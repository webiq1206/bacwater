"use client";
import Link from "next/link";
import { ClipboardCheck, Check } from "lucide-react";
import { SupplierWaterLink } from "@/components/partners/supplier-context";
export function SupplyChecklist({volumeMl,measurementMl}:{volumeMl?:number;measurementMl?:number}) {
 const valid=(n:number|undefined):n is number=>typeof n==="number"&&Number.isFinite(n)&&n>0;
 const show=(n:number)=>new Intl.NumberFormat("en-US",{maximumSignificantDigits:8}).format(n);
 return <section className="bac-supply-checklist no-print" aria-label="Supplies to check"><div className="bac-checklist-heading"><ClipboardCheck size={20} aria-hidden="true"/><h3>What to have ready</h3></div>
 <p>Start with the instructions for your exact product.</p><ul>
 <li><Check size={16} aria-hidden="true"/><span><strong>The right liquid.</strong> Use the liquid named in those instructions. Not every product uses BAC water.</span></li>
 <li><Check size={16} aria-hidden="true"/><span><strong>A way to measure it.</strong> Check the scale and the marks on your device.{valid(measurementMl)?` Your entered amount works out to ${show(measurementMl)} mL.`:""}</span></li>
 <li><Check size={16} aria-hidden="true"/><span><strong>A record of your numbers.</strong>{valid(volumeMl)?` You entered ${show(volumeMl)} mL as the final volume. That is not always the amount of water to add.`:" Keep the label and your result together."}</span></li>
 </ul><SupplierWaterLink/><p className="bac-checklist-limit">The supplier’s water is for lab research only. We do not decide which product you need.</p><Link href="/tools/supplies" className="bac-inline-link">Need to count vials? Use the supply calculator</Link></section>;
}
