import { STATIC_PAGES, SITE_URL } from "@/lib/seo/sitemap";
import { getCatalog } from "@/lib/learn/catalog";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const catalog = await getCatalog(true);
    const entries = new Map(catalog.map((e) => [e.url, { title: e.title, description: e.excerpt }]));
    for (const page of STATIC_PAGES) if (!entries.has(page.path || "/")) entries.set(page.path || "/", { title: page.path ? page.path.split("/").filter(Boolean).join(" / ").replaceAll("-", " ") : "BACwater.ai", description: "Public information or calculation tool." });
    const clean = (s: string) => s.replace(/[\r\n\[\]<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 200);
    const body = "# BACwater.ai\n\n> Free concentration and measurement tools using deterministic arithmetic. This site does not sell products, select a dose, establish compatibility, or validate a storage period.\n\nEnter verified values from the applicable product instructions. Research examples are not instructions for human use. Private accounts, saved-plan identifiers, notes, drafts, and administrative routes are excluded from this guide.\n\n## Public tools and reference pages\n\n" + [...entries].map(([url, e]) => `- [${clean(e.title)}](${SITE_URL}${url}): ${clean(e.description)}`).join("\n") + "\n\n## Limits\n\nThis file is an optional discovery guide, not an indexing guarantee or access-control mechanism. Storage and medical decisions require product-specific instructions and qualified review.\n";
    return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, must-revalidate" } });
  } catch { return new Response("Public reference guide temporarily unavailable", { status: 503, headers: { "Retry-After": "300", "Cache-Control": "no-store" } }); }
}
