/**
 * Shape of the central wedding configuration (src/config/wedding.ts).
 * Every component reads wedding details from that object — never hardcode them.
 */

/** Local calendar date in the wedding timezone, e.g. "2026-12-20". */
export type LocalDate = `${number}-${number}-${number}`;

/** Local wall-clock date-time in the wedding timezone, e.g. "2026-12-20T19:00". */
export type LocalDateTime = `${number}-${number}-${number}T${number}:${number}`;

/** A date with or without a time. Date-only means "time to be announced". */
export type LocalMoment = LocalDate | LocalDateTime;

/** 24-hour wall-clock time, e.g. "19:30". */
export type WallTime = `${number}:${number}`;

export interface Person {
  firstName: string;
  fullName: string;
  /** Parents' line as on a wedding card, e.g. { relation: "Son of", parents: "Mrs. … & Mr. …" }. */
  family?: { relation: string; parents: string };
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface VerifiedCoordinates extends LatLng {
  /** How these coordinates were verified — kept so the next editor knows they are not guesses. */
  source: string;
}

export interface Venue {
  name: string;
  /** Neighbourhood, e.g. "Jogeshwari West" — used on the map and ticket. */
  area: string;
  /** Address split into the lines shown on invitations. */
  addressLines: string[];
  /** Single-line address used for maps, calendars and screen readers. */
  fullAddress: string;
  /**
   * Verified venue pin. Set to null if it cannot be verified — the map then
   * shows the address with a Google Maps search link instead of a marker.
   */
  coordinates: VerifiedCoordinates | null;
  /** Google Maps link to the venue. Leave empty to build a search link from name + address. */
  googleMapsUrl?: string;
  /**
   * Optional well-known nearby landmark (also verified). The map draws a straight
   * "as the owl flies" trail from it to the venue — never a fabricated street route.
   */
  landmark?: { name: string; shortName: string; coordinates: VerifiedCoordinates };
}

export interface DressCode {
  label: string;
  note?: string;
}

export interface CelebrationEvent {
  id: string;
  /** e.g. "Walima" */
  name: string;
  date: LocalDate;
  /** null until confirmed — the site shows `timeToBeAnnounced` and the countdown targets the start of the day. */
  time: WallTime | null;
  endTime: WallTime | null;
  description: string | null;
  /** null = no dress code; the row is hidden. */
  dressCode: DressCode | null;
}

export interface StoryChapter {
  id: string;
  numeral: string;
  title: string;
  /** Free text such as "19 December 2026"; null hides it. */
  period: string | null;
  body: string;
  /** Image for the moving portrait on the left page (path under /public). */
  image: { src: string; alt: string };
  /**
   * Optional call to action under the text: an external URL (opens in a new
   * tab) or an in-page section, written "#walima".
   */
  link?: { label: string; href: string };
}

/** A line of Arabic with its English meaning and an optional source. */
export interface ArabicLine {
  arabic: string;
  translation: string;
  cite?: string;
}

export interface RsvpSettings {
  enabled: boolean;
  /** Optional: the form closes after this moment (wedding timezone). */
  deadline: LocalDateTime | null;
  /** Maximum attendees per reply, including the guest. */
  maxAttendees: number;
  dietaryOptions: string[];
}

export interface NavItem {
  id: string;
  label: string;
}

export interface WeddingConfig {
  couple: {
    /** The groom is always named first. */
    groom: Person;
    bride: Person;
    monogram: [string, string];
  };
  occasion: string;
  timeZone: string;
  timeZoneLabel: string;
  locationLine: string;
  event: CelebrationEvent;
  venue: Venue;
  /** Number for guests' questions — shown with Call and WhatsApp links. Also receives WhatsApp RSVPs. */
  contact: { label: string; phone: string };
  /** Wedding hashtag, e.g. "#SaFal". */
  hashtag: string;
  /** Shown at the head of the invitation letter. */
  bismillah: ArabicLine;
  /** The Qur'anic verse shown after the Great Hall. */
  verse: ArabicLine;

  invitation: {
    received: string;
    unsealLabel: string;
    byInvitation: string;
    /** Leads into the names, e.g. "request the pleasure of your company at the Walima of". */
    invitedTo: string;
    blessing: string;
    enterLabel: string;
    envelopeAddressee: string;
  };
  hero: { eyebrow: string; tagline: string };
  story: { eyebrow: string; title: string; intro: string; chapters: StoryChapter[] };
  celebration: {
    eyebrow: string;
    title: string;
    timeToBeAnnounced: string;
  };
  express: { eyebrow: string; title: string; line: string; platform: string };
  countdown: { eyebrow: string; title: string; complete: string; completeMessage: string };
  map: {
    eyebrow: string;
    title: string;
    intro: string;
    oath: string;
    revealLabel: string;
    closeLabel: string;
    mapTitle: string;
  };
  rsvp: RsvpSettings & {
    eyebrow: string;
    title: string;
    intro: string;
    submitLabel: string;
    successMessage: string;
  };
  closing: {
    message: string;
    duas: string;
    signOff: string;
    /** Footer credit: "Developed by …". */
    developedBy: string;
  };
  /** Background music, played by a hidden YouTube player when sound is on. */
  music: { youtubeId: string };
  secrets: { hiddenMessage: string; spellHint: string };
  nav: NavItem[];
  seo: {
    siteUrl: string;
    title: string;
    description: string;
    ogImageAlt: string;
    allowIndexing: boolean;
  };
}
