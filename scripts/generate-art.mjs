#!/usr/bin/env node
/**
 * Generates the story-book plates in public/images/story: one gold-foil
 * emblem per chapter, on deep navy and wine velvet inside an ornate gold
 * frame, like the stamped plates of a wedding card. Every plate is drawn
 * procedurally (original artwork; no stock, film stills or extracted assets).
 *
 * The emblem sits in the middle band (y 330–670 of 1000) so it survives the
 * 2:1 crop used on phones.
 *
 *   npm run art
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "story");
mkdirSync(OUT, { recursive: true });

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Math.round(n * 10) / 10;

const W = 800;
const H = 1000;
const CX = 400;
const CY = 500;

const DEFS = `
  <radialGradient id="velvet" cx="50%" cy="46%" r="70%">
    <stop offset="0" stop-color="#1e2a4a"/><stop offset="0.6" stop-color="#111a30"/><stop offset="1" stop-color="#080b15"/>
  </radialGradient>
  <radialGradient id="wine" cx="50%" cy="100%" r="70%">
    <stop offset="0" stop-color="#5a0b1e" stop-opacity="0.55"/><stop offset="1" stop-color="#5a0b1e" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="halo"><stop offset="0" stop-color="#ffe9b0" stop-opacity="0.42"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></radialGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fbeec4"/><stop offset="0.35" stop-color="#e2c27e"/><stop offset="0.65" stop-color="#b38a4a"/><stop offset="1" stop-color="#f3dea6"/>
  </linearGradient>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="n"/>
    <feColorMatrix in="n" values="0 0 0 0 0.9  0 0 0 0 0.8  0 0 0 0 0.6  0 0 0 0.06 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>`;

const SPARK = "M0 -1C0.12 -0.3 0.3 -0.12 1 0C0.3 0.12 0.12 0.3 0 1C-0.12 0.3 -0.3 0.12 -1 0C-0.3 -0.12 -0.12 -0.3 0 -1Z";
const spark = (x, y, s, o = 1) => `<path d="${SPARK}" transform="translate(${f(x)} ${f(y)}) scale(${f(s)})" fill="#fff3cf" opacity="${f(o)}"/>`;

function stars(n, seed) {
  const r = rng(seed);
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = 70 + r() * (W - 140);
    const y = 70 + r() * (H - 140);
    s += r() < 0.12 ? spark(x, y, 4 + r() * 5, 0.5 + r() * 0.4) : `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.6 + r() * 1.2)}" fill="#efe3c4" opacity="${f(0.25 + r() * 0.5)}"/>`;
  }
  return s;
}

/** An ornate gold double frame with flourished corners and a crest at top and bottom. */
function frame() {
  const corner = (x, y, sx, sy) =>
    `<g transform="translate(${x} ${y}) scale(${sx} ${sy})" fill="none" stroke="url(#gold)" stroke-width="2.4" stroke-linecap="round">
      <path d="M0 64 C0 26 26 0 64 0"/>
      <path d="M18 92 C14 50 40 18 92 18" stroke-width="1.4"/>
      <path d="M64 0 C80 0 92 10 92 24 C92 36 80 40 74 32 C70 26 76 18 84 22"/>
      <path d="M0 64 C0 80 10 92 24 92 C36 92 40 80 32 74 C26 70 18 76 22 84"/>
      <path d="M30 30 l8 -8 l8 8 l-8 8 z" fill="url(#gold)" stroke="none"/>
    </g>`;
  const crest = (y, flip) =>
    `<g transform="translate(${CX} ${y}) scale(1 ${flip ? -1 : 1})" fill="none" stroke="url(#gold)" stroke-width="2" stroke-linecap="round">
      <path d="M-90 0 C-60 0 -40 -16 -18 -16 C-8 -16 0 -8 0 0 C0 -8 8 -16 18 -16 C40 -16 60 0 90 0"/>
      <path d="M0 -10 l7 7 l-7 7 l-7 -7 z" fill="url(#gold)" stroke="none"/>
    </g>`;
  return `
    <rect x="30" y="30" width="${W - 60}" height="${H - 60}" fill="none" stroke="url(#gold)" stroke-width="3.2"/>
    <rect x="44" y="44" width="${W - 88}" height="${H - 88}" fill="none" stroke="url(#gold)" stroke-width="1.2" opacity="0.8"/>
    ${corner(44, 44, 1, 1)}${corner(W - 44, 44, -1, 1)}${corner(44, H - 44, 1, -1)}${corner(W - 44, H - 44, -1, -1)}
    ${crest(66, false)}${crest(H - 66, true)}`;
}

