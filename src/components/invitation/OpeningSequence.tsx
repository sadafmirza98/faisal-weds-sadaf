"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion } from "motion/react";
import { ChevronsRight, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { ParticleField } from "@/components/magical/ParticleField";
import { StarField } from "@/components/magical/StarField";
import { SoundToggle } from "@/components/sound/SoundToggle";
import { useSound } from "@/components/sound/SoundProvider";
import { EnvelopeBack, EnvelopeFlap, EnvelopeFront, SealButton } from "@/components/invitation/Envelope";
import { PANEL_RATIO, ParchmentLetter } from "@/components/invitation/ParchmentLetter";
import { eventDateFull, eventTimeWords } from "@/lib/wedding";

/**
 * THE SIGNATURE OPENING
 *  1. Enchanted darkness — an envelope materialises among golden motes.
 *  2. The wax seal cracks and falls away; the flap lifts.
 *  3. The folded letter slides out of the pocket.
 *  4. The envelope drops away; the letter comes forward and physically unfolds.
 *  5. Ink appears; "Enter the magical world" dissolves it into golden dust.
 */

const STAGES = ["sealed", "breaking", "opening", "sliding", "unfolding", "revealed", "entering"] as const;
type Stage = (typeof STAGES)[number];

/** How long each automatic stage lasts before the next (ms). */
const NEXT: Partial<Record<Stage, [Stage, number]>> = {
  breaking: ["opening", 800],
  opening: ["sliding", 950],
  sliding: ["unfolding", 1050],
  unfolding: ["revealed", 2700],
};

export function OpeningSequence() {
  const { opened, ready, enter } = useExperience();
  // Server render + first client render always include the gate (hidden by CSS
  // for returning guests), so there is never a flash of the site behind it.
  if (ready && opened) return null;
  return <OpeningOverlay onDone={enter} />;
}

function OpeningOverlay({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const { play } = useSound();
  const { burst } = useExperience();
  const [stage, setStage] = useState<Stage>("sealed");
  const [leaving, setLeaving] = useState<null | "enter" | "skip">(null);
  const [dims, setDims] = useState({ envW: 440, letterW: 480 });
  const stageRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const unsealRef = useRef<HTMLButtonElement>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef(false);

  const at = (s: Stage) => STAGES.indexOf(stage) >= STAGES.indexOf(s);

  // Measure the CSS-driven sizes (offsetWidth ignores transforms).
  useEffect(() => {
    const measure = () => {
      const envW = stageRef.current?.offsetWidth;
      const letterW = letterRef.current?.offsetWidth;
      if (envW && letterW) setDims({ envW, letterW });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Automatic progression through the choreography.
  useEffect(() => {
    const next = NEXT[stage];
    if (!next) return;
    const t = window.setTimeout(() => setStage(next[0]), next[1]);
    return () => window.clearTimeout(t);
  }, [stage]);

  // Sound cues (silent unless the guest enabled sound).
  useEffect(() => {
    if (stage === "breaking") play("seal");
    if (stage === "opening") play("whoosh");
    if (stage === "sliding") play("parchment");
    if (stage === "unfolding") {
      const a = window.setTimeout(() => play("parchment"), 850);
      const b = window.setTimeout(() => play("parchment"), 1450);
      return () => {
        window.clearTimeout(a);
        window.clearTimeout(b);
      };
    }
    if (stage === "revealed") play("chime");
  }, [stage, play]);

  useEffect(() => {
    const id = window.setTimeout(() => unsealRef.current?.focus({ preventScroll: true }), 900);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    if (stage === "revealed") {
      const id = window.setTimeout(() => enterRef.current?.focus({ preventScroll: true }), reduced ? 50 : 1800);
      return () => window.clearTimeout(id);
    }
  }, [stage, reduced]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  const unseal = useCallback(() => {
    if (stage !== "sealed") return;
    setStage(reduced ? "revealed" : "breaking");
  }, [stage, reduced]);

  const enterWorld = useCallback(() => {
    if (leaving) return;
    setStage("entering");
    setLeaving("enter");
    play("sparkle");
    if (!reduced && letterRef.current) burst(letterRef.current.getBoundingClientRect(), 340);
  }, [leaving, play, reduced, burst]);

  const skip = useCallback(() => {
    if (leaving) return;
    setLeaving("skip");
  }, [leaving]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && skip();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  // Letter placement: folded & tucked in the pocket → slid out → centre stage.
  const s0 = (dims.envW * 0.86) / dims.letterW;
  const tucked = dims.envW * 0.06;
  const letterAnim = at("unfolding")
    ? { y: 0, scale: 1 }
    : at("sliding")
      ? { y: tucked - dims.envW * 0.42, scale: s0 }
      : { y: tucked, scale: s0 };

  const showLetter = reduced ? at("revealed") : true;
  const unfolded = reduced ? true : at("unfolding");
  const envelopeGone = reduced ? at("revealed") : at("unfolding");

  return (
    <motion.div
      data-gate-overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      // The letter is sized to fit the screen, so the overlay never scrolls (the envelope
      // sliding away below must not add empty space). Only very short landscape screens scroll.
      className="fixed inset-0 z-[100] touch-none overflow-hidden overscroll-none bg-midnight [@media(max-height:560px)]:touch-auto [@media(max-height:560px)]:overflow-y-auto"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: leaving === "skip" ? 0.5 : 1, delay: leaving === "enter" && !reduced ? 0.55 : 0 }}
      onAnimationComplete={() => leaving && finish()}
      style={
        {
          "--env-w": "min(86vw, 500px, calc((100svh - 280px) * 1.5))",
          "--letter-w": `max(250px, min(90vw, 520px, calc((100svh - 170px) / ${PANEL_RATIO * 3})))`,
        } as React.CSSProperties
      }
    >
      {/* Enchanted darkness */}
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#16213a_0%,#0b1120_45%,#090b12_80%)]" />
        <StarField count={90} seed={3} className="opacity-60" />
        <ParticleField density={7} rise={10} />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(197_164_106/0.18),transparent_65%)]"
          animate={reduced ? undefined : { scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Chrome */}
      <div className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between p-4 sm:p-6">
        <SoundToggle />
        {!leaving && (
          <button type="button" onClick={skip} className="btn-ghost !min-h-10 !px-4 !text-[0.65rem]">
            Skip intro <ChevronsRight className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      <h1 id="gate-title" className="sr-only">
        A special invitation from {wedding.couple.groom.fullName} and {wedding.couple.bride.fullName}
      </h1>

      <div className="relative flex min-h-[100svh] items-center justify-center">
        {/* The stage is the envelope's box; everything is positioned from its centre. */}
        <motion.div
          ref={stageRef}
          className="relative"
          style={{ width: "var(--env-w)", height: "calc(var(--env-w) / 1.5)" }}
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          {/* Prompt above */}
          <AnimatePresence>
            {stage === "sealed" && (
              <motion.p
                key="received"
                className="absolute inset-x-[-10vw] bottom-[calc(100%+2.25rem)] text-center font-fell text-[clamp(1.15rem,3.6vw,1.6rem)] text-parchment/90 italic text-glow"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 1.6, duration: 1.2 } }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.4 } }}
              >
                {wedding.invitation.received}
              </motion.p>
            )}
          </AnimatePresence>

          <EnvelopeBack gone={envelopeGone} />
          <EnvelopeFlap open={reduced ? false : at("opening")} behind={at("sliding")} gone={envelopeGone} />

          {/* The letter */}
          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${at("unfolding") || reduced ? "z-50" : "z-20"}`}
          >
          <motion.div
            initial={false}
            animate={
              leaving === "enter"
                ? { ...letterAnim, scale: 1.1, opacity: 0, filter: "blur(10px)" }
                : { ...letterAnim, opacity: showLetter ? 1 : 0, filter: "blur(0px)" }
            }
            transition={
              leaving === "enter"
                ? { duration: 1.1, ease: [0.22, 1, 0.36, 1] }
                : { duration: 1, ease: [0.65, 0, 0.35, 1], opacity: { duration: reduced ? 0.6 : 0.2 } }
            }
          >
            <div ref={letterRef} className="drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]">
              <ParchmentLetter unfolded={unfolded} revealed={at("revealed")} unfoldDelay={0.85} />
            </div>
          </motion.div>
          </div>

          <EnvelopeFront gone={envelopeGone} />
          <SealButton broken={at("breaking")} hidden={at("unfolding")} onUnseal={unseal} disabled={stage !== "sealed"} />

          {/* Call to action below */}
          <AnimatePresence>
            {stage === "sealed" && (
              <motion.div
                key="unseal"
                className="absolute inset-x-[-10vw] top-[calc(100%+2.25rem)] flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 2.1, duration: 1 } }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                <button ref={unsealRef} type="button" onClick={unseal} className="btn-spell">
                  <Sparkles className="h-4 w-4" aria-hidden /> {wedding.invitation.unsealLabel}
                </button>
                <span className="font-sans text-[0.7rem] tracking-[0.18em] text-silver/60 uppercase">or tap the wax seal</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Enter */}
      <AnimatePresence>
        {at("revealed") && !leaving && (
          <motion.div
            key="enter"
            className="fixed inset-x-0 bottom-[max(0.9rem,env(safe-area-inset-bottom))] z-[60] flex justify-center px-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: reduced ? 0 : 1.7, duration: 0.9 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <button ref={enterRef} type="button" onClick={enterWorld} className="btn-spell whitespace-nowrap shadow-[0_0_40px_rgba(232,201,139,0.45)]">
              <Sparkles className="h-4 w-4" aria-hidden /> {wedding.invitation.enterLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="sr-only" aria-live="polite">
        {stage === "revealed" ? `Invitation opened. ${wedding.bismillah.translation}. ${wedding.invitation.byInvitation}: ${wedding.invitation.invitedTo} ${wedding.couple.groom.fullName} and ${wedding.couple.bride.fullName}. ${eventDateFull} ${eventTimeWords}, ${wedding.venue.name}.` : ""}
      </p>
    </motion.div>
  );
}
