import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-font";

export const runtime = "edge";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Favicon rendered as the header wordmark's initial "B" in Cormorant Garamond
 * (the site's --font-serif). Generated with next/og so the real font is
 * embedded, since SVG favicons cannot load a webfont. Falls back to a system
 * serif if the font fetch fails.
 */
export default async function Icon() {
  const cormorant = await loadGoogleFont("Cormorant+Garamond", 600, "B");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            fontFamily: cormorant
              ? "Cormorant Garamond"
              : "Georgia, 'Times New Roman', serif",
            fontSize: "50px",
            fontWeight: 600,
            color: "#111111",
            lineHeight: 1,
          }}
        >
          B
        </div>
      </div>
    ),
    {
      ...size,
      ...(cormorant
        ? {
            fonts: [
              {
                name: "Cormorant Garamond",
                data: cormorant,
                weight: 600 as const,
                style: "normal" as const,
              },
            ],
          }
        : {}),
    }
  );
}
