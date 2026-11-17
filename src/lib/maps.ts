import { wedding } from "@/config/wedding";
import type { LatLng } from "@/types/wedding";

const { venue } = wedding;

/** Opens the venue in Google Maps — the verified place link, or a name + address search. */
export const googleMapsUrl =
  venue.googleMapsUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name}, ${venue.fullAddress}`)}`;

/** Turn-by-turn directions from the guest's current location. */
export const googleDirectionsUrl = venue.coordinates
  ? `https://www.google.com/maps/dir/?api=1&destination=${venue.coordinates.lat},${venue.coordinates.lng}&travelmode=driving`
  : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${venue.name}, ${venue.fullAddress}`)}`;

/** Great-circle distance in metres. */
export function distanceMetres(a: LatLng, b: LatLng) {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** "≈ 400 m" / "≈ 1.2 km" */
export function formatDistance(m: number) {
  return m < 1000 ? `≈ ${Math.round(m / 50) * 50} m` : `≈ ${(m / 1000).toFixed(1)} km`;
}
