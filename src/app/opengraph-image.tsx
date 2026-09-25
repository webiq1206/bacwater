import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-font";

export const runtime = "nodejs";

export const alt =
  "BACwater.ai droplet logo beside a BAC water concentration calculator worksheet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEADLINE = "BAC water";
const ACCENT = "calculator.";
const FONT_TEXT = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:;/-÷";

export default async function OGImage() {
  const [montserratSemiBold, montserratRegular, serif] = await Promise.all([
    loadGoogleFont(
      "Montserrat",
      600,
      FONT_TEXT
    ),
    loadGoogleFont(
      "Montserrat",
      400,
      FONT_TEXT
    ),
    loadGoogleFont("Fraunces", 400, ACCENT),
  ]);

  const fonts = [
    montserratSemiBold && {
      name: "Montserrat",
      data: montserratSemiBold,
      weight: 600 as const,
      style: "normal" as const,
    },
    montserratRegular && {
      name: "Montserrat",
      data: montserratRegular,
      weight: 400 as const,
      style: "normal" as const,
    },
    serif && {
      name: "Fraunces",
      data: serif,
      weight: 400 as const,
      style: "normal" as const,
    },
  ].filter(Boolean) as {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 600;
    style: "normal";
  }[];

  const sans = montserratRegular || montserratSemiBold
    ? "Montserrat"
    : "sans-serif";
  const display = serif ? "Fraunces" : "serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f5f5ed",
          color: "#163d31",
          fontFamily: sans,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "760px",
            height: "760px",
            right: "-170px",
            top: "-270px",
            borderRadius: "50%",
            backgroundColor: "#e1edb8",
            opacity: 0.67,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "560px",
            height: "560px",
            right: "-5px",
            bottom: "-265px",
            borderRadius: "50%",
            border: "1px solid #aebd96",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "780px",
            height: "780px",
            right: "-100px",
            bottom: "-470px",
            borderRadius: "50%",
            border: "1px solid #c5d09e",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "52px 64px 50px 72px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", height: "52px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#163d31",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="27" height="31" viewBox="0 0 27 31" fill="none">
                <path d="M13.5 1.5C9 8.2 3 15.6 3 21.7a10.5 10.5 0 0 0 21 0c0-6.1-6.1-13.5-10.5-20.2Z" fill="#dfedb3" />
                <path d="M8.7 20h9.6M8.7 24.8h5.7" stroke="#163d31" strokeWidth="2.1" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", marginLeft: "13px" }}>
              <span style={{ fontFamily: sans, fontWeight: 600, fontSize: "31px", letterSpacing: "-1.5px" }}>bacwater</span>
              <span style={{ fontSize: "13px", marginLeft: "4px", color: "#58705c", letterSpacing: "-0.4px" }}>.ai</span>
            </div>
          </div>

          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ width: "620px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
                <div style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#708c49", marginRight: "13px" }} />
                <span style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "3px", color: "#294b3e" }}>YOUR NUMBERS. MADE CLEAR.</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", fontSize: "76px", lineHeight: 0.93, letterSpacing: "-4.5px", color: "#163d31" }}>
                <span style={{ fontWeight: 400 }}>{HEADLINE}</span>
                <span style={{ fontFamily: display, fontSize: "82px", letterSpacing: "-3px", color: "#526f45", marginTop: "8px" }}>{ACCENT}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", marginTop: "25px", fontSize: "21px", lineHeight: 1.4, color: "#536a5d", letterSpacing: "-0.3px" }}>
                A free peptide reconstitution calculator.<br />
                Check concentration, mL and U-100 units from your own numbers.
              </div>
            </div>

            <div
              style={{
                width: "350px",
                height: "292px",
                marginTop: "45px",
                borderRadius: "20px",
                backgroundColor: "#f9faf3",
                border: "1px solid #b9c7aa",
                boxShadow: "0 14px 0 #dce7b8",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div style={{ height: "55px", backgroundColor: "#163d31", padding: "0 20px", display: "flex", alignItems: "center" }}>
                <div style={{ width: "15px", height: "18px", border: "2px solid #dfedb3", borderRadius: "2px", marginRight: "10px", display: "flex", flexDirection: "column", justifyContent: "space-around", padding: "3px" }}>
                  <div style={{ height: "2px", backgroundColor: "#dfedb3" }} />
                  <div style={{ height: "2px", backgroundColor: "#dfedb3" }} />
                  <div style={{ height: "2px", backgroundColor: "#dfedb3" }} />
                </div>
                <span style={{ color: "#f5f5ed", fontSize: "13px", fontWeight: 600, letterSpacing: "1.6px" }}>LIVE CALCULATOR</span>
                <div style={{ width: "7px", height: "7px", backgroundColor: "#dfedb3", borderRadius: "50%", marginLeft: "12px" }} />
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: "13px", color: "#637568", marginBottom: "8px" }}>
                  <span style={{ width: "50%", fontWeight: 600, color: "#294b3e" }}>Amount in vial</span>
                  <span>Final liquid volume</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ width: "50%", border: "1px solid #b6c2ae", borderRadius: "10px", padding: "12px", display: "flex", fontSize: "17px", color: "#476053" }}>
                    12 <span style={{ fontSize: "12px", marginLeft: "auto", marginTop: "5px" }}>mg</span>
                  </div>
                  <div style={{ width: "50%", border: "1px solid #b6c2ae", borderRadius: "10px", padding: "12px", display: "flex", fontSize: "17px", color: "#476053" }}>
                    4 <span style={{ fontSize: "12px", marginLeft: "auto", marginTop: "5px" }}>mL</span>
                  </div>
                </div>
                <div style={{ marginTop: "14px", borderRadius: "12px", backgroundColor: "#dfedb3", padding: "13px 15px", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "12px", color: "#536a42" }}>ARITHMETIC EXAMPLE</span>
                  <span style={{ fontSize: "23px", letterSpacing: "-0.7px", marginTop: "2px" }}>12 mg ÷ 4 mL = 3 mg/mL</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: "8px", color: "#597064" }}>
            <div style={{ width: "34px", height: "1px", backgroundColor: "#789063", marginRight: "12px" }} />
            <span style={{ fontSize: "16px", letterSpacing: "1px" }}>FREE TO USE · NO ACCOUNT NEEDED</span>
          </div>
        </div>
      </div>
    ),
    { ...size, ...(fonts.length ? { fonts } : {}) }
  );
}
