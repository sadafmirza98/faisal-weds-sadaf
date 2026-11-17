import { cn, r2 } from "@/lib/utils";

/** Antique sixteen-point compass rose in ink. viewBox 200×200. */
export function Compass({ className, tone = "ink" }: { className?: string; tone?: "ink" | "gold" }) {
  const c = tone === "ink" ? "#2b1d10" : "#c5a46a";
  const fillA = tone === "ink" ? "#2b1d10" : "#c5a46a";
  const fillB = tone === "ink" ? "#e8d7b4" : "#111a2b";
  const points = Array.from({ length: 16 }, (_, i) => i);
  return (
    <svg viewBox="0 0 200 200" className={cn("block", className)} aria-hidden>
      <circle cx="100" cy="100" r="92" fill="none" stroke={c} strokeWidth="1.2" />
      <circle cx="100" cy="100" r="86" fill="none" stroke={c} strokeWidth="0.6" />
      <circle cx="100" cy="100" r="62" fill="none" stroke={c} strokeWidth="0.6" strokeDasharray="2 3" />
      {Array.from({ length: 72 }).map((_, i) => {
        const a = (i * 5 * Math.PI) / 180;
        const r1 = i % 2 ? 86 : 82;
        return <line key={i} x1={r2(100 + Math.cos(a) * r1)} y1={r2(100 + Math.sin(a) * r1)} x2={r2(100 + Math.cos(a) * 92)} y2={r2(100 + Math.sin(a) * 92)} stroke={c} strokeWidth="0.6" />;
      })}
      {points.map((i) => {
        const len = i % 4 === 0 ? 80 : i % 2 === 0 ? 56 : 38;
        const wdt = i % 4 === 0 ? 10 : i % 2 === 0 ? 7 : 5;
        const rot = i * 22.5;
        return (
          <g key={i} transform={`rotate(${rot} 100 100)`}>
            <path d={`M100 ${100 - len} L${100 + wdt} 100 L100 100Z`} fill={fillA} />
            <path d={`M100 ${100 - len} L${100 - wdt} 100 L100 100Z`} fill={fillB} stroke={c} strokeWidth="0.6" />
          </g>
        );
      })}
      <circle cx="100" cy="100" r="5" fill={fillB} stroke={c} strokeWidth="1" />
      {[
        ["N", 100, 7],
        ["E", 196, 104],
        ["S", 100, 200],
        ["W", 4, 104],
      ].map(([l, x, y]) => (
        <text key={l as string} x={x as number} y={y as number} textAnchor="middle" fontSize="13" fill={c} style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}>
          {l}
        </text>
      ))}
    </svg>
  );
}
