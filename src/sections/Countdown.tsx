"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { wedding } from "@/config/wedding";
import { ParticleField } from "@/components/magical/ParticleField";
import { FamilyClock, type Place } from "@/components/magical/FamilyClock";
import { StarField } from "@/components/magical/StarField";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useCountdown } from "@/hooks/useCountdown";
import { countdownTargetLabel, countdownTargetMs } from "@/lib/wedding";

/** Animated digits: each changing digit slides up out of the ink. */
function Digits({ value, pad = 2 }: { value: number; pad?: number }) {
  const reduced = useReducedMotion();
  const str = String(value).padStart(pad, "0");
  return (
    <span className="inline-flex overflow-hidden" aria-hidden>
      {str.split("").map((d, i) => (
        <span key={i} className="relative inline-block w-[0.62em] text-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={d}
              className="inline-block"
              initial={reduced ? { opacity: 0 } : { y: "-70%", opacity: 0, filter: "blur(4px)" }}
              animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
              exit={reduced ? { opacity: 0 } : { y: "70%", opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

/** Where the family clock's hands point, as the day draws near. */
function placesFor(daysLeft: number | null, done: boolean): [Place, Place] {
  if (done) return ["Walima", "Walima"];
  if (daysLeft === null || daysLeft > 7) return ["Counting days", "Dreaming"];
  if (daysLeft >= 1) return ["Making duas", "Getting ready"];
  return ["On the way", "Getting ready"];
}

const UNITS = [
  { key: "days", label: "Days", pad: 3 },
  { key: "hours", label: "Hours", pad: 2 },
  { key: "minutes", label: "Minutes", pad: 2 },
  { key: "seconds", label: "Seconds", pad: 2 },
] as const;

export function Countdown() {
  const left = useCountdown(countdownTargetMs);
  const { countdown } = wedding;
  const done = left !== null && left.total <= 0;

  // Announce at most once a minute for screen readers (not every second).
  const srSummary = left && !done ? `${left.days} days, ${left.hours} hours and ${left.minutes} minutes until the ${wedding.occasion}.` : "";

  return (
    <section id="countdown" aria-labelledby="countdown-title" className="relative isolate overflow-hidden bg-navy-deep py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#17223a_0%,#0c1220_55%,#090b12_90%)]" />
        <StarField count={110} seed={23} className="opacity-70" />
        <ParticleField density={4} />
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading id="countdown-title" eyebrow={countdown.eyebrow} title={countdown.title} />

        <Reveal className="mt-10 flex flex-col items-center">
          <div className="relative h-[min(74vw,17.5rem)] w-[min(74vw,17.5rem)] drop-shadow-[0_0_40px_rgba(197,164,106,0.3)]">
            <FamilyClock
              hands={(() => {
                const [groom, bride] = placesFor(left?.days ?? null, done);
                return [
                  { name: wedding.couple.groom.firstName, place: groom },
                  { name: wedding.couple.bride.firstName, place: bride },
                ];
              })()}
            />
          </div>

          {done ? (
            <motion.div className="mt-12 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}>
              <p className="text-foil font-cinzel text-[clamp(2rem,7vw,4rem)] font-bold tracking-[0.12em] uppercase" role="status">
                <Sparkles className="mr-3 inline h-8 w-8 text-gold-light" aria-hidden />
                {countdown.complete}
              </p>
              <p className="mt-4 font-fell text-xl text-parchment/80 italic">{countdown.completeMessage}</p>
            </motion.div>
          ) : (
            <div role="timer" aria-label={`Countdown to the ${wedding.occasion}`} className="mt-9 grid w-full max-w-xl grid-cols-4 gap-2 sm:gap-3.5">
              {UNITS.map((u) => (
                <div
                  key={u.key}
                  className="relative flex flex-col items-center rounded-[3px] border border-gold/35 bg-[linear-gradient(180deg,rgb(197_164_106/0.1),rgb(9_11_18/0.6))] px-1 py-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-sm sm:py-4"
                >
                  <span className="absolute inset-1.5 rounded-[2px] border border-gold/10" aria-hidden />
                  <span className="text-foil font-cinzel text-[clamp(1.45rem,6.4vw,2.4rem)] leading-none font-semibold tabular-nums">
                    {left ? <Digits value={left[u.key]} pad={u.key === "days" && left.days < 100 ? 2 : u.pad} /> : <span aria-hidden>––</span>}
                  </span>
                  <span className="mt-2 font-cinzel text-[0.55rem] font-semibold tracking-[0.22em] text-parchment/70 uppercase sm:text-[0.62rem] sm:tracking-[0.3em]">{u.label}</span>
                  <span className="sr-only">{left ? `${left[u.key]} ${u.label}` : ""}</span>
                </div>
              ))}
            </div>
          )}

          <p className="mt-6 text-center font-sans text-xs tracking-[0.08em] text-parchment/50">
            Counting down to {countdownTargetLabel}
            {!wedding.event.time && " — the hour will be announced"}
          </p>
          <p className="sr-only" aria-live="polite">
            {srSummary}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
