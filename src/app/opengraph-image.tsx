import { ImageResponse } from "next/og";
import { wedding } from "@/config/wedding";
import { eventDateLong } from "@/lib/wedding";

export const alt = wedding.seo.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card, generated at build time (no external fonts or assets). */
export default function OpenGraphImage() {
  const { couple, occasion, venue } = wedding;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at 50% 40%, #1b2a4a 0%, #111a2b 45%, #090b12 85%)",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 760,
            padding: "46px 40px",
            background: "linear-gradient(180deg, #efe0bf 0%, #e3cc9c 100%)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.6), inset 0 0 50px rgba(110,72,30,0.45)",
            border: "2px solid #c5a46a",
            color: "#2b1d10",
            position: "relative",
          }}
        >
          <div style={{ fontSize: 18, letterSpacing: 8, color: "#740d24", textTransform: "uppercase" }}>By Special Invitation</div>
          <div style={{ marginTop: 22, fontSize: 64, fontWeight: 700, letterSpacing: 2 }}>{couple.groom.fullName.toUpperCase()}</div>
          <div style={{ fontSize: 48, fontStyle: "italic", color: "#740d24", lineHeight: 1 }}>&amp;</div>
          <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: 2 }}>{couple.bride.fullName.toUpperCase()}</div>
          <div style={{ marginTop: 22, display: "flex", fontSize: 26, letterSpacing: 6 }}>{eventDateLong.toUpperCase()}</div>
          <div style={{ marginTop: 8, fontSize: 22, letterSpacing: 12, color: "#740d24" }}>{occasion.toUpperCase()}</div>
          <div style={{ marginTop: 16, fontSize: 18, fontStyle: "italic", color: "#5a4128" }}>{`${venue.name} · ${wedding.locationLine}`}</div>
          <div
            style={{
              position: "absolute",
              top: -46,
              width: 92,
              height: 92,
              borderRadius: 46,
              background: "radial-gradient(circle at 38% 32%, #b02647, #7d0f29 50%, #3c0512)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#e3c992",
              fontSize: 34,
              fontWeight: 700,
              boxShadow: "0 6px 14px rgba(0,0,0,0.5)",
            }}
          >
            {`${couple.monogram[0]}&${couple.monogram[1]}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
