import { PRODUCT_CATALOG_COPY } from "./product-catalog-copy";
/** Reviewed supplier listings, not a live inventory feed or product endorsement. */
export const SUPPLIER_SOURCES = {
  program: "https://www.aminoclub.com/us/affiliate",
  terms: "https://www.aminoclub.com/shop/affiliate-terms",
  coa: "https://www.aminoclub.com/us/coa",
  researchUse: "https://www.aminoclub.com/us/research-use",
} as const;

/** Supplied and approved by the account owner on September 24, 2026. */
export const APPROVED_AFFILIATE_URL = "https://aminoclub.com?utm_source=affiliate_marketing&code=WEBIQ";
export const AFFILIATE_DISCLOSURE = "Affiliate link. We may earn a commission if you purchase through this link.";
export const RESEARCH_ONLY_NOTICE = "For laboratory research only. Not for human consumption or veterinary use.";

/** Only the owner's two public attribution fields are added. No visitor data or redirects. */
export function affiliateProductUrl(sourceUrl: string): string {
  const url = new URL(sourceUrl);
  if (url.protocol !== "https:" || url.hostname !== "www.aminoclub.com" || url.port || url.username || url.password || url.search || url.hash || !/^\/us\/products\/[a-z0-9-]+$/.test(url.pathname)) {
    throw new Error("Unexpected supplier product destination");
  }
  const approved = new URL(APPROVED_AFFILIATE_URL);
  url.search = approved.search;
  return url.toString();
}

export type ProductKind = "single" | "blend" | "spray" | "water";
export interface SupplierProduct {
  id: string; name: string; mark: string; kind: ProductKind; reference: string;
  label: string; summary: string; sourceUrl: string; artworkTone: number;
  aliases?: readonly string[];
}
export const CATALOG_CHECKED_AT = "2026-09-24";
const PRODUCTS: readonly (readonly [string, ProductKind, string])[] = [
  ["amino-h2o", "water", ""],
  ["glp-1", "single", "semaglutide"],
  ["glp-2", "single", "tirzepatide"],
  ["glp-3", "single", "retatrutide"],
  ["bpc-157", "single", "bpc-157"],
  ["ghk-cu", "single", "ghk-cu"],
  ["tb-500", "single", "tb-500"],
  ["tesamorlin", "single", ""],
  ["mots-c", "single", "mots-c"],
  ["nad-plus", "single", ""],
  ["cjc-ipa-no-dac", "blend", ""],
  ["kpv", "single", ""],
  ["klow", "blend", ""],
  ["semax", "single", "semax"],
  ["glutathione", "single", ""],
  ["melanotan-ii", "single", "melanotan-2"],
  ["glow", "blend", "glow-blend"],
  ["selank", "single", "selank"],
  ["melanotan-i", "single", ""],
  ["igf-1-lr3", "single", ""],
  ["5-amino-1mq", "single", ""],
  ["wolverine-stack", "blend", ""],
  ["pt-141", "single", "pt-141"],
  ["cagrilintide", "single", "cagrilintide"],
  ["aod-9604", "single", "aod-9604"],
  ["dsip", "single", ""],
  ["epithalon", "single", "epithalon"],
  ["ipamorelin", "single", "ipamorelin"],
  ["snap-8", "single", ""],
  ["thymosin-alpha-1", "single", ""],
  ["ghkcu-spray", "spray", ""],
  ["nad-plus-spray", "spray", ""],
  ["semax-spray", "spray", ""],
  ["selank-spray", "spray", ""],
  ["pt-141-spray", "spray", ""],
  ["melanotan-ii-spray", "spray", ""],
  ["ll-37", "single", ""],
  ["cartalax", "single", ""],
  ["sermorelin", "single", "sermorelin"],
  ["kisspeptin", "single", "kisspeptin-10"],
  ["dihexa", "single", ""],
  ["vip", "single", ""],
  ["ara-290", "single", ""],
  ["dsip-spray", "spray", ""],
  ["adalank-spray", "spray", ""],
  ["adamax-spray", "spray", ""],
  ["bpc-tb-spray", "spray", ""],
  ["bpc-spray", "spray", ""],
  ["pinealon", "single", ""],
  ["ahk-cu", "single", ""],
];
const descriptions: Record<ProductKind, {label:string;summary:string}> = {
  single: {label:"Research compound",summary:"Check the full label, listed amounts, and batch report."},
  blend: {label:"Research blend",summary:"Several ingredients in one product. Check each amount on the label."},
  spray: {label:"Research solution",summary:"A ready-made solution. Check its label; do not assume it needs more water."},
  water: {label:"Lab water",summary:"Check the water label, bottle sizes, and batch report."},
};
export const SUPPLIER_PRODUCTS: readonly SupplierProduct[] = PRODUCTS.map(([id,kind,reference],index) => {
  const content = PRODUCT_CATALOG_COPY[id];
  if (!content) throw new Error(`Missing reviewed product content: ${id}`);
  return {id,kind,reference,...descriptions[kind],artworkTone:index%7,
    name:content.name,mark:content.name,summary:content.summary,aliases:content.aliases,
    sourceUrl:`https://www.aminoclub.com/us/products/${id}`};
});

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

