import { wedding } from "@/config/wedding";
import { cn } from "@/lib/utils";

/** "Son of … / Daughter of …" — groom first, as on a wedding card. */
export function Families({ className }: { className?: string }) {
  const people = [wedding.couple.groom, wedding.couple.bride].filter((p) => p.family);
  if (!people.length) return null;
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 sm:gap-10", className)}>
      {people.map((p) => (
        <div key={p.fullName} className="text-center">
          <p className="font-calligraphy text-[2rem] leading-[1.2] text-ink">{p.fullName}</p>
          <p className="mt-1 font-cinzel text-[0.66rem] font-bold tracking-[0.32em] text-crimson uppercase">{p.family!.relation}</p>
          <p className="mt-1.5 font-fell text-[1.08rem] leading-snug text-ink">{p.family!.parents}</p>
        </div>
      ))}
    </div>
  );
}
