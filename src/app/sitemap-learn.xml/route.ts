import { prisma } from "@/lib/db";
import { urlsetXml, xmlResponse, type SitemapUrl } from "@/lib/seo/sitemap";
import { COMPARISONS } from "@/lib/comparisons/content";

export const revalidate = 3600;

// Slugs that now 301-redirect elsewhere; keep them out of the sitemap.
const REDIRECTED = new Set(["bac-water-vs-sterile-water"]);

export async function GET() {
  const now = new Date();
  const guides = await prisma.contentBlock
    .findMany({
      where: { kind: "guide", published: true },
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

  return xmlResponse(urlsetXml([...comparisonUrls, ...guideUrls]));
}
