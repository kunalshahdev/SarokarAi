import { ImageResponse } from "next/og";

export const alt = "K Cha Ta? — Nepal ko internet ma k chaldai cha?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const eyesSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g transform="rotate(-8 15 25)"><ellipse cx="15" cy="25" rx="8" ry="9.5" fill="#FFFFFF"/><circle cx="16" cy="27" r="4.2" fill="#1C1917"/><circle cx="14.4" cy="25.4" r="1.4" fill="#FFFFFF"/></g><g transform="rotate(8 33 25)"><ellipse cx="33" cy="25" rx="8" ry="9.5" fill="#FFFFFF"/><circle cx="32" cy="27" r="4.2" fill="#1C1917"/><circle cx="30.4" cy="25.4" r="1.4" fill="#FFFFFF"/></g></svg>`;

const eyesUri = `data:image/svg+xml,${encodeURIComponent(eyesSvg)}`;

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
          backgroundColor: "#FFFBF0",
          padding: 72,
          position: "relative",
        }}
      >
        {/* Warm corner glow */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 560,
            height: 560,
            borderRadius: 999,
            backgroundColor: "#F59E0B",
            opacity: 0.12,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -140,
            width: 520,
            height: 520,
            borderRadius: 999,
            backgroundColor: "#EA580C",
            opacity: 0.08,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 20,
              backgroundColor: "#F59E0B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(245,158,11,0.35)",
            }}
          >
            <img src={eyesUri} width={52} height={52} alt="" />
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: "#78350F",
              letterSpacing: "-0.01em",
            }}
          >
            by Sarokar
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
          <div
            style={{
              fontSize: 130,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              backgroundImage:
                "linear-gradient(to right, #D97706, #EA580C, #DC2626)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            K Cha Ta?
          </div>
          <div
            style={{
              fontSize: 38,
              color: "#57534E",
              fontWeight: 500,
            }}
          >
            Nepal ko internet ma k chaldai cha?
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
          {["Trends", "Rumor check", "Explain"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                alignItems: "center",
                border: "2px solid #FDE68A",
                backgroundColor: "#FEF3C7",
                color: "#92400E",
                borderRadius: 14,
                padding: "10px 22px",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {tag}
            </div>
          ))}
          <div style={{ fontSize: 24, color: "#A8A29E", marginLeft: 4 }}>sarokar.app/k-cha-ta</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
