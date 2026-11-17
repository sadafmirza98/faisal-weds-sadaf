# The Wizarding Walima — Faisal Khan & Sadaf Mirza

A cinematic, wizarding-world-inspired invitation for the **Walima of Faisal Khan & Sadaf Mirza — 20 December 2026, The Grand FM Mini Banquet, Jogeshwari West, Mumbai.**

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion, Leaflet + OpenStreetMap, React Hook Form and Zod. Frontend only — no backend, database or account is required.

---

## The experience

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Opening invitation** | Envelope materialises in the dark → wax seal cracks → flap lifts → letter slides out → a deckle-edged tri-fold parchment physically unfolds (3D hinged panels) → the Bismillah and the invitation appear in ink → “Enter the magical world” dissolves it into golden dust. Skip button, `Esc` to skip, reduced-motion path. The F & S seal in the navigation reopens the letter. |
| 2 | **The Great Hall** | Original one-point-perspective hall, enchanted starry ceiling, floating candles with parallax, names as the focal point, wand scroll rune. |
| 3 | **A verse** | Surah Ar-Rum 30:21 in Arabic with its meaning. |
| 4 | **Our Magical Story** | An enchanted book: I · The Nikah and II · The Reception (19 December, linking to the Nikah/Reception invitation site), III · The Walima, IV · Forever, Insha’Allah. Page turns, moving portrait, chapter timeline (tabs, arrows, swipe). |
| 5 | **Platform 9¾** | Lamplit station, original crimson locomotive steaming in on scroll, keepsake ticket. |
| 6 | **The Walima** | Deckle-edged parchment with venue, address, date and time (7:00 pm IST), Google Maps and calendar links (.ics + Google Calendar). A dress-code row appears only if one is configured. |
| 7 | **The Enchanted Clock** | Live countdown to 20 December 2026, 7:00 pm Asia/Kolkata, animated digits, clock hands, “The magic begins.” at zero. |
| 8 | **The Marauder’s Map** | “I solemnly swear…” reveals a real Leaflet/OSM map on parchment: ink-drop venue marker, owl’s-flight trail with footprints, venue panel, Google Maps + directions. Touch devices get a tap-to-explore gate so the page still scrolls. |
| 9 | **Reply by Owl (RSVP)** | A folded, deckle-edged response letter with hand-drawn lines (name, phone, attendance, party size, dietary, message) and validation; an owl flies off with the reply. |
| 10 | **Closing** | Night sky, castle, candles, a note asking for duas, return to the Great Hall, replay the invitation. |

**Secrets:** catch the golden snitch that occasionally flies past (or the one resting in the closing section); press the wax seal in the Great Hall; type `lumos` anywhere (or tap the **Lumos** button); the map blooms ink where you click. Nothing essential depends on them.

**Wand cursor:** on desktop the wand cursor and its golden sparkle trail are used across the whole site (text fields keep a text cursor).

**Sound** is OFF by default. The speaker button enables a gentle ambience, chimes and paper sounds — all synthesised live with the Web Audio API (no audio files, no licences, no streaming service).

---

## Getting started

Requires Node.js ≥ 20.9 (22 LTS recommended).

```bash
npm install
npm run dev          # http://localhost:3000
```

Append `?open=1` to the URL to skip the opening invitation while developing. A guest who has already opened the invitation skips it automatically for the rest of that browser tab session; “Open the letter again” in the closing section replays it.

### Quality checks and production build

```bash
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run build        # production build
npm start            # serve the production build
npm run check        # all three in sequence
```

---

## Deploying

### Vercel

1. Push the repository to GitHub.
2. In Vercel → **Add New Project** → import the repo. Framework preset: **Next.js** (auto-detected). No build settings to change.
3. (Optional) add environment variables from `.env.example`.
4. Deploy. Canonical/Open Graph URLs use the Vercel production URL automatically.

### Netlify

1. Push to GitHub → Netlify → **Add new site → Import an existing project**.
2. Netlify detects Next.js and applies its official adapter; `netlify.toml` already sets `npm run build` and Node 22.
3. (Optional) add environment variables.
4. Deploy. The Netlify site URL is used for metadata automatically.

### Environment variables (all optional)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Custom domain for canonical and link-preview URLs. |
| `NEXT_PUBLIC_RSVP_ENDPOINT` | A real RSVP backend. When set, replies are POSTed as JSON there instead of the local demo store. |

`NEXT_PUBLIC_*` values are embedded in the browser bundle — never put a secret in them.

---

## Updating wedding details

**Everything lives in [`src/config/wedding.ts`](src/config/wedding.ts).** No component hard-codes names, dates or the venue. Values marked `✎` are placeholders or still to be confirmed.

