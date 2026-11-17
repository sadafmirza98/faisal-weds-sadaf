import { createHttpRsvpService } from "@/services/rsvp/httpAdapter";
import { localStorageRsvpService } from "@/services/rsvp/localStorageAdapter";
import type { RsvpService } from "@/services/rsvp/types";

export * from "@/services/rsvp/types";

const endpoint = process.env.NEXT_PUBLIC_RSVP_ENDPOINT?.trim();

/** The active RSVP service: a real backend when configured, else the local demo. */
export const rsvpService: RsvpService = endpoint ? createHttpRsvpService(endpoint) : localStorageRsvpService;
