import { SUPPLIER_PRODUCTS } from "@/lib/partners/supplier-catalog";
import { PEPTIDES } from "./peptides";
export function isSelectedMassProduct(s: { kind: string; productId: string; peptideSlug: string; customName: string }) {
 return s.kind === "single" && (SUPPLIER_PRODUCTS.some(p => p.id === s.productId && p.kind === "single") || PEPTIDES.some(p => p.slug === s.peptideSlug && !["hcg", "glow-blend", "custom"].includes(p.slug)) || (s.peptideSlug === "custom" && Boolean(s.customName.trim())));
}
