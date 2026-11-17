"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { useSound } from "@/components/sound/SoundProvider";
import { seeded } from "@/lib/utils";

export const CAST_EVENT = "fs:cast-lumos";

/** Cast from anywhere (e.g. the Lumos button in the closing section). */
export function castLumos() {
  window.dispatchEvent(new Event(CAST_EVENT));
}

/**
 * Whisper "lumos" (type it anywhere outside a form field) and a silvery,
 * Patronus-like light blooms across the page, carrying the hidden message.
 */
export function SpellListener() {
  const [active, setActive] = useState(0);
  const buffer = useRef("");
  const reduced = useReducedMotion();
  const { play } = useSound();

  const cast = useCallback(() => {
    setActive((n) => n + 1);
    play("chime");
  }, [play]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.closest("input, textarea, select, [contenteditable='true']") || e.metaKey || e.ctrlKey || e.altKey)) return;
      if (e.key.length !== 1) return;
      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-12);
      if (buffer.current.endsWith("lumos") || buffer.current.endsWith("expecto")) {
        buffer.current = "";
        cast();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(CAST_EVENT, cast);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(CAST_EVENT, cast);
    };
  }, [cast]);

  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => setActive(0), 7000);
    return () => window.clearTimeout(t);
  }, [active]);

  const rnd = seeded(active * 13 + 1);
  const wisps = Array.from({ length: reduced ? 0 : 26 }, (_, i) => ({
    i,
    x: (rnd() - 0.5) * 70,
    y: (rnd() - 0.5) * 50,
    s: 4 + rnd() * 10,
    d: rnd() * 1.2,
  }));

  return (
    <AnimatePresence>
      {active > 0 && (
        <motion.div
          key={active}
          className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.6 } }}
          transition={{ duration: 0.8 }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            className="absolute h-[140vmax] w-[140vmax] rounded-full bg-[radial-gradient(circle,rgb(214_228_255/0.55)_0%,rgb(185_188_199/0.22)_22%,rgb(120_150_220/0.08)_45%,transparent_65%)]"
            initial={{ scale: 0.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          />
          {wisps.map((w) => (
            <motion.span
              key={w.i}
              className="absolute rounded-full bg-[#e6eeff] shadow-[0_0_18px_6px_rgb(200_215_255/0.7)]"
              style={{ width: w.s, height: w.s }}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x: `${w.x}vw`, y: `${w.y}vh`, opacity: [0, 1, 0] }}
              transition={{ duration: 3.2, delay: w.d, ease: "easeOut" }}
            />
          ))}
          <motion.p
            className="relative mx-6 max-w-xl text-center font-script text-[clamp(2rem,6vw,3.4rem)] leading-tight text-white [text-shadow:0_0_24px_rgb(190_210_255/0.9)]"
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.9, duration: 1.4 }}
          >
            {wedding.secrets.hiddenMessage}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
