import { useId } from "react";
import { wedding } from "@/config/wedding";
import { r2, seeded } from "@/lib/utils";

/** Irregular poured-wax outline, generated once (deterministic). */
const BLOB = (() => {
  const rnd = seeded(20261220);
  const pts: [number, number][] = [];
  const n = 26;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 47 + (rnd() - 0.5) * 6 + (i % 3 === 0 ? 2.2 : 0);
    pts.push([r2(50 + Math.cos(a) * r), r2(50 + Math.sin(a) * r)]);
  }
  let d = "";
  for (let i = 0; i < n; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[(i + 1) % n];
    const mx = (x + nx) / 2;
    const my = (y + ny) / 2;
    d += i === 0 ? `M${mx.toFixed(2)},${my.toFixed(2)}` : "";
    d += ` Q${nx.toFixed(2)},${ny.toFixed(2)} ${(((nx + pts[(i + 2) % n][0]) / 2)).toFixed(2)},${(((ny + pts[(i + 2) % n][1]) / 2)).toFixed(2)}`;
  }
  return d + "Z";
})();

/** The zig-zag crack the seal breaks along. */
export const SEAL_CRACK = "M52,-4 L47,16 L55,31 L45,49 L54,64 L47,81 L53,104";

interface WaxSealProps {
  size?: number | string;
  /** Render only one half (for the breaking animation). */
  half?: "left" | "right";
  className?: string;
  title?: string;
}

/** Crimson wax seal with the embossed F & S monogram. Original artwork. */
export function WaxSeal({ size = 120, half, className, title }: WaxSealProps) {
  const id = useId().replace(/:/g, "");
  const [a, b] = wedding.couple.monogram;
  const clip =
    half === "left"
      ? "M-10,-10 L52,-4 L47,16 L55,31 L45,49 L54,64 L47,81 L53,104 L-10,110Z"
      : half === "right"
        ? "M52,-4 L47,16 L55,31 L45,49 L54,64 L47,81 L53,104 L110,110 L110,-10Z"
        : null;

  return (
    <svg
      viewBox="-6 -6 112 112"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <radialGradient id={`${id}-wax`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#b02647" />
          <stop offset="45%" stopColor="#7d0f29" />
          <stop offset="100%" stopColor="#3c0512" />
        </radialGradient>
        <radialGradient id={`${id}-pool`} cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#5a0a1c" stopOpacity="0" />
          <stop offset="100%" stopColor="#2a0209" stopOpacity="0.7" />
        </radialGradient>
        <filter id={`${id}-emboss`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" result="b" />
          <feSpecularLighting in="b" surfaceScale="2.4" specularConstant="0.7" specularExponent="18" lightingColor="#ffd9e0" result="s">
            <feDistantLight azimuth="235" elevation="42" />
          </feSpecularLighting>
          <feComposite in="s" in2="SourceAlpha" operator="in" result="s2" />
          <feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3="0.55" k4="0" />
        </filter>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000" floodOpacity="0.55" />
        </filter>
        {clip && (
          <clipPath id={`${id}-clip`}>
            <path d={clip} />
          </clipPath>
        )}
      </defs>
      <g clipPath={clip ? `url(#${id}-clip)` : undefined} filter={`url(#${id}-shadow)`}>
        <g filter={`url(#${id}-emboss)`}>
          <path d={BLOB} fill={`url(#${id}-wax)`} />
          <path d={BLOB} fill={`url(#${id}-pool)`} />
          <circle cx="50" cy="50" r="35" fill="none" stroke="#4a0716" strokeWidth="2.4" opacity="0.8" />
          <circle cx="50" cy="50" r="31.5" fill="none" stroke="#c9566f" strokeWidth="0.6" opacity="0.45" />
          {/* Dotted inner ring */}
          <circle cx="50" cy="50" r="38.5" fill="none" stroke="#9b2a44" strokeWidth="1" strokeDasharray="0.8 2.6" opacity="0.7" />
          <text
            x="41"
            y="61"
            textAnchor="middle"
            fontSize="34"
            fill="#4f0818"
            style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}
          >
            {a}
          </text>
          <text
            x="60"
            y="64"
            textAnchor="middle"
            fontSize="40"
            fill="#5c0b1e"
            style={{ fontFamily: "var(--font-script)" }}
          >
            {b}
          </text>
          {/* Tiny stars of the crest */}
          <path d="M50 19 l1.2 2.6 2.8.3-2.1 1.9.6 2.8-2.5-1.4-2.5 1.4.6-2.8-2.1-1.9 2.8-.3z" fill="#5a0a1c" />
          <path d="M50 76 l.9 1.9 2 .2-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.2z" fill="#5a0a1c" />
        </g>
        <ellipse cx="34" cy="28" rx="13" ry="6" fill="#fff" opacity="0.13" transform="rotate(-28 34 28)" />
      </g>
    </svg>
  );
}
