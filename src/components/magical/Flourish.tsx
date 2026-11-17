import { cn } from "@/lib/utils";

/** Symmetrical gilt flourish used as a section divider. */
export function Flourish({ className, tone = "gold" }: { className?: string; tone?: "gold" | "ink" }) {
  const c = tone === "gold" ? "#c5a46a" : "#5a4128";
  return (
    <svg viewBox="0 0 320 32" className={cn("block", className)} aria-hidden>
      <g fill="none" stroke={c} strokeWidth="1.1" strokeLinecap="round">
        <path d="M160 16 C140 4 122 4 112 12 C104 18 110 26 118 22 C124 19 120 12 114 14" />
        <path d="M160 16 C180 4 198 4 208 12 C216 18 210 26 202 22 C196 19 200 12 206 14" />
        <path d="M112 16 L20 16" />
        <path d="M208 16 L300 16" />
        <path d="M60 16 C70 10 78 10 84 16 C78 22 70 22 60 16Z" />
        <path d="M260 16 C250 10 242 10 236 16 C242 22 250 22 260 16Z" />
      </g>
      <path d="M160 9 L166 16 L160 23 L154 16Z" fill={c} />
      <circle cx="14" cy="16" r="2" fill={c} />
      <circle cx="306" cy="16" r="2" fill={c} />
    </svg>
  );
}

/** Ornamental L-shaped corner for parchment documents. Rotate per corner. */
export function Corner({ className, tone = "ink" }: { className?: string; tone?: "gold" | "ink" }) {
  const c = tone === "gold" ? "#c5a46a" : "#5a4128";
  return (
    <svg viewBox="0 0 80 80" className={cn("block", className)} aria-hidden>
      <g fill="none" stroke={c} strokeWidth="1.1" strokeLinecap="round">
        <path d="M4 76 V12 Q4 4 12 4 H76" />
        <path d="M10 76 V18 Q10 10 18 10 H76" strokeWidth="0.6" />
        <path d="M18 18 C30 18 34 28 28 34 C24 38 18 34 20 30 C22 26 28 28 26 32" />
        <path d="M10 40 C16 40 18 46 14 48" />
        <path d="M40 10 C40 16 46 18 48 14" />
      </g>
      <circle cx="18" cy="18" r="2.2" fill={c} />
    </svg>
  );
}
