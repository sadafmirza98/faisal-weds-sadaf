"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "motion/react";
import { useId } from "react";
import { wedding } from "@/config/wedding";
import { r2 } from "@/lib/utils";

interface MonogramProps {
  className?: string;
  /** Animate the strokes drawing in (ink being written). */
  draw?: boolean;
  title?: string;
  /** gold for dark backgrounds, ink for parchment. */
  tone?: "gold" | "ink";
}

/** Interlaced F & S monogram inside a laurel-ring crest. Original artwork. */
export function Monogram({ className, draw = false, title, tone = "gold" }: MonogramProps) {
  const reduced = useReducedMotion();
  const gid = `mono-${useId().replace(/:/g, "")}`;
  const [a, b] = wedding.couple.monogram;
  const animate = draw && !reduced;
  const stroke = (delay: number, duration = 1.8) =>
    animate
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration, delay, ease: [0.65, 0, 0.35, 1] as const },
        }
      : {};
  const fill = (delay: number) =>
    animate
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1.2, delay } }
      : {};

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={title ?? `${a} and ${b} monogram`}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tone === "gold" ? "#f3e0ad" : "#6b4a22"} />
          <stop offset="0.45" stopColor={tone === "gold" ? "#c5a46a" : "#3b2714"} />
          <stop offset="0.7" stopColor={tone === "gold" ? "#f6e6bb" : "#80603b"} />
          <stop offset="1" stopColor={tone === "gold" ? "#8a6a3a" : "#2b1d10"} />
        </linearGradient>
      </defs>
      <motion.circle cx="100" cy="100" r="88" fill="none" stroke={`url(#${gid})`} strokeWidth="1.2" {...stroke(0, 1.6)} />
      <motion.circle cx="100" cy="100" r="80" fill="none" stroke={`url(#${gid})`} strokeWidth="0.6" strokeDasharray="1 4" {...fill(0.6)} />
      {/* Laurel sprigs */}
      {Array.from({ length: 9 }).map((_, i) => {
        const ang = 200 + i * 15;
        const r = 84;
        const x = r2(100 + Math.cos((ang * Math.PI) / 180) * r);
        const y = r2(100 + Math.sin((ang * Math.PI) / 180) * r);
        const x2 = r2(100 + Math.cos(((360 - ang + 180) * Math.PI) / 180) * r);
        return (
          <g key={i}>
            <motion.ellipse cx={x} cy={y} rx="5" ry="2" fill={`url(#${gid})`} transform={`rotate(${ang + 60} ${x} ${y})`} {...fill(0.8 + i * 0.05)} />
            <motion.ellipse cx={x2} cy={y} rx="5" ry="2" fill={`url(#${gid})`} transform={`rotate(${-ang - 60} ${x2} ${y})`} {...fill(0.8 + i * 0.05)} />
          </g>
        );
      })}
      <motion.text
        x="82"
        y="128"
        textAnchor="middle"
        fontSize="92"
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="1.4"
        style={{ fontFamily: "var(--font-cinzel)", fontWeight: 600 }}
        {...stroke(0.4, 2.2)}
      >
        {a}
      </motion.text>
      <motion.text x="82" y="128" textAnchor="middle" fontSize="92" fill={`url(#${gid})`} style={{ fontFamily: "var(--font-cinzel)", fontWeight: 600 }} {...fill(1.6)}>
        {a}
      </motion.text>
      <motion.text
        x="118"
        y="138"
        textAnchor="middle"
        fontSize="104"
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="1.2"
        style={{ fontFamily: "var(--font-script)" }}
        {...stroke(1, 2.4)}
      >
        {b}
      </motion.text>
      <motion.text x="118" y="138" textAnchor="middle" fontSize="104" fill={`url(#${gid})`} style={{ fontFamily: "var(--font-script)" }} {...fill(2.2)}>
        {b}
      </motion.text>
      <motion.path d="M100 14 l2 4.4 4.8.5-3.6 3.2 1 4.7-4.2-2.4-4.2 2.4 1-4.7-3.6-3.2 4.8-.5z" fill={`url(#${gid})`} {...fill(2.4)} />
    </svg>
  );
}