/** Restrict externally supplied links to the exact reviewed product destination. */
export function validateSupplierLink(input: unknown, product: SupplierProduct): string | null {
  if (typeof input !== "string" || input.length > 2048 || /[\s\\\u0000-\u001f]/u.test(input)) return null;
  try {
    const url = new URL(input), source = new URL(product.sourceUrl);
    if (url.protocol !== "https:" || url.hostname !== source.hostname || url.port || url.username || url.password || url.hash) return null;
    if (url.pathname !== source.pathname || /%(?:2f|5c|2e)/i.test(input)) return null;
    const entries = [...url.searchParams.entries()];
    if (entries.length < 1 || entries.length > 8) return null;
    const keys = new Set<string>();
    for (const [key, value] of entries) {
      if (!/^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(key) || !/^[a-zA-Z0-9._~-]{1,160}$/.test(value)) return null;
      if (/(?:email|phone|token|secret|password|session|auth|redirect|return|srsltid|gclid|fbclid)/i.test(key)) return null;
      if (keys.has(key)) return null;
      keys.add(key);
    }
    return input;
  } catch { return null; }
}

/** Public, deterministic fallback also used outside the provider. Never attach user input. */
export function getApprovedSupplierCatalog(): DisplaySupplierProduct[] {
  return SUPPLIER_PRODUCTS.map(product => ({...product, href:affiliateProductUrl(product.sourceUrl), paid:true}));
}

/** Owner approval replaces the former pre-approval environment setup. An explicit pause remains available. */
function approvedSettings(): SupplierSettings {
  return {
    AMINO_CLUB_ENABLED: process.env.AMINO_CLUB_AFFILIATE_PAUSED === "true" ? "false" : "true",
    AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED: "true",
    AMINO_CLUB_PRODUCT_LINKS_JSON: JSON.stringify(Object.fromEntries(SUPPLIER_PRODUCTS.map(p=>[p.id,affiliateProductUrl(p.sourceUrl)]))),
  };
}

/** Explicit settings still fail closed. Default links use only the owner's approved attribution fields. */
export function getSupplierPartner(settings: SupplierSettings = approvedSettings()): SupplierPartnerState {
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
/** Fixed ordering is independent of health information, calculation inputs and accounts. */
export function getSupplierCatalog(settings?: SupplierSettings): DisplaySupplierProduct[] {
  const partner = settings ? getSupplierPartner(settings) : getSupplierPartner();
  return SUPPLIER_PRODUCTS.map(product => {
    const linked = partner.active ? partner.products.find(item => item.id === product.id) : undefined;
    return { ...product, href: linked?.affiliateUrl || product.sourceUrl, paid: Boolean(linked) };
  });
}

/** Product display names never change a compound identity, URL, unit, or saved user label. */
export function productDisplayName(slug: string, fallback: string): string {
  return productForReference(slug)?.name || fallback;
}
