"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CalendarDays, CalendarPlus, Clock, Compass, Download, MapPin, Shirt } from "lucide-react";
import { wedding } from "@/config/wedding";
import { ContactLinks } from "@/components/events/ContactLinks";
import { DetailRow } from "@/components/events/DetailRow";
import { Families } from "@/components/events/Families";
import { Corner, Flourish } from "@/components/magical/Flourish";
import { FloatingCandles } from "@/components/magical/FloatingCandles";
import { WaxSeal } from "@/components/magical/WaxSeal";
import { Reveal } from "@/components/ui/Reveal";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import { googleMapsUrl } from "@/lib/maps";
import { eventDateFull, eventDateLong, eventTimeLabel } from "@/lib/wedding";
import { cn, scrollToId } from "@/lib/utils";

export function Walima() {
  const reduced = useReducedMotion();
  const { event, venue, celebration, couple } = wedding;
  return (
    <section id="walima" aria-labelledby="walima-title" className="relative isolate overflow-hidden bg-midnight py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,#1a2438_0%,#0c1220_50%,#090b12_85%)]" aria-hidden />
      <FloatingCandles count={16} seed={77} className="-z-10 opacity-70" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="eyebrow text-gold">{celebration.eyebrow}</p>
          <p className="mt-3 font-fell text-xl text-parchment/75 italic">{celebration.title}</p>
        </Reveal>

        <Reveal delay={0.1} className="relative mt-14">
          {/* Seal pinning the document */}
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
            <WaxSeal size={92} title={`${couple.monogram[0]} and ${couple.monogram[1]} wax seal`} />
          </div>
          {/* Shadow lives on the wrapper: the deckled mask would clip a box-shadow. */}
          <div className="drop-shadow-[0_30px_40px_rgba(0,0,0,0.75)]">
            <article className="parchment deckle relative px-8 pb-16 pt-16 sm:px-16 sm:pb-20 sm:pt-20">
              <div className="pointer-events-none absolute inset-7 border border-ink/35 sm:inset-9" aria-hidden />
              <div className="pointer-events-none absolute inset-[34px] border border-ink/15 sm:inset-[42px]" aria-hidden />
              <Corner className="absolute left-5 top-5 w-16 sm:left-7 sm:top-7 sm:w-20" />
              <Corner className="absolute right-5 top-5 w-16 -scale-x-100 sm:right-7 sm:top-7 sm:w-20" />
              <Corner className="absolute bottom-5 left-5 w-16 -scale-y-100 sm:bottom-7 sm:left-7 sm:w-20" />
              <Corner className="absolute bottom-5 right-5 w-16 -scale-100 sm:bottom-7 sm:right-7 sm:w-20" />

              <header className="relative text-center">
                <h2 id="walima-title" className="font-calligraphy text-[clamp(4.2rem,15vw,8rem)] leading-[1.15] text-crimson">
                  {event.name}
                </h2>
                <p className="mt-1 font-cinzel text-[clamp(1rem,2.8vw,1.4rem)] font-semibold tracking-[0.28em] text-ink">
                  <time dateTime={event.date}>{eventDateLong.toUpperCase()}</time>
                </p>
                <Flourish tone="ink" className="mx-auto mt-6 w-60 max-w-full" />
                <p className="mt-5 font-calligraphy text-[clamp(2.2rem,6.5vw,3.4rem)] leading-[1.25] text-ink">
                  <span className="block sm:inline">{couple.groom.fullName}</span>{" "}
                  <span className="block font-script text-[0.8em] leading-[1] text-crimson sm:inline">&amp;</span>{" "}
                  <span className="block sm:inline">{couple.bride.fullName}</span>
                </p>
                {event.description && <p className="mx-auto mt-5 max-w-xl font-fell text-lg leading-relaxed text-ink-soft italic">{event.description}</p>}
              </header>

              {/* The families */}
              <div className="relative mx-auto mt-10 max-w-2xl">
                <p className="text-center font-cinzel text-[0.7rem] font-bold tracking-[0.36em] text-ink-soft uppercase">With the blessings of our families</p>
                <Families className="mt-5" />
              </div>

              {/* Venue — the heart of the document */}
              <div className="relative mx-auto mt-10 max-w-xl border-y border-ink/25 py-8 text-center">
                <p className="font-cinzel text-[0.7rem] font-bold tracking-[0.36em] text-ink-soft uppercase">The Venue</p>
                <p className="mt-3 font-cinzel text-[clamp(1.35rem,4vw,2rem)] font-bold tracking-[0.06em] text-ink">{venue.name.toUpperCase()}</p>
                <address className="mt-3 font-fell text-[1.15rem] leading-relaxed text-ink not-italic">
                  {venue.addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </div>

              <dl className={cn("relative mx-auto mt-10 grid max-w-xl gap-8", event.dressCode ? "sm:max-w-none sm:grid-cols-3" : "sm:grid-cols-2")}>
                <DetailRow icon={CalendarDays} label="Date">
                  <time dateTime={event.date}>{eventDateFull}</time>
                </DetailRow>
                <DetailRow icon={Clock} label="Time">
                  {eventTimeLabel}
                </DetailRow>
                {event.dressCode && (
                  <DetailRow icon={Shirt} label="Dress code">
                    {event.dressCode.label}
                    {event.dressCode.note && <span className="mt-1 block font-fell text-base text-ink-soft italic">{event.dressCode.note}</span>}
                  </DetailRow>
                )}
              </dl>

              <ContactLinks className="relative mt-12 border-t border-ink/20 pt-8" />

              <div className="relative mt-10 flex flex-wrap items-center justify-center gap-3">
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ink sketch">
                  <MapPin className="h-4 w-4" aria-hidden /> Open in Google Maps
                </a>
                <button type="button" onClick={() => scrollToId("map", reduced)} className="btn-ink sketch">
                  <Compass className="h-4 w-4" aria-hidden /> Find the way
                </button>
                <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="btn-ink sketch">
                  <CalendarPlus className="h-4 w-4" aria-hidden /> Google Calendar
                </a>
                <button type="button" onClick={downloadIcs} className="btn-ink sketch">
                  <Download className="h-4 w-4" aria-hidden /> Apple / Outlook (.ics)
                </button>
              </div>
            </article>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
