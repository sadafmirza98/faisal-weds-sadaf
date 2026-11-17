"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { ArrowDown, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { Flourish } from "@/components/magical/Flourish";
import { FloatingCandles } from "@/components/magical/FloatingCandles";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useSound } from "@/components/sound/SoundProvider";
import { cn, scrollToId } from "@/lib/utils";

const { story } = wedding;
const chapters = story.chapters;

/** Words appear one by one like ink soaking into paper. */
function InkText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <p className={className}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, filter: "blur(5px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.25 + i * 0.035 }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

export function Story() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const reduced = useReducedMotion();
  const { play } = useSound();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const chapter = chapters[index];

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= chapters.length || next === index) return;
      setDir(next > index ? 1 : -1);
      setIndex(next);
      play("parchment");
    },
    [index, play],
  );

  const onTabKey = (e: React.KeyboardEvent) => {
    let next = index;
    if (e.key === "ArrowRight") next = Math.min(chapters.length - 1, index + 1);
    else if (e.key === "ArrowLeft") next = Math.max(0, index - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = chapters.length - 1;
    else return;
    e.preventDefault();
    go(next);
    tabs.current[next]?.focus();
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(index + 1);
    else if (info.offset.x > 60) go(index - 1);
  };

  // Page-turn: the outgoing page swings about the spine.
  const turn = {
    initial: (d: 1 | -1) => (reduced ? { opacity: 0 } : { rotateY: d === 1 ? 70 : -70, opacity: 0 }),
    animate: { rotateY: 0, opacity: 1, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } },
    exit: (d: 1 | -1) => (reduced ? { opacity: 0 } : { rotateY: d === 1 ? -95 : 95, opacity: 0, transition: { duration: 0.45, ease: [0.55, 0, 1, 0.45] as const } }),
  };

  return (
    <section id="story" aria-labelledby="story-title" className="relative isolate overflow-hidden bg-navy-deep py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_30%,rgb(36_61_50/0.35),transparent_60%)]" aria-hidden />
      <FloatingCandles count={12} seed={41} className="-z-10 opacity-60" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="story-title" eyebrow={story.eyebrow} title={story.title} intro={story.intro} />

        <Reveal className="mt-14 sm:mt-16">
          {/* The book: leather cover holding two pages */}
          <div className="relative mx-auto max-w-5xl rounded-[10px] bg-[linear-gradient(135deg,#5a0b1e,#3b0612_55%,#2a040d)] p-2.5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85),inset_0_0_0_1px_rgba(197,164,106,0.45)] sm:p-4">
            <div className="pointer-events-none absolute inset-1.5 rounded-[8px] border border-gold/30" aria-hidden />
            <motion.div
              className="relative grid min-h-[34rem] overflow-hidden rounded-[4px] md:grid-cols-2"
              style={{ perspective: 2000 }}
              drag={reduced ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={onDragEnd}
            >
              {/* Spine shadow */}
              <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-16 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgb(60_35_10/0.38)_45%,rgb(60_35_10/0.5)_50%,rgb(60_35_10/0.38)_55%,transparent)] md:block" aria-hidden />

              {/* Left page — the moving portrait */}
              <div className="parchment relative flex flex-col items-center justify-center px-6 pb-8 pt-10 md:px-10 md:py-12" style={{ perspective: 1600 }}>
                <AnimatePresence mode="wait" custom={dir} initial={false}>
                  <motion.div
                    key={chapter.id}
                    custom={dir}
                    variants={turn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ transformOrigin: "100% 50%" }}
                    className="flex w-full flex-col items-center"
                  >
                    <div className="frame-wood w-full max-w-[20rem] p-3 sm:p-4">
                      <div className="relative aspect-[4/5] overflow-hidden bg-navy">
                        <motion.div
                          className="absolute inset-0"
                          animate={reduced ? undefined : { scale: [1.04, 1.12, 1.04], x: [0, -8, 0], y: [0, -6, 0] }}
                          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Image src={chapter.image.src} alt={chapter.image.alt} fill sizes="(min-width: 768px) 320px, 80vw" className="object-cover" unoptimized={chapter.image.src.endsWith(".svg")} />
                        </motion.div>
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(0_0_0/0.45))]" aria-hidden />
                      </div>
                    </div>
                    <p className="mt-6 font-cinzel text-xs font-semibold tracking-[0.4em] text-crimson uppercase">Chapter {chapter.numeral}</p>
                  </motion.div>
                </AnimatePresence>
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-fell text-sm text-ink-soft/70 md:left-8 md:translate-x-0" aria-hidden>
                  {index * 2 + 1}
                </span>
              </div>

              {/* Right page — the tale */}
              <div className="parchment relative flex flex-col justify-center px-7 pb-14 pt-8 md:px-12 md:py-14" style={{ perspective: 1600 }}>
                <AnimatePresence mode="wait" custom={dir} initial={false}>
                  <motion.article
                    key={chapter.id}
                    custom={dir}
                    variants={turn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ transformOrigin: "0% 50%" }}
                    aria-live="polite"
                  >
                    <h3 className="font-calligraphy text-[clamp(2.6rem,5vw,3.6rem)] leading-[1.2] text-ink">{chapter.title}</h3>
                    {chapter.period && <p className="mt-1 font-cinzel text-xs font-semibold tracking-[0.3em] text-crimson uppercase">{chapter.period}</p>}
                    <Flourish tone="ink" className="mt-4 w-44" />
                    <InkText
                      key={chapter.id}
                      text={chapter.body}
                      className="mt-6 font-fell text-[1.2rem] leading-[1.75] text-ink first-letter:float-left first-letter:mr-2 first-letter:font-cinzel first-letter:text-[3.4rem] first-letter:leading-[0.85] first-letter:text-crimson"
                    />
                    {chapter.link &&
                      (chapter.link.href.startsWith("#") ? (
                        <button type="button" onClick={() => scrollToId(chapter.link!.href.slice(1), reduced)} className="btn-ink sketch mt-7">
                          {chapter.link.label} <ArrowDown className="h-4 w-4" aria-hidden />
                        </button>
                      ) : (
                        <a href={chapter.link.href} target="_blank" rel="noopener noreferrer" className="btn-ink sketch mt-7">
                          {chapter.link.label} <ExternalLink className="h-4 w-4" aria-hidden />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ))}
                  </motion.article>
                </AnimatePresence>
                <span className="absolute bottom-3 right-8 hidden font-fell text-sm text-ink-soft/70 md:block" aria-hidden>
                  {index * 2 + 2}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Timeline of chapters */}
          <div className="mx-auto mt-10 flex max-w-3xl items-center gap-3 sm:gap-5">
            <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="btn-ghost !h-11 !w-11 !min-h-0 !p-0 disabled:opacity-30" aria-label="Previous chapter">
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <div className="relative flex-1">
              <div className="gold-rule absolute inset-x-0 top-[1.05rem]" aria-hidden />
              <div role="tablist" aria-label="Chapters" className="relative flex justify-between" onKeyDown={onTabKey}>
                {chapters.map((c, i) => (
                  <button
                    key={c.id}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    type="button"
                    aria-selected={i === index}
                    tabIndex={i === index ? 0 : -1}
                    onClick={() => go(i)}
                    className="group flex flex-col items-center gap-2"
                  >
                    <span
                      className={cn(
                        "flex h-[2.1rem] w-[2.1rem] items-center justify-center rounded-full border font-cinzel text-[0.7rem] font-bold transition-all duration-500",
                        i === index
                          ? "border-gold-light bg-gold text-midnight shadow-[0_0_18px_rgba(232,201,139,0.7)]"
                          : "border-gold/50 bg-midnight text-gold-light group-hover:border-gold-light",
                      )}
                    >
                      {c.numeral}
                    </span>
                    <span className={cn("hidden max-w-[8rem] text-center font-cinzel text-[0.62rem] tracking-[0.16em] uppercase sm:block", i === index ? "text-gold-light" : "text-parchment/55")}>
                      {c.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => go(index + 1)} disabled={index === chapters.length - 1} className="btn-ghost !h-11 !w-11 !min-h-0 !p-0 disabled:opacity-30" aria-label="Next chapter">
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <p className="mt-4 text-center font-sans text-xs text-parchment/45 md:hidden">Swipe the pages to turn them</p>
        </Reveal>
      </div>
    </section>
  );
}
