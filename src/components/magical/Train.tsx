import { cn, r2 } from "@/lib/utils";

function Wheel({ cx, cy, r, spin }: { cx: number; cy: number; r: number; spin?: boolean }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g className={spin ? "animate-[spin_1.6s_linear_infinite]" : undefined} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle r={r} fill="#120d0a" stroke="#c5a46a" strokeWidth="2.5" />
        <circle r={r - 5} fill="none" stroke="#3a2a1a" strokeWidth="1.5" />
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={i} x1="0" y1="0" x2={r2(Math.cos((i * Math.PI) / 5) * (r - 4))} y2={r2(Math.sin((i * Math.PI) / 5) * (r - 4))} stroke="#80603b" strokeWidth="1.6" />
        ))}
        <circle r={r * 0.22} fill="#c5a46a" />
      </g>
    </g>
  );
}

/** An original crimson steam locomotive with tender and one carriage. viewBox 1000×260. */
export function Train({ className, spinning = false }: { className?: string; spinning?: boolean }) {
  return (
    <svg viewBox="0 0 1000 260" className={cn("block overflow-visible", className)} aria-hidden>
      <defs>
        <linearGradient id="train-boiler" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a3203d" />
          <stop offset="0.45" stopColor="#740d24" />
          <stop offset="1" stopColor="#3b0512" />
        </linearGradient>
        <linearGradient id="train-black" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2d36" />
          <stop offset="1" stopColor="#0b0c10" />
        </linearGradient>
        <linearGradient id="train-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0c4" />
          <stop offset="1" stopColor="#e8b25c" />
        </linearGradient>
      </defs>
      {/* Carriage (left) */}
      <g>
        <rect x="10" y="70" width="330" height="130" rx="10" fill="url(#train-boiler)" />
        <rect x="10" y="62" width="330" height="16" rx="6" fill="url(#train-black)" />
        <rect x="10" y="118" width="330" height="4" fill="#c5a46a" />
        <rect x="10" y="182" width="330" height="4" fill="#c5a46a" />
        {[30, 100, 170, 240].map((x) => (
          <g key={x}>
            <rect x={x} y="84" width="52" height="30" rx="4" fill="url(#train-window)" />
            <rect x={x} y="84" width="52" height="30" rx="4" fill="none" stroke="#c5a46a" strokeWidth="1.5" />
          </g>
        ))}
        <rect x="312" y="84" width="18" height="90" rx="3" fill="#3b0512" stroke="#c5a46a" strokeWidth="1" />
        <rect x="20" y="200" width="310" height="10" fill="#0b0c10" />
        <Wheel cx={80} cy={222} r={22} spin={spinning} />
        <Wheel cx={270} cy={222} r={22} spin={spinning} />
        <rect x="340" y="186" width="30" height="6" fill="#0b0c10" />
      </g>
      {/* Tender */}
      <g>
        <rect x="370" y="110" width="150" height="92" rx="6" fill="url(#train-boiler)" />
        <rect x="370" y="104" width="150" height="12" rx="4" fill="url(#train-black)" />
        <rect x="370" y="150" width="150" height="3" fill="#c5a46a" />
        <path d="M384 104 q20 -18 40 -6 q22 -14 44 -2 q20 -10 40 4z" fill="#14100d" />
        <Wheel cx={410} cy={222} r={20} spin={spinning} />
        <Wheel cx={480} cy={222} r={20} spin={spinning} />
        <rect x="380" y="200" width="130" height="8" fill="#0b0c10" />
      </g>
      {/* Locomotive */}
      <g>
        {/* Cab */}
        <rect x="528" y="50" width="120" height="152" rx="6" fill="url(#train-boiler)" />
        <path d="M518 54 h140 l-8 -16 h-124z" fill="url(#train-black)" />
        <rect x="548" y="72" width="54" height="46" rx="5" fill="url(#train-window)" />
        <rect x="548" y="72" width="54" height="46" rx="5" fill="none" stroke="#c5a46a" strokeWidth="2" />
        <rect x="528" y="140" width="120" height="3" fill="#c5a46a" />
        {/* Boiler */}
        <rect x="640" y="96" width="250" height="78" rx="38" fill="url(#train-boiler)" />
        {[690, 760, 830].map((x) => (
          <rect key={x} x={x} y="96" width="5" height="78" fill="#c5a46a" />
        ))}
        {/* Smokebox */}
        <rect x="872" y="92" width="74" height="86" rx="12" fill="url(#train-black)" />
        <circle cx="946" cy="135" r="34" fill="url(#train-black)" stroke="#c5a46a" strokeWidth="2" />
        <circle cx="946" cy="135" r="6" fill="#c5a46a" />
        {/* Lamp */}
        <circle cx="962" cy="96" r="9" fill="#fff0c4" />
        <circle cx="962" cy="96" r="22" fill="#ffe9a8" opacity="0.18" />
        {/* Chimney + dome */}
        <path d="M900 92 v-38 h-8 v-10 h40 v10 h-8 v38z" fill="url(#train-black)" />
        <rect x="892" y="40" width="40" height="5" fill="#c5a46a" />
        <path d="M770 96 a22 20 0 0 1 44 0z" fill="#c5a46a" />
        <path d="M700 96 a14 14 0 0 1 28 0z" fill="url(#train-black)" />
        {/* Running board and buffer */}
        <rect x="528" y="174" width="440" height="10" fill="#0b0c10" />
        <rect x="960" y="164" width="30" height="8" rx="3" fill="#0b0c10" />
        <rect x="960" y="186" width="30" height="8" rx="3" fill="#0b0c10" />
        {/* Wheels */}
        <Wheel cx={590} cy={210} r={30} spin={spinning} />
        <Wheel cx={680} cy={210} r={30} spin={spinning} />
        <Wheel cx={770} cy={210} r={30} spin={spinning} />
        <Wheel cx={880} cy={222} r={18} spin={spinning} />
        <rect x="580" y="206" width="200" height="8" rx="4" fill="#c5a46a" opacity="0.9" />
        {/* Name plate */}
        <rect x="740" y="146" width="96" height="20" rx="3" fill="#1b1209" stroke="#c5a46a" strokeWidth="1.2" />
        <text x="788" y="160" textAnchor="middle" fontSize="11" fill="#e3c992" style={{ fontFamily: "var(--font-cinzel)", letterSpacing: "0.12em" }}>
          F · S EXPRESS
        </text>
      </g>
      {/* Rails */}
      <rect x="-200" y="244" width="1400" height="6" fill="#3a2a1a" />
    </svg>
  );
}
