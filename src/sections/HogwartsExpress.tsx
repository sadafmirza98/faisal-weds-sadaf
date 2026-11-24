"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion, useScroll, useTransform } from "motion/react";
import { Compass, Ticket } from "lucide-react";
import { useRef } from "react";
import { wedding } from "@/config/wedding";
import { ParticleField } from "@/components/magical/ParticleField";
import { Train } from "@/components/magical/Train";
import { Reveal } from "@/components/ui/Reveal";
import { eventDateLong } from "@/lib/wedding";
import { scrollToId, seeded } from "@/lib/utils";

/** Iron-and-glass station roof with arched trusses. */
function StationRoof() {
  return (
    <svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMin slice" className="absolute inset-x-0 top-0 h-[60%] w-full" aria-hidden>
      <defs>
        <linearGradient id="roof-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2a48" stopOpacity="0.9" />
          <stop offset="1" stopColor="#111a2b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M-40 420 Q720 -120 1480 420Z" fill="url(#roof-glass)" />
      {[0, 1, 2, 3].map((k) => (
        <path key={k} d={`M${-40 + k * 30} 420 Q720 ${-120 + k * 70} ${1480 - k * 30} 420`} fill="none" stroke="#0a0e18" strokeWidth={10 - k * 2} opacity="0.9" />
      ))}
      {Array.from({ length: 23 }).map((_, i) => {
        const x = -40 + (i * 1520) / 22;
        return <line key={i} x1={x} y1="420" x2="720" y2="-60" stroke="#0a0e18" strokeWidth="2" opacity="0.55" />;
      })}
    </svg>
  );
}

function Lamp({ left, className }: { left: string; className?: string }) {
  return (
    <div className={`absolute bottom-[26%] flex flex-col items-center ${className ?? ""}`} style={{ left }} aria-hidden>
      <div className="absolute -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgb(232_201_139/0.38),transparent_65%)]" />
      <div className="relative h-7 w-5 rounded-t-md border border-bronze bg-[radial-gradient(circle_at_50%_60%,#fff3cf,#e8b25c)] shadow-[0_0_24px_#e8c98b]" />
      <div className="h-1.5 w-7 bg-[#1b1209]" />
      <div className="h-20 w-1.5 bg-gradient-to-b sm:h-40 from-[#2a1d12] to-[#0b0806]" />
      <div className="h-2 w-6 rounded-sm bg-[#0b0806]" />
    </div>
  );
}

