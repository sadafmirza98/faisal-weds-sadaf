import { wedding } from "@/config/wedding";
import { RsvpForm } from "@/components/rsvp/RsvpForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Rsvp() {
  const { rsvp } = wedding;
  return (
    <section id="rsvp" aria-labelledby="rsvp-title" className="relative isolate overflow-hidden bg-navy-deep py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_20%,rgb(116_13_36/0.18),transparent_55%)]" aria-hidden />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading id="rsvp-title" eyebrow={rsvp.eyebrow} title={rsvp.title} intro={rsvp.intro} />
        <Reveal className="mt-12">
          <RsvpForm />
        </Reveal>
      </div>
    </section>
  );
}
