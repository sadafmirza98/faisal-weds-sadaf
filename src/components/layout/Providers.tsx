"use client";

import { MotionConfig } from "motion/react";
import { ExperienceProvider } from "@/components/layout/ExperienceProvider";
import { SoundProvider } from "@/components/sound/SoundProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SoundProvider>
        <ExperienceProvider>{children}</ExperienceProvider>
      </SoundProvider>
    </MotionConfig>
  );
}
