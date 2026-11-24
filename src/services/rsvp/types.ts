/** An RSVP as submitted by a guest (validated by the form schema). */
export interface RsvpSubmission {
  name: string;
  attending: "yes" | "no";
  attendees: number;
  dietary: string;
  message: string;
}

export interface RsvpRecord extends RsvpSubmission {
  id: string;
  submittedAt: string;
  updatedAt?: string;
}

export interface RsvpReceipt {
  id: string;
  /**
   * "local-demo": saved only in this browser — NOT delivered to the couple.
   * "remote": accepted by the configured backend endpoint.
   */
  mode: "local-demo" | "remote";
  savedAt: string;
}

/** Swap implementations without touching the UI. */
export interface RsvpService {
  readonly mode: RsvpReceipt["mode"];
  /** Create, or update when `id` is given (same guest editing their reply). */
  submit(data: RsvpSubmission, id?: string): Promise<RsvpReceipt>;
}

export class RsvpError extends Error {
  constructor(message: string, readonly kind: "storage" | "network" | "server") {
    super(message);
    this.name = "RsvpError";
  }
}
