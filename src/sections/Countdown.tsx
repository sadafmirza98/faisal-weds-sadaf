"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { wedding } from "@/config/wedding";
import { ParticleField } from "@/components/magical/ParticleField";
import { StarField } from "@/components/magical/StarField";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useCountdown } from "@/hooks/useCountdown";
import { countdownTargetLabel, countdownTargetMs } from "@/lib/wedding";
import { r2 } from "@/lib/utils";

const ROMAN = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

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

/** The enchanted clock face. Its hands show the hours, minutes and seconds still to wait. */
function ClockFace({ h, m, s }: { h: number; m: number; s: number }) {
  const reduced = useReducedMotion();
  const hand = (deg: number) => ({ transform: `rotate(${deg}deg)`, transformOrigin: "150px 150px", transition: reduced ? undefined : "transform 0.6s cubic-bezier(0.22,1,0.36,1)" });
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="clock-face" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#1b2740" />
          <stop offset="1" stopColor="#090b12" />
        </radialGradient>
        <linearGradient id="clock-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3e0ad" />
          <stop offset="0.5" stopColor="#c5a46a" />
          <stop offset="1" stopColor="#80603b" />
        </linearGradient>
      </defs>
      <circle cx="150" cy="150" r="146" fill="url(#clock-face)" stroke="url(#clock-gold)" strokeWidth="3" />
      <circle cx="150" cy="150" r="138" fill="none" stroke="#c5a46a" strokeWidth="0.6" opacity="0.6" />
      {/* Rotating celestial rings */}
      <g className="animate-spin-slow" style={{ transformOrigin: "150px 150px" }}>
        <circle cx="150" cy="150" r="104" fill="none" stroke="#c5a46a" strokeWidth="0.5" strokeDasharray="1 6" opacity="0.7" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return <circle key={i} cx={r2(150 + Math.cos(a) * 104)} cy={r2(150 + Math.sin(a) * 104)} r={i % 2 ? 1.6 : 3} fill="#e8c98b" />;
        })}
      </g>
      <g className="animate-spin-slower" style={{ transformOrigin: "150px 150px" }}>
        <circle cx="150" cy="150" r="72" fill="none" stroke="#b9bcc7" strokeWidth="0.5" opacity="0.4" />
        <path d="M150 78 l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#b9bcc7" opacity="0.7" />
        <path d="M150 210 l2 5 5 .5-4 3.5 1 5-4-2.5-4 2.5 1-5-4-3.5 5-.5z" fill="#b9bcc7" opacity="0.5" />
      </g>
      {/* Hour marks & numerals */}
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i * 6 * Math.PI) / 180 - Math.PI / 2;
        const r1 = i % 5 === 0 ? 124 : 129;
        return (
          <line key={i} x1={r2(150 + Math.cos(a) * r1)} y1={r2(150 + Math.sin(a) * r1)} x2={r2(150 + Math.cos(a) * 134)} y2={r2(150 + Math.sin(a) * 134)} stroke="#c5a46a" strokeWidth={i % 5 === 0 ? 1.6 : 0.6} />
        );
      })}
      {ROMAN.map((n, i) => {
        const a = (i * 30 * Math.PI) / 180 - Math.PI / 2;
        return (
          <text key={n} x={r2(150 + Math.cos(a) * 112)} y={r2(150 + Math.sin(a) * 112 + 4)} textAnchor="middle" fontSize="11" fill="#e3c992" style={{ fontFamily: "var(--font-cinzel)", fontWeight: 600 }}>
            {n}
          </text>
        );
      })}
      {/* Hands */}
      <g style={hand((h % 12) * 30 + m * 0.5)}>
        <path d="M150 150 L146 146 L150 92 L154 146Z" fill="url(#clock-gold)" />
      </g>
      <g style={hand(m * 6)}>
        <path d="M150 150 L147 147 L150 62 L153 147Z" fill="url(#clock-gold)" />
        <circle cx="150" cy="76" r="3" fill="none" stroke="#e3c992" strokeWidth="1" />
      </g>
      <g style={hand(s * 6)}>
        <line x1="150" y1="168" x2="150" y2="44" stroke="#740d24" strokeWidth="1.4" />
        <circle cx="150" cy="44" r="2.6" fill="#740d24" />
      </g>
      <circle cx="150" cy="150" r="6" fill="url(#clock-gold)" />
      <circle cx="150" cy="150" r="2.2" fill="#740d24" />
    </svg>
  );
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
    <section id="countdown" aria-labelledby="countdown-title" className="relative isolate overflow-hidden bg-navy-deep py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#17223a_0%,#0c1220_55%,#090b12_90%)]" />
        <StarField count={110} seed={23} className="opacity-70" />
        <ParticleField density={4} />
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading id="countdown-title" eyebrow={countdown.eyebrow} title={countdown.title} />

        <Reveal className="mt-12 flex flex-col items-center">
          <div className="relative h-[min(78vw,20rem)] w-[min(78vw,20rem)] drop-shadow-[0_0_50px_rgba(197,164,106,0.25)]">
            <ClockFace h={left?.hours ?? 0} m={left?.minutes ?? 0} s={left?.seconds ?? 0} />
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
            <div role="timer" aria-label={`Countdown to the ${wedding.occasion}`} className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
              {UNITS.map((u) => (
                <div
                  key={u.key}
                  className="relative flex flex-col items-center rounded-[3px] border border-gold/35 bg-[linear-gradient(180deg,rgb(197_164_106/0.1),rgb(9_11_18/0.6))] px-2 py-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-sm sm:py-7"
                >
                  <span className="absolute inset-1.5 rounded-[2px] border border-gold/10" aria-hidden />
                  <span className="text-foil font-cinzel text-[clamp(2.4rem,8vw,3.6rem)] leading-none font-semibold tabular-nums">
                    {left ? <Digits value={left[u.key]} pad={u.key === "days" && left.days < 100 ? 2 : u.pad} /> : <span aria-hidden>––</span>}
                  </span>
                  <span className="mt-3 font-cinzel text-[0.68rem] font-semibold tracking-[0.36em] text-parchment/70 uppercase">{u.label}</span>
                  <span className="sr-only">{left ? `${left[u.key]} ${u.label}` : ""}</span>
                </div>
              ))}
            </div>
          )}

          <p className="mt-8 text-center font-sans text-xs tracking-[0.08em] text-parchment/50">
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
