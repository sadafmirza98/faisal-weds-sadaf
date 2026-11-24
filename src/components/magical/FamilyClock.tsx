"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "motion/react";
import { useState } from "react";
import { r2 } from "@/lib/utils";

/*
 * An enchanted family clock (original artwork): instead of hours it shows
 * where each of us is. Two brass hands carry our names and point to a place
 * on the dial; they twitch as if alive. Tap the clock and the hands whirl
 * round and settle together on the Walima.
 */

export const PLACES = ["Walima", "Forever", "On the way", "Getting ready", "Counting days", "Making duas", "Dreaming", "Celebrating"] as const;
export type Place = (typeof PLACES)[number];

const SLICE = 360 / PLACES.length;
const angleOf = (p: Place) => PLACES.indexOf(p) * SLICE;

const at = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [r2(150 + Math.cos(a) * r), r2(150 + Math.sin(a) * r)] as const;
};

/** Arc through the middle of a place's slice, for its curved label (reads left to right). */
function labelArc(deg: number, r: number) {
  const bottom = deg > 90 && deg < 270;
  const [x1, y1] = at(deg + (bottom ? SLICE / 2 - 3 : -SLICE / 2 + 3), r);
  const [x2, y2] = at(deg + (bottom ? -SLICE / 2 + 3 : SLICE / 2 - 3), r);
  return `M ${x1} ${y1} A ${r} ${r} 0 0 ${bottom ? 0 : 1} ${x2} ${y2}`;
}

