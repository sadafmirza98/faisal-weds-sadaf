"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/components/sound/SoundProvider";
import { cn } from "@/lib/utils";

export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute ambient sound" : "Play ambient sound"}
      title={enabled ? "Mute sound" : "Sound is off — tap to enable"}
      className={cn(
        "relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-midnight/50 text-gold-light backdrop-blur transition hover:border-gold-light hover:bg-gold/15",
        className,
      )}
    >
      {enabled ? <Volume2 className="h-[18px] w-[18px]" aria-hidden /> : <VolumeX className="h-[18px] w-[18px]" aria-hidden />}
      {enabled && <span className="absolute h-11 w-11 animate-pulse-ring rounded-full border border-gold/40" aria-hidden />}
    </button>
  );
}
