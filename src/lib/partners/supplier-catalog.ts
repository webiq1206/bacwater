import { productAffiliateUrl } from "./affiliate";
/**
 * Curated supplier references, not a live inventory feed or product endorsement.
 * Public destinations checked 2026-09-23. Referral parameters supplied by the
 * owner 2026-09-24. Merchant-side commission attribution is verified separately.
 * Explicit environment flags can suspend referrals. No customer data is used.
 */
export const SUPPLIER_SOURCES = {
  program: "https://www.aminoclub.com/us/affiliate",
  terms: "https://www.aminoclub.com/us/affiliate-terms",
  coa: "https://www.aminoclub.com/us/coa",
  researchUse: "https://www.aminoclub.com/us/research-use",
} as const;

export type ProductKind = "single" | "blend" | "spray" | "water";
export interface SupplierProduct {
  id: string; name: string; mark: string; kind: ProductKind; reference: string;
  label: string; summary: string; sourceUrl: string; artworkTone: number;
}
export const CATALOG_CHECKED_AT = "2026-09-23";
const LISTINGS: readonly (readonly [string, string, string, ProductKind, string])[] = [
  ["amino-h2o","BAC water","H₂O","water",""],
  ["glp-1","GLP-1 / Semaglutide","GLP·1","single","semaglutide"],
  ["glp-2","Tirzepatide","TR","single","tirzepatide"],
  ["glp-3","Retatrutide","RT","single","retatrutide"],
  ["bpc-157","BPC-157","BPC·157","single","bpc-157"],
  ["ghk-cu","GHK-Cu","GHK·Cu","single","ghk-cu"],
  ["tb-500","TB-500","TB·500","single","tb-500"],
  ["tesamorlin","Tesamorelin","TES","single",""],
  ["mots-c","MOTS-C","MOTS·C","single","mots-c"],
  ["nad-plus","NAD+","NAD+","single",""],
  ["cjc-ipa-no-dac","CJC-1295 / Ipamorelin (No DAC)","CJC·IPA","blend",""],
  ["kpv","KPV","KPV","single",""],
  ["klow","KLOW","KLOW","blend",""],
  ["semax","SEMAX","SEMAX","single","semax"],
  ["glutathione","Glutathione","GSH","single",""],
  ["melanotan-ii","Melanotan II","MT·II","single","melanotan-2"],
  ["glow","GLOW","GLOW","blend","glow-blend"],
  ["selank","SELANK","SELANK","single","selank"],
  ["melanotan-i","Melanotan I","MT·I","single",""],
  ["igf-1-lr3","IGF-1 LR3","IGF·1","single",""],
  ["5-amino-1mq","5-Amino-1MQ","1MQ","single",""],
  ["wolverine-stack","BPC-157 / TB-500 (Wolverine)","BPC·TB","blend",""],
  ["pt-141","PT-141","PT·141","single","pt-141"],
  ["cagrilintide","Cagrilintide","CAG","single","cagrilintide"],
  ["aod-9604","AOD-9604","AOD","single","aod-9604"],
  ["dsip","DSIP","DSIP","single",""],
  ["epithalon","Epithalon","EPI","single","epithalon"],
  ["ipamorelin","Ipamorelin","IPA","single","ipamorelin"],
  ["snap-8","SNAP-8","SNAP·8","single",""],
  ["thymosin-alpha-1","Thymosin Alpha-1","TA·1","single",""],
  ["ghkcu-spray","GHK-Cu Spray","GHK·Cu","spray",""],
  ["nad-plus-spray","NAD+ Spray","NAD+","spray",""],
  ["semax-spray","SEMAX Spray","SEMAX","spray",""],
  ["selank-spray","SELANK Spray","SELANK","spray",""],
  ["pt-141-spray","PT-141 Spray","PT·141","spray",""],
  ["melanotan-ii-spray","Melanotan II Spray","MT·II","spray",""],
  ["ll-37","LL-37","LL·37","single",""],
  ["cartalax","Cartalax","CART","single",""],
  ["sermorelin","Sermorelin","SERM","single","sermorelin"],
  ["kisspeptin","Kisspeptin-10","KP·10","single","kisspeptin-10"],
  ["dihexa","Dihexa","DIH","single",""],
  ["vip","VIP","VIP","single",""],
  ["ara-290","ARA-290","ARA","single",""],
  ["dsip-spray","DSIP Spray","DSIP","spray",""],
  ["adalank-spray","Adalank Spray","ADA·L","spray",""],
  ["adamax-spray","Adamax Spray","ADA·M","spray",""],
  ["bpc-tb-spray","BPC-157 / TB-500 Spray (Wolverine)","BPC·TB","spray",""],
  ["bpc-spray","BPC-157 Spray","BPC·157","spray",""],
  ["pinealon","Pinealon","PINE","single",""],
  ["ahk-cu","AHK-Cu","AHK·Cu","single",""]
];
const descriptions: Record<ProductKind, {label:string;summary:string}> = {
  single: {label:"Research compound",summary:"Check the full label, listed amounts, and batch report."},
  blend: {label:"Research blend",summary:"Several ingredients in one product. Check each amount on the label."},
  spray: {label:"Research solution",summary:"A ready-made solution. Check its label; do not assume it needs more water."},
  water: {label:"Lab water",summary:"Check the water label, bottle sizes, and batch report."},
};
export const SUPPLIER_PRODUCTS: readonly SupplierProduct[] = LISTINGS.map(([id,name,mark,kind,reference],index) => ({
  id,name,mark,kind,reference,...descriptions[kind],artworkTone:index%7,
  sourceUrl:`https://www.aminoclub.com/us/products/${id}`,
}));
export type SupplierProductId = string;
export function productForReference(slug: string) {
  return SUPPLIER_PRODUCTS.find(p => p.reference === slug && slug !== "");
}
export function productCalculatorPath(id: string) {
  return `/calculate/product/${encodeURIComponent(id)}`;
}
export function productForCalculatorPath(path: string) {
  if (path.startsWith("/calculate/product/")) return SUPPLIER_PRODUCTS.find(p=>p.id===path.slice("/calculate/product/".length));
  return path.startsWith("/calculate/") ? productForReference(path.slice("/calculate/".length)) : undefined;
}
export type ActiveSupplierProduct = SupplierProduct & { affiliateUrl: string };
export type SupplierPartnerState =
  | { active: false; reason: "disabled" | "approval-pending" | "invalid-links" | "no-links" }
  | { active: true; products: ActiveSupplierProduct[] };
