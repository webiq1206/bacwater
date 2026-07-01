import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "BACwater.ai";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "72px",
              fontWeight: 600,
              color: "#111111",
              letterSpacing: "-1px",
              lineHeight: 1,
            }}
          >
            BACwater
          </span>
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "18px",
              color: "#888888",
              letterSpacing: "4px",
              textTransform: "uppercase" as const,
              lineHeight: 1,
            }}
          >
            .ai
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: "22px",
            color: "#666666",
            letterSpacing: "0.5px",
          }}
        >
          The complete BAC water calculator &amp; reconstitution guide
        </div>
      </div>
    ),
    { ...size }
  );
}
