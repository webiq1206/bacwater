import { PEPTIDES } from "@/lib/calc/peptides";

/**
 * Curated set of high-demand peptides that get dedicated per-vial-size landing
 * pages (e.g. "5 mg BPC-157 reconstitution"). Kept deliberately small and
 * demand-driven so each page targets a distinct real query and clears the
 * doorway/uniqueness bar. The route uses `dynamicParams = false`, so only these
 * combinations exist; the sitemap enumerates the same list.
 */
const CURATED_SLUGS = [
  "bpc-157",
  "tb-500",
  "tirzepatide",
  "semaglutide",
  "ipamorelin",
  "retatrutide",
];

export interface VialSizePage {
  slug: string;
  sizeMg: number;
  /** URL segment, e.g. "5mg". */
  sizeParam: string;
}

export const VIAL_SIZE_PAGES: VialSizePage[] = CURATED_SLUGS.flatMap((slug) => {
  const p = PEPTIDES.find((x) => x.slug === slug);
  if (!p) return [];
  return p.commonVialStrengthsMg.map((mg) => ({
    slug,
    sizeMg: mg,
    sizeParam: `${mg}mg`,
  }));
});

export function findVialSizePage(
  slug: string,
  sizeParam: string
): VialSizePage | undefined {
  return VIAL_SIZE_PAGES.find(
    (v) => v.slug === slug && v.sizeParam === sizeParam
  );
}