export interface SupplierSettings {
  AMINO_CLUB_ENABLED?: string;
  AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED?: string;
  AMINO_CLUB_PRODUCT_LINKS_JSON?: string;
}

/** Restrict externally supplied links to their exact reviewed product destination. */
export function validateSupplierLink(input: unknown, product: SupplierProduct): string | null {
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

export function getSupplierPartner(settings: SupplierSettings = {
  AMINO_CLUB_ENABLED: process.env.AMINO_CLUB_ENABLED ?? "true",
  AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED: process.env.AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED ?? "true",
  AMINO_CLUB_PRODUCT_LINKS_JSON: process.env.AMINO_CLUB_PRODUCT_LINKS_JSON || JSON.stringify(
    Object.fromEntries(SUPPLIER_PRODUCTS.map(product => [product.id, productAffiliateUrl(product.sourceUrl)])),
  ),
}): SupplierPartnerState {
  if (settings.AMINO_CLUB_ENABLED !== "true") return { active: false, reason: "disabled" };
  if (settings.AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED !== "true") return { active: false, reason: "approval-pending" };
  const raw = settings.AMINO_CLUB_PRODUCT_LINKS_JSON;
  if (!raw || raw.length > 120000) return { active: false, reason: "no-links" };
  try {
    const links: unknown = JSON.parse(raw);
    if (!links || typeof links !== "object" || Array.isArray(links)) return { active: false, reason: "invalid-links" };
    const record = links as Record<string, unknown>;
    if (Object.keys(record).some(key => !SUPPLIER_PRODUCTS.some(p => p.id === key))) return { active: false, reason: "invalid-links" };
    const products: ActiveSupplierProduct[] = [];
    for (const product of SUPPLIER_PRODUCTS) {
      if (!Object.hasOwn(record, product.id)) continue;
      const affiliateUrl = validateSupplierLink(record[product.id], product);
      if (!affiliateUrl) return { active: false, reason: "invalid-links" };
      products.push({ ...product, affiliateUrl });
    }
    return products.length ? { active: true, products } : { active: false, reason: "no-links" };
  } catch { return { active: false, reason: "invalid-links" }; }
}

export type DisplaySupplierProduct = SupplierProduct & { href: string; paid: boolean };
export function productDetailPath(id: string) { return `/products/${encodeURIComponent(id)}`; }

/** Fixed ordering is independent of health information, calculation inputs and accounts. */
export function getSupplierCatalog(settings?: SupplierSettings): DisplaySupplierProduct[] {
  const partner = settings ? getSupplierPartner(settings) : getSupplierPartner();
  return SUPPLIER_PRODUCTS.map(product => {
    const linked = partner.active ? partner.products.find(item => item.id === product.id) : undefined;
    return { ...product, href: linked?.affiliateUrl || product.sourceUrl, paid: Boolean(linked) };
  });
}
