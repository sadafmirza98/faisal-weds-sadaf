import { wedding } from "@/config/wedding";
import { Flourish } from "@/components/magical/Flourish";
import { StarField } from "@/components/magical/StarField";
import { Reveal } from "@/components/ui/Reveal";

/** Surah Ar-Rum 30:21 — a quiet interlude between the RSVP and the closing. */
export function Blessing() {
  const { verse } = wedding;
  return (
    <section aria-label="A verse from the Qur’an" className="relative isolate overflow-hidden bg-midnight py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgb(36_61_50/0.35),transparent_65%)]" />
        <StarField count={70} seed={301} className="opacity-50" />
      </div>
      <Reveal className="mx-auto max-w-3xl px-5 text-center">
        <Flourish className="mx-auto w-56 max-w-full" />
        <p lang="ar" dir="rtl" className="text-foil mt-8 font-arabic text-[clamp(1.6rem,4.6vw,2.6rem)] leading-[1.9]">
          {verse.arabic}
        </p>
        <blockquote className="mx-auto mt-6 max-w-2xl font-fell text-[clamp(1.15rem,2.6vw,1.45rem)] leading-relaxed text-parchment/85 italic">
          “{verse.translation}”
        </blockquote>
        {verse.cite && <p className="mt-5 font-cinzel text-xs tracking-[0.35em] text-gold uppercase">{verse.cite}</p>}
        <Flourish className="mx-auto mt-8 w-56 max-w-full" />
      </Reveal>
    </section>
  );
}
