import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-font";

export const runtime = "edge";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Favicon rendered as the header wordmark's initial "B" in Montserrat (the
 * site's brand voice). Generated with next/og so the real font is embedded,
 * since SVG favicons cannot load a webfont. Charcoal mark on a bone tile.
 * Falls back to a system sans if the font fetch fails.
 */
export default async function Icon() {
  const montserrat = await loadGoogleFont("Montserrat", 600, "B");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7f5f3",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            fontFamily: montserrat
              ? "Montserrat"
              : "'Helvetica Neue', Arial, sans-serif",
            fontSize: "44px",
            fontWeight: 600,
            color: "#2c302f",
            lineHeight: 1,
          }}
        >
          B
        </div>
      </div>
    ),
    {
      ...size,
      ...(montserrat
        ? {
            fonts: [
              {
                name: "Montserrat",
                data: montserrat,
                weight: 600 as const,
                style: "normal" as const,
              },
            ],
          }
        : {}),
    }
  );
}
