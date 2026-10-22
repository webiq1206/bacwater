"use client";
import Link from "next/link";
import { ClipboardCheck, Check } from "lucide-react";
import { SupplierWaterLink } from "@/components/partners/supplier-context";
export function SupplyChecklist({volumeMl,measurementMl}:{volumeMl?:number;measurementMl?:number}) {
 const valid=(n:number|undefined):n is number=>typeof n==="number"&&Number.isFinite(n)&&n>0;
 const show=(n:number)=>new Intl.NumberFormat("en-US",{maximumSignificantDigits:8}).format(n);
 return <section className="bac-supply-checklist no-print" aria-label="Calculation inputs to check"><div className="bac-checklist-heading"><ClipboardCheck size={20} aria-hidden="true"/><h3>What this calculation needs</h3></div>
 <p>Check these inputs before interpreting the arithmetic.</p><ul>
 <li><Check size={16} aria-hidden="true"/><span><strong>Final volume.</strong> Use an independently specified total liquid volume. The calculator does not establish the appropriate diluent.</span></li>
 <li><Check size={16} aria-hidden="true"/><span><strong>Scale meaning.</strong> U-100 means 100 scale units per mL.{valid(measurementMl)?` The calculated volume equivalent is ${show(measurementMl)} mL, or ${show(measurementMl*100)} U-100 scale units.`:""}</span></li>
 <li><Check size={16} aria-hidden="true"/><span><strong>A note of your numbers.</strong>{valid(volumeMl)?` Entered final volume: ${show(volumeMl)} mL.`:" Record total mass, final volume and measurement units."}</span></li>
 </ul><SupplierWaterLink/><p className="bac-checklist-limit">The supplier’s water is for lab research only. We do not choose products for you.</p><Link href="/tools/supplies" className="bac-inline-link">Explore portion and vial count arithmetic</Link></section>;
}
