import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-font";

export const runtime = "edge";

export const alt =
  "BACwater.ai: the complete BAC water calculator and reconstitution guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGLINE = "The complete BAC water calculator & reconstitution guide";

export default async function OGImage() {
  // Match the header wordmark: "BACwater" in Montserrat (the site's brand
  // voice), with ".ai" and the tagline in the same family. Brand palette:
  // bone ground, charcoal wordmark, sage accents.
  const [montserratBold, montserratRegular] = await Promise.all([
    loadGoogleFont("Montserrat", 600, "BACwater"),
    loadGoogleFont("Montserrat", 400, `${TAGLINE} .aiAI`),
  ]);

  const fonts = [
    montserratBold && {
      name: "Montserrat",
      data: montserratBold,
      weight: 600 as const,
      style: "normal" as const,
    },
    montserratRegular && {
      name: "Montserrat",
      data: montserratRegular,
      weight: 400 as const,
      style: "normal" as const,
    },
  ].filter(Boolean) as {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 600;
    style: "normal";
  }[];

  const sans = fonts.length ? "Montserrat" : "'Helvetica Neue', Arial, sans-serif";

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
          backgroundColor: "#f7f5f3",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span
            style={{
              fontFamily: sans,
              fontSize: "112px",
              fontWeight: 600,
              color: "#2c302f",
              letterSpacing: "-3px",
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
              color: "#9aa09b",
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
            backgroundColor: "#5d6561",
          }}
        />
        <div
          style={{
            marginTop: "30px",
            fontFamily: sans,
            fontSize: "27px",
            color: "#5d6561",
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
