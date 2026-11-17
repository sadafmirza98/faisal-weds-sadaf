"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Candle } from "@/components/magical/Candle";
import { cn, seeded } from "@/lib/utils";

interface FloatingCandlesProps {
  count?: number;
  seed?: number;
  className?: string;
  /** Keep the middle band clear for text. */
  clearCenter?: boolean;
}

/** A field of floating candles in three depth layers, with gentle scroll parallax. */
export function FloatingCandles({ count = 22, seed = 9, className, clearCenter = true }: FloatingCandlesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yNear = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [60, -120]);
  const yMid = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [30, -60]);
  const yFar = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [10, -20]);

  const rnd = seeded(seed);
  const candles = Array.from({ length: count }, (_, i) => {
    const depth = i % 3; // 0 far, 1 mid, 2 near
    let left = rnd() * 96 + 2;
    const top = rnd() * (depth === 2 ? 55 : 70) + 2;
    // Keep the central text band clear of the nearer candles.
    if (clearCenter && depth > 0 && left > 26 && left < 74 && top > 8 && top < 62) left = left < 50 ? left - 24 : left + 24;
    return {
      i,
      depth,
      left,
      top,
      scale: [0.45, 0.7, 1][depth] * (0.85 + rnd() * 0.3),
      delay: `${(rnd() * -7).toFixed(2)}s`,
      duration: `${(6 + rnd() * 5).toFixed(2)}s`,
      flicker: `${(rnd() * -3).toFixed(2)}s`,
      height: 50 + rnd() * 40,
    };
  });

  const layers = [yFar, yMid, yNear];
  return (
    <div ref={ref} className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {[0, 1, 2].map((depth) => (
        <motion.div key={depth} className={cn("absolute inset-0", depth === 2 && clearCenter && "max-sm:hidden")} style={{ y: layers[depth] }}>
          {candles
            .filter((c) => c.depth === depth)
            .map((c) => (
              <div
                key={c.i}
                className="animate-bob absolute"
                style={{
                  left: `${c.left}%`,
                  top: `${c.top}%`,
                  animationDelay: c.delay,
                  animationDuration: c.duration,
                  opacity: [0.45, 0.75, 1][depth],
                  filter: depth === 0 ? "blur(1.2px)" : undefined,
                }}
              >
                <Candle height={c.height} width={14} flickerDelay={c.flicker} style={{ transform: `scale(${c.scale})` }} />
              </div>
            ))}
        </motion.div>
      ))}
    </div>
  );
}
