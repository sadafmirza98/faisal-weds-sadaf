"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { Snitch } from "@/components/magical/Snitch";
import { SecretMessage } from "@/components/secrets/SecretMessage";
import { useSound } from "@/components/sound/SoundProvider";
import { seeded } from "@/lib/utils";

/**
 * Every so often a golden snitch darts across the screen. Catch it for a
 * secret. (Keyboard and reduced-motion guests can find a resting snitch in the
 * closing section — nothing essential lives here.)
 */
export function GoldenSnitchHunt() {
  const { opened, burst } = useExperience();
  const reduced = useReducedMotion();
  const { play } = useSound();
  const [flight, setFlight] = useState<number | null>(null);
  const [caught, setCaught] = useState(false);
  const count = useRef(0);

  useEffect(() => {
    if (!opened || reduced || caught) return;
    let t = window.setTimeout(function launch() {
      if (!document.hidden) setFlight(++count.current);
      t = window.setTimeout(launch, 38000 + Math.random() * 20000);
    }, 14000);
    return () => window.clearTimeout(t);
  }, [opened, reduced, caught]);

  const path = (() => {
    const r = seeded((flight ?? 1) * 97);
    const ltr = r() < 0.5;
    const ys = [r() * 60 + 15, r() * 60 + 15, r() * 60 + 15, r() * 60 + 15];
    return { x: ltr ? ["-10vw", "30vw", "60vw", "110vw"] : ["110vw", "65vw", "35vw", "-10vw"], y: ys.map((v) => `${v}vh`), flip: !ltr };
  })();

  return (
    <>
      <AnimatePresence>
        {flight !== null && (
          <motion.button
            key={flight}
            type="button"
            tabIndex={-1}
            aria-label="Catch the golden snitch"
            className="fixed left-0 top-0 z-[45] w-24 cursor-pointer p-3 sm:w-28"
            initial={{ x: path.x[0], y: path.y[0], opacity: 0 }}
            animate={{ x: path.x, y: path.y, opacity: [0, 1, 1, 1] }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 7.5, ease: "easeInOut" }}
            onAnimationComplete={() => setFlight(null)}
            onClick={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              burst(rect, 90);
              play("sparkle");
              setFlight(null);
              setCaught(true);
            }}
            style={{ scaleX: path.flip ? -1 : 1 }}
          >
            <Snitch className="w-full drop-shadow-[0_0_12px_rgba(255,233,168,0.8)]" />
          </motion.button>
        )}
      </AnimatePresence>
      <SecretMessage open={caught} onClose={() => setCaught(false)} />
    </>
  );
}
