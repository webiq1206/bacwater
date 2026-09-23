/**
 * Curated supplier references, not a live inventory feed or product endorsement.
 * Public destinations checked 2026-09-23. Never infer affiliate parameters.
 * Populate exact links supplied by the approved partner dashboard, then verify
 * attribution there before setting the approval flag. No customer data is used.
 */
export const AMINO_SOURCES = {
  program: "https://www.aminoclub.com/us/affiliate",
  terms: "https://www.aminoclub.com/shop/affiliate-terms",
  coa: "https://www.aminoclub.com/us/coa",
  researchUse: "https://www.aminoclub.com/us/research-use",
} as const;

export const AMINO_PRODUCTS = [
  { id: "amino-h2o", name: "BAC water", supplierName: "Amino H2O", label: "Lab water", mark: "H₂O", summary: "See the water label, bottle sizes, and lab report.", sourceUrl: "https://www.aminoclub.com/us/products/amino-h2o" },
  { id: "glp-1", name: "GLP-1 / Semaglutide", supplierName: "GLP-1 (SM)", label: "Research compound", mark: "GLP·1", summary: "Listed by AminoClub as GLP-1 (SM). Check its full label.", sourceUrl: "https://www.aminoclub.com/us/products/glp-1" },
  { id: "glp-2", name: "Tirzepatide", supplierName: "GLP-2 (TR)", label: "Research compound", mark: "TR", summary: "Listed by AminoClub as GLP-2 (TR). See the lab report.", sourceUrl: "https://www.aminoclub.com/us/products/glp-2" },
  { id: "glp-3", name: "Retatrutide", supplierName: "GLP-3 (RT)", label: "Research compound", mark: "RT", summary: "Listed by AminoClub as GLP-3 (RT). Check the exact product.", sourceUrl: "https://www.aminoclub.com/us/products/glp-3" },
  { id: "bpc-157", name: "BPC-157", supplierName: "BPC-157", label: "Research compound", mark: "BPC·157", summary: "See the label, listed amounts, and report for the batch.", sourceUrl: "https://www.aminoclub.com/us/products/bpc-157" },
  { id: "ghk-cu", name: "GHK-Cu", supplierName: "GHK-Cu", label: "Research compound", mark: "GHK·Cu", summary: "Check the exact form and the supplier’s lab report.", sourceUrl: "https://www.aminoclub.com/us/products/ghk-cu" },
  { id: "tb-500", name: "TB-500", supplierName: "TB-500", label: "Research compound", mark: "TB·500", summary: "Read the full product name and batch report.", sourceUrl: "https://www.aminoclub.com/us/products/tb-500" },
] as const;
export type AminoProduct = (typeof AMINO_PRODUCTS)[number];
export type AminoProductId = AminoProduct["id"];
export type ActiveAminoProduct = AminoProduct & { affiliateUrl: string };
export type AminoPartnerState =
  | { active: false; reason: "disabled" | "approval-pending" | "invalid-links" | "no-links" }
  | { active: true; products: ActiveAminoProduct[] };
export interface AminoSettings {
  AMINO_CLUB_ENABLED?: string;
  AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED?: string;
  AMINO_CLUB_PRODUCT_LINKS_JSON?: string;
}

/** Restrict externally supplied links to their exact reviewed product destination. */
export function validateAminoLink(input: unknown, product: AminoProduct): string | null {
  if (typeof input !== "string" || input.length > 2048 || /[\s\\\u0000-\u001f]/u.test(input)) return null;
  try {
    const url = new URL(input), source = new URL(product.sourceUrl);
    if (url.protocol !== "https:" || url.hostname !== source.hostname || url.port || url.username || url.password || url.hash) return null;
    // A link to a different compound or a generic redirect is not a product link.
    if (url.pathname !== source.pathname || /%(?:2f|5c|2e)/i.test(input)) return null;
    const entries = [...url.searchParams.entries()];
    if (entries.length < 1 || entries.length > 8) return null;
    const keys = new Set<string>();
    for (const [key, value] of entries) {
      if (!/^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(key) || !/^[a-zA-Z0-9._~-]{1,160}$/.test(value)) return null;
      // Block credentials, identity data, click IDs and redirect destinations.
      if (/(?:email|phone|token|secret|password|session|auth|redirect|return|srsltid|gclid|fbclid)/i.test(key)) return null;
      if (keys.has(key)) return null;
      keys.add(key);
    }
    // Do not alter the verified URL, invent a ref parameter, or attach page data.
    return input;
  } catch { return null; }
}

export function getAminoPartner(settings: AminoSettings = {
  AMINO_CLUB_ENABLED: process.env.AMINO_CLUB_ENABLED,
  AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED: process.env.AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED,
  AMINO_CLUB_PRODUCT_LINKS_JSON: process.env.AMINO_CLUB_PRODUCT_LINKS_JSON,
}): AminoPartnerState {
  if (settings.AMINO_CLUB_ENABLED !== "true") return { active: false, reason: "disabled" };
  if (settings.AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED !== "true") return { active: false, reason: "approval-pending" };
  const raw = settings.AMINO_CLUB_PRODUCT_LINKS_JSON;
  if (!raw || raw.length > 12000) return { active: false, reason: "no-links" };
  try {
    const links: unknown = JSON.parse(raw);
    if (!links || typeof links !== "object" || Array.isArray(links)) return { active: false, reason: "invalid-links" };
    const record = links as Record<string, unknown>;
    if (Object.keys(record).some(key => !AMINO_PRODUCTS.some(p => p.id === key))) return { active: false, reason: "invalid-links" };
    const products: ActiveAminoProduct[] = [];
    for (const product of AMINO_PRODUCTS) {
      if (!Object.hasOwn(record, product.id)) continue;
      const affiliateUrl = validateAminoLink(record[product.id], product);
      if (!affiliateUrl) return { active: false, reason: "invalid-links" };
      products.push({ ...product, affiliateUrl });
    }
    return products.length ? { active: true, products } : { active: false, reason: "no-links" };
  } catch { return { active: false, reason: "invalid-links" }; }
}

export type DisplayAminoProduct = AminoProduct & { href: string; paid: boolean };
/** Fixed ordering is independent of health information, calculation inputs and accounts. */
export function getAminoCatalog(settings?: AminoSettings): DisplayAminoProduct[] {
  const partner = settings ? getAminoPartner(settings) : getAminoPartner();
  return AMINO_PRODUCTS.map(product => {
    const linked = partner.active ? partner.products.find(item => item.id === product.id) : undefined;
    return { ...product, href: linked?.affiliateUrl || product.sourceUrl, paid: Boolean(linked) };
  });
}
