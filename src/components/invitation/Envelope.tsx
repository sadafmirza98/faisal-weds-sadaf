"use client";

import { motion } from "motion/react";
import { wedding } from "@/config/wedding";
import { SEAL_CRACK, WaxSeal } from "@/components/magical/WaxSeal";
import { cn } from "@/lib/utils";

/**
 * The envelope is built from separate layers (back, front pocket, flap, seal)
 * so the letter can sit *between* them — behind the pocket, in front of the
 * opened flap — exactly like paper.
 */

const EASE = [0.65, 0, 0.35, 1] as const;

const away = (gone: boolean, delay = 0) => ({
  animate: gone ? { y: "70vh", rotate: 5, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 },
  transition: { duration: gone ? 1.1 : 0, delay: gone ? delay : 0, ease: [0.55, 0, 0.75, 0.3] as const },
});

export function EnvelopeBack({ gone }: { gone: boolean }) {
  return (
    <motion.div className="absolute inset-0 z-10" {...away(gone)} aria-hidden>
      <div
        className="parchment absolute inset-0 rounded-[3px]"
        style={{
          backgroundColor: "#b99a66",
          boxShadow:
            "0 0 0 1px rgb(197 164 106 / 0.55), 0 0 90px -10px rgb(232 201 139 / 0.38), 0 40px 70px -20px rgb(0 0 0 / 0.85), inset 0 0 60px rgb(70 40 12 / 0.7)",
        }}
      />
    </motion.div>
  );
}

export function EnvelopeFront({ gone }: { gone: boolean }) {
  return (
    <motion.div className="pointer-events-none absolute inset-0 z-30" {...away(gone)} aria-hidden>
      <div
        className="parchment absolute inset-0 rounded-[3px]"
        style={{ clipPath: "polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)" }}
      />
      <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {/* Pocket folds */}
        <path d="M0 0 L150 108 L300 0" fill="none" stroke="rgb(90 60 25 / 0.45)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        <path d="M0 200 L130 118 M300 200 L170 118" fill="none" stroke="rgb(90 60 25 / 0.22)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        {/* Embossed gilt border along the pocket */}
        <path d="M8 192 L292 192 L292 14 M8 192 L8 14" fill="none" stroke="rgb(128 96 59 / 0.55)" strokeWidth="0.6" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="absolute inset-x-0 bottom-[9%] flex flex-col items-center text-center">
        <span className="font-script text-[clamp(1.2rem,4.6vw,1.9rem)] leading-none text-ink/85">{wedding.invitation.envelopeAddressee}</span>
        <span className="mt-1.5 font-cinzel text-[clamp(0.5rem,1.5vw,0.62rem)] tracking-[0.32em] text-ink-soft/80 uppercase">By owl post · {wedding.locationLine}</span>
      </div>
    </motion.div>
  );
}

export function EnvelopeFlap({ open, behind, gone }: { open: boolean; behind: boolean; gone: boolean }) {
  return (
    <motion.div className={cn("pointer-events-none absolute inset-x-0 top-0 h-full", behind ? "z-[15]" : "z-40")} {...away(gone, 0.05)} aria-hidden>
      <motion.div
        className="preserve-3d absolute inset-0"
        style={{ transformOrigin: "50% 0%", transformPerspective: 1100 }}
        initial={false}
        animate={{ rotateX: open ? 178 : 0 }}
        transition={{ duration: 0.95, ease: EASE }}
      >
        {/* Outer face */}
        <div className="paper-face" style={{ filter: "drop-shadow(0 7px 7px rgb(40 22 6 / 0.45))" }}>
          <div className="parchment absolute inset-0" style={{ clipPath: "polygon(0 0, 100% 0, 50% 58%)", backgroundColor: "#ecdcbc" }} />
          <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d="M10 4 L150 108 L290 4" fill="none" stroke="rgb(128 96 59 / 0.6)" strokeWidth="0.6" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        {/* Inner face (seen once the flap is lifted) */}
        <div className="paper-face paper-back">
          <div className="parchment absolute inset-0" style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 42%)", backgroundColor: "#c4a571", filter: "brightness(0.86)" }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

interface SealButtonProps {
  broken: boolean;
  hidden: boolean;
  onUnseal: () => void;
  disabled: boolean;
}

/** The wax seal: a real button. Breaks along a crack into two halves. */
export function SealButton({ broken, hidden, onUnseal, disabled }: SealButtonProps) {
  return (
    <div
      className={cn("absolute left-1/2 top-[58%] z-[45] -translate-x-1/2 -translate-y-1/2", hidden && "invisible")}
      style={{ width: "clamp(70px, calc(var(--env-w) * 0.2), 104px)", aspectRatio: "1" }}
    >
      {!broken ? (
        <motion.button
          type="button"
          onClick={onUnseal}
          disabled={disabled}
          aria-label="Break the wax seal"
          className="group relative block h-full w-full rounded-full"
          whileHover={{ scale: 1.06, rotate: -3 }}
          whileTap={{ scale: 0.94 }}
        >
          <span className="absolute inset-[-14%] animate-pulse rounded-full bg-[radial-gradient(circle,rgb(232_201_139/0.35),transparent_65%)]" aria-hidden />
          <WaxSeal size="100%" className="relative drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]" />
        </motion.button>
      ) : (
        <div className="relative h-full w-full" aria-hidden>
          {/* Crack of light */}
          <svg viewBox="-6 -6 112 112" className="absolute inset-0 h-full w-full overflow-visible">
            <motion.path
              d={SEAL_CRACK}
              fill="none"
              stroke="#fff3c9"
              strokeWidth="2.4"
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 4px #ffd98a)" }}
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: [1, 1, 0] }}
              transition={{ duration: 0.55, times: [0, 0.6, 1] }}
            />
          </svg>
          <motion.div
            className="absolute inset-0"
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: -34, y: 110, rotate: -38, opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: [0.5, 0, 0.75, 0] }}
          >
            <WaxSeal size="100%" half="left" />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: 36, y: 124, rotate: 44, opacity: 0 }}
            transition={{ duration: 0.95, delay: 0.3, ease: [0.5, 0, 0.75, 0] }}
          >
            <WaxSeal size="100%" half="right" />
          </motion.div>
          {/* Wax crumbs */}
          {[
            [-20, -30, 4],
            [26, -22, 3],
            [8, -40, 2.5],
            [-30, 6, 3],
          ].map(([x, y, r], i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full bg-crimson"
              style={{ width: r * 2, height: r * 2 }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: x * 2, y: [y, y + 160], opacity: [1, 1, 0] }}
              transition={{ duration: 1, delay: 0.3, ease: "easeIn" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
