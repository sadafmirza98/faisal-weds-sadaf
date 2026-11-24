"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion, useInView } from "motion/react";
import { CalendarPlus } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { Corner, Flourish } from "@/components/magical/Flourish";
import { StarField } from "@/components/magical/StarField";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useSound } from "@/components/sound/SoundProvider";
import { googleCalendarUrl } from "@/lib/calendar";

const WEEKDAYS = [
  ["S", "Sunday"],
  ["M", "Monday"],
  ["T", "Tuesday"],
  ["W", "Wednesday"],
  ["T", "Thursday"],
  ["F", "Friday"],
  ["S", "Saturday"],
] as const;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SPARKLE = "M0 -1C0.12 -0.3 0.3 -0.12 1 0C0.3 0.12 0.12 0.3 0 1C-0.12 0.3 -0.3 0.12 -1 0C-0.3 -0.12 -0.12 -0.3 0 -1Z";

/** A hand-inked ring, slightly uneven, drawn round a marked day. */
const RING = "M50 8 C74 7 93 24 92 49 C91 74 72 93 48 92 C24 91 7 73 8 50 C9 28 26 9 52 10";

/** One sparkle burst when a marked day is tapped. */
function Burst() {
  const n = 9;
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const size = i % 3 === 0 ? 12 : 8;
        return (
          <motion.svg
            key={i}
            viewBox="-1 -1 2 2"
            className="absolute drop-shadow-[0_0_5px_rgba(255,233,168,0.95)]"
            style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
            initial={{ left: "50%", top: "50%", scale: 0, opacity: 0 }}
            animate={{ left: `${50 + Math.cos(a) * 95}%`, top: `${50 + Math.sin(a) * 95}%`, scale: [0, 1.2, 0.4], opacity: [0, 1, 0], rotate: 120 }}
            transition={{ duration: 1.1, ease: [0.2, 0.7, 0.3, 1] }}
          >
            <path d={SPARKLE} fill={i % 2 ? "#ffe9a8" : "#fff6d6"} />
          </motion.svg>
        );
      })}
      <motion.span
        className="absolute inset-[-10%] rounded-full border border-gold-light/80 shadow-[0_0_20px_rgba(232,201,139,0.6)]"
        initial={{ scale: 0.6, opacity: 0.9 }}
        animate={{ scale: 1.8, opacity: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  );
}

