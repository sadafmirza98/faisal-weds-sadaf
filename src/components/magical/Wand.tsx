import { cn } from "@/lib/utils";

/** A slender carved wand, tip at the top. viewBox 24×200. */
export function Wand({ className, glow = true }: { className?: string; glow?: boolean }) {
  return (
    <svg viewBox="0 0 24 200" className={cn("block overflow-visible", className)} aria-hidden>
      <defs>
        <linearGradient id="wand-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a2414" />
          <stop offset="0.5" stopColor="#8a5f36" />
          <stop offset="1" stopColor="#2c1a0e" />
        </linearGradient>
        <radialGradient id="wand-glow">
          <stop offset="0" stopColor="#fff6d8" />
          <stop offset="0.3" stopColor="#e8c98b" stopOpacity="0.7" />
          <stop offset="1" stopColor="#e8c98b" stopOpacity="0" />
        </radialGradient>
      </defs>
      {glow && <circle cx="12" cy="6" r="14" fill="url(#wand-glow)" className="animate-twinkle" />}
      <path d="M11 8 L13 8 L15.5 128 L8.5 128Z" fill="url(#wand-wood)" />
      <path d="M8 128 h8 l1.6 6 l-1.6 6 l1.6 6 l-1.6 6 l1.6 6 l-1 40 h-9 l-1 -40 l1.6 -6 l-1.6 -6 l1.6 -6 l-1.6 -6z" fill="url(#wand-wood)" />
      <path d="M7.5 134 h9 M7.5 146 h9 M7.5 158 h9" stroke="#c5a46a" strokeWidth="0.8" opacity="0.8" />
      <circle cx="12" cy="194" r="4.5" fill="#5a3a20" stroke="#c5a46a" strokeWidth="0.8" />
    </svg>
  );
}
