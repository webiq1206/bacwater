import { PEPTIDES } from "@/lib/calc/peptides";
import { urlsetXml, xmlResponse } from "@/lib/seo/sitemap";

export const revalidate = 3600;

export function GET() {
  const now = new Date();
  return xmlResponse(
    urlsetXml(
      PEPTIDES.map((p) => ({
        path: `/peptides/${p.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }))
    )
  );
}
