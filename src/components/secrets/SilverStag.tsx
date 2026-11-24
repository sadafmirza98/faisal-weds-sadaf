"use client";

import { motion } from "motion/react";

/*
 * A stag drawn in silver light (original artwork), facing right. Strokes in a
 * 200 × 200 box: body, neck and head, two branching antlers, four legs.
 * `drawn` traces the lines in as it appears.
 */
const BODY = [
  // back, rump and belly
  "M58 100 C68 88 118 86 136 93 C146 97 149 109 141 116 C122 124 78 125 62 117 C53 112 52 105 58 100 Z",
  // neck, front and back
  "M128 96 C134 82 140 71 146 62",
  "M141 106 C146 92 152 80 157 67",
  // head and muzzle
  "M146 62 C150 54 160 52 168 56 C173 59 177 61 178 64 C175 68 166 69 160 68 C156 68 154 67 157 67",
  // ear
  "M150 58 L141 49 L153 55",
  // tail
  "M58 101 L49 96",
];
const ANTLERS = [
  "M152 55 C147 41 140 31 128 22",
  "M146 41 L156 30",
  "M140 32 L141 17",
  "M134 27 L122 17",
  "M159 53 C161 39 167 29 178 21",
  "M163 41 L174 37",
  "M167 32 L165 17",
  "M172 25 L182 14",
];
const LEGS = [
  "M134 114 L139 139 L136 162",
  "M125 117 L122 140 L127 162",
  "M73 115 C66 127 73 139 66 162",
  "M84 119 L86 140 L81 162",
];

export function SilverStag({ className, drawn = true, gallop = false }: { className?: string; drawn?: boolean; gallop?: boolean }) {
  const line = (d: string, i: number, delay = 0) => (
    <motion.path
      key={d}
      d={d}
      initial={{ pathLength: drawn ? 1 : 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.1, delay: delay + i * 0.05, ease: [0.65, 0, 0.35, 1] }}
    />
  );
  // While galloping, the legs reach and gather.
  const stride = (i: number) =>
    gallop
      ? {
          animate: { rotate: i < 2 ? [-14, 16, -14] : [16, -14, 16] },
          transition: { duration: 0.55, repeat: Infinity, ease: "easeInOut" as const },
        }
      : { animate: { rotate: 0 }, transition: { duration: 0.6 } };

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <filter id="stag-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <radialGradient id="stag-fill" cx="0.6" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#f2f6ff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#a9bfff" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      {/* halo of light behind the stag */}
      <g stroke="#bcd0ff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.45" filter="url(#stag-glow)">
        {[...BODY, ...ANTLERS, ...LEGS].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {/* the soft silver body, neck and head */}
      <path d={BODY[0]} fill="url(#stag-fill)" />
      <path d="M128 96 C134 82 140 71 146 62 C150 54 160 52 168 56 C173 59 177 61 178 64 C175 68 166 69 160 68 C154 76 148 90 141 106 Z" fill="url(#stag-fill)" />
      {/* the lines of light */}
      <g stroke="#f4f8ff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ filter: "drop-shadow(0 0 4px rgb(200 218 255 / 0.95))" }}>
        {BODY.map((d, i) => line(d, i))}
        {ANTLERS.map((d, i) => line(d, i, 0.35))}
        {LEGS.map((d, i) => {
          const hip = d.match(/M(\d+) (\d+)/)!;
          return (
            <motion.g key={d} style={{ transformOrigin: `${hip[1]}px ${hip[2]}px`, transformBox: "view-box" }} {...stride(i)}>
              {line(d, i, 0.2)}
            </motion.g>
          );
        })}
      </g>
    </svg>
  );
}
