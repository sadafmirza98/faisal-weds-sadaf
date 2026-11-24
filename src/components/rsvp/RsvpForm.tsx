"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Feather, Loader2, MessageCircle, Minus, Pencil, Plus, Send } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { wedding } from "@/config/wedding";
import { OwlDelivery } from "@/components/rsvp/OwlDelivery";
import { rsvpSchema, type RsvpFormInput, type RsvpFormValues } from "@/components/rsvp/schema";
import { WaxSeal } from "@/components/magical/WaxSeal";
import { useSound } from "@/components/sound/SoundProvider";
import { RsvpError, rsvpService, type RsvpReceipt } from "@/services/rsvp";
import { firstNames } from "@/lib/wedding";
import { rsvpWhatsappMessage, telHref, whatsappUrl } from "@/lib/contact";
import { zonedTimeToUtc } from "@/lib/time";
import { cn, safeStorage } from "@/lib/utils";

const SESSION_KEY = "fs-rsvp-this-session";
const { rsvp } = wedding;
const max = rsvp.maxAttendees;
const deadlineMs = rsvp.deadline ? zonedTimeToUtc(rsvp.deadline, wedding.timeZone).getTime() : null;

const defaults: RsvpFormInput = {
  name: "",
  phone: "",
  attending: undefined as unknown as "yes",
  attendees: 1,
  dietary: rsvp.dietaryOptions[0] ?? "",
  message: "",
};

type Phase = "form" | "sending" | "flying" | "done";

interface SessionReply {
  receipt: RsvpReceipt;
  values: RsvpFormValues;
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block font-cinzel text-[0.7rem] font-bold tracking-[0.26em] text-ink-soft uppercase">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 font-sans text-xs text-ink-soft/80">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 font-sans text-[0.8rem] font-medium text-crimson">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

/** Fold creases of a letter that travelled by owl. */
function Folds() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-ink/10 shadow-[0_1px_0_rgb(255_255_255/0.35)]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-2/3 h-px bg-ink/10 shadow-[0_1px_0_rgb(255_255_255/0.35)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_32%,rgb(110_72_30/0.07)_33.3%,transparent_36%,transparent_65%,rgb(110_72_30/0.07)_66.6%,transparent_69%)]" aria-hidden />
    </>
  );
}

const inkInput =
  "ink-line mt-2 block w-full border-0 bg-transparent px-1 py-2 font-fell text-[1.2rem] text-ink placeholder:text-ink-soft/50 focus:outline-none focus-visible:outline-none focus:ring-0 disabled:opacity-60";