function Steam({ reduced }: { reduced: boolean }) {
  if (reduced) return null;
  const rnd = seeded(93);
  return (
    <div className="pointer-events-none absolute" style={{ left: "89.5%", top: "8%" }} aria-hidden>
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className="animate-steam absolute block rounded-full bg-[radial-gradient(circle,rgb(225_228_236/0.6),rgb(225_228_236/0)_70%)]"
          style={{
            width: 70 + rnd() * 60,
            height: 70 + rnd() * 60,
            left: -40,
            top: -40,
            animationDelay: `${(i * 0.55).toFixed(2)}s`,
            animationDuration: `${(4.2 + rnd() * 1.6).toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  );
}

export function HogwartsExpress() {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const trainX = useTransform(scrollYProgress, [0.05, 0.55], reduced ? ["0%", "0%"] : ["-70%", "0%"]);
  const signY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -40]);
  const { express, venue } = wedding;

  return (
    <section ref={ref} id="express" aria-labelledby="express-title" className="relative isolate overflow-hidden bg-midnight">
      {/* Dusk atmosphere */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#090b12_0%,#111a2b_35%,#2a2230_62%,#3a2a22_72%,#0d0a08_73%,#090b12_100%)]" aria-hidden />
      <div className="absolute inset-x-0 top-[40%] -z-20 h-[35%] bg-[radial-gradient(ellipse_at_50%_100%,rgb(232_201_139/0.28),transparent_70%)]" aria-hidden />
      <StationRoof />
      <ParticleField density={4} className="-z-10" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
        <Reveal className="text-center">
          <p className="eyebrow text-gold">{express.eyebrow}</p>
        </Reveal>

        {/* Antique enamel platform sign */}
        <motion.div style={{ y: signY }} className="relative mx-auto mt-6 flex flex-col items-center">
          <div className="flex gap-24 sm:gap-40" aria-hidden>
            <span className="h-10 w-0.5 bg-[#2a1d12]" />
            <span className="h-10 w-0.5 bg-[#2a1d12]" />
          </div>
          <div className="relative rounded-[4px] border-[3px] border-gold bg-[linear-gradient(180deg,#7d1029,#5a0b1e)] px-8 py-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),inset_0_0_0_2px_#3b0612,inset_0_0_0_4px_rgba(197,164,106,0.5)] sm:px-14 sm:py-6">
            <h2 id="express-title" className="text-center font-cinzel text-[clamp(1.7rem,6vw,3.4rem)] leading-none font-bold tracking-[0.12em] text-gold-light">
              <span className="sr-only">{express.title}: </span>
              <span aria-hidden>PLATFORM {express.platform}</span>
            </h2>
            <span className="absolute left-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            <span className="absolute bottom-2.5 left-2.5 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            <span className="absolute bottom-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
          </div>
        </motion.div>

        <Reveal delay={0.15} className="mx-auto mt-8 max-w-2xl text-center">
          <p className="font-fell text-[clamp(1.4rem,3.6vw,2.2rem)] leading-snug text-parchment italic text-glow">“{express.line}”</p>
        </Reveal>

        {/* Platform scene */}
        <div className="relative mt-auto h-[clamp(14rem,38vw,26rem)]">
          <Lamp left="6%" />
          <Lamp left="48%" className="max-sm:hidden" />
          <Lamp left="88%" />
          <div className="absolute inset-x-[-10%] bottom-[8%] overflow-visible">
            <motion.div className="relative mx-auto w-[max(880px,100%)] max-w-[1400px]" style={{ x: trainX }}>
              <Steam reduced={reduced} />
              <Train className="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]" spinning={!reduced} />
            </motion.div>
          </div>
          {/* Platform edge */}
          <div className="absolute inset-x-0 bottom-0 h-[9%] bg-[linear-gradient(180deg,#3a2c22,#1a130e)] shadow-[0_-2px_0_#c5a46a]" aria-hidden />
        </div>

        {/* The ticket */}
        <Reveal delay={0.1} className="relative z-10 mx-auto -mt-6 w-full max-w-[21rem] sm:max-w-xl">
          <div className="parchment relative flex overflow-hidden rounded-[4px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]">
            <div className="min-w-0 flex-1 px-4 py-3.5 sm:px-7 sm:py-5">
              <p className="flex items-center gap-1.5 whitespace-nowrap font-cinzel text-[0.6rem] font-bold tracking-[0.26em] text-crimson uppercase sm:gap-2 sm:text-[0.66rem] sm:tracking-[0.34em]">
                <Ticket className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden /> Admit · {wedding.occasion}
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 font-fell text-ink sm:mt-3 sm:gap-x-4 sm:gap-y-2">
                <div>
                  <dt className="font-cinzel text-[0.52rem] tracking-[0.22em] text-ink-soft uppercase sm:text-[0.6rem] sm:tracking-[0.25em]">Departs</dt>
                  <dd className="text-[0.92rem] leading-snug sm:text-[1.05rem]">Platform {express.platform}</dd>
                </div>
                <div>
                  <dt className="font-cinzel text-[0.52rem] tracking-[0.22em] text-ink-soft uppercase sm:text-[0.6rem] sm:tracking-[0.25em]">Date</dt>
                  <dd className="text-[0.92rem] leading-snug sm:text-[1.05rem]">{eventDateLong}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-cinzel text-[0.52rem] tracking-[0.22em] text-ink-soft uppercase sm:text-[0.6rem] sm:tracking-[0.25em]">Destination</dt>
                  <dd className="text-[0.92rem] leading-snug sm:text-[1.05rem]">{venue.name}, {venue.area}</dd>
                </div>
              </dl>
            </div>
            <div className="relative flex w-[5.4rem] shrink-0 flex-col items-center justify-center gap-2 border-l-2 border-dashed border-ink/35 px-1.5 sm:w-36 sm:gap-3 sm:px-2">
              <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-midnight sm:-left-3 sm:-top-3 sm:h-6 sm:w-6" aria-hidden />
              <span className="absolute -bottom-2.5 -left-2.5 h-5 w-5 rounded-full bg-midnight sm:-bottom-3 sm:-left-3 sm:h-6 sm:w-6" aria-hidden />
              <span className="whitespace-nowrap font-script text-xl text-crimson sm:text-3xl">F &amp; S</span>
              <button type="button" onClick={() => scrollToId("map", reduced)} aria-label="The way to the venue" className="btn-ink !min-h-8 !px-2 !py-1 !text-[0.5rem] sm:!min-h-9 sm:!px-2.5 sm:!py-1.5 sm:!text-[0.58rem]">
                <Compass className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden /> The way
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
