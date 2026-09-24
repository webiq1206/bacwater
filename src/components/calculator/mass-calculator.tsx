"use client";
import { useEffect, useId } from "react";
import Link from "next/link";
import { useMassDraft } from "@/lib/session/use-mass-draft";
import { massInMg, switchVialUnit } from "@/lib/session/mass-draft";
import { amountTiming, showNumber } from "@/lib/calc/amount-timing";
import { positiveDecimal } from "@/lib/calc/number-text";
import { AmountAndTiming } from "./amount-and-timing";
import { CalculatorWorkspace, WorkspaceActions } from "./calculator-workspace";
import { CarriedOverNotice } from "@/components/tools/carried-over-notice";
import { BeginnerHelp } from "@/components/plan/beginner-help";
import { CopyButton } from "@/components/common/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function MassCalculator({title,productId="",peptideSlug="",backHref="/tools"}:{title:string;productId?:string;peptideSlug?:string;backHref?:string}) {
 const id=useId(),{draft,update,clear,carried,select}=useMassDraft(title);
 useEffect(()=>{if(productId||peptideSlug)select(productId,peptideSlug);},[productId,peptideSlug,select]);
 const mass=positiveDecimal(massInMg(draft)),volume=positiveDecimal(draft.volume),timing=amountTiming(draft);
 const concentration=mass!==null&&volume!==null?mass/volume:null;
 const c=concentration!==null&&Number.isFinite(concentration)&&concentration>0?concentration:null;
 const invalidMass=!!draft.vial.trim()&&mass===null,invalidVolume=!!draft.volume.trim()&&volume===null;
 const ml=c!==null&&timing.kind==="value"?timing.perUseMg/c:null;
 const valid=ml!==null&&Number.isFinite(ml)&&ml>0&&Number.isFinite(ml*100);
 const tooMuch=timing.kind==="value"&&mass!==null&&timing.perUseMg>mass;
 const concentrationText=c===null?"Enter the bottle amount and final volume to see concentration.":`${showNumber(c)} mg/mL`;
 const copy=valid&&timing.kind==="value"?`${showNumber(ml!)} mL each time = ${showNumber(ml!*100)} U-100 units each time. ${timing.explanation} Concentration: ${concentrationText}.` : "";
 return <CalculatorWorkspace title={title} description="Your bottle, your amount, your timing. We show the math, one part at a time." backHref={backHref} help={<><BeginnerHelp kind="vial"/><BeginnerHelp kind="volume"/><BeginnerHelp kind="units"/><BeginnerHelp kind="amount"/><p>Product changes keep your current mass-based calculation. Blends, ready-made solutions and product IU use separate fields. Check the new label before using carried values.</p></>}>
  <section className="bac-calc-card p-5 sm:p-7" aria-label="Product calculation inputs" data-shared-mass>
   <CarriedOverNotice visible={carried} onClear={clear}/>{draft.isExample&&<p className="mb-4 text-sm font-medium">These are example numbers, not product instructions. Replace them with your own numbers.</p>}
   <p className="mb-4 text-xs text-muted-foreground">Your numbers stay with you in this tab. Changing a product does not choose new amounts.</p>
   <h2 className="text-xl font-semibold">1. What is in the bottle?</h2>
   <div className="mt-4 grid gap-5 sm:grid-cols-2">
    <div className="min-w-0"><label htmlFor={`${id}-total`} className="block text-sm font-medium">Total amount in the vial</label><div className="mt-2 flex gap-2"><Input id={`${id}-total`} data-mass-vial aria-invalid={invalidMass} aria-label="Total amount in the vial" type="text" inputMode="decimal" maxLength={64} value={draft.vial} placeholder="Copy the label" onChange={e=>update({vial:e.target.value})} className="min-w-0 flex-1 min-h-12"/><select className="min-h-12 rounded-lg border px-2 text-base" value={draft.vialUnit} aria-label="Vial amount unit" onChange={e=>update(d=>switchVialUnit(d,e.target.value as "mg"|"mcg"))}><option value="mg">mg</option><option value="mcg">mcg</option></select></div><p className="mt-2 text-xs text-muted-foreground">This is everything in the small bottle, not one use.</p></div>
    <div className="min-w-0"><label htmlFor={`${id}-volume`} className="block text-sm font-medium">Total liquid after preparation (mL)</label><Input id={`${id}-volume`} data-mass-volume aria-invalid={invalidVolume} aria-label="Final liquid volume in mL" className="mt-2 min-h-12" type="text" inputMode="decimal" maxLength={64} value={draft.volume} placeholder="From your instructions" onChange={e=>update({volume:e.target.value})}/><p className="mt-2 text-xs text-muted-foreground">Final volume can differ from the water added. Follow your product instructions.</p></div>
   </div>
   {(invalidMass||invalidVolume)&&<p role="alert" className="mt-3 text-sm text-destructive">Use positive numbers for the whole vial and final volume. Enter a decimal point, not commas or unit words.</p>}
   <div className="mt-4 rounded-xl border bg-surface p-3 text-sm" data-concentration><strong>Amount in each 1 mL: </strong>{concentrationText}</div>
   <div className="mt-6 border-t pt-5"><h2 className="mb-4 text-xl font-semibold">2. What do your instructions say?</h2><AmountAndTiming value={draft} onChange={v=>update(v)}/></div>
   <div className="bac-result-card mt-6 break-words [overflow-wrap:anywhere]" role="status" aria-live="polite" aria-atomic="true" data-mass-result>
    <p className="text-sm font-medium">3. Your amount for each use</p>
    {valid&&!tooMuch?<><p className="mt-2 text-3xl font-semibold">{showNumber(ml!)} <span className="text-lg">mL each time</span></p><p className="mt-2 text-lg">{showNumber(ml!*100)} U-100 units each time</p><p className="mt-3 text-sm">{timing.kind==="value"&&timing.explanation}</p>{ml!>1&&<p className="mt-2 text-sm font-semibold">More than 1 mL. Check that your actual device can hold this volume.</p>}</>:<p className="mt-2 text-sm">{tooMuch?"The amount for one use is more than the whole bottle. Check the numbers and units.":c===null?"Add the total bottle amount and final liquid volume above.":timing.kind!=="value"?timing.message:"These values are outside the supported range."}</p>}
   </div>
   <p className="mt-4 text-xs leading-relaxed text-muted-foreground">U-100 is a syringe volume scale: 100 units = 1 mL. It is not mg, mcg or product IU. Check the actual device and markings. The calculator does not choose an amount, timing, liquid or expiry.</p>
  </section>
  <WorkspaceActions><Button type="button" variant="outline" onClick={clear}>Clear inputs</Button>{valid&&!tooMuch&&<CopyButton value={copy} label="Copy result"/>}<Button asChild variant="outline"><Link href="/plan">Save as a plan</Link></Button></WorkspaceActions>
 </CalculatorWorkspace>;
}
