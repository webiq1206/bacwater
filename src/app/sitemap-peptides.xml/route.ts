import { PEPTIDES } from "@/lib/calc/peptides";
import { urlsetXml, xmlResponse } from "@/lib/seo/sitemap";

export const revalidate = 3600;

// Peptide pages are code-defined; omit lastmod so crawlers don't treat every
// hourly revalidation as a content change. The per-vial-size doorway pages
// were consolidated into the compound page (PRD §9.11) and redirect to it, so
// they are no longer emitted here.
export function GET() {
  return xmlResponse(
    urlsetXml(
      PEPTIDES.map((p) => ({
        path: `/peptides/${p.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }))
    )
  );
}
