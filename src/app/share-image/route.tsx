import { ImageResponse } from "next/og";
import { searchSnippet } from "@/lib/seo/search-appearance";

export const runtime = "nodejs";
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") || "";
  const snippet = path.length <= 160 ? searchSnippet(path) : undefined;
  if (!snippet) return new Response("Image not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  const title = snippet.title.replace(/ \| BACwater\.ai$/, "");
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "56px 64px", background: "#f7f8f2", color: "#18382d", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <svg width="96" height="96" viewBox="0 0 48 48"><rect x="1" y="1" width="46" height="46" rx="14" fill="#18382d"/><path d="M24 9c-4 6-11 13-11 19a11 11 0 0 0 22 0c0-6-7-13-11-19Z" fill="#dfedb3"/><path d="M19 26h10M19 31h6" stroke="#18382d" strokeWidth="2.2" strokeLinecap="round"/></svg>
        <span style={{ fontSize: 36, fontWeight: 700 }}>BACwater.ai</span>
      </div>
      <div style={{ display: "flex", fontSize: title.length > 65 ? 56 : 66, fontWeight: 700, lineHeight: 1.12, letterSpacing: -2 }}>{title}</div>
      <div style={{ display: "flex", borderTop: "2px solid #c7d1bd", paddingTop: 24, fontSize: 25 }}>Calculation tools and reference guides</div>
    </div>,
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } },
  );
}