function MarkedDay({ day, label, order, drawn }: { day: number; label: string; order: number; drawn: boolean }) {
  const reduced = useReducedMotion();
  const { play } = useSound();
  const [bursts, setBursts] = useState<number[]>([]);
  const tap = () => {
    play("sparkle");
    if (reduced) return;
    const id = Date.now();
    setBursts((b) => [...b.slice(-2), id]);
    window.setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 1300);
  };
  const delay = 0.5 + order * 0.6;
  return (
    <button type="button" data-day={day} onClick={tap} className="group relative mx-auto grid aspect-square w-full max-w-12 place-items-center rounded-full">
      {/* soft golden glow, breathing */}
      <motion.span
        aria-hidden
        className="absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgb(232_201_139/0.55),transparent_68%)]"
        initial={{ opacity: 0 }}
        animate={drawn ? (reduced ? { opacity: 0.7 } : { opacity: [0.35, 0.85, 0.35] }) : { opacity: 0 }}
        transition={reduced ? { duration: 0.4 } : { duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* the ink ring draws itself */}
      <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-[-16%] overflow-visible">
        <motion.path
          d={RING}
          fill="none"
          stroke="#8e1430"
          strokeWidth="4.5"
          strokeLinecap="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={{ duration: 1.1, delay, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
      {/* a sparkle perched on the ring, twinkling */}
      <motion.svg
        aria-hidden
        viewBox="-1 -1 2 2"
        className="absolute -right-1 -top-1 size-3.5 drop-shadow-[0_0_4px_rgba(255,233,168,0.95)] sm:size-4"
        initial={{ opacity: 0, scale: 0 }}
        animate={drawn ? (reduced ? { opacity: 1, scale: 1 } : { opacity: [0.4, 1, 0.4], scale: [0.8, 1.15, 0.8], rotate: [0, 45, 0] }) : { opacity: 0, scale: 0 }}
        transition={reduced ? { duration: 0.3 } : { duration: 2.4, delay: delay + 1, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d={SPARKLE} fill="#fff1c4" />
      </motion.svg>
      <span className="relative font-cinzel text-[0.95rem] font-bold text-crimson transition-transform duration-300 group-hover:scale-110 sm:text-lg">{day}</span>
      <span className="sr-only">, {label} — tap for a sparkle</span>
      {bursts.map((id) => (
        <Burst key={id} />
      ))}
    </button>
  );
}

/* ── Footprints: two of us walking across the month to meet ───────────── */

type Pt = { x: number; y: number };
interface Print extends Pt {
  rot: number;
  tick: number;
  who: 0 | 1 | 2; // groom, bride, together
}

const STEP_PX = 13;
const TICK_MS = 150;
const FADE_TICKS = 11;

/** Footsteps along a polyline: alternating left and right, turned to face the way they walk. */
function stepsAlong(points: Pt[], who: 0 | 1 | 2, startTick: number, side = 0): Print[] {
  const out: Print[] = [];
  let tick = startTick;
  let n = 0;
  for (let k = 1; k < points.length; k++) {
    const a = points[k - 1];
    const b = points[k];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const ux = (b.x - a.x) / (len || 1);
    const uy = (b.y - a.y) / (len || 1);
    const rot = (Math.atan2(uy, ux) * 180) / Math.PI + 90;
    for (let d = k === 1 ? 0 : STEP_PX; d <= len; d += STEP_PX) {
      const off = (n % 2 ? 3 : -3) + side;
      out.push({ x: a.x + ux * d - uy * off, y: a.y + uy * d + ux * off, rot, tick: tick++, who });
      n++;
    }
  }
  return out;
}

/** One small inked footprint (a sole and a heel). */
function Foot({ p, opacity }: { p: Print; opacity: number }) {
  return (
    <g transform={`translate(${p.x} ${p.y}) rotate(${p.rot})`} opacity={opacity}>
      <ellipse cx="0" cy="-1.6" rx="2" ry="3" fill="#3b2a14" />
      <circle cx="0" cy="2.8" r="1.5" fill="#3b2a14" />
    </g>
  );
}

/** A little ink banner carrying a name, like a label on an enchanted map. */
function NameTag({ at, name }: { at: Pt; name: string }) {
  return (
    <g transform={`translate(${at.x} ${at.y - 14})`}>
      <rect x={-name.length * 3.1 - 5} y="-7" width={name.length * 6.2 + 10} height="13" rx="2" fill="#f3e6c4" stroke="#3b2a14" strokeWidth="0.8" />
      <text x="0" y="2.6" textAnchor="middle" fontSize="8.2" fill="#3b2a14" style={{ fontFamily: "var(--font-fell), serif", fontStyle: "italic" }}>
        {name}
      </text>
    </g>
  );
}

function Footprints({ grid, centres, running, names }: { grid: { w: number; h: number }; centres: Map<number, Pt>; running: boolean; names: [string, string] }) {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);

  const { prints, total } = useMemo(() => {
    const c = (d: number) => centres.get(d);
    const path = (days: number[]) => days.map(c).filter((p): p is Pt => Boolean(p));
    // nudge each walker to the side of the number so prints sit between figures
    const groom = stepsAlong(path([1, 3, 11, 19]), 0, 0);
    const bride = stepsAlong(path([30, 25, 19]), 1, 0);
    const meet = Math.max(groom.length, bride.length) + 4;
    const together = [...stepsAlong(path([19, 26, 20]), 2, meet, -3), ...stepsAlong(path([19, 26, 20]), 2, meet, 3)];
    const all = [...groom, ...bride, ...together];
    return { prints: all, total: Math.max(...all.map((p) => p.tick), 0) + 1 };
  }, [centres]);

  useEffect(() => {
    if (!running || reduced || !total) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % (total + 22)), TICK_MS);
    return () => window.clearInterval(id);
  }, [running, reduced, total]);

  if (!prints.length) return null;
  const now = reduced ? total : tick;
  const visible = prints
    .map((p) => {
      const age = now - p.tick;
      const opacity = reduced ? 0.35 : age < 0 ? 0 : age > FADE_TICKS ? (p.who === 2 && now >= total ? 0.35 : 0) : 0.75 - (age / FADE_TICKS) * 0.5;
      return { p, opacity };
    })
    .filter((v) => v.opacity > 0);
  const latest = (who: 0 | 1 | 2) => {
    const mine = prints.filter((p) => p.who === who && p.tick <= now);
    return mine.length ? mine[mine.length - 1] : null;
  };
  const g = latest(0);
  const b = latest(1);
  const t = latest(2);

  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 overflow-visible" viewBox={`0 0 ${grid.w} ${grid.h}`} width={grid.w} height={grid.h}>
      {visible.map(({ p, opacity }, i) => (
        <Foot key={i} p={p} opacity={opacity} />
      ))}
      {t ? (
        <NameTag at={t} name={`${names[0]} & ${names[1]}`} />
      ) : (
        <>
          {g && <NameTag at={g} name={names[0]} />}
          {b && <NameTag at={b} name={names[1]} />}
        </>
      )}
    </svg>
  );
}

