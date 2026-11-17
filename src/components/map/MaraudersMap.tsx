"use client";

import "leaflet/dist/leaflet.css";
import type { LatLngTuple, Map as LeafletMap, Polyline } from "leaflet";
import { Hand, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { distanceMetres, formatDistance } from "@/lib/maps";
import { cn } from "@/lib/utils";

const { venue } = wedding;

const PIN_SVG = `
<svg viewBox="0 0 56 56" aria-hidden="true">
  <path d="M28 6c-8.3 0-15 6.5-15 14.6C13 31.5 28 48 28 48s15-16.5 15-27.4C43 12.5 36.3 6 28 6z" fill="#740d24" stroke="#2b1d10" stroke-width="1.4"/>
  <circle cx="28" cy="21" r="9.5" fill="#ead8b2" stroke="#2b1d10" stroke-width="1"/>
  <text x="24.2" y="25.5" text-anchor="middle" font-size="11" font-family="Cinzel, serif" font-weight="700" fill="#2b1d10">F</text>
  <text x="32.2" y="26.5" text-anchor="middle" font-size="13" font-family="'Great Vibes', cursive" fill="#740d24">S</text>
</svg>`;

/** A small boot-print, pointing "up" — rotated along the trail. */
const FOOT_SVG = (deg: number, left: boolean) => `
<svg viewBox="0 0 16 24" width="14" height="20" style="transform: rotate(${deg}deg) translateX(${left ? -5 : 5}px)" aria-hidden="true">
  <ellipse cx="8" cy="7" rx="5" ry="6.5" fill="#2b1d10" opacity="0.8"/>
  <ellipse cx="8" cy="18.5" rx="3.6" ry="4" fill="#2b1d10" opacity="0.8"/>
</svg>`;

interface MaraudersMapProps {
  /** Show the dotted owl's-flight trail and footprints from the landmark. */
  trail: boolean;
  className?: string;
}

/**
 * The real map underneath the magic: Leaflet + OpenStreetMap tiles with a
 * parchment treatment. The venue marker uses verified coordinates only; the
 * trail is an honest straight line ("as the owl flies"), never a fake route.
 */
export function MaraudersMap({ trail, className }: MaraudersMapProps) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const L = useRef<typeof import("leaflet") | null>(null);
  const trailLayers = useRef<(Polyline | import("leaflet").Marker)[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [touch, setTouch] = useState(false);
  const [exploring, setExploring] = useState(false);

  // Initialise Leaflet on the client only.
  useEffect(() => {
    const coords = venue.coordinates;
    if (!el.current || !coords) return;
    let cancelled = false;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setTouch(coarse);

    import("leaflet")
      .then((mod) => {
        if (cancelled || !el.current) return;
        const Leaf = mod.default ?? mod;
        L.current = Leaf;
        const m = Leaf.map(el.current, {
          center: [coords.lat, coords.lng],
          zoom: 17,
          minZoom: 12,
          maxZoom: 19,
          zoomControl: false,
          scrollWheelZoom: false,
          dragging: !coarse,
          touchZoom: !coarse,
          // Leaflet's tap handler is only needed for old mobile Safari.
          attributionControl: true,
        });
        Leaf.control.zoom({ position: "bottomright" }).addTo(m);
        Leaf.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        })
          .on("load", () => setStatus("ready"))
          .on("tileerror", () => setStatus((s) => (s === "loading" ? "error" : s)))
          .addTo(m);

        // Venue — appears as an ink drop.
        Leaf.marker([coords.lat, coords.lng], {
          icon: Leaf.divIcon({
            className: "",
            html: `<div class="venue-pin ink-drop"><span class="ring"></span><span class="ring r2"></span>${PIN_SVG}</div>`,
            iconSize: [56, 56],
            iconAnchor: [28, 48],
          }),
          keyboard: true,
          title: venue.name,
          alt: venue.name,
        })
          .addTo(m)
          .bindTooltip(venue.name, { permanent: true, direction: "top", offset: [0, -46], className: "map-label" });

        // Landmark for orientation.
        if (venue.landmark) {
          const lm = venue.landmark.coordinates;
          Leaf.marker([lm.lat, lm.lng], {
            icon: Leaf.divIcon({ className: "", html: `<div class="landmark-pin ink-drop"></div>`, iconSize: [18, 18], iconAnchor: [9, 9] }),
            title: venue.landmark.name,
            alt: venue.landmark.name,
          })
            .addTo(m)
            .bindTooltip(venue.landmark.shortName, { permanent: true, direction: "bottom", offset: [0, 10], className: "map-label" });
        }

        // Desktop: wheel-zoom only once the guest clicks into the map.
        m.on("click", () => m.scrollWheelZoom.enable());
        m.on("mouseout", () => m.scrollWheelZoom.disable());

        // Ink blooms wherever the map is touched.
        m.on("click", (e) => {
          const host = el.current;
          if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const ink = document.createElement("span");
          ink.className = "ink-splash pointer-events-none absolute z-[500] h-16 w-16 rounded-full";
          ink.style.left = `${e.containerPoint.x}px`;
          ink.style.top = `${e.containerPoint.y}px`;
          ink.style.background = "radial-gradient(circle, rgb(43 29 16 / 0.45), rgb(43 29 16 / 0.12) 45%, transparent 70%)";
          host.appendChild(ink);
          window.setTimeout(() => ink.remove(), 1700);
        });

        map.current = m;
        // Layout can settle after the reveal animation.
        window.setTimeout(() => m.invalidateSize(), 400);
      })
      .catch(() => setStatus("error"));

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Touch devices: interactions are opt-in so the page still scrolls.
  useEffect(() => {
    const m = map.current;
    if (!m || !touch) return;
    if (exploring) {
      m.dragging.enable();
      m.touchZoom.enable();
    } else {
      m.dragging.disable();
      m.touchZoom.disable();
    }
  }, [exploring, touch]);

  // Draw / clear the owl's-flight trail.
  useEffect(() => {
    const m = map.current;
    const Leaf = L.current;
    const coords = venue.coordinates;
    if (!m || !Leaf || !coords || !venue.landmark) return;
    trailLayers.current.forEach((l) => l.remove());
    trailLayers.current = [];
    if (!trail) {
      m.flyTo([coords.lat, coords.lng], 17, { duration: 1 });
      return;
    }
    const from = venue.landmark.coordinates;
    const a: LatLngTuple = [from.lat, from.lng];
    const b: LatLngTuple = [coords.lat, coords.lng];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const line = Leaf.polyline([a, b], {
      color: "#740d24",
      weight: 3,
      dashArray: "2 12",
      lineCap: "round",
      className: "trail-line",
      interactive: false,
    }).addTo(m);
    trailLayers.current.push(line);

    // Footprints along the line, alternating feet, appearing step by step.
    const pa = m.latLngToLayerPoint(a);
    const pb = m.latLngToLayerPoint(b);
    const bearing = (Math.atan2(pb.x - pa.x, -(pb.y - pa.y)) * 180) / Math.PI;
    const steps = 14;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const pos: LatLngTuple = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      const step = Leaf.marker(pos, {
        icon: Leaf.divIcon({
          className: "",
          html: `<div class="footprint" style="animation-delay:${reduced ? 0 : 0.6 + i * 0.16}s">${FOOT_SVG(bearing, i % 2 === 0)}</div>`,
          iconSize: [14, 20],
          iconAnchor: [7, 10],
        }),
        interactive: false,
        keyboard: false,
      }).addTo(m);
      trailLayers.current.push(step);
    }

    const metres = distanceMetres(from, coords);
    const mid: LatLngTuple = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const label = Leaf.marker(mid, { icon: Leaf.divIcon({ className: "", html: "", iconSize: [0, 0] }), interactive: false, keyboard: false })
      .addTo(m)
      .bindTooltip(`as the owl flies · ${formatDistance(metres)}`, { permanent: true, direction: "right", offset: [12, 0], className: "map-label" });
    trailLayers.current.push(label);

    // On large screens the venue panel floats over the left of the map — keep the trail clear of it.
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    m.flyToBounds(Leaf.latLngBounds([a, b]), {
      paddingTopLeft: wide ? [420, 80] : [50, 90],
      paddingBottomRight: wide ? [120, 60] : [50, 50],
      maxZoom: 17,
      duration: reduced ? 0 : 1.4,
    });
  }, [trail, status]);

  return (
    <div className={cn("marauder-map relative h-full w-full", className)}>
      <div ref={el} className="absolute inset-0" role="region" aria-label={`Interactive map of ${venue.area} showing ${venue.name}`} />

      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 z-[400] flex items-center justify-center gap-2 font-fell text-ink-soft italic" role="status">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> The ink is settling…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 z-[400] flex items-center justify-center p-6 text-center font-fell text-ink italic" role="alert">
          The map tiles could not be loaded. The venue address and Google Maps link below still work.
        </div>
      )}

      {touch && status !== "error" && (
        <button
          type="button"
          onClick={() => setExploring((v) => !v)}
          className={cn(
            "absolute z-[600] inline-flex items-center gap-2 rounded-full border border-ink/50 px-4 py-2.5 font-cinzel text-[0.66rem] font-bold tracking-[0.18em] uppercase shadow-lg",
            exploring ? "right-3 top-3 bg-ink text-parchment" : "bottom-10 left-1/2 -translate-x-1/2 bg-parchment/95 text-ink",
          )}
          aria-pressed={exploring}
        >
          <Hand className="h-4 w-4" aria-hidden /> {exploring ? "Done exploring" : "Tap to explore the map"}
        </button>
      )}
    </div>
  );
}
