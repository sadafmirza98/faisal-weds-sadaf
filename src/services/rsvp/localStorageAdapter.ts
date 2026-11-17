import { RsvpError, type RsvpRecord, type RsvpService } from "@/services/rsvp/types";

const STORAGE_KEY = "fs-walima-rsvps";

function read(): RsvpRecord[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `rsvp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * DEMO ADAPTER — stores replies in this browser's localStorage.
 * Browser-specific, unencrypted, cleared with site data, and never sent
 * anywhere. Suitable for previewing the flow, not for collecting real RSVPs.
 */
export const localStorageRsvpService: RsvpService = {
  mode: "local-demo",
  async submit(data, id) {
    // A short pause so the owl has time to take flight.
    await new Promise((r) => setTimeout(r, 900));
    try {
      const all = read();
      const now = new Date().toISOString();
      const existing = id ? all.findIndex((r) => r.id === id) : -1;
      let record: RsvpRecord;
      if (existing >= 0) {
        record = { ...all[existing], ...data, updatedAt: now };
        all[existing] = record;
      } else {
        record = { ...data, id: newId(), submittedAt: now };
        all.push(record);
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return { id: record.id, mode: "local-demo", savedAt: now };
    } catch {
      throw new RsvpError("Your browser blocked local storage, so the demo reply could not be saved.", "storage");
    }
  },
};