/** A brass hand with a name plate; the plate text stays upright. */
function Hand({ name, length, angle, wobble, tone }: { name: string; length: number; angle: number; wobble: number; tone: "gold" | "crimson" }) {
  const reduced = useReducedMotion();
  const flip = ((angle % 360) + 360) % 360 > 180;
  const fill = tone === "gold" ? "url(#fc-gold)" : "url(#fc-crimson)";
  const plateY = 150 - length * 0.58;
  return (
    <motion.g
      style={{ transformOrigin: "150px 150px", transformBox: "view-box" }}
      initial={false}
      animate={{ rotate: reduced ? angle : [angle - wobble, angle + wobble * 0.6, angle - wobble * 0.3, angle] }}
      transition={reduced ? { duration: 0 } : { rotate: { duration: 2.2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" } }}
    >
      {/* the shaft and a spade tip */}
      <path d={`M147.5 162 L148.6 ${150 - length + 14} L150 ${150 - length} L151.4 ${150 - length + 14} L152.5 162 Z`} fill={fill} stroke="#3b2a14" strokeWidth="0.5" />
      <path d={`M150 ${150 - length - 2} l-5 9 l5 4 l5 -4 z`} fill={fill} stroke="#3b2a14" strokeWidth="0.5" />
      {/* the name plate */}
      <g transform={`rotate(${flip ? 90 : -90} 150 ${plateY})`}>
        <rect x={150 - 23} y={plateY - 6.5} width="46" height="13" rx="3" fill="#f3e6c4" stroke={tone === "gold" ? "#8a6a32" : "#7a1027"} strokeWidth="1" />
        <text x="150" y={plateY + 3.4} textAnchor="middle" fontSize="8.6" fill={tone === "gold" ? "#3b2a14" : "#7a1027"} style={{ fontFamily: "var(--font-calligraphy), var(--font-fell), serif", fontWeight: 600 }}>
          {name}
        </text>
      </g>
    </motion.g>
  );
}

export function FamilyClock({ hands }: { hands: { name: string; place: Place }[] }) {
  const reduced = useReducedMotion();
  const [spin, setSpin] = useState(0);
  const together = spin > 0;
  const onTap = () => {
    if (!reduced) setSpin((s) => s + 1);
  };

  return (
    <button type="button" onClick={onTap} className="relative block h-full w-full rounded-full" aria-label={`The family clock: ${hands.map((h) => `${h.name} — ${h.place}`).join("; ")}. Tap to make the hands whirl.`}>
      <svg viewBox="0 0 300 300" className="h-full w-full overflow-visible" aria-hidden>
        <defs>
          <radialGradient id="fc-face" cx="50%" cy="45%" r="62%">
            <stop offset="0" stopColor="#f6ead0" />
            <stop offset="0.7" stopColor="#e6d3ac" />
            <stop offset="1" stopColor="#c9ae7c" />
          </radialGradient>
          <linearGradient id="fc-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6e6b8" />
            <stop offset="0.45" stopColor="#c5a46a" />
            <stop offset="0.75" stopColor="#80603b" />
            <stop offset="1" stopColor="#e9d29a" />
          </linearGradient>
          <linearGradient id="fc-crimson" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c2384f" />
            <stop offset="0.6" stopColor="#8e1430" />
            <stop offset="1" stopColor="#5a0b1e" />
          </linearGradient>
          {PLACES.map((p) => (
            <path key={p} id={`fc-arc-${PLACES.indexOf(p)}`} d={labelArc(angleOf(p), 112)} />
          ))}
        </defs>

        {/* brass case with studs */}
        <circle cx="150" cy="150" r="148" fill="url(#fc-gold)" />
        <circle cx="150" cy="150" r="147" fill="none" stroke="#fff3d0" strokeOpacity="0.5" strokeWidth="0.8" />
        {Array.from({ length: 16 }, (_, i) => {
          const [x, y] = at(i * 22.5, 143.5);
          return <circle key={i} cx={x} cy={y} r="2.2" fill={i % 2 ? "#f3e0ad" : "#8e1430"} stroke="#3b2a14" strokeWidth="0.5" />;
        })}
        <circle cx="150" cy="150" r="138" fill="#3b2a14" />

        {/* the parchment face, divided into places */}
        <circle cx="150" cy="150" r="135" fill="url(#fc-face)" />
        {PLACES.map((p) => {
          const [x1, y1] = at(angleOf(p) + SLICE / 2, 96);
          const [x2, y2] = at(angleOf(p) + SLICE / 2, 135);
          return <line key={p} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8a6a32" strokeWidth="1" />;
        })}
        <circle cx="150" cy="150" r="96" fill="none" stroke="#8a6a32" strokeWidth="1" />
        <circle cx="150" cy="150" r="128" fill="none" stroke="#8a6a32" strokeOpacity="0.5" strokeWidth="0.6" />
        {PLACES.map((p, i) => (
          <text key={p} fontSize={p.length > 11 ? 7.6 : p.length > 8 ? 8.6 : 9.6} fill={p === "Walima" ? "#8e1430" : "#3b2a14"} letterSpacing="0.6" style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}>
            <textPath href={`#fc-arc-${i}`} startOffset="50%" textAnchor="middle">
              {p.toUpperCase()}
            </textPath>
          </text>
        ))}
        {/* a little star at each place */}
        {PLACES.map((p) => {
          const [x, y] = at(angleOf(p), 102);
          return <path key={p} d="M0 -3.4 L0.9 -0.9 L3.4 0 L0.9 0.9 L0 3.4 L-0.9 0.9 L-3.4 0 L-0.9 -0.9 Z" transform={`translate(${x} ${y})`} fill={p === "Walima" ? "#8e1430" : "#8a6a32"} />;
        })}

        {/* inner medallion */}
        <circle cx="150" cy="150" r="58" fill="none" stroke="#8a6a32" strokeOpacity="0.45" strokeDasharray="2 3" />
        <text x="150" y="196" textAnchor="middle" fontSize="7.2" letterSpacing="2.4" fill="#8a6a32" style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}>
          WHERE ARE WE?
        </text>

        {/* the hands: they whirl when tapped, then settle */}
        <motion.g
          key={spin}
          style={{ transformOrigin: "150px 150px", transformBox: "view-box" }}
          initial={spin ? { rotate: 0 } : false}
          animate={spin ? { rotate: [0, -540, -720] } : { rotate: 0 }}
          transition={{ duration: 1.8, times: [0, 0.7, 1], ease: [0.3, 0, 0.2, 1] }}
        >
          {hands.map((h, i) => (
            <Hand
              key={h.name}
              name={h.name}
              length={i === 0 ? 116 : 96}
              angle={together ? angleOf("Walima") + (i === 0 ? -4 : 4) : angleOf(h.place) + (i === 0 ? -5 : 5)}
              wobble={i === 0 ? 3 : 4}
              tone={i === 0 ? "gold" : "crimson"}
            />
          ))}
        </motion.g>

        <circle cx="150" cy="150" r="9" fill="url(#fc-gold)" stroke="#3b2a14" strokeWidth="0.8" />
        <circle cx="150" cy="150" r="3.4" fill="#8e1430" />
      </svg>
    </button>
  );
}
