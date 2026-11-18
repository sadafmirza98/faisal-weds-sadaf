import { OpeningSequence } from "@/components/invitation/OpeningSequence";
import { SiteContent } from "@/components/layout/ExperienceProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { GoldenSnitchHunt } from "@/components/secrets/GoldenSnitchHunt";
import { SpellListener } from "@/components/secrets/SpellListener";
import { WandTrail } from "@/components/secrets/WandTrail";
import { Blessing } from "@/sections/Blessing";
import { Closing } from "@/sections/Closing";
import { Countdown } from "@/sections/Countdown";
import { GreatHall } from "@/sections/GreatHall";
import { HogwartsExpress } from "@/sections/HogwartsExpress";
import { MapSection } from "@/sections/MapSection";
import { Rsvp } from "@/sections/Rsvp";
import { Story } from "@/sections/Story";
import { Walima } from "@/sections/Walima";

/**
 * The journey: the sealed letter → the Great Hall → our story →
 * Platform 9¾ → the Walima → the enchanted clock → the Marauder’s Map →
 * the reply by owl → a verse → the closing night sky.
 */
export default function Home() {
  return (
    <>
      <OpeningSequence />
      <SiteContent>
        <SiteNav />
        <main>
          <GreatHall />
          <Story />
          <HogwartsExpress />
          <Walima />
          <Countdown />
          <MapSection />
          <Rsvp />
          <Blessing />
          <Closing />
        </main>
        <GoldenSnitchHunt />
      </SiteContent>
      <SpellListener />
      <WandTrail />
    </>
  );
}
