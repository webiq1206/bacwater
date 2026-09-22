export const dynamic = "force-static";
export function GET() {
  return Response.json({ release: "2026-09-21-content-and-verification", commit: process.env.BACWATER_BUILD_COMMIT || "unavailable" }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
