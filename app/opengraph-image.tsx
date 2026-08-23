import { ImageResponse } from "next/og";

export const alt = "Sarokar — Nepal ko kaam, aba sajilo.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const peaksSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M8 37 L19 13 L26.5 29 L31 21 L40 37 Z" fill="none" stroke="#B3262D" stroke-width="3" stroke-linejoin="round"/><circle cx="34.5" cy="11" r="4" fill="#B3262D"/></svg>`;

const peaksUri = `data:image/svg+xml,${encodeURIComponent(peaksSvg)}`;

const latticeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><path d="M60 18l42 42-42 42-42-42z M44 44h32v32H44z" fill="none" stroke="#FFFFFF" stroke-width="2"/></svg>`;

const latticeUri = `data:image/svg+xml,${encodeURIComponent(latticeSvg)}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#B3262D",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 480,
            height: 480,
            display: "flex",
            opacity: 0.08,
            backgroundImage: `url("${latticeUri}")`,
            backgroundRepeat: "repeat",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 22,
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}
          >
            <img src={peaksUri} width={56} height={56} alt="" />
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            Sarokar
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Nepal ko kaam,
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              color: "#F5C518",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            aba sajilo.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              backgroundColor: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 999,
              padding: "14px 28px",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: "#4ADE80" }} />
            <div style={{ fontSize: 28, fontWeight: 600, color: "#FFFFFF" }}>sarokar.app</div>
          </div>
          <div style={{ fontSize: 26, color: "rgba(255,255,255,0.75)" }}>
            Your guide to everyday Nepal
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
