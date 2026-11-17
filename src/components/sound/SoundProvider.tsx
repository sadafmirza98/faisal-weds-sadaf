"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { wedding } from "@/config/wedding";

/**
 * Sound design. Background music streams from a hidden YouTube player
 * (`wedding.music.youtubeId`); the UI effects are synthesised live with the
 * Web Audio API. OFF by default; music and the AudioContext only start after
 * the guest turns sound on (a user gesture), so nothing ever autoplays.
 */

export type SoundEffect = "parchment" | "seal" | "chime" | "whoosh" | "sparkle";

interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  play: (effect: SoundEffect) => void;
}

const SoundContext = createContext<SoundContextValue>({ enabled: false, toggle: () => {}, play: () => {} });

export const useSound = () => useContext(SoundContext);

// Minimal slice of the YouTube IFrame Player API we use.
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (v: number) => void;
  destroy: () => void;
}
interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: { videoId: string; width?: number; height?: number; playerVars?: Record<string, number | string>; events?: { onReady?: () => void } },
  ) => YTPlayer;
}
type YTWindow = Window & { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void };

const MUSIC_VOLUME = 55;

let ytApi: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  const w = window as YTWindow;
  if (w.YT?.Player) return Promise.resolve(w.YT);
  ytApi ??= new Promise((resolve, reject) => {
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (w.YT) resolve(w.YT);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.onerror = () => {
      ytApi = null;
      reject(new Error("YouTube IFrame API failed to load"));
    };
    document.head.appendChild(tag);
  });
  return ytApi;
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const enabledRef = useRef(false);
  const musicHostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const playerReadyRef = useRef(false);
  const fadeRef = useRef(0);

  const ensureContext = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0;
    // A gentle convolution-free "hall": feedback delay through a lowpass.
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.32;
    const fb = ctx.createGain();
    fb.gain.value = 0.32;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2600;
    master.connect(ctx.destination);
    master.connect(delay);
    delay.connect(lp);
    lp.connect(fb);
    fb.connect(delay);
    lp.connect(ctx.destination);
    ctxRef.current = ctx;
    masterRef.current = master;
    return ctx;
  }, []);

  const noiseBuffer = useCallback((ctx: AudioContext, seconds: number) => {
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }, []);

  const bell = useCallback((ctx: AudioContext, out: AudioNode, freq: number, when: number, gain = 0.12, decay = 2.4) => {
    [1, 2.01, 3.02].forEach((mult, k) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq * mult;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(gain / (k + 1.5), when + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, when + decay / (k + 1));
      o.connect(g).connect(out);
      o.start(when);
      o.stop(when + decay + 0.1);
    });
  }, []);

  // Create the (hidden) player ahead of time so playVideo() can run inside the
  // guest's tap — iOS Safari blocks unmuted playback started outside a gesture.
  useEffect(() => {
    let cancelled = false;
    const idle = window.setTimeout(() => {
      loadYouTubeApi()
        .then((YT) => {
          if (cancelled || !musicHostRef.current) return;
          const id = wedding.music.youtubeId;
          playerRef.current = new YT.Player(musicHostRef.current, {
            videoId: id,
            width: 1,
            height: 1,
            playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, loop: 1, playlist: id, playsinline: 1, rel: 0 },
            events: {
              onReady: () => {
                playerReadyRef.current = true;
                // Guest turned sound on before the player was ready.
                if (enabledRef.current) {
                  playerRef.current?.setVolume(MUSIC_VOLUME);
                  playerRef.current?.playVideo();
                }
              },
            },
          });
        })
        .catch(() => {
          /* Music is an enhancement — effects still work without it. */
        });
    }, 1500);
    return () => {
      cancelled = true;
      window.clearTimeout(idle);
      window.clearInterval(fadeRef.current);
      playerRef.current?.destroy();
      playerRef.current = null;
      playerReadyRef.current = false;
    };
  }, []);

  const fadeMusic = useCallback((to: number, onDone?: () => void) => {
    const player = playerRef.current;
    if (!player || !playerReadyRef.current) return;
    window.clearInterval(fadeRef.current);
    const from = to > 0 ? 0 : MUSIC_VOLUME;
    const steps = 12;
    let i = 0;
    player.setVolume(from);
    fadeRef.current = window.setInterval(() => {
      i += 1;
      player.setVolume(Math.round(from + ((to - from) * i) / steps));
      if (i >= steps) {
        window.clearInterval(fadeRef.current);
        onDone?.();
      }
    }, 60);
  }, []);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    if (next) {
      if (playerReadyRef.current) {
        playerRef.current?.playVideo();
        fadeMusic(MUSIC_VOLUME);
      }
      const ctx = ensureContext();
      if (!ctx || !masterRef.current) return;
      void ctx.resume();
      masterRef.current.gain.cancelScheduledValues(ctx.currentTime);
      masterRef.current.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.6);
      bell(ctx, masterRef.current, 783.99, ctx.currentTime + 0.05, 0.08);
    } else {
      fadeMusic(0, () => playerRef.current?.pauseVideo());
      const ctx = ctxRef.current;
      if (ctx && masterRef.current) {
        masterRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      }
    }
  }, [bell, ensureContext, fadeMusic]);

  const play = useCallback(
    (effect: SoundEffect) => {
      if (!enabledRef.current) return;
      const ctx = ctxRef.current;
      const out = masterRef.current;
      if (!ctx || !out) return;
      const t = ctx.currentTime + 0.01;
      if (effect === "chime" || effect === "sparkle") {
        const base = effect === "chime" ? [659.25, 783.99, 1046.5] : [1318.51, 1567.98, 2093];
        base.forEach((f, i) => bell(ctx, out, f, t + i * 0.09, effect === "chime" ? 0.09 : 0.05, 2));
        return;
      }
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx, effect === "parchment" ? 0.9 : 0.6);
      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();
      if (effect === "parchment") {
        // Paper rustle: band-passed noise with a crackly amplitude envelope.
        filter.type = "bandpass";
        filter.frequency.value = 2400;
        filter.Q.value = 0.7;
        g.gain.setValueAtTime(0.0001, t);
        for (let i = 0; i < 9; i++) g.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.09, t + 0.05 + i * 0.08 + Math.random() * 0.03);
        g.gain.linearRampToValueAtTime(0.0001, t + 0.85);
      } else if (effect === "seal") {
        // Wax crack: a sharp click and a low thump.
        filter.type = "highpass";
        filter.frequency.value = 1200;
        g.gain.setValueAtTime(0.35, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        const o = ctx.createOscillator();
        const og = ctx.createGain();
        o.frequency.setValueAtTime(140, t);
        o.frequency.exponentialRampToValueAtTime(50, t + 0.25);
        og.gain.setValueAtTime(0.25, t);
        og.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        o.connect(og).connect(out);
        o.start(t);
        o.stop(t + 0.35);
      } else {
        // Whoosh: swept band-pass noise.
        filter.type = "bandpass";
        filter.Q.value = 1.2;
        filter.frequency.setValueAtTime(300, t);
        filter.frequency.exponentialRampToValueAtTime(2400, t + 0.5);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.12, t + 0.2);
        g.gain.linearRampToValueAtTime(0.0001, t + 0.6);
      }
      src.connect(filter).connect(g).connect(out);
      src.start(t);
    },
    [bell, noiseBuffer],
  );

  useEffect(
    () => () => {
      void ctxRef.current?.close();
    },
    [],
  );

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);
  return (
    <SoundContext.Provider value={value}>
      {children}
      {/* Hidden music player; the API replaces the inner div with an iframe. */}
      <div aria-hidden className="pointer-events-none fixed bottom-0 left-0 h-px w-px overflow-hidden opacity-0">
        <div ref={musicHostRef} />
      </div>
    </SoundContext.Provider>
  );
}
