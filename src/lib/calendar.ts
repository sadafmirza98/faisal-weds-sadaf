import { wedding } from "@/config/wedding";
import { eventEnd, eventStart, fullNames, hasEventTime } from "@/lib/wedding";
import { googleMapsUrl } from "@/lib/maps";
import { parseLocal, zonedTimeToUtc } from "@/lib/time";

const { event, venue, timeZone } = wedding;
const title = `${event.name} — ${fullNames}`;
const location = `${venue.name}, ${venue.fullAddress}`;
const details = [event.description, event.dressCode && `Dress code: ${event.dressCode.label}`, `Directions: ${googleMapsUrl}`]
  .filter(Boolean)
  .join("\n\n");

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function dateStamp(value: string, addDays = 0) {
  const p = parseLocal(value);
  return new Date(Date.UTC(p.year, p.month - 1, p.day + addDays)).toISOString().slice(0, 10).replace(/-/g, "");
}

/** Date-only events become all-day entries (end date exclusive, RFC 5545). */
function span() {
  if (!hasEventTime) return { allDay: true, start: dateStamp(event.date), end: dateStamp(event.date, 1) };
  const start = stamp(zonedTimeToUtc(eventStart, timeZone));
  // No end time configured → the entry is the start time only (no invented duration).
  const end = eventEnd ? stamp(zonedTimeToUtc(eventEnd, timeZone)) : start;
  return { allDay: false, start, end };
}

function escapeIcs(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

export function googleCalendarUrl() {
  const s = span();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${s.start}/${s.end}`,
    details,
    location,
    ctz: timeZone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcs() {
  const s = span();
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Faisal & Sadaf//Wizarding Walima//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}-${s.start}@faisal-weds-sadaf`,
    `DTSTAMP:${stamp(new Date())}`,
    s.allDay ? `DTSTART;VALUE=DATE:${s.start}` : `DTSTART:${s.start}`,
    s.allDay ? `DTEND;VALUE=DATE:${s.end}` : `DTEND:${s.end}`,
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(details)}`,
    `LOCATION:${escapeIcs(location)}`,
    `URL:${googleMapsUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.id}-faisal-sadaf.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
