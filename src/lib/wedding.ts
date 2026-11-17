import { wedding } from "@/config/wedding";
import type { LocalMoment } from "@/types/wedding";
import { formatFullDate, formatLongDate, formatTime, zonedTimeToUtc } from "@/lib/time";

/**
 * Derived wedding values. Components import these instead of re-computing
 * names, dates or the countdown target, so there is one source of truth.
 */

const { couple, event, timeZone } = wedding;

/** Groom first, always. */
export const fullNames = `${couple.groom.fullName} & ${couple.bride.fullName}`;
export const firstNames = `${couple.groom.firstName} & ${couple.bride.firstName}`;
export const monogram = `${couple.monogram[0]} & ${couple.monogram[1]}`;

/** "2026-12-20" or "2026-12-20T19:30" in the wedding timezone. */
export const eventStart: LocalMoment = event.time ? `${event.date}T${event.time}` : event.date;
export const eventEnd: LocalMoment | null = event.time && event.endTime ? `${event.date}T${event.endTime}` : null;
export const hasEventTime = event.time !== null;

/** "20 December 2026" */
export const eventDateLong = formatLongDate(event.date);
/** "Sunday, 20 December 2026" */
export const eventDateFull = formatFullDate(event.date);
/** "20 · XII · MMXXVI" style roman date for ornaments. */
export const eventDateRoman = (() => {
  const [y, m, d] = event.date.split("-").map(Number);
  return `${toRoman(d)} · ${toRoman(m)} · ${toRoman(y)}`;
})();

/** "7:30 pm IST", or the to-be-announced wording. */
export const eventTimeLabel = event.time
  ? `${formatTime(eventStart)}${eventEnd ? ` – ${formatTime(eventEnd)}` : ""} ${wedding.timeZoneLabel}`
  : wedding.celebration.timeToBeAnnounced;

const HOUR_WORDS = ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"];

/** "at seven o’clock in the evening" — formal invitation wording (empty when the time is unknown). */
export const eventTimeWords = (() => {
  if (!event.time) return "";
  const [h, m] = event.time.split(":").map(Number);
  const part = h < 12 ? "in the morning" : h < 17 ? "in the afternoon" : "in the evening";
  const clock = m === 0 ? `${HOUR_WORDS[h % 12]} o’clock` : formatTime(eventStart);
  return `at ${clock} ${part}`;
})();

/**
 * The single countdown target (ms since epoch). The event time when set,
 * otherwise the start of the day — both in Asia/Kolkata.
 */
export const countdownTargetMs = zonedTimeToUtc(eventStart, timeZone).getTime();

export const countdownTargetLabel = event.time
  ? `${eventDateLong}, ${formatTime(eventStart)} ${wedding.timeZoneLabel}`
  : `the start of ${eventDateLong} (${wedding.timeZoneLabel})`;

export function toRoman(n: number) {
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out;
}
