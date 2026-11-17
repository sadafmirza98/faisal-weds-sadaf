"use client";

import { motion, type Variants } from "motion/react";
import { wedding } from "@/config/wedding";
import { Corner, Flourish } from "@/components/magical/Flourish";
import { Monogram } from "@/components/magical/Monogram";
import { eventDateFull, eventDateLong, eventTimeWords, firstNames, hasEventTime } from "@/lib/wedding";
import { cn } from "@/lib/utils";

/**
 * A tri-fold parchment letter. The top and bottom thirds are hinged 3D panels
 * (front + back faces) that fold over the fixed middle third. Sizes use
 * container-query units so the composition scales with the letter, not the
 * viewport.
 */

/** Panel height as a fraction of the letter width (three panels per letter). */
export const PANEL_RATIO = 0.52;

const EASE = [0.65, 0, 0.35, 1] as const;

const ink: Variants = {
  hidden: { opacity: 0, y: 6, filter: "blur(6px)" },
  shown: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, delay: 0.15 + i * 0.16, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Ink({ i, show, className, children, as = "div" }: { i: number; show: boolean; className?: string; children: React.ReactNode; as?: "div" | "p" | "h1" | "h2" }) {
  const Comp = motion[as];
  return (
    <Comp custom={i} variants={ink} initial="hidden" animate={show ? "shown" : "hidden"} className={className}>
      {children}
    </Comp>
  );
}

/** Gilt-and-ink inner frame, drawn per panel so it reads continuous once unfolded. */
function Frame({ edge }: { edge: "top" | "middle" | "bottom" }) {
  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute inset-x-[6.5cqw] border-x border-ink/45",
          edge === "top" && "top-[6.5cqw] bottom-0 border-t",
          edge === "middle" && "inset-y-0",
          edge === "bottom" && "top-0 bottom-[6.5cqw] border-b",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-[8cqw] border-x border-ink/20",
          edge === "top" && "top-[8cqw] bottom-0 border-t",
          edge === "middle" && "inset-y-0",
          edge === "bottom" && "top-0 bottom-[8cqw] border-b",
        )}
      />
      {edge === "top" && (
        <>
          <Corner className="absolute left-[5cqw] top-[5cqw] w-[11cqw]" />
          <Corner className="absolute right-[5cqw] top-[5cqw] w-[11cqw] -scale-x-100" />
        </>
      )}
      {edge === "bottom" && (
        <>
          <Corner className="absolute bottom-[5cqw] left-[5cqw] w-[11cqw] -scale-y-100" />
          <Corner className="absolute bottom-[5cqw] right-[5cqw] w-[11cqw] -scale-100" />
        </>
      )}
    </>
  );
}

/** Soft shadow along a crease; deepens while folded. */
function Crease({ side, folded }: { side: "top" | "bottom"; folded: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          side === "bottom"
            ? "linear-gradient(to top, rgb(70 40 12 / 0.55), rgb(70 40 12 / 0.08) 18%, transparent 40%)"
            : "linear-gradient(to bottom, rgb(70 40 12 / 0.55), rgb(70 40 12 / 0.08) 18%, transparent 40%)",
      }}
      initial={false}
      animate={{ opacity: folded ? 1 : 0.32 }}
      transition={{ duration: 1.2, ease: EASE }}
    />
  );
}

interface ParchmentLetterProps {
  /** Panels open (animates the fold). */
  unfolded: boolean;
  /** Ink revealed. */
  revealed: boolean;
  /** Delay before the first panel opens, in seconds. */
  unfoldDelay?: number;
}

