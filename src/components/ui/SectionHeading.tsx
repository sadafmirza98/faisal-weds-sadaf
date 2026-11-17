import { Flourish } from "@/components/magical/Flourish";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  id?: string;
  tone?: "night" | "parchment";
  className?: string;
}

export function SectionHeading({ eyebrow, title, intro, id, tone = "night", className }: SectionHeadingProps) {
  const night = tone === "night";
  return (
    <Reveal className={cn("mx-auto max-w-2xl text-center", className)}>
      <p className={cn("eyebrow", night ? "text-gold" : "text-crimson")}>{eyebrow}</p>
      <h2
        id={id}
        className={cn(
          "mt-4 font-cinzel text-[clamp(2rem,5.6vw,3.6rem)] leading-[1.08] font-semibold tracking-[0.03em]",
          night ? "text-foil" : "text-ink",
        )}
      >
        {title}
      </h2>
      <Flourish tone={night ? "gold" : "ink"} className="mx-auto mt-5 w-56 max-w-full" />
      {intro && <p className={cn("mt-5 font-fell text-lg italic sm:text-xl", night ? "text-parchment/75" : "text-ink-soft")}>{intro}</p>}
    </Reveal>
  );
}
