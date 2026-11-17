"use client";

import { wedding } from "@/config/wedding";
import { MagicDialog } from "@/components/ui/MagicDialog";
import { Snitch } from "@/components/magical/Snitch";
import { firstNames } from "@/lib/wedding";

/** The hidden romantic message, revealed by catching the snitch. */
export function SecretMessage({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <MagicDialog open={open} onClose={onClose} label="A secret message" variant="night">
      <div className="flex flex-col items-center text-center">
        <Snitch className="w-40" />
        <p className="mt-2 eyebrow text-gold">You caught it</p>
        <p className="mt-6 font-script text-[2.2rem] leading-tight text-candle text-glow">“{wedding.secrets.hiddenMessage}”</p>
        <p className="mt-6 font-cinzel text-xs tracking-[0.3em] text-parchment/70 uppercase">— {firstNames}</p>
      </div>
    </MagicDialog>
  );
}