export function ParchmentLetter({ unfolded, revealed, unfoldDelay = 0.85 }: ParchmentLetterProps) {
  const { invitation } = wedding;
  const slot = { height: `calc(var(--letter-w) * ${PANEL_RATIO})` };

  return (
    <div className="relative w-[var(--letter-w)] [container-type:inline-size]">
      {/* ── Top third: hinged at its bottom edge, folds down over the middle (outermost). ── */}
      <div className="relative z-30" style={slot}>
        <motion.div
          className="preserve-3d absolute inset-0"
          style={{ transformOrigin: "50% 100%", transformPerspective: 1600 }}
          initial={false}
          animate={{ rotateX: unfolded ? 0 : -180 }}
          transition={{ duration: 1.2, delay: unfolded ? unfoldDelay : 0, ease: EASE }}
        >
          <div className="paper-face parchment deckle-t overflow-hidden">
            <Frame edge="top" />
            <div className="relative flex h-full flex-col items-center justify-end px-[9cqw] pb-[2.6cqw] text-center">
              <Ink i={0} show={revealed}>
                <Monogram tone="ink" className="mx-auto h-[10cqw] w-[10cqw] drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]" title="F and S crest" />
              </Ink>
              <Ink i={1} show={revealed} as="p" className="mt-[1.2cqw] font-arabic text-[6.2cqw] leading-[1.5] text-ink" >
                <span lang="ar" dir="rtl">{wedding.bismillah.arabic}</span>
              </Ink>
              <Ink i={2} show={revealed} as="p" className="font-fell text-[2.7cqw] text-ink-soft italic">
                {wedding.bismillah.translation}
              </Ink>
              <Ink i={3} show={revealed}>
                <Flourish tone="ink" className="mx-auto mt-[1.4cqw] w-[38cqw]" />
              </Ink>
              <Ink i={4} show={revealed} as="p" className="mt-[1.2cqw] font-cinzel text-[max(9px,2.5cqw)] font-semibold tracking-[0.42em] text-crimson uppercase">
                {invitation.byInvitation}
              </Ink>
              <Ink i={5} show={revealed} as="p" className="mt-[1.2cqw] max-w-[64cqw] font-fell text-[3.6cqw] leading-[1.35] text-ink-soft italic">
                {invitation.invitedTo}
              </Ink>
            </div>
            <Crease side="bottom" folded={!unfolded} />
          </div>
          {/* Exterior of the folded letter */}
          <div className="paper-face paper-back parchment deckle-b flex flex-col items-center justify-center overflow-hidden text-center">
            <div className="absolute inset-[7cqw] border border-ink/25" />
            <span className="font-calligraphy text-[11cqw] leading-[1.2] text-ink/85">{firstNames}</span>
            <span className="mt-[2cqw] font-cinzel text-[2.6cqw] tracking-[0.4em] text-ink-soft uppercase">{eventDateLong}</span>
          </div>
        </motion.div>
      </div>

      {/* ── Middle third: fixed. ── */}
      <div className="parchment deckle-x relative z-10 overflow-hidden" style={slot}>
        <Frame edge="middle" />
        <div className="relative flex h-full flex-col items-center justify-center px-[8cqw] text-center">
          {[wedding.couple.groom, wedding.couple.bride].map((p, k) => (
            <div key={p.fullName} className="contents">
              {k === 1 && (
                <Ink i={7} show={revealed} as="p" className="my-[0.5cqw] font-script text-[8cqw] leading-none text-crimson">
                  &amp;
                </Ink>
              )}
              <Ink i={k === 0 ? 6 : 8} show={revealed} as="h2" className="font-calligraphy text-[10.4cqw] leading-[1.12] text-ink">
                {p.fullName}
              </Ink>
              {p.family && (
                <Ink i={k === 0 ? 6 : 8} show={revealed} as="p" className="font-fell text-[max(9px,2.65cqw)] leading-[1.3] text-ink-soft italic">
                  {p.family.relation} {p.family.parents}
                </Ink>
              )}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-ink/15" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-ink/15" />
      </div>

      {/* ── Bottom third: hinged at its top edge, folds up over the middle. ── */}
      <div className="relative z-20" style={slot}>
        <motion.div
          className="preserve-3d absolute inset-0"
          style={{ transformOrigin: "50% 0%", transformPerspective: 1600 }}
          initial={false}
          animate={{ rotateX: unfolded ? 0 : 180 }}
          transition={{ duration: 1.2, delay: unfolded ? unfoldDelay + 0.6 : 0, ease: EASE }}
        >
          <div className="paper-face parchment deckle-b overflow-hidden">
            <Frame edge="bottom" />
            <div className="relative flex h-full flex-col items-center justify-start px-[9cqw] pt-[3cqw] text-center">
              <Ink i={9} show={revealed} as="p" className="font-cinzel text-[4.4cqw] font-bold tracking-[0.12em] text-ink">
                {eventDateFull.toUpperCase()}
              </Ink>
              {hasEventTime && (
                <Ink i={10} show={revealed} as="p" className="mt-[0.6cqw] font-fell text-[3.6cqw] text-ink-soft italic">
                  {eventTimeWords}
                </Ink>
              )}
              <Ink i={11} show={revealed} className="mt-[1.4cqw] flex items-center gap-[2.5cqw]">
                <span className="h-px w-[9cqw] bg-ink/45" />
                <span className="font-calligraphy text-[6.4cqw] leading-[1.2] text-crimson">{wedding.occasion}</span>
                <span className="h-px w-[9cqw] bg-ink/45" />
              </Ink>
              <Ink i={12} show={revealed} as="p" className="mt-[0.6cqw] font-cinzel text-[max(8.5px,2.4cqw)] font-semibold tracking-[0.24em] text-ink uppercase">
                {wedding.venue.name}
              </Ink>
              <Ink i={13} show={revealed} as="p" className="font-fell text-[2.9cqw] text-ink-soft">
                {wedding.venue.area}, {wedding.locationLine}
              </Ink>
              <Ink i={14} show={revealed} as="p" className="mt-[1.6cqw] max-w-[66cqw] font-fell text-[3.3cqw] leading-[1.35] text-ink-soft italic">
                “{invitation.blessing}”
              </Ink>
            </div>
            <Crease side="top" folded={!unfolded} />
          </div>
          <div className="paper-face paper-back parchment deckle-t" />
        </motion.div>
      </div>
    </div>
  );
}
