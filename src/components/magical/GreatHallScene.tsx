import { cn, r2 } from "@/lib/utils";

/**
 * Original Great Hall interior in one-point perspective: side walls with
 * lancet windows and hanging banners, a rose window on the far wall and long
 * tables converging on the vanishing point. The ceiling is left open so the
 * enchanted night sky behind shows through. viewBox 1440×900.
 */

const VP = { x: 720, y: 520 };
const FAR = { l: 540, r: 900, t: 330, b: 600 };

function wallY(x: number, side: "l" | "r") {
  // Top edge: (0,40) → (FAR.l, FAR.t); bottom: (0,900) → (FAR.l, FAR.b)
  const t = side === "l" ? x / FAR.l : (1440 - x) / (1440 - FAR.r);
  return { top: 40 + (FAR.t - 40) * t, bottom: 900 - (900 - FAR.b) * t };
}

function lancet(x1: number, x2: number, side: "l" | "r") {
  const a = wallY(x1, side);
  const b = wallY(x2, side);
  const ha = a.bottom - a.top;
  const hb = b.bottom - b.top;
  const t1 = a.top + ha * 0.2;
  const b1 = a.top + ha * 0.66;
  const t2 = b.top + hb * 0.2;
  const b2 = b.top + hb * 0.66;
  const mx = (x1 + x2) / 2;
  const apex = (t1 + t2) / 2 - Math.abs(x2 - x1) * 0.9;
  return {
    d: `M${x1} ${b1} L${x1} ${t1} Q${x1} ${apex + (t1 - apex) * 0.25} ${mx} ${apex} Q${x2} ${apex + (t2 - apex) * 0.25} ${x2} ${t2} L${x2} ${b2} Z`,
    mullion: `M${mx} ${(t1 + t2) / 2 - Math.abs(x2 - x1) * 0.45} L${mx} ${(b1 + b2) / 2}`,
    transom: `M${x1} ${t1 + (b1 - t1) * 0.55} L${x2} ${t2 + (b2 - t2) * 0.55}`,
  };
}

function banner(x: number, w: number, side: "l" | "r", color: string) {
  const a = wallY(x, side);
  const h = (a.bottom - a.top) * 0.36;
  const top = a.top + (a.bottom - a.top) * 0.04;
  return { x, w, top, h, color };
}

const LEFT_WINDOWS = [
  [40, 150],
  [230, 310],
  [370, 425],
  [468, 505],
] as const;
const BANNERS_L = [banner(178, 34, "l", "#740d24"), banner(335, 22, "l", "#243d32"), banner(440, 15, "l", "#1c2a4a")];
const BANNERS_R = [banner(1440 - 178 - 34, 34, "r", "#80603b"), banner(1440 - 335 - 22, 22, "r", "#740d24"), banner(1440 - 440 - 15, 15, "r", "#243d32")];

