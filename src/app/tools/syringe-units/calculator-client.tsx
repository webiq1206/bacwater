"use client";
import { CalculatorWorkspace } from "@/components/calculator/calculator-workspace";
import { SupplyChecklist } from "@/components/tools/supply-checklist";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/lib/use-persistent-state";
import { SYRINGE_UNIT_FAQS } from "./faqs";
import { useState } from "react";
import { scaleConversion, switchScaleDirection } from "@/lib/calc/conversion-direction";
import { ConversionDirection, SCALE_DIRECTIONS } from "@/components/calculator/conversion-direction";
interface ConversionInput{direction:"units"|"ml";text:string}
export default function SyringeUnitConverterPage(){
 const [stored,setStored]=usePersistentState<ConversionInput>("scale-conversion",{direction:"units",text:""});
 const text=typeof stored?.text==="string"?stored.text:"",direction=stored?.direction==="ml"?"ml":"units";
 const result=scaleConversion({direction,text}),valid=result.kind==="value";
 const units=direction==="units"?text:valid?result.units:"",ml=direction==="ml"?text:valid?result.ml:"";
 const invalid=result.kind==="error";
 const [directionError,setDirectionError]=useState("");
 function changeDirection(nextDirection:"units"|"ml"){
   const next=switchScaleDirection({direction,text},nextDirection);
   if(!next){setDirectionError("Check the number before switching units. Your entry has been kept.");return;}
   setStored(next);setDirectionError("");
   requestAnimationFrame(()=>document.getElementById(nextDirection==="units"?"u100-units":"u100-ml")?.focus());
 }
 return <CalculatorWorkspace title="Syringe units to mL converter" description="Type a number in either box. On an insulin syringe marked U-100, 100 units is 1 mL, so the 10 line is 0.1 mL." help={<SupplyChecklist/>} reference={<> <section className="mt-9"><h2 className="text-2xl font-serif">U-100 conversion examples</h2><div className="mt-4 rounded-xl border"><table className="w-full text-left text-sm"><caption className="sr-only">U-100 scale units and liquid volumes</caption><thead><tr><th scope="col" className="p-3">U-100 units</th><th scope="col" className="p-3">Volume</th></tr></thead><tbody>{[1,5,10,20,25,30,40,50,75,100,200].map(n=><tr key={n} className="border-t"><th scope="row" className="p-3 font-normal">{n}</th><td className="p-3">{n/100} mL</td></tr>)}</tbody></table></div><p className="mt-3 text-sm text-muted-foreground">Units ÷ 100 = mL. mL × 100 = units. A 1 mL insulin syringe only goes up to 100 units, so 200 units would need two fills or a bigger syringe.</p></section>
 {SYRINGE_UNIT_FAQS.map(item=><section key={item.q} className="mt-9 space-y-3"><h2 className="text-2xl font-serif">{item.q}</h2><p>{item.a}</p>{item.q.startsWith("Can you convert mg")&&<Link href="/tools/dose" className="inline-flex min-h-11 items-center underline">Convert an amount using a known concentration</Link>}</section>)}
 <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">Three things to check on your syringe</h2><p>Does it say U-100? What is the biggest number on it (30, 50 or 100)? And how far apart are the little lines (every 1 unit, or every 2)? All three are printed on the syringe or its package.</p><p>This converter only changes units to mL. To find the line for a dose in mg or mcg, you also need the mg per mL in your vial. The BAC water calculator does that for you.</p><p><Link href="/tools/dose" className="underline">Amount-to-volume calculator</Link> · <Link href="/tools/mg-to-mcg" className="underline">Mass converter</Link> · <Link href="/methodology" className="underline">Formulas and limits</Link></p></section>
 </>}>
 <section className="rounded-2xl border bg-card p-5 sm:p-7" aria-label="U-100 volume conversion"><ConversionDirection value={direction} onChange={changeDirection} options={SCALE_DIRECTIONS} label="U-100 conversion direction"/>{directionError&&<p role="alert" className="mb-3 text-sm text-destructive">{directionError}</p>}<div className="grid gap-5 sm:grid-cols-2">
 {([direction,direction==="units"?"ml":"units"] as const).map(unit=><div key={unit}><label htmlFor={`u100-${unit}`} className="block text-sm font-medium">{unit==="units"?"U-100 syringe units":"Milliliters (mL)"}</label><Input id={`u100-${unit}`} type="text" inputMode="decimal" maxLength={64} value={unit==="units"?units:ml} onChange={e=>{setStored({direction:unit,text:e.target.value});setDirectionError("");}} aria-invalid={invalid&&direction===unit} aria-describedby="u100-help u100-error" placeholder={unit==="units"?"For example, 25":"For example, 0.25"} className="mt-2 min-h-12"/></div>)}</div>
 <p id="u100-help" className="mt-3 text-sm text-muted-foreground">Units ÷ 100 = mL. mL × 100 = units.</p><p id="u100-error" role={invalid?"alert":undefined} className="mt-2 text-sm text-destructive">{invalid?result.message:""}</p>
 <div className="mt-4 rounded-xl bg-muted p-4" role="status" aria-live="polite" aria-atomic="true"><p className="text-lg font-semibold [overflow-wrap:anywhere]">{valid?direction==="units"?`${result.units} U-100 units = ${result.ml} mL`:`${result.ml} mL = ${result.units} U-100 units`:"Type a number in either box."}</p></div>
 <div className="mt-4 flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={()=>{setStored({direction,text:""});setDirectionError("");}}>Clear values</Button><Button asChild variant="brand"><Link href="/peptide-calculator">Open the full calculator</Link></Button></div><p className="mt-4 text-xs leading-relaxed text-muted-foreground">The decimal point moves exactly, so small numbers stay exact. Check the biggest number and the lines on your real syringe.</p></section>
 </CalculatorWorkspace>;
}
