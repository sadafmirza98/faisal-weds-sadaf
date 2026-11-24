"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "motion/react";
import { ArrowDown, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { wedding } from "@/config/wedding";
import { Flourish } from "@/components/magical/Flourish";
import { FloatingCandles } from "@/components/magical/FloatingCandles";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useSound } from "@/components/sound/SoundProvider";
import { cn, scrollToId } from "@/lib/utils";

/*
 * OUR MAGICAL STORY — a compact book whose pages really turn. On wide screens
 * a leaf lifts from the spine and flips over in 3D: its front is the page you
 * were reading, its back the next chapter's picture page, and the next text is
 * revealed beneath. On phones the whole page flips away to the next. Tabs,
 * arrows, tapping a page, swiping and ← → / Home / End all turn pages; with
 * reduced motion the pages simply change.
 */

const { story } = wedding;
const chapters = story.chapters;
type Chapter = (typeof chapters)[number];

const TURN_MS = 900;
const EASE = [0.45, 0.05, 0.25, 1] as const;

/** True from 768px up (two-page spread). False on the server and first render. */
function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

function Portrait({ chapter, className, sizes }: { chapter: Chapter; className?: string; sizes: string }) {
  return (
    <div className={cn("frame-wood p-2", className)}>
      <div className="relative h-full w-full overflow-hidden bg-navy">
        <Image src={chapter.image.src} alt={chapter.image.alt} fill sizes={sizes} className="object-cover" unoptimized={chapter.image.src.endsWith(".svg")} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(0_0_0/0.45))]" aria-hidden />
      </div>
    </div>
  );
}

/** "View the invitation" / "See the details" — never turns the page itself. */
function ChapterLink({ chapter, reduced }: { chapter: Chapter; reduced: boolean }) {
  const link = chapter.link;
  if (!link) return null;
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  return link.href.startsWith("#") ? (
    <button
      type="button"
      onClick={(e) => {
        stop(e);
        scrollToId(link.href.slice(1), reduced);
      }}
      className="btn-ink sketch relative z-10 mt-5 !min-h-10 !py-2 !text-[0.66rem]"
    >
      {link.label} <ArrowDown className="h-4 w-4" aria-hidden />
    </button>
  ) : (
    <a href={link.href} onClick={stop} target="_blank" rel="noopener noreferrer" className="btn-ink sketch relative z-10 mt-5 !min-h-10 !py-2 !text-[0.66rem]">
      {link.label} <ExternalLink className="h-4 w-4" aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/** A dog-eared corner: this page can be turned. */
function DogEar() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-0 right-0 size-8 bg-[linear-gradient(135deg,transparent_50%,#d6bf8f_50%,#b39662_100%)] shadow-[-3px_-3px_6px_-2px_rgb(0_0_0/0.35)] transition-[width,height] duration-300 group-hover:size-11"
    />
  );
}

/** Left page on wide screens: the portrait. */
function PicturePage({ chapter, n }: { chapter: Chapter; n: number }) {
  return (
    <div className="parchment relative flex h-full flex-col items-center justify-center px-8 pb-9 pt-8">
      <Portrait chapter={chapter} className="aspect-[4/5] w-full max-w-[13.5rem]" sizes="216px" />
      <p className="mt-4 font-cinzel text-xs font-semibold tracking-[0.4em] text-crimson uppercase">Chapter {chapter.numeral}</p>
      <span className="absolute bottom-3 left-7 font-fell text-sm text-ink-soft/70" aria-hidden>
        {n}
      </span>
    </div>
  );
}

/** Right page on wide screens: the tale. */
function TextPage({ chapter, n, reduced, curl = false }: { chapter: Chapter; n: number; reduced: boolean; curl?: boolean }) {
  return (
    <div className="parchment relative flex h-full flex-col justify-center px-10 pb-10 pt-8">
      <h3 className="font-calligraphy text-[clamp(2.3rem,4vw,3rem)] leading-[1.2] text-ink">{chapter.title}</h3>
      {chapter.period && <p className="mt-1 font-cinzel text-xs font-semibold tracking-[0.3em] text-crimson uppercase">{chapter.period}</p>}
      <Flourish tone="ink" className="mt-3 w-40" />
      <p className="mt-4 font-fell text-[1.08rem] leading-[1.65] text-ink first-letter:float-left first-letter:mr-2 first-letter:font-cinzel first-letter:text-[2.9rem] first-letter:leading-[0.85] first-letter:text-crimson">
        {chapter.body}
      </p>
      <div>
        <ChapterLink chapter={chapter} reduced={reduced} />
      </div>
      <span className="absolute bottom-3 right-8 font-fell text-sm text-ink-soft/70" aria-hidden>
        {n}
      </span>
      {curl && <DogEar />}
    </div>
  );
}

/** Phones: the whole chapter on one compact page, a picture strip above the tale. */
function FullPage({ chapter, reduced, curl = false }: { chapter: Chapter; reduced: boolean; curl?: boolean }) {
  return (
    <div className="parchment relative px-5 pb-8 pt-5">
      <Portrait chapter={chapter} className="aspect-[2/1] w-full" sizes="90vw" />
      <p className="mt-4 font-cinzel text-[0.62rem] font-semibold tracking-[0.36em] text-crimson uppercase">Chapter {chapter.numeral}</p>
      <h3 className="mt-1 font-calligraphy text-[2.3rem] leading-[1.15] text-ink">{chapter.title}</h3>
      {chapter.period && <p className="font-cinzel text-[0.62rem] font-semibold tracking-[0.28em] text-crimson uppercase">{chapter.period}</p>}
      <p className="mt-3 font-fell text-[1.02rem] leading-[1.6] text-ink">{chapter.body}</p>
      <ChapterLink chapter={chapter} reduced={reduced} />
      {curl && <DogEar />}
    </div>
  );
}

/** A soft shadow sweeping across a turning leaf. */
function LeafShade({ dir }: { dir: 1 | -1 }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ background: `linear-gradient(${dir > 0 ? 90 : 270}deg, rgb(40 22 6 / 0.35), transparent 60%)` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.9, 0] }}
      transition={{ duration: TURN_MS / 1000, ease: "easeInOut" }}
    />
  );
}

