import { getCatalog } from "@/lib/learn/catalog";
import { buildLlmsGuide } from "@/lib/seo/llms";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return new Response(buildLlmsGuide(await getCatalog(true)), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, must-revalidate" } });
  } catch {
    // A stale snapshot could expose a withdrawn or newly private article.
    return new Response("Public reference guide temporarily unavailable", { status: 503, headers: { "Retry-After": "300", "Cache-Control": "no-store" } });
  }
}