export function GreatHallScene({ className }: { className?: string }) {
  const windows = [
    ...LEFT_WINDOWS.map(([a, b]) => lancet(a, b, "l")),
    ...LEFT_WINDOWS.map(([a, b]) => lancet(1440 - b, 1440 - a, "r")),
  ];
  const tables = [250, 560, 880, 1190];
  return (
    <svg viewBox="0 0 1440 900" className={cn("block h-full w-full", className)} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="gh-wall-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0d1322" />
          <stop offset="1" stopColor="#1a2234" />
        </linearGradient>
        <linearGradient id="gh-wall-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#0d1322" />
          <stop offset="1" stopColor="#1a2234" />
        </linearGradient>
        <linearGradient id="gh-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1a1c" />
          <stop offset="1" stopColor="#07080c" />
        </linearGradient>
        <linearGradient id="gh-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d77a8" stopOpacity="0.85" />
          <stop offset="0.55" stopColor="#c9a86a" stopOpacity="0.7" />
          <stop offset="1" stopColor="#e8c98b" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="gh-rose" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff1c9" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#c5a46a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#5d77a8" stopOpacity="0.25" />
        </radialGradient>
        <radialGradient id="gh-glow" cx="50%" cy="62%" r="55%">
          <stop offset="0" stopColor="#e8c98b" stopOpacity="0.32" />
          <stop offset="0.6" stopColor="#e8c98b" stopOpacity="0.05" />
          <stop offset="1" stopColor="#e8c98b" stopOpacity="0" />
        </radialGradient>
        <filter id="gh-soft">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Far wall */}
      <rect x={FAR.l} y={FAR.t} width={FAR.r - FAR.l} height={FAR.b - FAR.t} fill="#141b2c" />
      <g transform="translate(720 410)">
        <circle r="62" fill="url(#gh-rose)" opacity="0.55" filter="url(#gh-soft)" />
        <circle r="50" fill="url(#gh-rose)" opacity="0.6" />
        <circle r="50" fill="none" stroke="#0d1322" strokeWidth="4" />
        <circle r="22" fill="none" stroke="#0d1322" strokeWidth="3" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="0" y1="0" x2={r2(Math.cos((i * Math.PI) / 6) * 50)} y2={r2(Math.sin((i * Math.PI) / 6) * 50)} stroke="#0d1322" strokeWidth="2.5" />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={r2(Math.cos(((i + 0.5) * Math.PI) / 6) * 36)} cy={r2(Math.sin(((i + 0.5) * Math.PI) / 6) * 36)} r="7" fill="none" stroke="#0d1322" strokeWidth="2" />
        ))}
      </g>
      {/* High table */}
      <rect x={FAR.l + 30} y={FAR.b - 40} width={FAR.r - FAR.l - 60} height="16" fill="#0b0d14" />
      <rect x={FAR.l + 30} y={FAR.b - 42} width={FAR.r - FAR.l - 60} height="3" fill="#80603b" opacity="0.7" />

      {/* Side walls */}
      <path d={`M0 40 L${FAR.l} ${FAR.t} L${FAR.l} ${FAR.b} L0 900Z`} fill="url(#gh-wall-l)" />
      <path d={`M1440 40 L${FAR.r} ${FAR.t} L${FAR.r} ${FAR.b} L1440 900Z`} fill="url(#gh-wall-r)" />

      {/* Lancet windows with light spill */}
      {windows.map((w, i) => (
        <g key={i}>
          <path d={w.d} fill="url(#gh-window)" opacity="0.32" filter="url(#gh-soft)" />
          <path d={w.d} fill="url(#gh-window)" opacity="0.78" />
          <path d={w.d} fill="none" stroke="#0a0f1a" strokeWidth="3" />
          <path d={w.mullion} stroke="#0a0f1a" strokeWidth="2.5" />
          <path d={w.transom} stroke="#0a0f1a" strokeWidth="2" />
        </g>
      ))}

      {/* Pillars */}
      {[190, 340, 445, 1440 - 190, 1440 - 340, 1440 - 445].map((x, i) => {
        const side = x < 720 ? "l" : "r";
        const a = wallY(x, side);
        const w = side === "l" ? 34 * (1 - x / 720) + 6 : 34 * (1 - (1440 - x) / 720) + 6;
        return <rect key={i} x={x - w / 2} y={a.top} width={w} height={a.bottom - a.top} fill="#0a0e18" opacity="0.85" />;
      })}

      {/* Banners */}
      {[...BANNERS_L, ...BANNERS_R].map((b, i) => (
        <g key={i}>
          <path d={`M${b.x} ${b.top} h${b.w} v${b.h} l-${b.w / 2} ${b.w * 0.6} l-${b.w / 2} -${b.w * 0.6}z`} fill={b.color} />
          <path d={`M${b.x} ${b.top} h${b.w}`} stroke="#c5a46a" strokeWidth={Math.max(1.5, b.w / 9)} />
          <path
            d={`M${b.x + b.w / 2} ${b.top + b.h * 0.38} l${b.w * 0.12} ${b.w * 0.26} ${b.w * 0.28} ${b.w * 0.03} -${b.w * 0.21} ${b.w * 0.19} ${b.w * 0.06} ${b.w * 0.28} -${b.w * 0.25} -${b.w * 0.14} -${b.w * 0.25} ${b.w * 0.14} ${b.w * 0.06} -${b.w * 0.28} -${b.w * 0.21} -${b.w * 0.19} ${b.w * 0.28} -${b.w * 0.03}z`}
            fill="#c5a46a"
            opacity="0.85"
          />
          <path d={`M${b.x + 1} ${b.top + 2} v${b.h - 2} M${b.x + b.w - 1} ${b.top + 2} v${b.h - 2}`} stroke="#c5a46a" strokeWidth="0.8" opacity="0.5" />
        </g>
      ))}

      {/* Floor and long tables */}
      <path d={`M0 900 L${FAR.l} ${FAR.b} L${FAR.r} ${FAR.b} L1440 900Z`} fill="url(#gh-floor)" />
      {tables.map((x, i) => {
        const k = 0.09;
        const ex = x + (VP.x - x) * (1 - k);
        const ey = 900 + (VP.y - 900) * (1 - k);
        return (
          <g key={i}>
            <path d={`M${x - 60} 900 L${ex - 4} ${ey + 2} L${ex + 4} ${ey + 2} L${x + 60} 900Z`} fill="#0e0b0a" />
            <path d={`M${x - 60} 900 L${ex - 4} ${ey + 2}`} stroke="#80603b" strokeWidth="1.5" opacity="0.6" />
            {Array.from({ length: 9 }).map((_, j) => {
              const t = Math.pow((j + 1) / 10, 1.6);
              const cx = x + (ex - x) * (1 - t);
              const cy = 900 + (ey - 900) * (1 - t);
              const s = 1 - (1 - t) * 0.7;
              return <circle key={j} cx={cx} cy={cy - 6 * (1 - s) - 4} r={5 * (1.2 - s)} fill="#ffe2a0" opacity={0.75} className="animate-twinkle" style={{ animationDelay: `${(i + j) * -0.37}s`, animationDuration: "3.6s" }} />;
            })}
          </g>
        );
      })}

      {/* Warm candlelight wash */}
      <rect width="1440" height="900" fill="url(#gh-glow)" />
    </svg>
  );
}
