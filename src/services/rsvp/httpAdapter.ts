import { RsvpError, type RsvpService } from "@/services/rsvp/types";

/**
 * Generic JSON adapter for a real backend (your own API route, a serverless
 * function, a form service…). Enabled by NEXT_PUBLIC_RSVP_ENDPOINT.
 *
 * Contract: POST { ...submission, id? } → 2xx with optional JSON { id }.
 */
export function createHttpRsvpService(endpoint: string): RsvpService {
  return {
    mode: "remote",
    async submit(data, id) {
      let res: Response;
      try {
        res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...data, id }),
        });
      } catch {
        throw new RsvpError("We couldn’t reach the owlery. Please check your connection and try again.", "network");
      }
      if (!res.ok) throw new RsvpError(`The owlery returned an error (${res.status}). Please try again shortly.`, "server");
      let body: { id?: string } = {};
      try {
        body = await res.json();
      } catch {
        /* an empty 2xx body is fine */
      }
      return { id: body.id ?? id ?? "remote", mode: "remote", savedAt: new Date().toISOString() };
    },
  };
}
