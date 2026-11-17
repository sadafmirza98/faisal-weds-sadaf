import { cn, seeded } from "@/lib/utils";

interface Tower {
  x: number;
  w: number;
  h: number;
  roof: number;
  battlement?: boolean;
}

// Hand-placed composition (x, width, height above the cliff, spire height).
const TOWERS: Tower[] = [
  { x: 80, w: 34, h: 120, roof: 70 },
  { x: 150, w: 70, h: 90, roof: 0, battlement: true },
  { x: 230, w: 40, h: 170, roof: 95 },
  { x: 300, w: 110, h: 120, roof: 0, battlement: true },
  { x: 420, w: 46, h: 230, roof: 120 },
  { x: 480, w: 150, h: 160, roof: 70 },
  { x: 560, w: 52, h: 290, roof: 150 },
  { x: 640, w: 120, h: 150, roof: 0, battlement: true },
  { x: 770, w: 44, h: 210, roof: 110 },
  { x: 830, w: 90, h: 110, roof: 55 },
  { x: 935, w: 36, h: 160, roof: 85 },
  { x: 990, w: 80, h: 80, roof: 0, battlement: true },
  { x: 1085, w: 30, h: 120, roof: 65 },
];
const BASE = 330;

/** Original castle silhouette on a cliff, with candle-lit windows. viewBox 1200×400. */
export function Castle({ className, glow = true }: { className?: string; glow?: boolean }) {
  const rnd = seeded(1220);
  const windows: { x: number; y: number; w: number; h: number; lit: boolean; tw: boolean; d: string }[] = [];
  for (const t of TOWERS) {
    const cols = Math.max(1, Math.floor(t.w / 22));
    const rows = Math.floor(t.h / 34);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rnd() < 0.7) continue;
        const ww = 6;
        const wh = 11;
        const x = t.x + ((c + 0.5) * t.w) / cols - ww / 2;
        const y = BASE - t.h + 18 + r * 34;
        windows.push({ x, y, w: ww, h: wh, lit: rnd() < 0.7, tw: rnd() < 0.25, d: (rnd() * -5).toFixed(2) });
      }
    }
  }
  return (
    <svg viewBox="0 0 1200 400" className={cn("block", className)} aria-hidden preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="castle-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141c2e" />
          <stop offset="1" stopColor="#070a12" />
        </linearGradient>
        <radialGradient id="castle-glow" cx="50%" cy="80%" r="60%">
          <stop offset="0" stopColor="#e8c98b" stopOpacity="0.22" />
          <stop offset="1" stopColor="#e8c98b" stopOpacity="0" />
        </radialGradient>
      </defs>
      {glow && <ellipse cx="600" cy="260" rx="520" ry="160" fill="url(#castle-glow)" />}
      <g fill="url(#castle-stone)">
        {TOWERS.map((t, i) => (
          <g key={i}>
            <rect x={t.x} y={BASE - t.h} width={t.w} height={t.h + 4} />
            {t.roof > 0 && <path d={`M${t.x - 5} ${BASE - t.h} L${t.x + t.w / 2} ${BASE - t.h - t.roof} L${t.x + t.w + 5} ${BASE - t.h}Z`} />}
            {t.roof > 0 && <path d={`M${t.x + t.w / 2} ${BASE - t.h - t.roof} v-14`} stroke="#141c2e" strokeWidth="2" />}
            {t.battlement &&
              Array.from({ length: Math.floor(t.w / 14) }).map((_, j) => (
                <rect key={j} x={t.x + j * 14 + 2} y={BASE - t.h - 9} width="8" height="10" />
              ))}
          </g>
        ))}
        {/* Bridge arches */}
        <path d="M150 300 h80 v-10 h-80z M640 290 h130 v-12 h-130z" />
        {/* Cliff */}
        <path d="M0 400 L0 352 C80 338 140 330 200 334 C300 340 360 322 440 326 C540 332 600 318 700 324 C820 330 900 318 1000 330 C1080 338 1140 344 1200 350 L1200 400Z" fill="#05070c" />
        <path d="M60 340 L1150 340 L1120 352 L90 356Z" fill="#0a0f1a" />
      </g>
      {windows.map((w, i) =>
        w.lit ? (
          <path
            key={i}
            d={`M${w.x} ${w.y + w.h} v-${w.h - 3} a${w.w / 2} ${w.w / 2} 0 0 1 ${w.w} 0 v${w.h - 3}z`}
            fill="#e8c98b"
            opacity={0.85}
            className={w.tw ? "animate-twinkle" : undefined}
            style={w.tw ? { animationDelay: `${w.d}s`, animationDuration: "5s" } : undefined}
          />
        ) : null,
      )}
    </svg>
  );
}
