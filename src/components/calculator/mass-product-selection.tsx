"use client";
import { useRouter } from "next/navigation";
import { ProductPicker } from "@/components/plan/product-picker";
import { useCalculationSession, chooseCalculationProduct } from "@/lib/session/calculation-session";
import { SUPPLIER_PRODUCTS, productForReference, productCalculatorPath } from "@/lib/partners/supplier-catalog";
import { isSelectedMassProduct } from "@/lib/calc/product-context";
export { isSelectedMassProduct } from "@/lib/calc/product-context";
/** Non-mass formats always leave this form for their dedicated calculator. */
export function MassProductSelection() {
 const s = useCalculationSession(), router = useRouter();
 function select(value: string) {
  if (value === "hcg") { chooseCalculationProduct("", "iu", "hcg"); router.push("/calculate/hcg"); return; }
  const p = value.startsWith("product:") ? SUPPLIER_PRODUCTS.find(p => p.id === value.slice(8)) : productForReference(value);
  if (p && p.kind !== "single") { chooseCalculationProduct(p.id, p.kind, p.reference); router.push(productCalculatorPath(p.id)); return; }
  chooseCalculationProduct(p?.id || "", "single", p?.reference || (value.startsWith("product:") ? "custom" : value));
 }
 return <div className="mb-4"><ProductPicker value={s.productId && !SUPPLIER_PRODUCTS.find(p => p.id === s.productId)?.reference ? `product:${s.productId}` : s.peptideSlug} onChange={select}/>
 {s.peptideSlug === "custom" && !s.productId && <label className="mt-3 block text-sm">Product name from your label<input className="mt-2 min-h-11 w-full rounded-lg border bg-background p-3 text-base" value={s.customName} onChange={e => s.patch({ customName: e.target.value })} maxLength={100}/></label>}
 </div>;
}
export function MassProductGate({children}: {children: React.ReactNode}) {
 const s = useCalculationSession();
 return <><MassProductSelection/>{isSelectedMassProduct(s) ? children : <p className="rounded-xl border bg-muted p-5 text-base leading-relaxed">Choose the exact product before entering numbers. IU products, blends, solutions and lab water open their own calculators.</p>}</>;
}
