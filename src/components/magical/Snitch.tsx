"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "motion/react";
import { useId } from "react";
import { cn } from "@/lib/utils";

/** An original winged golden orb. viewBox 160×80. */
export function Snitch({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const flutter = (dir: 1 | -1) =>
    reduced
      ? {}
      : {
          animate: { rotate: [dir * 6, dir * -22, dir * 6], scaleY: [1, 0.55, 1] },
          transition: { duration: 0.18, repeat: Infinity, ease: "easeInOut" as const },
        };
  const feather = "M0 0 C-14 -16 -40 -26 -70 -24 C-58 -18 -52 -14 -48 -10 C-58 -9 -64 -6 -68 -2 C-50 0 -38 2 -30 4 C-36 8 -40 10 -42 14 C-24 12 -10 8 0 4Z";
  return (
    <svg viewBox="0 0 160 80" className={cn("overflow-visible", className)} aria-hidden>
      <defs>
        <radialGradient id={`${id}-orb`} cx="38%" cy="32%" r="70%">
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="0.35" stopColor="#e9c873" />
          <stop offset="0.8" stopColor="#a87b2d" />
          <stop offset="1" stopColor="#6c4a16" />
        </radialGradient>
        <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f6f1e2" stopOpacity="0.15" />
          <stop offset="1" stopColor="#f3e3b5" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="80" cy="40" r="34" fill={`url(#${id}-halo)`} />
      <motion.g style={{ originX: "70px", originY: "38px" }} {...flutter(1)}>
        <path d={feather} transform="translate(70 38)" fill={`url(#${id}-wing)`} stroke="#d9c38c" strokeWidth="0.6" />
        <path d="M70 38 C58 30 40 24 14 22 M70 38 C56 34 42 34 22 36" transform="" stroke="#c7a45e" strokeWidth="0.5" fill="none" opacity="0.7" />
      </motion.g>
      <motion.g style={{ originX: "90px", originY: "38px" }} {...flutter(-1)}>
        <path d={feather} transform="translate(90 38) scale(-1 1)" fill={`url(#${id}-wing)`} stroke="#d9c38c" strokeWidth="0.6" />
        <path d="M90 38 C102 30 120 24 146 22 M90 38 C104 34 118 34 138 36" stroke="#c7a45e" strokeWidth="0.5" fill="none" opacity="0.7" />
      </motion.g>
      <circle cx="80" cy="40" r="11" fill={`url(#${id}-orb)`} />
      <path d="M69.5 40 C74 36 86 36 90.5 40 M80 29 C77 34 77 46 80 51" stroke="#7c5718" strokeWidth="0.7" fill="none" opacity="0.8" />
    </svg>
  );
}