interface Turn {
  from: number;
  to: number;
  dir: 1 | -1;
}

export function Story() {
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const reduced = useReducedMotion();
  const wide = useWide();
  const { play } = useSound();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const start = useRef<number | null>(null);
  const swiped = useRef(false);
  const last = chapters.length - 1;

  const go = (next: number) => {
    if (turn) return;
    const to = Math.max(0, Math.min(last, next));
    if (to === index) return;
    play("parchment");
    if (reduced) {
      setIndex(to);
      return;
    }
    setTurn({ from: index, to, dir: to > index ? 1 : -1 });
  };
  const finishTurn = () => {
    if (!turn) return;
    setIndex(turn.to);
    setTurn(null);
  };

  const onTabKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: last };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = Math.max(0, Math.min(last, map[e.key]));
    go(next);
    tabs.current[next]?.focus();
  };
  const onDown = (e: PointerEvent) => {
    start.current = e.clientX;
    swiped.current = false;
  };
  const onUp = (e: PointerEvent) => {
    if (start.current === null) return;
    const dx = e.clientX - start.current;
    start.current = null;
    if (Math.abs(dx) > 50) {
      swiped.current = true;
      go(index + (dx < 0 ? 1 : -1));
    }
  };
  /** Tapping a page turns it (but not right after a swipe). */
  const tapTurn = (delta: number) => () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    go(index + delta);
  };

  const target = turn ? turn.to : index;
  const shown = chapters[target];
  const from = turn ? chapters[turn.from] : null;
  const spin = { duration: TURN_MS / 1000, ease: EASE };

  return (
    <section id="story" aria-labelledby="story-title" className="relative isolate overflow-hidden bg-navy-deep py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_30%,rgb(36_61_50/0.35),transparent_60%)]" aria-hidden />
      <FloatingCandles count={12} seed={41} className="-z-10 opacity-60" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="story-title" eyebrow={story.eyebrow} title={story.title} intro={story.intro} />

        <Reveal className="mt-10 sm:mt-14">
          {/* The book: a leather cover holding the pages */}
          <div className="relative mx-auto max-w-4xl rounded-[10px] bg-[linear-gradient(135deg,#5a0b1e,#3b0612_55%,#2a040d)] p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85),inset_0_0_0_1px_rgba(197,164,106,0.45)] sm:p-3.5">
            <div className="pointer-events-none absolute inset-1.5 rounded-[8px] border border-gold/30" aria-hidden />
            <div
              id="story-panel"
              role="tabpanel"
              aria-labelledby={`story-tab-${target}`}
              aria-live="polite"
              onPointerDown={onDown}
              onPointerUp={onUp}
              className="relative touch-pan-y overflow-hidden rounded-[4px]"
            >
              {wide ? (
                /* ── Two-page spread with a leaf turning over the spine ── */
                <div className="relative grid min-h-[25rem] grid-cols-2">
                  {/* the left page keeps the old picture until the leaf lands on it */}
                  <div role="presentation" onClick={tapTurn(-1)} className={cn(index > 0 && "cursor-pointer")}>
                    <PicturePage chapter={turn && turn.dir > 0 && from ? from : shown} n={(turn && turn.dir > 0 ? turn.from : target) * 2 + 1} />
                  </div>
                  {/* the right page shows the new tale as the leaf lifts */}
                  <div role="presentation" onClick={tapTurn(1)} className={cn("group", index < last && "cursor-pointer")}>
                    <TextPage
                      chapter={turn && turn.dir < 0 && from ? from : shown}
                      n={(turn && turn.dir < 0 ? turn.from : target) * 2 + 2}
                      reduced={reduced}
                      curl={!turn && index < last}
                    />
                  </div>
                  {/* spine */}
                  <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-14 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgb(60_35_10/0.38)_45%,rgb(60_35_10/0.5)_50%,rgb(60_35_10/0.38)_55%,transparent)]" aria-hidden />

                  {turn && from && (
                    <motion.div
                      key={`${turn.from}-${turn.to}`}
                      aria-hidden
                      className={cn("pointer-events-none absolute inset-y-0 z-10 w-1/2", turn.dir > 0 ? "right-0" : "left-0")}
                      style={{ transformStyle: "preserve-3d", transformPerspective: 1800, transformOrigin: turn.dir > 0 ? "0% 50%" : "100% 50%" }}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: turn.dir > 0 ? -180 : 180 }}
                      transition={spin}
                      onAnimationComplete={finishTurn}
                    >
                      {/* front: the page being turned */}
                      <div className="absolute inset-0 [backface-visibility:hidden]">
                        {turn.dir > 0 ? <TextPage chapter={from} n={turn.from * 2 + 2} reduced={reduced} /> : <PicturePage chapter={from} n={turn.from * 2 + 1} />}
                        <LeafShade dir={turn.dir} />
                      </div>
                      {/* back: what it becomes on the other side */}
                      <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        {turn.dir > 0 ? <PicturePage chapter={shown} n={turn.to * 2 + 1} /> : <TextPage chapter={shown} n={turn.to * 2 + 2} reduced={reduced} />}
                        <LeafShade dir={turn.dir === 1 ? -1 : 1} />
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                /* ── Phones: the whole page flips away ── */
                <div className="relative">
                  <div role="presentation" onClick={tapTurn(1)} className={cn("group", index < last && "cursor-pointer")}>
                    <FullPage chapter={turn && turn.dir < 0 && from ? from : shown} reduced={reduced} curl={!turn && index < last} />
                  </div>
                  {turn && from && (
                    <motion.div
                      key={`${turn.from}-${turn.to}`}
                      aria-hidden
                      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
                      style={{ transformOrigin: "0% 50%", transformPerspective: 1400 }}
                      // Solid while it swings; it only fades once nearly edge-on.
                      initial={turn.dir > 0 ? { rotateY: 0, opacity: 1 } : { rotateY: -100, opacity: 0 }}
                      animate={turn.dir > 0 ? { rotateY: -100, opacity: [1, 1, 0] } : { rotateY: 0, opacity: [0, 1, 1] }}
                      transition={{ ...spin, opacity: { duration: TURN_MS / 1000, times: turn.dir > 0 ? [0, 0.7, 1] : [0, 0.3, 1] } }}
                      onAnimationComplete={finishTurn}
                    >
                      <FullPage chapter={turn.dir > 0 ? from : shown} reduced={reduced} />
                      <LeafShade dir={1} />
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Timeline of chapters */}
          <div className="mx-auto mt-8 flex max-w-3xl items-center gap-3 sm:gap-5">
            <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="btn-ghost !h-11 !w-11 !min-h-0 !p-0 disabled:opacity-30" aria-label="Previous chapter">
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <div className="relative flex-1">
              <div className="gold-rule absolute inset-x-0 top-[1.05rem]" aria-hidden />
              <div role="tablist" aria-label="Chapters" className="relative flex justify-between" onKeyDown={onTabKey}>
                {chapters.map((c, i) => (
                  <button
                    key={c.id}
                    id={`story-tab-${i}`}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    type="button"
                    aria-selected={i === target}
                    aria-controls="story-panel"
                    tabIndex={i === target ? 0 : -1}
                    onClick={() => go(i)}
                    className="group flex flex-col items-center gap-2"
                  >
                    <span
                      className={cn(
                        "flex h-[2.1rem] w-[2.1rem] items-center justify-center rounded-full border font-cinzel text-[0.7rem] font-bold transition-all duration-500",
                        i === target
                          ? "border-gold-light bg-gold text-midnight shadow-[0_0_18px_rgba(232,201,139,0.7)]"
                          : "border-gold/50 bg-midnight text-gold-light group-hover:border-gold-light",
                      )}
                    >
                      {c.numeral}
                    </span>
                    <span className={cn("hidden max-w-[8rem] text-center font-cinzel text-[0.62rem] tracking-[0.16em] uppercase sm:block", i === target ? "text-gold-light" : "text-parchment/55")}>
                      {c.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => go(index + 1)} disabled={index === last} className="btn-ghost !h-11 !w-11 !min-h-0 !p-0 disabled:opacity-30" aria-label="Next chapter">
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <p className="mt-3 text-center font-sans text-xs text-parchment/45">Tap a page or swipe to turn it</p>
        </Reveal>
      </div>
    </section>
  );
}
