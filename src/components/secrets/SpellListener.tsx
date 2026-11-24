"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { useSound } from "@/components/sound/SoundProvider";
import { seeded } from "@/lib/utils";
import { SilverStag } from "@/components/secrets/SilverStag";

export const CAST_EVENT = "fs:cast-lumos";

/** Cast from anywhere (e.g. the Lumos button in the closing section). */
export function castLumos() {
  window.dispatchEvent(new Event(CAST_EVENT));
}

/**
 * Whisper "lumos" (type it anywhere outside a form field) or press the Lumos
 * button: silver light blooms across the page and a stag made of light
 * gallops in, slows to a stand in the centre and lifts its head in a burst of
 * light, before the message appears beneath it. Tap anywhere to dismiss.
 */
export function SpellListener() {
  const [active, setActive] = useState(0);
  const [galloping, setGalloping] = useState(false);
  const buffer = useRef("");
  const reduced = useReducedMotion();
  const { play } = useSound();

  const cast = useCallback(() => {
    setActive((n) => n + 1);
    setGalloping(true);
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
    const t = window.setTimeout(() => setActive(0), 11000);
    // The gallop settles into a stand partway through.
    const g = window.setTimeout(() => setGalloping(false), 2300);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(g);
    };
  }, [active]);

  const rnd = seeded(active * 13 + 1);
  // silver wisps shed along the stag's path
  const wisps = Array.from({ length: reduced ? 0 : 30 }, (_, i) => ({
    i,
    x: -48 + (i / 30) * 48 + (rnd() - 0.5) * 6,
    y: (rnd() - 0.5) * 14,
    s: 3 + rnd() * 7,
    d: (i / 30) * 2.1 + rnd() * 0.2,
  }));
  const { lumos } = wedding.secrets;

  return (
    <AnimatePresence>
      {active > 0 && (
        <motion.div
          key={active}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.6 } }}
          transition={{ duration: 0.8 }}
          role="status"
          aria-live="polite"
          onClick={() => setActive(0)}
        >
          {/* the night dims, then silver light blooms */}
          <div className="absolute inset-0 bg-[#04060c]/70" />
          <motion.div
            className="absolute h-[140vmax] w-[140vmax] rounded-full bg-[radial-gradient(circle,rgb(214_228_255/0.45)_0%,rgb(185_188_199/0.18)_22%,rgb(120_150_220/0.07)_45%,transparent_65%)]"
            initial={{ scale: 0.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* wisps of light left in the stag's wake */}
          {wisps.map((w) => (
            <motion.span
              key={w.i}
              className="absolute left-1/2 top-[42%] rounded-full bg-[#e6eeff] shadow-[0_0_14px_5px_rgb(200_215_255/0.7)]"
              style={{ width: w.s, height: w.s }}
              initial={{ x: `${w.x}vw`, y: `${w.y}vh`, opacity: 0, scale: 0.4 }}
              animate={{ y: `${w.y - 10}vh`, opacity: [0, 0.95, 0], scale: [0.4, 1, 0.2] }}
              transition={{ duration: 2.4, delay: w.d, ease: "easeOut" }}
            />
          ))}

          {/* the stag: bounds in from the left, slows to a stand, lifts its head */}
          <motion.div
            className="relative w-[min(66vw,19rem)]"
            initial={reduced ? { opacity: 0 } : { x: "-75vw", y: 0, opacity: 0 }}
            animate={
              reduced
                ? { opacity: 1 }
                : { x: ["-75vw", "-45vw", "-18vw", "0vw", "0vw"], y: [0, -46, 0, -26, 0], opacity: [0, 1, 1, 1, 1] }
            }
            transition={reduced ? { duration: 0.8 } : { duration: 2.3, times: [0, 0.3, 0.6, 0.85, 1], ease: "easeOut" }}
          >
            <motion.div
              initial={false}
              animate={reduced ? undefined : { rotate: [0, -6, 0, -4, 0, 0, -7, 0] }}
              transition={{ duration: 3.4, times: [0, 0.15, 0.3, 0.45, 0.6, 0.7, 0.82, 1] }}
              style={{ transformOrigin: "40% 80%" }}
            >
              <SilverStag className="w-full overflow-visible" drawn={reduced} gallop={galloping && !reduced} />
            </motion.div>
            {/* the burst of light as it stands */}
            {!reduced && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-[78%] top-[30%] size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.95),rgb(200_218_255/0.4)_40%,transparent_70%)]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2.6, 3.2], opacity: [0, 0.9, 0] }}
                transition={{ duration: 1.4, delay: 2.4, ease: "easeOut" }}
              />
            )}
          </motion.div>

          {/* the message */}
          <motion.div
            className="relative mx-6 -mt-2 max-w-xl text-center"
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: reduced ? 0.6 : 2.9, duration: 1.4 }}
          >
            <p className="font-cinzel text-[0.7rem] font-semibold tracking-[0.5em] text-[#cfdcff] uppercase">✦ {lumos.eyebrow} ✦</p>
            <p className="mt-2 font-script text-[clamp(2.2rem,7vw,3.6rem)] leading-tight text-white [text-shadow:0_0_24px_rgb(190_210_255/0.9)]">{lumos.title}</p>
            <p className="mx-auto mt-3 max-w-md font-fell text-[clamp(1.05rem,3.6vw,1.3rem)] leading-relaxed text-[#e9efff] italic [text-shadow:0_0_14px_rgb(160_185_255/0.6)]">
              {lumos.message}
            </p>
            <p className="mt-3 font-calligraphy text-2xl text-[#dbe5ff]">{lumos.signature}</p>
            <p className="mt-5 font-sans text-[0.65rem] tracking-[0.25em] text-[#cfdcff]/60 uppercase">Tap anywhere to close</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
