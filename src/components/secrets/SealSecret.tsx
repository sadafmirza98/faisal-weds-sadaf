"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { wedding } from "@/config/wedding";
import { MagicDialog } from "@/components/ui/MagicDialog";
import { Monogram } from "@/components/magical/Monogram";
import { WaxSeal } from "@/components/magical/WaxSeal";
import { useSound } from "@/components/sound/SoundProvider";
import { eventDateRoman, fullNames } from "@/lib/wedding";

/** Easter egg: press the wax seal to watch the F & S monogram write itself in gold. */
export function SealSecret({ size = 64 }: { size?: number }) {
  const [open, setOpen] = useState(false);
  const { play } = useSound();
  return (
    <>
      <motion.button
        type="button"
        onClick={() => {
          setOpen(true);
          play("chime");
        }}
        aria-label="Press the wax seal to reveal the monogram"
        className="relative rounded-full"
        whileHover={{ scale: 1.08, rotate: -6 }}
        whileTap={{ scale: 0.92 }}
      >
        <span className="absolute inset-[-30%] animate-pulse rounded-full bg-[radial-gradient(circle,rgb(116_13_36/0.45),transparent_65%)]" aria-hidden />
        <WaxSeal size={size} className="relative" />
      </motion.button>
      <MagicDialog open={open} onClose={() => setOpen(false)} label="The F and S monogram" variant="night">
        <div className="flex flex-col items-center text-center">
          <Monogram draw className="h-56 w-56 sm:h-64 sm:w-64" />
          <p className="mt-6 eyebrow text-gold">{eventDateRoman}</p>
          <p className="mt-3 font-cinzel text-lg tracking-[0.12em] text-parchment">{fullNames}</p>
          <p className="mt-4 max-w-xs font-fell text-parchment/70 italic">Sealed with love, and a little magic. — {wedding.occasion}</p>
        </div>
      </MagicDialog>
    </>
  );
}
