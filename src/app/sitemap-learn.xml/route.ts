import { prisma } from "@/lib/db";
import { urlsetXml, xmlResponse, type SitemapUrl } from "@/lib/seo/sitemap";
import { COMPARISONS } from "@/lib/comparisons/content";
import { getCatalog } from "@/lib/learn/catalog";
import { CONTENT_TYPES, TOPICS } from "@/lib/learn/taxonomy";

export const revalidate = 3600;

// Slugs that now 301-redirect elsewhere; keep them out of the sitemap.
const REDIRECTED = new Set(["bac-water-vs-sterile-water", "how-long-bac-water-lasts"]);

export async function GET() {
  const now = new Date();
  const guides = await prisma.contentBlock
    .findMany({
      where: { kind: { in: ["guide", "faq"] }, published: true },
      select: { slug: true, updatedAt: true },
    })
    .catch(() => [] as { slug: string; updatedAt: Date }[]);

  const guideUrls: SitemapUrl[] = guides
    .filter((g) => !REDIRECTED.has(g.slug))
    .map((g) => ({
      path: `/learn/${g.slug}`,
      lastModified: g.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const comparisonUrls: SitemapUrl[] = COMPARISONS.map((c) => ({
    path: `/learn/vs/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Single-dimension filter views that are indexable (>= 3 results). These are
  // the legitimate, non-duplicate landing pages the taxonomy creates.
  const catalog = await getCatalog().catch(() => []);
  const filterUrls: SitemapUrl[] = [];
  for (const c of CONTENT_TYPES) {
    const count = catalog.filter((e) => e.contentType === c.key).length;
    if (count >= 3)
      filterUrls.push({
        path: `/learn?type=${c.key}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.5,
      });
  }
  for (const t of TOPICS) {
    const count = catalog.filter((e) => e.topicTags.includes(t.key)).length;
    if (count >= 3)
      filterUrls.push({
        path: `/learn?topic=${t.key}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.5,
      });
  }

  return xmlResponse(
    urlsetXml([...comparisonUrls, ...guideUrls, ...filterUrls])
  );
}
