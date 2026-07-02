import { prisma } from "@/lib/db";
import { urlsetXml, xmlResponse } from "@/lib/seo/sitemap";

export const revalidate = 3600;

export async function GET() {
  const products = await prisma.product
    .findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    })
    .catch(() => [] as { slug: string; updatedAt: Date }[]);

  return xmlResponse(
    urlsetXml(
      products.map((p) => ({
        path: `/shop/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    )
  );
}