export function EnchantedCalendar() {
  const { calendar } = wedding;
  const pageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(pageRef, { once: true, amount: 0.45 });
  const onScreen = useInView(pageRef, { amount: 0.2 });
  const reduced = useReducedMotion();

  // Where each day sits, so the footprints can walk between them.
  const gridRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{ w: number; h: number; centres: Map<number, Pt> } | null>(null);
  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    // Layout offsets, not screen rectangles: the page unfolds with a 3D
    // transform, which would skew on-screen measurements.
    const offsetIn = (node: HTMLElement) => {
      let x = 0;
      let y = 0;
      let n: HTMLElement | null = node;
      while (n && n !== el) {
        x += n.offsetLeft;
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return { x, y };
    };
    const measure = () => {
      const centres = new Map<number, Pt>();
      el.querySelectorAll<HTMLElement>("[data-day]").forEach((d) => {
        const o = offsetIn(d);
        centres.set(Number(d.dataset.day), { x: o.x + d.offsetWidth / 2, y: o.y + d.offsetHeight / 2 });
      });
      setLayout({ w: el.offsetWidth, h: el.offsetHeight, centres });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [y, m] = calendar.marks[0].date.split("-").map(Number);
  const marks = new Map(calendar.marks.map((mk, i) => [Number(mk.date.slice(8, 10)), { ...mk, order: i }]));
  const firstWeekday = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (number | null)[] = [...Array.from({ length: firstWeekday }, () => null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  const weekday = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" });

  return (
    <section id="calendar" aria-labelledby="calendar-title" className="relative isolate overflow-hidden bg-midnight py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgb(36_61_50/0.3),transparent_62%)]" />
        <StarField count={80} seed={517} className="opacity-60" />
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading id="calendar-title" eyebrow={calendar.eyebrow} title={calendar.title} intro={calendar.intro} />

        <Reveal className="mt-10 sm:mt-14">
          {/* the calendar page unfurls */}
          <motion.div
            ref={pageRef}
            className="mx-auto max-w-md drop-shadow-[0_30px_40px_rgba(0,0,0,0.75)]"
            initial={reduced ? false : { opacity: 0, rotateX: -35, y: 20 }}
            animate={inView ? { opacity: 1, rotateX: 0, y: 0 } : undefined}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 900, transformOrigin: "50% 0%" }}
          >
            <div className="parchment deckle relative px-5 pb-8 pt-9 sm:px-9 sm:pb-10 sm:pt-11">
              <div className="pointer-events-none absolute inset-4 border border-ink/25" aria-hidden />
              <Corner className="absolute left-3 top-3 w-12" />
              <Corner className="absolute right-3 top-3 w-12 -scale-x-100" />
              <Corner className="absolute bottom-3 left-3 w-12 -scale-y-100" />
              <Corner className="absolute bottom-3 right-3 w-12 -scale-100" />

              <div ref={gridRef} className="relative">
              <table className="relative w-full table-fixed border-collapse text-center">
                <caption className="mb-5">
                  <span className="block font-calligraphy text-[clamp(2.8rem,11vw,3.6rem)] leading-[1.15] text-ink">{MONTHS[m - 1]}</span>
                  <span className="block font-cinzel text-xs font-semibold tracking-[0.5em] text-crimson">{y}</span>
                  <Flourish tone="ink" className="mx-auto mt-3 w-40" />
                </caption>
                <thead>
                  <tr>
                    {WEEKDAYS.map(([short, full], i) => (
                      <th key={i} scope="col" abbr={full} className="pb-2 font-cinzel text-[0.62rem] font-bold tracking-[0.18em] text-ink-soft">
                        {short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((week, w) => (
                    <tr key={w}>
                      {week.map((day, d) => {
                        const mark = day ? marks.get(day) : undefined;
                        return (
                          <td key={d} className="p-0.5 sm:p-1">
                            {day &&
                              (mark ? (
                                <MarkedDay day={day} label={mark.label} order={mark.order} drawn={reduced || inView} />
                              ) : (
                                <span data-day={day} className="mx-auto grid aspect-square w-full max-w-12 place-items-center font-serif text-[0.92rem] text-ink/70 sm:text-base">{day}</span>
                              ))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              {layout && (
                <Footprints
                  grid={layout}
                  centres={layout.centres}
                  running={inView && onScreen}
                  names={[wedding.couple.groom.firstName, wedding.couple.bride.firstName]}
                />
              )}
              </div>

              {/* what each mark means */}
              {/* columns line up: day, rule, event */}
              <ul className="relative mt-6 space-y-2 border-t border-ink/20 pt-5">
                {calendar.marks.map((mk) => (
                  <li key={mk.date} className="mx-auto grid w-fit grid-cols-[4.6rem_1.25rem_10.5rem] items-center gap-3">
                    <span className="text-right font-cinzel text-[0.7rem] font-bold tracking-[0.2em] text-crimson uppercase">
                      {weekday(mk.date)} {Number(mk.date.slice(8, 10))}
                    </span>
                    <span className="h-px w-5 bg-ink/30" aria-hidden />
                    <span className="font-fell text-lg text-ink italic">{mk.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </Reveal>

        <Reveal delay={0.15} className="mt-9 flex flex-col items-center gap-2">
          <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="btn-spell">
            <CalendarPlus className="h-4 w-4" aria-hidden /> Add the {wedding.occasion} to Google Calendar
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
