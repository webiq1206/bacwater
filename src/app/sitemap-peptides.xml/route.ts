import { PEPTIDES } from "@/lib/calc/peptides";
import { VIAL_SIZE_PAGES } from "@/lib/peptides/vial-sizes";
import { urlsetXml, xmlResponse } from "@/lib/seo/sitemap";

export const revalidate = 3600;

// Peptide and vial-size pages are code-defined; omit lastmod so crawlers
// don't treat every hourly revalidation as a content change.
export function GET() {
  return xmlResponse(
    urlsetXml([
      ...PEPTIDES.map((p) => ({
        path: `/peptides/${p.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...VIAL_SIZE_PAGES.map((v) => ({
        path: `/peptides/${v.slug}/${v.sizeParam}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ])
  );
}
