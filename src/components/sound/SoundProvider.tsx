"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * Sound design, synthesised live with the Web Audio API — no audio files,
 * no licences, no streaming service. OFF by default; the AudioContext is
 * only created after the guest turns sound on (a user gesture), so nothing
 * ever autoplays.
 */

export type SoundEffect = "parchment" | "seal" | "chime" | "whoosh" | "sparkle";

interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  play: (effect: SoundEffect) => void;
}

const SoundContext = createContext<SoundContextValue>({ enabled: false, toggle: () => {}, play: () => {} });

export const useSound = () => useContext(SoundContext);

// Pentatonic notes (Hz) in a soft, celestial register.
const NOTES = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const ambientRef = useRef<{ stop: () => void } | null>(null);
  const enabledRef = useRef(false);

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

  const startAmbient = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master || ambientRef.current) return;
    const bus = ctx.createGain();
    bus.gain.value = 0;
    bus.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 4);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    bus.connect(lp).connect(master);

    // Warm drone: a soft open fifth with slow beating.
    const oscs = [130.81, 196, 261.63, 196.6].map((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = i % 2 ? "triangle" : "sine";
      o.frequency.value = f;
      g.gain.value = [0.05, 0.03, 0.022, 0.03][i];
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.05 + i * 0.03;
      lfoGain.gain.value = g.gain.value * 0.6;
      lfo.connect(lfoGain).connect(g.gain);
      o.connect(g).connect(bus);
      o.start();
      lfo.start();
      return [o, lfo];
    });

    // Occasional distant chimes.
    let timer = 0;
    const chime = () => {
      const now = ctx.currentTime + 0.05;
      const n = NOTES[Math.floor(Math.random() * NOTES.length)];
      bell(ctx, master, n, now, 0.045, 3.2);
      if (Math.random() < 0.5) bell(ctx, master, n * 1.5, now + 0.35, 0.03, 2.6);
      timer = window.setTimeout(chime, 3500 + Math.random() * 6000);
    };
    timer = window.setTimeout(chime, 1800);

    ambientRef.current = {
      stop: () => {
        window.clearTimeout(timer);
        const t = ctx.currentTime;
        bus.gain.cancelScheduledValues(t);
        bus.gain.setValueAtTime(bus.gain.value, t);
        bus.gain.linearRampToValueAtTime(0, t + 0.8);
        oscs.flat().forEach((o) => o.stop(t + 0.9));
      },
    };
  }, [bell]);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    if (next) {
      const ctx = ensureContext();
      if (!ctx || !masterRef.current) return;
      void ctx.resume();
      masterRef.current.gain.cancelScheduledValues(ctx.currentTime);
      masterRef.current.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.6);
      startAmbient();
      bell(ctx, masterRef.current, 783.99, ctx.currentTime + 0.05, 0.08);
    } else {
      ambientRef.current?.stop();
      ambientRef.current = null;
      const ctx = ctxRef.current;
      if (ctx && masterRef.current) {
        masterRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      }
    }
  }, [bell, ensureContext, startAmbient]);

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
      ambientRef.current?.stop();
      void ctxRef.current?.close();
    },
    [],
  );

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
