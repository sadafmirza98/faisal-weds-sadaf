"use client";

import { LiningDigits } from "@/components/ui/LiningDigits";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion } from "motion/react";
import { Footprints, MapPin, Navigation, ScrollText, Sparkles, Undo2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { wedding } from "@/config/wedding";
import { Compass } from "@/components/magical/Compass";
import { Corner } from "@/components/magical/Flourish";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useSound } from "@/components/sound/SoundProvider";
import { distanceMetres, googleDirectionsUrl, googleMapsUrl } from "@/lib/maps";
import { cn } from "@/lib/utils";

// Leaflet touches `window` — load the map on the client, on demand.
const MaraudersMap = dynamic(() => import("@/components/map/MaraudersMap").then((m) => m.MaraudersMap), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center font-fell text-ink-soft italic">Unfolding the map…</div>,
});

const { venue, map: copy } = wedding;
const verified = venue.coordinates !== null;

function distanceLine() {
  if (!venue.coordinates || !venue.landmark) return null;
  const m = distanceMetres(venue.landmark.coordinates, venue.coordinates);
  return `About ${Math.round(m / 50) * 50} m from ${venue.landmark.name}, as the owl flies.`;
}

function VenuePanel({ trail, onTrail, className }: { trail: boolean; onTrail: () => void; className?: string }) {
  const line = distanceLine();
  return (
    <div className={cn("drop-shadow-[0_18px_24px_rgba(43,29,16,0.55)]", className)}>
    <div className="parchment deckle relative p-9">
      <div className="pointer-events-none absolute inset-6 border border-ink/25" aria-hidden />
      <p className="flex items-center gap-2 font-cinzel text-[0.66rem] font-bold tracking-[0.3em] text-crimson uppercase">
        <MapPin className="h-4 w-4" aria-hidden /> Destination
      </p>
      <h3 className="mt-2 font-cinzel text-xl leading-tight font-bold text-ink">{venue.name}</h3>
      <address className="mt-2 font-fell text-[1.05rem] leading-relaxed text-ink not-italic">
        <LiningDigits text={venue.addressLines.join(", ")} />
      </address>
      {line && <p className="mt-2 font-fell text-sm text-ink-soft italic">{line}</p>}
      <div className="mt-5 flex flex-col gap-2.5">
        {verified && venue.landmark && (
          <button type="button" onClick={onTrail} className="btn-ink sketch w-full" aria-pressed={trail}>
            <Footprints className="h-4 w-4" aria-hidden /> {trail ? "Hide the trail" : copy.revealLabel}
          </button>
        )}
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ink sketch w-full !bg-ink !text-parchment hover:!bg-crimson">
          <MapPin className="h-4 w-4" aria-hidden /> Open in Google Maps
        </a>
        <a href={googleDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn-ink sketch w-full">
          <Navigation className="h-4 w-4" aria-hidden /> Directions from here
        </a>
      </div>
      {!verified && (
        <p className="mt-4 font-sans text-xs text-ink-soft">The exact pin is not verified yet, so this opens a Google Maps search for the address.</p>
      )}
    </div>
    </div>
  );
}

export function MapSection() {
  const [revealed, setRevealed] = useState(false);
  const [trail, setTrail] = useState(false);
  const reduced = useReducedMotion();
  const { play } = useSound();

  const reveal = () => {
    setRevealed(true);
    play("sparkle");
  };
  const close = () => {
    setRevealed(false);
    setTrail(false);
    play("parchment");
  };

  return (
    <section id="map" aria-labelledby="map-title" className="relative isolate overflow-hidden bg-midnight py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_30%,rgb(36_61_50/0.4),transparent_60%),radial-gradient(ellipse_at_50%_100%,rgb(17_26_43/0.9),transparent_70%)]" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="map-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />

        <Reveal className="mt-12">
          <AnimatePresence mode="wait" initial={false}>
            {!revealed ? (
              /* The blank, folded parchment awaiting the oath */
              <motion.div
                key="closed"
                className="mx-auto max-w-3xl drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)]"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)", transition: { duration: 0.5 } }}
              >
              <div className="parchment deckle relative flex min-h-[24rem] flex-col items-center justify-center overflow-hidden px-6 py-14 text-center">
                {/* Fold lines */}
                <div className="pointer-events-none absolute inset-y-0 left-1/3 w-px bg-ink/15 shadow-[1px_0_0_rgb(255_255_255/0.3)]" aria-hidden />
                <div className="pointer-events-none absolute inset-y-0 left-2/3 w-px bg-ink/15 shadow-[1px_0_0_rgb(255_255_255/0.3)]" aria-hidden />
                <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-ink/15" aria-hidden />
                <Corner className="absolute left-6 top-6 w-16" />
                <Corner className="absolute right-6 top-6 w-16 -scale-x-100" />
                <Corner className="absolute bottom-6 left-6 w-16 -scale-y-100" />
                <Corner className="absolute bottom-6 right-6 w-16 -scale-100" />
                <Compass className="w-24 opacity-70" />
                <p className="mt-6 max-w-md font-fell text-lg text-ink-soft italic">This parchment appears blank to the uninitiated. Only the oath will reveal it.</p>
                <button type="button" onClick={reveal} className="btn-spell mt-8 max-w-full !whitespace-normal !text-[0.72rem] sm:!text-[0.8rem]">
                  <Sparkles className="h-4 w-4 shrink-0" aria-hidden /> {copy.oath}
                </button>
              </div>
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={reduced ? { opacity: 0 } : { clipPath: "circle(0% at 50% 50%)", opacity: 1 }}
                animate={reduced ? { opacity: 1 } : { clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { clipPath: "circle(0% at 50% 50%)", transition: { duration: 0.8 } }}
                transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
                className="relative"
              >
                <div className="relative drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)]">
                <div className="parchment deckle relative overflow-hidden p-5 sm:p-6">
                  {/* Map + decorative overlays */}
                  <div className="relative h-[min(70svh,36rem)] min-h-[22rem] overflow-hidden border border-ink/40">
                    {verified ? (
                      <MaraudersMap trail={trail} />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                        <ScrollText className="h-8 w-8 text-ink-soft" aria-hidden />
                        <p className="max-w-sm font-fell text-lg text-ink italic">The exact pin has not been verified, so no marker is drawn. Use the Google Maps search below.</p>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 z-[450] shadow-[inset_0_0_60px_rgb(110_72_30/0.55)]" aria-hidden />
                    <Compass className="pointer-events-none absolute right-3 top-3 z-[450] w-16 opacity-80 sm:w-24" />
                    <div className="pointer-events-none absolute left-3 top-3 z-[450] max-w-[60%] border border-ink/40 bg-parchment/85 px-3 py-2 sm:px-4">
                      <p className="font-cinzel text-[0.62rem] font-bold tracking-[0.2em] text-ink uppercase sm:text-xs">{copy.mapTitle}</p>
                      <p className="font-fell text-[0.75rem] text-ink-soft italic sm:text-sm">faithfully drawn for the guests of F &amp; S</p>
                    </div>
                  </div>

                  {/* Floating parchment panel on large screens */}
                  <motion.div
                    className="absolute bottom-8 left-8 z-[500] hidden w-[22rem] lg:block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduced ? 0 : 1.4, duration: 0.8 }}
                  >
                    <VenuePanel trail={trail} onTrail={() => setTrail((t) => !t)} />
                  </motion.div>
                </div>
                </div>

                <VenuePanel trail={trail} onTrail={() => setTrail((t) => !t)} className="mt-5 lg:hidden" />

                <div className="mt-6 flex justify-center">
                  <button type="button" onClick={close} className="btn-ghost">
                    <Undo2 className="h-4 w-4" aria-hidden /> {copy.closeLabel}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
