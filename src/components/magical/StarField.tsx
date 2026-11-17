import { cn, seeded } from "@/lib/utils";

interface StarFieldProps {
  count?: number;
  seed?: number;
  className?: string;
}

/** The enchanted ceiling: a deterministic field of twinkling stars. */
export function StarField({ count = 140, seed = 7, className }: StarFieldProps) {
  const rnd = seeded(seed);
  const stars = Array.from({ length: count }, (_, i) => ({
    i,
    x: rnd() * 100,
    y: rnd() * 100,
    r: rnd() < 0.08 ? 1.4 + rnd() : 0.4 + rnd() * 0.8,
    twinkle: rnd() < 0.45,
    delay: (rnd() * -4).toFixed(2),
    dur: (2.5 + rnd() * 4).toFixed(2),
    o: 0.35 + rnd() * 0.6,
  }));
  return (
    <svg className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} aria-hidden preserveAspectRatio="none">
      {stars.map((s) => (
        <circle
          key={s.i}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.r}
          fill={s.r > 1.3 ? "#fff4d6" : "#dfe3ee"}
          opacity={s.o}
          className={s.twinkle ? "animate-twinkle" : undefined}
          style={s.twinkle ? { animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` } : undefined}
        />
      ))}
    </svg>
  );
}
