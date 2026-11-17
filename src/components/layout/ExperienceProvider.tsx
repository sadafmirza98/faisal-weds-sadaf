"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ParticleField, type ParticleFieldHandle } from "@/components/magical/ParticleField";
import { safeStorage } from "@/lib/utils";

import { OPENED_KEY } from "@/lib/constants";

interface ExperienceValue {
  /** The guest has passed the opening invitation. */
  opened: boolean;
  /** True once the client has read the gate state (avoids SSR guesses). */
  ready: boolean;
  enter: () => void;
  replay: () => void;
  /** Golden dust burst over the whole viewport. */
  burst: (rect: { x: number; y: number; width: number; height: number }, count?: number) => void;
}

const ExperienceContext = createContext<ExperienceValue | null>(null);

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used inside <ExperienceProvider>");
  return ctx;
}

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false);
  const [ready, setReady] = useState(false);
  const dust = useRef<ParticleFieldHandle>(null);
  const focusMain = useRef(false);

  useEffect(() => {
    // The inline head script marks returning guests (same session) or ?open=1.
    const already = document.documentElement.hasAttribute("data-opened");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of pre-hydration state
    setOpened(already);
    setReady(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (opened) {
      root.removeAttribute("data-gate");
      // The dialog's buttons are gone: hand focus to the start of the page content
      // (after commit, once the page is no longer inert).
      if (focusMain.current) {
        focusMain.current = false;
        document.getElementById("main")?.focus({ preventScroll: true });
      }
    } else if (ready) {
      root.setAttribute("data-gate", "closed");
      root.removeAttribute("data-opened");
    }
  }, [opened, ready]);

  const enter = useCallback(() => {
    safeStorage.set("session", OPENED_KEY, "1");
    setOpened(true);
    window.scrollTo(0, 0);
    focusMain.current = true;
  }, []);

  const replay = useCallback(() => {
    safeStorage.remove("session", OPENED_KEY);
    window.scrollTo(0, 0);
    setOpened(false);
  }, []);

  const burst = useCallback<ExperienceValue["burst"]>((rect, count) => dust.current?.burst(rect, count), []);

  const value = useMemo(() => ({ opened, ready, enter, replay, burst }), [opened, ready, enter, replay, burst]);

  return (
    <ExperienceContext.Provider value={value}>
      {children}
      <ParticleField ref={dust} density={0} fixed className="z-[130]" />
    </ExperienceContext.Provider>
  );
}

/** Wraps the page content; inert while the opening invitation is on screen. */
export function SiteContent({ children }: { children: React.ReactNode }) {
  const { opened, ready } = useExperience();
  const locked = ready && !opened;
  return (
    <div inert={locked} aria-hidden={locked || undefined}>
      {children}
    </div>
  );
}
