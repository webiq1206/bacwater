import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "BACwater.ai: the complete BAC water calculator and reconstitution guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Load a Google font as TrueType data for satori. Requesting a text subset
 * (and using the default fetch user-agent) makes Google Fonts return a
 * truetype/opentype src, which is what next/og can embed.
 */
async function loadGoogleFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(
      text
    )}`;
    const css = await (await fetch(url)).text();
    const src = css.match(
      /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/
    );
    if (!src) return null;
    const res = await fetch(src[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

const TAGLINE = "The complete BAC water calculator & reconstitution guide";

export default async function OGImage() {
  // Match the header wordmark: "BACwater" in Cormorant Garamond (the site's
  // --font-serif), ".ai" and the tagline in Inter (the site's --font-inter).
  const [cormorant, inter] = await Promise.all([
    loadGoogleFont("Cormorant+Garamond", 500, "BACwater"),
    loadGoogleFont("Inter", 400, `${TAGLINE} .aiAI`),
  ]);

  const fonts = [
    cormorant && {
      name: "Cormorant Garamond",
      data: cormorant,
      weight: 500 as const,
      style: "normal" as const,
    },
    inter && {
      name: "Inter",
      data: inter,
      weight: 400 as const,
      style: "normal" as const,
    },
  ].filter(Boolean) as {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 500;
    style: "normal";
  }[];

  const serif = cormorant
    ? "Cormorant Garamond"
    : "Georgia, 'Times New Roman', serif";
  const sans = inter ? "Inter" : "'Helvetica Neue', Arial, sans-serif";

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
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span
            style={{
              fontFamily: serif,
              fontSize: "116px",
              fontWeight: 500,
              color: "#111111",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            BACwater
          </span>
          <span
            style={{
              fontFamily: sans,
              fontSize: "26px",
              fontWeight: 400,
              color: "#71717a",
              letterSpacing: "6px",
              textTransform: "uppercase" as const,
              lineHeight: 1,
              marginLeft: "12px",
            }}
          >
            .ai
          </span>
        </div>
        <div
          style={{
            marginTop: "30px",
            width: "120px",
            height: "2px",
            backgroundColor: "#2d6a4f",
          }}
        />
        <div
          style={{
            marginTop: "30px",
            fontFamily: sans,
            fontSize: "27px",
            color: "#555555",
            letterSpacing: "0.3px",
          }}
        >
          {TAGLINE}
        </div>
      </div>
    ),
    { ...size, ...(fonts.length ? { fonts } : {}) }
  );
}
