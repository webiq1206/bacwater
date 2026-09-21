import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { flushIndexNow } from "@/lib/seo/indexnow";
export function revalidatePublication(slugs: Array<string | undefined> = []) {
  // At this inventory size a full layout invalidation also purges related-reading
  // excerpts that could otherwise keep an unpublished article in a cached page.
  revalidatePath("/", "layout");
  for (const slug of new Set(slugs)) if (slug) revalidatePath(`/learn/${slug}`);
}
export function publishDiscoveryChange(paths: string[]) {
  revalidatePublication(paths.filter(p => p.startsWith("/learn/")).map(p => p.slice(7)));
  after(async () => {
    try { await flushIndexNow(); } catch { console.error("Publication notification drain failed; pending events remain in the outbox."); }
  });
}
