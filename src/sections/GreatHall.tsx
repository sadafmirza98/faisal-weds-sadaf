"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { wedding } from "@/config/wedding";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { FloatingCandles } from "@/components/magical/FloatingCandles";
import { GreatHallScene } from "@/components/magical/GreatHallScene";
import { ParticleField } from "@/components/magical/ParticleField";
import { StarField } from "@/components/magical/StarField";
import { Wand } from "@/components/magical/Wand";
import { SealSecret } from "@/components/secrets/SealSecret";
import { eventDateLong, eventTimeLabel } from "@/lib/wedding";
import { scrollToId } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function GreatHall() {
  const { opened } = useExperience();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 1.12]);
  const skyY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -80]);

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 26, filter: "blur(10px)" },
    animate: opened ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 26, filter: "blur(10px)" },
    transition: { duration: 1.4, delay: opened ? delay : 0, ease: EASE },
  });

  const { groom, bride } = wedding.couple;

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-names"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-midnight"
    >
      {/* Enchanted ceiling */}
      <motion.div className="absolute inset-0 -z-30" style={{ y: skyY }} aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#1b2a4a_0%,#111a2b_40%,#090b12_85%)]" />
        <div className="absolute left-[-10%] top-[8%] h-[40%] w-[120%] rotate-[-8deg] bg-[radial-gradient(ellipse,rgb(185_188_199/0.09),transparent_65%)] blur-2xl" />
        <StarField count={180} seed={11} />
      </motion.div>

      {/* Hall architecture */}
      <motion.div className="absolute inset-0 -z-20 origin-[50%_58%]" style={{ scale: sceneScale }} aria-hidden>
        <GreatHallScene className="opacity-95" />
      </motion.div>

      <FloatingCandles count={26} seed={5} className="-z-10" />
      <ParticleField density={5} className="-z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-midnight to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(9_11_18/0.72)_0%,rgb(9_11_18/0.35)_45%,transparent_75%)]" aria-hidden />

      <motion.div id="main" tabIndex={-1} className="relative z-10 outline-none mx-auto w-full max-w-5xl px-5 pb-28 pt-28 text-center sm:pt-32" style={{ y: contentY, opacity: contentOpacity }}>
        <motion.p className="eyebrow text-gold" {...show(0.25)}>
          {wedding.hero.eyebrow}
        </motion.p>

        <h1 id="hero-names" className="mt-7 sm:mt-9">
          <motion.span
            className="text-foil text-foil-animated mx-auto block w-fit px-[0.25em] py-[0.08em] font-calligraphy text-[clamp(3.2rem,min(13vw,13.5svh),8.6rem)] leading-[1.1] drop-shadow-[0_4px_30px_rgba(232,201,139,0.25)]"
            {...show(0.45)}
          >
            {groom.fullName}
          </motion.span>
          <motion.span className="-my-[0.12em] block font-script text-[clamp(2.4rem,7vw,4.8rem)] leading-[1] text-candle text-glow" {...show(0.75)}>
            <span className="sr-only"> and </span>
            <span aria-hidden>&amp;</span>
          </motion.span>
          <motion.span
            className="text-foil text-foil-animated mx-auto block w-fit px-[0.25em] py-[0.08em] font-calligraphy text-[clamp(3.2rem,min(13vw,13.5svh),8.6rem)] leading-[1.1] drop-shadow-[0_4px_30px_rgba(232,201,139,0.25)]"
            {...show(1.0)}
          >
            {bride.fullName}
          </motion.span>
        </h1>

        <motion.div className="mt-9 flex flex-col items-center gap-4" {...show(1.3)}>
          <p className="font-cinzel text-[clamp(1rem,2.6vw,1.45rem)] font-semibold tracking-[0.34em] text-parchment">
            <time dateTime={wedding.event.date}>{eventDateLong.toUpperCase()}</time>
            {wedding.event.time && <span className="mt-2 block text-[0.62em] tracking-[0.4em] text-parchment/75">{eventTimeLabel.toUpperCase()}</span>}
          </p>
          <div className="flex items-center gap-4">
            <span className="gold-rule w-14 sm:w-24" />
            <span className="font-calligraphy text-[2.4rem] leading-[1.2] text-gold-light">{wedding.occasion}</span>
            <span className="gold-rule w-14 sm:w-24" />
          </div>
        </motion.div>

        <motion.p className="mx-auto mt-7 max-w-xl font-fell text-[clamp(1.15rem,2.6vw,1.5rem)] text-parchment/85 italic" {...show(1.55)}>
          “{wedding.hero.tagline}”
        </motion.p>

        <motion.div className="mt-9 flex justify-center" {...show(1.8)}>
          <SealSecret size={58} />
        </motion.div>
      </motion.div>

      {/* Scroll rune */}
      <motion.button
        type="button"
        onClick={() => scrollToId("story", !!reduced)}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-gold-light"
        aria-label="Scroll to our story"
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ delay: opened ? 2.4 : 0, duration: 1 }}
      >
        <span className="font-cinzel text-[0.62rem] tracking-[0.45em] uppercase">Scroll</span>
        <span className="animate-rune">
          <Wand className="h-14 w-3.5 rotate-180" />
        </span>
      </motion.button>
    </section>
  );
}
