import { wedding } from "@/config/wedding";
import type { RsvpSubmission } from "@/services/rsvp/types";
import { eventDateLong, firstNames, eventTimeLabel } from "@/lib/wedding";

const { contact } = wedding;

/** "+91 98674 74339" → "919867474339" (the format wa.me expects). */
export const phoneDigits = (phone: string) => phone.replace(/\D/g, "");

export const telHref = `tel:+${phoneDigits(contact.phone)}`;

/** Opens a WhatsApp chat with the couple's number, optionally pre-written. */
export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${phoneDigits(contact.phone)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** The RSVP as a WhatsApp message the guest sends themselves — this is what actually reaches the couple. */
export function rsvpWhatsappMessage(v: RsvpSubmission) {
  const lines = [
    `Assalamu Alaikum! RSVP for ${firstNames}'s ${wedding.occasion} (${eventDateLong}, ${eventTimeLabel})`,
    "",
    `Name: ${v.name}`,
    `Phone: ${v.phone}`,
    v.attending === "yes" ? "Reply: Joyfully accepts" : "Reply: Regretfully declines",
  ];
  if (v.attending === "yes") {
    lines.push(`Guests: ${v.attendees} (including me)`);
    if (v.dietary) lines.push(`Dietary: ${v.dietary}`);
  }
  if (v.message) lines.push("", `Message: ${v.message}`);
  return lines.join("\n");
}
