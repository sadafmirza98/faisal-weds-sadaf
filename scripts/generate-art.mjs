#!/usr/bin/env node
/**
 * Generates the original story illustrations in public/images/story.
 * Every scene is drawn procedurally (no stock, film stills or extracted assets).
 * Re-run with:  npm run art
 * Swap any of them for a real photograph whenever you like — see README.
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

const DEFS = `
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
    <feColorMatrix in="n" values="0 0 0 0 0.9  0 0 0 0 0.8  0 0 0 0 0.6  0 0 0 0.07 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="soft"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="glow"><feGaussianBlur stdDeviation="6"/></filter>
  <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
    <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity="0.65"/>
  </radialGradient>
  <radialGradient id="candleGlow"><stop offset="0" stop-color="#ffe4a0" stop-opacity="0.75"/><stop offset="1" stop-color="#ffe4a0" stop-opacity="0"/></radialGradient>
  <linearGradient id="goldG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e3ae"/><stop offset="0.5" stop-color="#c5a46a"/><stop offset="1" stop-color="#7d5b2e"/></linearGradient>`;

function wrap(w, h, body, extraDefs = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>${DEFS}${extraDefs}</defs>
${body}
<rect width="${w}" height="${h}" fill="url(#vignette)"/>
<rect width="${w}" height="${h}" fill="#fff" filter="url(#grain)" opacity="0.9"/>
</svg>
`;
}

function stars(w, h, n, seed, maxY = 1) {
  const r = rng(seed);
  let s = "";
  for (let i = 0; i < n; i++) {
    const big = r() < 0.07;
    s += `<circle cx="${f(r() * w)}" cy="${f(r() * h * maxY)}" r="${f(big ? 1.6 + r() * 1.6 : 0.5 + r() * 1.1)}" fill="${big ? "#fff4d6" : "#dfe3ee"}" opacity="${f(0.35 + r() * 0.6)}"/>`;
  }
  return s;
}

function candle(x, y, s = 1) {
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})">
    <circle cx="0" cy="-12" r="38" fill="url(#candleGlow)"/>
    <path d="M0 -26 C5 -18 6 -12 0 -4 C-6 -12 -5 -18 0 -26Z" fill="#ffe7a3"/>
    <path d="M0 -20 C2.5 -15 3 -11 0 -7 C-3 -11 -2.5 -15 0 -20Z" fill="#fffbe8"/>
    <rect x="-7" y="-4" width="14" height="52" rx="3" fill="#efe2c4"/>
    <rect x="-7" y="-4" width="4" height="52" fill="#c9b48c" opacity="0.6"/>
  </g>`;
}

function castle(w, baseY, scale = 1, color = "#0a0f1b", seed = 4) {
  const r = rng(seed);
  const towers = [
    [0.08, 0.05, 0.3, 0.16], [0.16, 0.09, 0.22, 0], [0.27, 0.04, 0.42, 0.2], [0.33, 0.12, 0.3, 0],
    [0.47, 0.05, 0.58, 0.26], [0.53, 0.14, 0.4, 0.12], [0.69, 0.04, 0.48, 0.22], [0.75, 0.1, 0.26, 0], [0.87, 0.04, 0.34, 0.17],
  ];
  let s = `<g fill="${color}">`;
  let win = "";
  for (const [x, tw, th, roof] of towers) {
    const X = x * w, W = tw * w, H = th * w * 0.55 * scale;
    s += `<rect x="${f(X)}" y="${f(baseY - H)}" width="${f(W)}" height="${f(H + 4)}"/>`;
    if (roof) s += `<path d="M${f(X - 4)} ${f(baseY - H)} L${f(X + W / 2)} ${f(baseY - H - roof * w * 0.5 * scale)} L${f(X + W + 4)} ${f(baseY - H)}Z"/>`;
    else for (let k = 0; k < Math.floor(W / 14); k++) s += `<rect x="${f(X + k * 14 + 2)}" y="${f(baseY - H - 8)}" width="8" height="9"/>`;
    const cols = Math.max(1, Math.floor(W / 22));
    const rows = Math.floor(H / 30);
    for (let rr = 0; rr < rows; rr++) for (let c = 0; c < cols; c++) {
      if (r() < 0.78) continue;
      win += `<rect x="${f(X + ((c + 0.5) * W) / cols - 3)}" y="${f(baseY - H + 14 + rr * 30)}" width="6" height="10" rx="3" fill="#e8c98b" opacity="${f(0.55 + r() * 0.45)}"/>`;
    }
  }
  return s + "</g>" + win;
}

const art = {
  "great-hall.svg": () => {
    const W = 1200, H = 1500;
    let candles = "";
    const r = rng(12);
    for (let i = 0; i < 26; i++) {
      const d = r();
      candles += candle(80 + r() * 1040, 150 + r() * 620, 0.45 + d * 0.9);
    }
    return wrap(W, H, `
      <rect width="${W}" height="${H}" fill="#0b1220"/>
      <rect width="${W}" height="${H * 0.62}" fill="url(#sky)"/>
      ${stars(W, H, 260, 5, 0.6)}
      <path d="M0 260 L320 640 L320 1080 L0 1500Z" fill="#141c2e"/>
      <path d="M1200 260 L880 640 L880 1080 L1200 1500Z" fill="#141c2e"/>
      ${[[40, 150], [190, 255]].map(([a, b]) => `<path d="M${a} ${560 + a * 0.6} L${a} ${380 + a * 0.5} Q${(a + b) / 2} ${260 + a * 0.5} ${b} ${380 + b * 0.5} L${b} ${560 + b * 0.6}Z" fill="#c9a86a" opacity="0.55"/><path d="M${1200 - a} ${560 + a * 0.6} L${1200 - a} ${380 + a * 0.5} Q${1200 - (a + b) / 2} ${260 + a * 0.5} ${1200 - b} ${380 + b * 0.5} L${1200 - b} ${560 + b * 0.6}Z" fill="#c9a86a" opacity="0.55"/>`).join("")}
      <rect x="320" y="640" width="560" height="440" fill="#18213a"/>
      <circle cx="600" cy="780" r="90" fill="#e8c98b" opacity="0.35" filter="url(#soft)"/>
      <circle cx="600" cy="780" r="70" fill="none" stroke="#0b1220" stroke-width="6"/>
      <path d="M0 1500 L320 1080 L880 1080 L1200 1500Z" fill="#100d0c"/>
      ${[200, 480, 720, 1000].map((x) => `<path d="M${x - 70} 1500 L${600 + (x - 600) * 0.12 - 4} 1090 L${600 + (x - 600) * 0.12 + 4} 1090 L${x + 70} 1500Z" fill="#1e1610"/>`).join("")}
      ${candles}
      <rect width="${W}" height="${H}" fill="url(#warm)"/>`,
      `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22355e"/><stop offset="1" stop-color="#0b1220"/></linearGradient>
       <radialGradient id="warm" cx="50%" cy="70%" r="60%"><stop offset="0" stop-color="#e8c98b" stop-opacity="0.25"/><stop offset="1" stop-color="#e8c98b" stop-opacity="0"/></radialGradient>`);
  },

  "castle-night.svg": () => {
    const W = 1200, H = 800;
    return wrap(W, H, `
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      ${stars(W, H, 240, 31, 0.6)}
      <path d="M180 120 C190 90 230 80 250 100 C240 96 220 100 214 118 C210 130 196 132 180 120Z" fill="#f1e6c8" opacity="0.9"/>
      <ellipse cx="600" cy="520" rx="640" ry="200" fill="#e8c98b" opacity="0.08" filter="url(#soft)"/>
      ${castle(W, 520, 1.15, "#070a12", 7)}
      <path d="M0 520 C200 500 360 530 600 515 C820 500 1000 530 1200 520 L1200 560 L0 560Z" fill="#05070c"/>
      <rect y="560" width="${W}" height="240" fill="url(#lake)"/>
      <g opacity="0.35" transform="translate(0 1080) scale(1 -1)">${castle(W, 520, 1.15, "#0b1424", 7)}</g>
      ${Array.from({ length: 30 }, (_, i) => `<rect x="${f(rng(i + 3)() * 1200)}" y="${f(580 + rng(i + 9)() * 200)}" width="${f(20 + rng(i)() * 90)}" height="1.2" fill="#e8c98b" opacity="0.25"/>`).join("")}`,
      `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b16"/><stop offset="1" stop-color="#22324f"/></linearGradient>
       <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14203a"/><stop offset="1" stop-color="#05070c"/></linearGradient>`);
  },

  "lake.svg": () => {
    const W = 1200, H = 1600;
    return wrap(W, H, `
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      ${stars(W, H, 300, 64, 0.5)}
      <circle cx="840" cy="300" r="150" fill="#f1e6c8" opacity="0.15" filter="url(#soft)"/>
      <path d="M800 210 C860 190 940 240 930 320 C920 390 850 420 800 400 C850 380 880 330 868 280 C858 240 830 220 800 210Z" fill="#f6ecd2"/>
      ${castle(W, 840, 1.3, "#06080f", 13)}
      <rect y="840" width="${W}" height="760" fill="url(#water)"/>
      <rect x="805" y="860" width="90" height="640" fill="url(#beam)" filter="url(#glow)"/>
      ${Array.from({ length: 40 }, (_, i) => { const q = rng(i + 800); return `<rect x="${f(700 + q() * 300)}" y="${f(880 + q() * 650)}" width="${f(20 + q() * 120)}" height="1.6" fill="#f6ecd2" opacity="${f(0.1 + q() * 0.35)}"/>`; }).join("")}
      <path d="M0 1600 L0 1380 C140 1350 220 1420 300 1460 C380 1500 420 1560 460 1600Z" fill="#05070c"/>`,
      `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060a14"/><stop offset="0.52" stop-color="#1b2a48"/><stop offset="0.53" stop-color="#05070c"/></linearGradient>
       <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16233f"/><stop offset="1" stop-color="#04060b"/></linearGradient>
       <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6ecd2" stop-opacity="0.32"/><stop offset="1" stop-color="#f6ecd2" stop-opacity="0"/></linearGradient>`);
  },

  "wands.svg": () => {
    const W = 1000, H = 1250;
    const r = rng(303);
    let sparks = "";
    for (let i = 0; i < 120; i++) {
      const a = r() * Math.PI * 2;
      const d = 30 + r() * 360;
      sparks += `<circle cx="${f(500 + Math.cos(a) * d)}" cy="${f(470 + Math.sin(a) * d * 0.9)}" r="${f(0.8 + r() * 2.8)}" fill="${r() < 0.3 ? "#fff6d8" : "#e8c98b"}" opacity="${f(0.25 + r() * 0.7)}"/>`;
    }
    const wand = `<path d="M-6 0 L6 0 L10 520 L-10 520Z" fill="url(#wood)"/><path d="M-11 520 h22 l3 14 l-3 14 l3 14 l-3 14 l-2 120 h-20 l-2 -120 l-3 -14 l3 -14 l-3 -14z" fill="url(#wood)"/><path d="M-11 534 h22 M-11 562 h22" stroke="#c5a46a" stroke-width="2" opacity="0.8"/>`;
    return wrap(W, H, `
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <circle cx="500" cy="470" r="300" fill="#ffe9a8" opacity="0.2" filter="url(#soft)"/>
      <circle cx="500" cy="470" r="90" fill="#fff3cf" opacity="0.55" filter="url(#soft)"/>
      ${sparks}
      <g transform="translate(500 560) rotate(-32)"><g transform="translate(0 -330)">${wand}</g></g>
      <g transform="translate(500 560) rotate(32)"><g transform="translate(0 -330)">${wand}</g></g>
      <circle cx="${f(500 + Math.sin((32 * Math.PI) / 180) * 330)}" cy="${f(560 - Math.cos((32 * Math.PI) / 180) * 330)}" r="9" fill="#fffbe8"/><circle cx="${f(500 - Math.sin((32 * Math.PI) / 180) * 330)}" cy="${f(560 - Math.cos((32 * Math.PI) / 180) * 330)}" r="9" fill="#fffbe8"/>`,
      `<radialGradient id="bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#2a2a3a"/><stop offset="1" stop-color="#07080d"/></radialGradient>
       <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a2414"/><stop offset="0.5" stop-color="#8a5f36"/><stop offset="1" stop-color="#2c1a0e"/></linearGradient>`);
  },
};

for (const [name, draw] of Object.entries(art)) {
  writeFileSync(join(OUT, name), draw());
  console.log("✓", name);
}
