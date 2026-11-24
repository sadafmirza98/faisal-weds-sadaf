import { OpeningSequence } from "@/components/invitation/OpeningSequence";
import { SiteContent } from "@/components/layout/ExperienceProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { GoldenSnitchHunt } from "@/components/secrets/GoldenSnitchHunt";
import { SpellListener } from "@/components/secrets/SpellListener";
import { WandTrail } from "@/components/secrets/WandTrail";
import { Closing } from "@/sections/Closing";
import { Countdown } from "@/sections/Countdown";
import { EnchantedCalendar } from "@/sections/EnchantedCalendar";
import { GreatHall } from "@/sections/GreatHall";
import { HogwartsExpress } from "@/sections/HogwartsExpress";
import { MapSection } from "@/sections/MapSection";
import { Rsvp } from "@/sections/Rsvp";
import { Story } from "@/sections/Story";
import { Walima } from "@/sections/Walima";

/**
 * The journey: the sealed letter → the Great Hall → our story →
 * Platform 9¾ → the Walima → the enchanted clock → the Marauder’s Map →
 * the reply by owl → the closing night sky, ending with a verse.
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
          <EnchantedCalendar />
          <MapSection />
          <Rsvp />
          <Closing />
        </main>
        <GoldenSnitchHunt />
      </SiteContent>
      <SpellListener />
      <WandTrail />
    </>
  );
}
