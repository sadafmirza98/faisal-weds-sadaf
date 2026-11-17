"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface OwlProps {
  className?: string;
  /** Show the sealed letter held in the talons. */
  withLetter?: boolean;
  flapping?: boolean;
}

/** An original owl in flight carrying a sealed letter. viewBox 240×200. */
export function Owl({ className, withLetter = true, flapping = true }: OwlProps) {
  const reduced = useReducedMotion();
  const flap = flapping && !reduced;
  const wing = (dir: 1 | -1) =>
    flap
      ? {
          animate: { rotate: [0, dir * -28, 0, dir * 12, 0], scaleY: [1, 0.7, 1, 1.05, 1] },
          transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" as const },
        }
      : {};
  return (
    <svg viewBox="0 0 240 200" className={cn("overflow-visible", className)} aria-hidden>
      <defs>
        <linearGradient id="owl-wing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9b7446" />
          <stop offset="1" stopColor="#4d3420" />
        </linearGradient>
        <radialGradient id="owl-body" cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor="#d9bf92" />
          <stop offset="0.6" stopColor="#a07a4a" />
          <stop offset="1" stopColor="#5b3e24" />
        </radialGradient>
      </defs>
      {/* Far wing */}
      <motion.g style={{ originX: "118px", originY: "92px" }} {...wing(-1)}>
        <path d="M118 92 C150 52 196 34 236 40 C214 50 206 58 200 66 C214 66 222 70 228 76 C206 80 194 84 186 92 C196 96 202 100 206 106 C180 108 150 106 124 104Z" fill="url(#owl-wing)" opacity="0.8" />
      </motion.g>
      {/* Body */}
      <path d="M96 78 C96 56 108 44 122 44 C138 44 150 58 150 78 C152 110 144 136 124 146 C104 138 94 112 96 78Z" fill="url(#owl-body)" />
      {/* Breast feathers */}
      {[96, 108, 120, 132].map((y, i) => (
        <path key={i} d={`M${108 + (i % 2) * 4} ${y} q6 5 12 0 q6 5 12 0`} stroke="#6b4b2c" strokeWidth="1.2" fill="none" opacity="0.55" />
      ))}
      {/* Face disc */}
      <ellipse cx="123" cy="64" rx="22" ry="17" fill="#e8d3a8" opacity="0.9" />
      <path d="M103 50 L108 40 L114 50Z M132 50 L138 40 L143 50Z" fill="#5b3e24" />
      <circle cx="114" cy="63" r="7" fill="#1b1209" />
      <circle cx="132" cy="63" r="7" fill="#1b1209" />
      <circle cx="114" cy="63" r="4.2" fill="#e8b448" />
      <circle cx="132" cy="63" r="4.2" fill="#e8b448" />
      <circle cx="114" cy="63" r="2" fill="#120c06" />
      <circle cx="132" cy="63" r="2" fill="#120c06" />
      <circle cx="115.3" cy="61.6" r="0.9" fill="#fff" />
      <circle cx="133.3" cy="61.6" r="0.9" fill="#fff" />
      <path d="M120 69 L123 76 L126 69Z" fill="#c59a3e" />
      {/* Near wing */}
      <motion.g style={{ originX: "112px", originY: "88px" }} {...wing(1)}>
        <path d="M112 88 C82 46 36 26 2 32 C24 42 32 52 38 60 C22 60 14 64 8 70 C30 74 44 80 52 88 C40 92 34 98 30 104 C58 108 88 104 112 100Z" fill="url(#owl-wing)" />
        <path d="M100 88 C80 66 54 52 30 48 M96 94 C74 80 50 74 30 74 M92 98 C70 94 54 94 40 98" stroke="#3b2716" strokeWidth="1.2" fill="none" opacity="0.6" />
      </motion.g>
      {/* Talons + letter */}
      {withLetter && (
        <g transform="translate(104 140) rotate(-8)">
          <path d="M10 0 v8 M18 0 v8 M26 0 v8" stroke="#6b4b2c" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="-4" y="8" width="46" height="31" rx="1.5" fill="#e8d7b4" stroke="#a88b5c" strokeWidth="0.8" />
          <path d="M-4 8 L19 27 L42 8" fill="none" stroke="#a88b5c" strokeWidth="0.9" />
          <circle cx="19" cy="26" r="5.2" fill="#740d24" />
          <circle cx="19" cy="26" r="3.2" fill="none" stroke="#a83a52" strokeWidth="0.6" />
        </g>
      )}
    </svg>
  );
}
