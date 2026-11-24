"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "motion/react";
import { ArrowUp, RotateCcw, Wand2 } from "lucide-react";
import { useState } from "react";
import { wedding } from "@/config/wedding";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { Castle } from "@/components/magical/Castle";
import { FloatingCandles } from "@/components/magical/FloatingCandles";
import { Flourish } from "@/components/magical/Flourish";
import { ParticleField } from "@/components/magical/ParticleField";
import { Snitch } from "@/components/magical/Snitch";
import { StarField } from "@/components/magical/StarField";
import { SecretMessage } from "@/components/secrets/SecretMessage";
import { castLumos } from "@/components/secrets/SpellListener";
import { Reveal } from "@/components/ui/Reveal";
import { Blessing } from "@/sections/Blessing";

export function Closing() {
  const reduced = useReducedMotion();
  const { replay } = useExperience();
  const [secret, setSecret] = useState(false);
  const { couple, closing, secrets } = wedding;

  const toTop = () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

  return (
    <section id="closing" aria-labelledby="closing-title" className="relative isolate overflow-hidden bg-midnight pt-28 sm:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#090b12_0%,#0f1830_45%,#1a2744_70%,#0b1020_100%)]" />
        <StarField count={200} seed={99} />
        <ParticleField density={6} />
      </div>
      <FloatingCandles count={14} seed={202} className="-z-10 opacity-80" />

      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          {/* a quiet line rather than a headline — the duas below say the rest */}
          <p id="closing-title" className="font-cinzel text-[0.72rem] font-semibold tracking-[0.3em] text-gold uppercase">
            {closing.message.replace(/\.$/, "")}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-xl font-fell text-lg leading-relaxed text-parchment/75 italic">{closing.duas}</p>
          <Flourish className="mx-auto mt-10 w-64 max-w-full" />
          <p className="mt-8 font-script text-3xl text-candle">{closing.signOff}</p>
          <p className="mt-4 font-calligraphy text-[clamp(2.8rem,9vw,5.6rem)] leading-[1.15]">
            <span className="text-foil mx-auto block w-fit px-[0.25em]">{couple.groom.firstName}</span>
            <span className="block font-script text-[0.7em] leading-[1] text-candle">&amp;</span>
            <span className="text-foil mx-auto block w-fit px-[0.25em]">{couple.bride.firstName}</span>
          </p>
          <p className="mt-6 font-cinzel text-sm tracking-[0.3em] text-gold">{wedding.hashtag}</p>
        </Reveal>

        <Reveal delay={0.25} className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={toTop} className="btn-spell">
            <ArrowUp className="h-4 w-4" aria-hidden /> Return to the Great Hall
          </button>
          <button type="button" onClick={replay} className="btn-ghost">
            <RotateCcw className="h-4 w-4" aria-hidden /> Open the letter again
          </button>
        </Reveal>

        {/* Lumos: casts the silver stag */}
        <Reveal delay={0.3} className="mt-14 flex flex-col items-center gap-3">
          <button type="button" onClick={castLumos} className="btn-ghost !min-h-10 !px-3 !text-[0.62rem]" aria-label="Cast Lumos">
            <Wand2 className="h-4 w-4" aria-hidden /> Lumos
          </button>
          <p className="font-fell text-sm text-parchment/50 italic">{secrets.spellHint}</p>
        </Reveal>
      </div>

      <Castle className="mx-auto mt-16 h-[clamp(9rem,26vw,20rem)] w-full" />
      {/* The last word: the Quran verse, at the very bottom */}
      <Blessing />
      {/* …and below it, a golden snitch resting, waiting to be caught */}
      <div className="relative flex justify-center bg-[#05070c] pb-4">
        <motion.button
          type="button"
          onClick={() => setSecret(true)}
          aria-label="A golden snitch is resting here — catch it"
          className="w-20 rounded-full p-1"
          animate={reduced ? undefined : { y: [0, -8, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Snitch className="w-full drop-shadow-[0_0_10px_rgba(255,233,168,0.7)]" />
        </motion.button>
      </div>
      <footer className="relative bg-[#05070c] px-5 pb-10 pt-6 text-center">
        <p className="font-cinzel text-[0.68rem] tracking-[0.3em] text-parchment/55 uppercase">
          Developed by <span className="text-gold-light">{closing.developedBy}</span>
        </p>
      </footer>
      <SecretMessage open={secret} onClose={() => setSecret(false)} />
    </section>
  );
}
