"use client";
import Link from "next/link";
import { ClipboardCheck, Check } from "lucide-react";
import { SupplierWaterLink } from "@/components/partners/supplier-context";
export function SupplyChecklist({volumeMl,measurementMl}:{volumeMl?:number;measurementMl?:number}) {
 const valid=(n:number|undefined):n is number=>typeof n==="number"&&Number.isFinite(n)&&n>0;
 const show=(n:number)=>new Intl.NumberFormat("en-US",{maximumSignificantDigits:8}).format(n);
 return <section className="bac-supply-checklist no-print" aria-label="Supplies to check"><div className="bac-checklist-heading"><ClipboardCheck size={20} aria-hidden="true"/><h3>What to have ready</h3></div>
 <p>Before you mix, have these three things.</p><ul>
 <li><Check size={16} aria-hidden="true"/><span><strong>BAC water.</strong> This is the liquid you add to the powder. Check your instructions in case your product uses a different liquid.</span></li>
 <li><Check size={16} aria-hidden="true"/><span><strong>A syringe.</strong> Most people use a 1 mL insulin syringe marked U-100.{valid(measurementMl)?` Your dose is ${show(measurementMl)} mL, which is the ${show(measurementMl*100)} line.`:""}</span></li>
 <li><Check size={16} aria-hidden="true"/><span><strong>A note of your numbers.</strong>{valid(volumeMl)?` You are adding ${show(volumeMl)} mL of BAC water. Write it on the vial so you remember.`:" Write the water amount and the syringe line on the vial."}</span></li>
 </ul><SupplierWaterLink/><p className="bac-checklist-limit">The supplier’s water is for lab research only. We do not choose products for you.</p><Link href="/tools/supplies" className="bac-inline-link">How many vials do I need? Count them here</Link></section>;
}
