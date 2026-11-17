"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "motion/react";
import { Owl } from "@/components/magical/Owl";

/** The owl takes the sealed reply and flies off across the sky. */
export function OwlDelivery({ onDone }: { onDone?: () => void }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <motion.div className="mx-auto w-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onAnimationComplete={onDone}>
        <Owl flapping={false} />
      </motion.div>
    );
  }
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute w-36 sm:w-48"
        initial={{ left: "-20%", top: "70%", rotate: 8, scale: 0.8 }}
        animate={{ left: ["-20%", "35%", "110%"], top: ["70%", "40%", "-20%"], rotate: [8, -4, -12], scale: [0.8, 1.05, 0.6] }}
        transition={{ duration: 3.2, ease: "easeInOut", times: [0, 0.45, 1] }}
        onAnimationComplete={onDone}
      >
        <Owl />
        {/* Trail of sparkles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute left-0 top-1/2 h-1.5 w-1.5 rounded-full bg-gold-light shadow-[0_0_8px_#e8c98b]"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: [0, 1, 0], x: -30 - i * 18, y: (i % 2 ? 1 : -1) * 10 }}
            transition={{ duration: 1.4, delay: 0.3 + i * 0.12, repeat: 1 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