export function RsvpForm() {
  const uid = useId();
  const ids = { name: `${uid}-name`, phone: `${uid}-phone`, attendees: `${uid}-att`, dietary: `${uid}-diet`, message: `${uid}-msg` };
  const { play } = useSound();
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<SessionReply | null>(null);
  const [closed, setClosed] = useState(false);
  const inFlight = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<RsvpFormInput, unknown, RsvpFormValues>({ resolver: zodResolver(rsvpSchema), defaultValues: defaults, mode: "onTouched" });
  const attending = useWatch({ control, name: "attending" });

  // Restore a reply already sent in this browser session (prevents duplicates).
  useEffect(() => {
    const saved = safeStorage.get("session", SESSION_KEY);
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from sessionStorage once
        setSession(JSON.parse(saved) as SessionReply);
        setPhase("done");
      } catch {
        /* ignore corrupted value */
      }
    }
    if (deadlineMs !== null && Date.now() > deadlineMs) setClosed(true);
  }, []);

  useEffect(() => {
    if (attending === "no") setValue("attendees", 0, { shouldValidate: false });
    if (attending === "yes" && (getValues("attendees") ?? 0) < 1) setValue("attendees", 1, { shouldValidate: false });
  }, [attending, setValue, getValues]);

  const onSubmit = async (values: RsvpFormValues) => {
    if (inFlight.current) return; // double-click / double-submit guard
    inFlight.current = true;
    setError(null);
    setPhase("sending");
    try {
      const receipt = await rsvpService.submit(values, session?.receipt.id);
      const reply = { receipt, values };
      setSession(reply);
      safeStorage.set("session", SESSION_KEY, JSON.stringify(reply));
      play("whoosh");
      setPhase("flying");
    } catch (e) {
      setError(e instanceof RsvpError ? e.message : "Something went wrong while sending your owl. Please try again.");
      setPhase("form");
    } finally {
      inFlight.current = false;
    }
  };

  const editReply = () => {
    if (session) reset(session.values);
    setPhase("form");
  };

  useEffect(() => {
    if (phase === "done") resultRef.current?.focus({ preventScroll: true });
  }, [phase]);

  if (!rsvp.enabled || closed) {
    return (
      <div className="parchment deckle px-8 py-14 text-center">
        <p className="font-fell text-xl text-ink italic">Replies are now closed. Thank you to everyone who sent an owl.</p>
      </div>
    );
  }

  const sending = phase === "sending";

  return (
    <div className="relative">
      <AnimatePresence>{phase === "flying" && <OwlDelivery key="owl" onDone={() => setPhase("done")} />}</AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {phase === "done" || phase === "flying" ? (
          <motion.div
            key="done"
            ref={resultRef}
            tabIndex={-1}
            role="status"
            className="rotate-[0.6deg] text-center outline-none drop-shadow-[0_30px_35px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase === "done" ? 1 : 0.25, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="parchment deckle relative px-9 py-16 sm:px-16">
            <Folds />
            <div className="pointer-events-none absolute inset-7 border border-ink/30" aria-hidden />
            <WaxSeal size={84} className="mx-auto" />
            <p className="mx-auto mt-6 max-w-lg font-fell text-[1.35rem] leading-relaxed text-ink">{rsvp.successMessage}</p>
            {session && (
              <p className="mt-4 font-serif text-ink-soft italic">
                {session.values.attending === "yes"
                  ? `${session.values.name} — joyfully attending, party of ${session.values.attendees}.`
                  : `${session.values.name} — sadly unable to attend. You will be missed.`}
              </p>
            )}
            {session && (
              <div className="mt-7 flex flex-col items-center gap-2">
                <a href={whatsappUrl(rsvpWhatsappMessage(session.values))} target="_blank" rel="noopener noreferrer" className="btn-spell">
                  <MessageCircle className="h-4 w-4" aria-hidden /> Send my reply on WhatsApp
                  <span className="sr-only">(opens WhatsApp in a new tab)</span>
                </a>
                <p className="max-w-sm font-sans text-xs text-ink-soft">Opens WhatsApp with your reply already written to <span className="whitespace-nowrap">{wedding.contact.phone}</span> — just press send.</p>
              </div>
            )}
            <button type="button" onClick={editReply} className="btn-ink sketch mt-6" disabled={phase !== "done"}>
              <Pencil className="h-4 w-4" aria-hidden /> Update my reply
            </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={(e) => void handleSubmit(onSubmit)(e)}
            noValidate
            aria-busy={sending}
            className="-rotate-[0.5deg] drop-shadow-[0_30px_35px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.4 } }}
          >
            <div className="parchment deckle relative px-9 pb-14 pt-14 sm:px-16 sm:pt-16">
            <Folds />
            <div className="pointer-events-none absolute inset-7 border border-ink/30" aria-hidden />
            <WaxSeal size={64} className="absolute -right-1 -top-1 rotate-12 sm:right-3 sm:top-3" />
            <p className="font-calligraphy text-[2.4rem] leading-[1.2] text-ink">Dear {firstNames},</p>
            <p className="mt-3 font-fell text-lg text-ink-soft italic">With thanks for your kind invitation to the {wedding.occasion}, I reply as follows:</p>

            <fieldset disabled={sending} className="mt-8 grid gap-7">
              <legend className="sr-only">Your reply</legend>

              <Field id={ids.name} label="Your name" error={errors.name?.message}>
                <input
                  id={ids.name}
                  type="text"
                  autoComplete="name"
                  placeholder="As it should appear on the guest list"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? `${ids.name}-error` : undefined}
                  className={inkInput}
                  {...register("name")}
                />
              </Field>

              <Field id={ids.phone} label="Phone number" error={errors.phone?.message} hint="So the couple can reach you about the celebration.">
                <input
                  id={ids.phone}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? `${ids.phone}-error` : `${ids.phone}-hint`}
                  className={inkInput}
                  {...register("phone")}
                />
              </Field>

              <fieldset aria-describedby={errors.attending ? `${uid}-attending-error` : undefined}>
                <legend className="font-cinzel text-[0.7rem] font-bold tracking-[0.26em] text-ink-soft uppercase">Will you attend?</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["yes", "Joyfully accepts", "I wouldn’t miss it for all the magic in the world."],
                      ["no", "Regretfully declines", "I’ll be there in spirit, sending my love."],
                    ] as const
                  ).map(([value, title, sub]) => (
                    <label
                      key={value}
                      className={cn(
                        "sketch relative flex cursor-pointer flex-col gap-1 border-2 px-5 py-4 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-crimson",
                        attending === value ? "border-crimson bg-[rgb(116_13_36/0.08)]" : "border-ink/25 hover:border-ink/50",
                      )}
                    >
                      <input type="radio" value={value} className="sr-only" {...register("attending")} />
                      <span className="font-cinzel text-sm font-bold tracking-[0.1em] text-ink">{title}</span>
                      <span className="font-fell text-[0.98rem] text-ink-soft italic">{sub}</span>
                      {attending === value && <Feather className="absolute right-3 top-3 h-4 w-4 text-crimson" aria-hidden />}
                    </label>
                  ))}
                </div>
                {errors.attending && (
                  <p id={`${uid}-attending-error`} className="mt-1.5 flex items-center gap-1.5 font-sans text-[0.8rem] font-medium text-crimson">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden /> {errors.attending.message}
                  </p>
                )}
              </fieldset>

              <AnimatePresence initial={false}>
                {attending === "yes" && (
                  <motion.div key="party" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid gap-7 overflow-hidden sm:grid-cols-2">
                    <Field id={ids.attendees} label="Number attending" error={errors.attendees?.message}>
                      <Controller
                        control={control}
                        name="attendees"
                        render={({ field }) => (
                          <div className="mt-2 flex items-center gap-3">
                            <button type="button" onClick={() => field.onChange(Math.max(1, (field.value ?? 1) - 1))} disabled={(field.value ?? 1) <= 1} className="btn-ink sketch !h-11 !w-11 !min-h-0 !p-0 disabled:opacity-40" aria-label="One fewer guest">
                              <Minus className="h-4 w-4" aria-hidden />
                            </button>
                            <input
                              id={ids.attendees}
                              type="number"
                              inputMode="numeric"
                              min={1}
                              max={max}
                              value={field.value ?? 1}
                              onChange={(e) => field.onChange(e.target.value === "" ? 1 : Math.min(max, Math.max(1, Number(e.target.value))))}
                              onBlur={field.onBlur}
                              aria-invalid={!!errors.attendees}
                              aria-describedby={errors.attendees ? `${ids.attendees}-error` : `${ids.attendees}-hint`}
                              className="ink-line h-11 w-16 border-0 bg-transparent text-center font-cinzel text-xl font-bold text-ink focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button type="button" onClick={() => field.onChange(Math.min(max, (field.value ?? 1) + 1))} disabled={(field.value ?? 1) >= max} className="btn-ink sketch !h-11 !w-11 !min-h-0 !p-0 disabled:opacity-40" aria-label="One more guest">
                              <Plus className="h-4 w-4" aria-hidden />
                            </button>
                          </div>
                        )}
                      />
                    </Field>
                    <Field id={ids.dietary} label="Dietary preferences">
                      <select id={ids.dietary} className={cn(inkInput, "cursor-pointer")} {...register("dietary")}>
                        {rsvp.dietaryOptions.map((o) => (
                          <option key={o} value={o} className="bg-parchment">
                            {o}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              <Field id={ids.message} label="A note for the couple (optional)" error={errors.message?.message}>
                <textarea
                  id={ids.message}
                  rows={3}
                  placeholder="Wishes, blessings, a favourite memory…"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? `${ids.message}-error` : undefined}
                  className={cn(inkInput, "resize-y leading-relaxed")}
                  {...register("message")}
                />
              </Field>
            </fieldset>

            {error && (
              <div role="alert" className="mt-6 flex items-start gap-2 border border-crimson/60 bg-[rgb(116_13_36/0.08)] p-3 font-sans text-sm text-crimson">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {error}
              </div>
            )}

            <div className="mt-9 flex flex-col items-center gap-3">
              <p className="font-calligraphy text-3xl leading-[1.3] text-ink-soft">Yours, magically</p>
              <button type="submit" className="btn-spell" disabled={sending}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                {sending ? "Your owl is taking flight…" : rsvp.submitLabel}
              </button>
              <p className="text-center font-sans text-xs text-ink-soft">
                Questions? Call or WhatsApp{" "}
                <a href={telHref} className="whitespace-nowrap font-semibold text-ink underline decoration-ink/30 underline-offset-4">
                  {wedding.contact.phone}
                </a>
              </p>
            </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
