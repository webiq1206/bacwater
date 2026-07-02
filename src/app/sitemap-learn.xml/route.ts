import { prisma } from "@/lib/db";
import { urlsetXml, xmlResponse } from "@/lib/seo/sitemap";

export const revalidate = 3600;

export async function GET() {
  const guides = await prisma.contentBlock
    .findMany({
      where: { kind: "guide", published: true },
      select: { slug: true, updatedAt: true },
    })
    .catch(() => [] as { slug: string; updatedAt: Date }[]);

  return xmlResponse(
    urlsetXml(
      guides.map((g) => ({
        path: `/learn/${g.slug}`,
        lastModified: g.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    )
  );
}
