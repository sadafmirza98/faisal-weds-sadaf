import type { LucideIcon } from "lucide-react";

export function DetailRow({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/35 bg-[rgb(255_248_230/0.35)] text-crimson">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <dt className="font-cinzel text-[0.7rem] font-bold tracking-[0.32em] text-ink-soft uppercase">{label}</dt>
      <dd className="font-serif text-[1.15rem] leading-snug font-medium text-ink">{children}</dd>
    </div>
  );
}