| Field | Notes |
|-------|-------|
| `couple.groom` / `couple.bride` | The groom (Faisal Khan) is always rendered first. |
| `event.date` | `"2026-12-20"` |
| `event.time` | `"19:00"` (7:00 pm IST). Drives the countdown, the Walima card, the letter wording and calendar files. Set `null` to show “Time to be announced”. |
| `event.endTime` | Optional, e.g. `"23:00"`. |
| `event.dressCode` | `null` = no dress code (row hidden). Set `{ label, note? }` to show one. |
| `event.description` | Shown on the Walima document. |
| `venue.*` | Name, address lines, verified coordinates, Google Maps URL, orientation landmark. |
| `story.chapters` | Title, date line, text, illustration and an optional `link` — an external URL (opens in a new tab) or an in-page anchor such as `#walima`. |
| `bismillah`, `verse` | Arabic text with its translation (letter header and the verse interlude). |
| `rsvp.*` | Max party size, dietary options, optional `deadline`, `enabled`. |
| `seo.*` | Title, description, `allowIndexing` (false by default — a private invitation). |

### Venue coordinates

`venue.coordinates` is **19.1374952, 72.8458317**, verified as follows:

- It is the Google Maps place pin for the banquet (place id `0x3be7b631b5978847:0x9570c62616af2660`).
- An OpenStreetMap reverse geocode of that point resolves to S.V. Road, Jogeshwari West.
- Directory listings place E.E Heights / Jaffer Bhai's Delhi Darbar on S.V. Road, Jogeshwari West 400102.

OpenStreetMap itself has no record of the banquet, which is why the Google pin is the primary source. If you ever cannot verify a pin, set `coordinates: null`: the map then shows no marker and the buttons fall back to a Google Maps address search.

The map's dotted trail is a straight line from Jogeshwari Station (also verified via OpenStreetMap), labelled “as the owl flies”. It is not a street route, so guests should use the Google Maps directions button to navigate.

---

## Replacing images

The story illustrations live in `public/images/story/`. They are original paintings generated by `scripts/generate-art.mjs` (`npm run art`). To use a photograph for a chapter, put it in that folder and update `story.chapters[n].image` (`src` + a descriptive `alt`). Raster photos are optimised automatically by `next/image`.

---

## RSVP — demo storage and its limits

The RSVP UI talks to an `RsvpService` interface (`src/services/rsvp/`):

- **Default: `localStorageRsvpService` (demo).** Replies are saved in the guest's own browser `localStorage` under `fs-walima-rsvps`. This storage is **browser-specific, unencrypted, and cleared with site data. It is never sent to the couple or to any server.** The site says this plainly after every demo submission and never claims the reply was delivered.
- **Duplicate protection:** a submission is ignored while another one is in flight. Once a reply is sent, the session shows the confirmation instead of a fresh form, and **Update my reply** edits that same record rather than creating a new one.
- **Real backend:** set `NEXT_PUBLIC_RSVP_ENDPOINT`. `httpAdapter.ts` sends `POST <endpoint>` with JSON `{ name, phone, attending, attendees, dietary, message, id? }` and treats any 2xx response as success (optionally `{ id }`). Any backend works: your own API route, a serverless function, or a form service. Validate on the server as well, since client validation can be bypassed.

---

## Project structure

```
src/
  app/                 layout (fonts, metadata, gate script), page, icon, OG image, robots, error/404
  config/wedding.ts    ← the single source of wedding details
  types/wedding.ts     config types
  lib/                 wedding (derived names/dates/countdown target), time (timezone maths), maps, calendar, utils
  hooks/               useCountdown, useActiveSection
  services/rsvp/       RsvpService interface + localStorage and HTTP adapters
  sections/            one file per page section
  components/
    invitation/        OpeningSequence, Envelope layers, ParchmentLetter (tri-fold)
    magical/           original SVG/CSS artwork: wax seal, monogram, candles, castle, hall, owl, snitch, train, compass, particles…
    map/               MaraudersMap (Leaflet, client-only)
    rsvp/ events/ secrets/ sound/ layout/ ui/
public/
  images/story/        chapter illustrations
  textures/            procedural parchment grain, fibres, mottling
  illustrations/       wand cursor
scripts/generate-art.mjs
```

---

## Accessibility & motion

- Semantic landmarks, a skip link, labelled controls, and native `<dialog>` modals (focus trap, `Esc`, focus return).
- Keyboard: the opening sequence, story tabs (arrow keys, Home/End) and map (Leaflet keyboard controls) all work without a mouse.
- `prefers-reduced-motion`: the opening becomes a simple reveal, parallax and floating effects stop, and the flying snitch is replaced by the resting one.
- The countdown is announced at most once a minute to screen readers.
- Map, sound and secrets are enhancements: the venue, address and Google Maps links are always available as plain text.

---

## Notes

- This is an unofficial, fan-inspired personal invitation. All artwork is original (SVG and CSS), and no film stills, logos or extracted assets are used. The footer says it isn't affiliated with the franchise owners.
- Map tiles come from the OpenStreetMap community tile servers with attribution. They're fine for a personal site's traffic. For heavy traffic, switch to a commercial tile provider in `MaraudersMap.tsx`.
- Fonts (Cinzel, Cormorant Garamond, IM Fell English, Great Vibes, Inter) are self-hosted at build time by `next/font`.