function plate(emblem, seed) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>${DEFS}</defs>
<rect width="${W}" height="${H}" fill="url(#velvet)"/>
<rect width="${W}" height="${H}" fill="url(#wine)"/>
${stars(70, seed)}
<circle cx="${CX}" cy="${CY}" r="230" fill="url(#halo)"/>
${frame()}
<g filter="url(#glow)" opacity="0.55">${emblem}</g>
${emblem}
<rect width="${W}" height="${H}" fill="#fff" filter="url(#grain)" opacity="0.8"/>
</svg>
`;
}

/** Points along a heart outline centred on cx, cy. */
function heartPoints(cx, cy, scale, n) {
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return [cx + x * scale, cy - y * scale];
  });
}

// Solid gold for line work: a gradient stroke vanishes on a perfectly straight line (zero-width box).
const GOLD_LINE = `fill="none" stroke="#e2c27e" stroke-linecap="round" stroke-linejoin="round"`;

const art = {
  /** I · The Nikah: the Nikahnama — an unrolled marriage scroll with a quill and wax seal, beneath a crescent and star. */
  "nikah.svg": () => {
    const roll = (y) =>
      `<rect x="292" y="${y - 13}" width="216" height="26" rx="13" fill="url(#gold)"/><ellipse cx="292" cy="${y}" rx="8" ry="13" fill="#b38a4a"/><ellipse cx="508" cy="${y}" rx="8" ry="13" fill="#e2c27e"/>`;
    let writing = "";
    const r = rng(7);
    for (let k = 0; k < 6; k++) {
      const y = 456 + k * 20;
      const w = k === 5 ? 70 : 120 + r() * 40;
      writing += `<path d="M322 ${y} h${f(w)}" fill="none" stroke="#8a6a32" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" opacity="0.75" stroke-dasharray="${f(10 + r() * 14)} 5 ${f(18 + r() * 10)} 4"/>`;
    }
    const scroll = `
      <path d="M304 420 H496 V600 H304 Z" fill="#f3e6c4" stroke="url(#gold)" stroke-width="3"/>
      <path d="M316 432 H484 V588 H316 Z" fill="none" stroke="#b38a4a" stroke-width="1.2" opacity="0.7"/>
      <path d="M352 442 C372 434 428 434 448 442" fill="none" stroke="#8e1430" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"/>
      ${writing}
      <path d="M326 574 c14 -14 24 4 36 -6 c10 -8 18 6 30 -2" fill="none" stroke="#3b2a14" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"/>
      ${roll(420)}${roll(600)}
      <g transform="translate(466 566)"><circle r="17" fill="#8e1430"/><circle r="11" fill="none" stroke="#c2384f" stroke-width="2"/><path d="M-4 -5 l8 10 M4 -5 l-8 10" stroke="#e9b2bd" stroke-width="1.6" stroke-linecap="round"/></g>`;
    const quill = `
      <path d="M560 360 C520 384 482 452 452 556 C470 470 500 410 560 360 Z" fill="#f6ead0" stroke="url(#gold)" stroke-width="2.4"/>
      <path d="M560 360 C512 420 478 488 452 556" ${GOLD_LINE} stroke-width="2"/>
      <path d="M452 556 l-8 22 l14 -16 z" fill="url(#gold)"/>`;
    const crescent = `<path d="M${CX - 6} 336 a34 34 0 1 0 36 40 a27 27 0 1 1 -36 -40 Z" fill="url(#gold)"/>`;
    return plate(`${scroll}${quill}${crescent}${spark(CX + 42, 344, 11)}${spark(232, 460, 8, 0.85)}${spark(580, 620, 9, 0.85)}${spark(226, 640, 6, 0.7)}`, 11);
  },

  /** II · The Reception: a castle with glowing windows and floating lanterns. */
  "reception.svg": () => {
    const towers = [
      { x: 286, w: 36, top: 520 },
      { x: 334, w: 44, top: 470 },
      { x: 400, w: 56, top: 408 },
      { x: 466, w: 44, top: 470 },
      { x: 514, w: 36, top: 520 },
    ];
    let castle = `<path d="M250 640 H550" ${GOLD_LINE} stroke-width="4"/><path d="M262 640 V585 H538 V640" ${GOLD_LINE} stroke-width="3"/>`;
    for (let i = 262; i < 538; i += 22) castle += `<path d="M${i} 585 v-10 h11 v10" ${GOLD_LINE} stroke-width="2.4"/>`;
    for (const t of towers) {
      const l = t.x - t.w / 2;
      const r = t.x + t.w / 2;
      castle += `<path d="M${l} 585 V${t.top} H${r} V585" fill="#111a30" stroke="url(#gold)" stroke-width="3" stroke-linejoin="round"/>`;
      castle += `<path d="M${l - 6} ${t.top} L${t.x} ${t.top - t.w * 1.5} L${r + 6} ${t.top} Z" fill="url(#gold)"/>`;
      castle += `<path d="M${t.x} ${t.top - t.w * 1.5} V${t.top - t.w * 1.5 - 18}" ${GOLD_LINE} stroke-width="2"/><path d="M${t.x} ${t.top - t.w * 1.5 - 18} l14 5 l-14 5" fill="url(#gold)"/>`;
      for (let y = t.top + 18; y < 570; y += 30) castle += `<rect x="${t.x - 5}" y="${y}" width="10" height="15" rx="5" fill="#ffe7a6"/>`;
    }
    castle += `<path d="M386 640 V612 a14 14 0 0 1 28 0 V640" fill="#ffe7a6"/>`;
    const lantern = (x, y, s) =>
      `<g transform="translate(${x} ${y}) scale(${s})"><circle r="26" fill="#ffe2a0" opacity="0.35" filter="url(#glow)"/><path d="M-10 -14 h20 l4 8 v16 l-4 8 h-20 l-4 -8 v-16 z" fill="#ffd98a" stroke="url(#gold)" stroke-width="2"/><path d="M-6 -14 v-5 h12 v5" ${GOLD_LINE} stroke-width="2"/></g>`;
    return plate(`${castle}${lantern(300, 380, 1)}${lantern(512, 360, 1.15)}${lantern(232, 470, 0.8)}${lantern(580, 452, 0.85)}${spark(400, 350, 10)}${spark(600, 600, 7, 0.8)}${spark(200, 590, 7, 0.8)}`, 22);
  },

  /** III · The Walima: a gold domed feast platter, steaming, beneath floating candles. */
  "walima.svg": () => {
    const candle = (x, y) =>
      `<g transform="translate(${x} ${y})"><circle cy="-30" r="18" fill="#ffe2a0" opacity="0.45" filter="url(#glow)"/><rect x="-6" y="-14" width="12" height="44" rx="2" fill="#f3e6c4"/><path d="M0 -34 C6 -26 5 -18 0 -16 C-5 -18 -6 -26 0 -34 Z" fill="#ffd27a"/></g>`;
    const dish = `
      <path d="M262 600 C262 520 324 470 400 470 C476 470 538 520 538 600 Z" fill="#111a30" stroke="url(#gold)" stroke-width="5" stroke-linejoin="round"/>
      <path d="M292 590 C296 536 342 500 400 498" ${GOLD_LINE} stroke-width="2.6" opacity="0.7"/>
      <path d="M300 560 H500" ${GOLD_LINE} stroke-width="1.6" opacity="0.6" stroke-dasharray="3 7"/>
      <circle cx="400" cy="460" r="13" fill="url(#gold)"/><circle cx="400" cy="460" r="5" fill="#8e1430"/>
      <path d="M236 604 H564" ${GOLD_LINE} stroke-width="7"/>
      <path d="M270 612 C300 630 500 630 530 612" ${GOLD_LINE} stroke-width="4"/>
      <path d="M380 630 H420 L430 646 H370 Z" fill="url(#gold)"/>`;
    const steam = [-34, 0, 34]
      .map((dx, k) => `<path d="M${400 + dx} 440 c-14 -16 14 -26 0 -44 c-12 -16 10 -24 4 -38" ${GOLD_LINE} stroke-width="3" opacity="${0.75 - k * 0.1}"/>`)
      .join("");
    return plate(`${steam}${dish}${candle(270, 372)}${candle(400, 336)}${candle(530, 372)}${spark(214, 560, 8, 0.8)}${spark(588, 548, 9, 0.85)}${spark(470, 430, 7, 0.8)}`, 33);
  },

  /** IV · Forever: two crossed wands whose sparks meet in a heart. */
  "forever.svg": () => {
    const wand = (rot) =>
      `<g transform="translate(${CX} 650) rotate(${rot})"><path d="M-4 -230 L4 -230 L8 -40 L-8 -40 Z" fill="#6b4424" stroke="url(#gold)" stroke-width="2"/><path d="M-9 -40 h18 l3 12 l-3 12 l3 12 l-3 12 l-2 50 h-16 l-2 -50 l-3 -12 l3 -12 l-3 -12 z" fill="#4a2c16" stroke="url(#gold)" stroke-width="2"/><path d="M-10 -28 h20 M-10 -4 h20" ${GOLD_LINE} stroke-width="2"/><circle cy="-232" r="5" fill="#fff6dc"/></g>`;
    const r = rng(44);
    const heart = heartPoints(CX, 430, 6.2, 34)
      .map(([x, y], i) => (i % 4 === 0 ? spark(x, y, 7 + r() * 3) : `<circle cx="${f(x)}" cy="${f(y)}" r="${f(2.2 + r() * 2)}" fill="#ffe7a6"/>`))
      .join("");
    // trails of sparks from each wand tip up into the heart
    const tip = (rot) => [CX + Math.sin((rot * Math.PI) / 180) * 232, 650 - Math.cos((rot * Math.PI) / 180) * 232];
    let trails = "";
    for (const rot of [-26, 26]) {
      const [tx, ty] = tip(rot);
      for (let k = 1; k <= 6; k++) {
        const t = k / 7;
        trails += `<circle cx="${f(tx + (CX + (rot < 0 ? -50 : 50) - tx) * t)}" cy="${f(ty + (470 - ty) * t)}" r="${f(1.6 + t * 2)}" fill="#ffe7a6" opacity="${f(0.4 + t * 0.5)}"/>`;
      }
    }
    return plate(`${wand(-26)}${wand(26)}${trails}${heart}${spark(CX, 430, 14)}`, 55);
  },
};

for (const [name, draw] of Object.entries(art)) {
  writeFileSync(join(OUT, name), draw());
  console.log("✓", name);
}
