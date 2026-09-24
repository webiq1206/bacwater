"use client";
import { useEffect } from "react";
import { useMassDraft } from "@/lib/use-calculator-session";
import { massText, selectMassProduct, clearMassNumbers } from "@/lib/calculator-session";
import { AmountSchedule } from "@/components/plan/amount-schedule";
import { amountSchedule, scheduleNumber } from "@/lib/calc/amount-schedule";
import { SessionNotice } from "@/components/calculator/session-notice";
import { UnitHelp } from "@/components/tools/unit-help";
import { SupplyChecklist } from "@/components/tools/supply-checklist";
import { positiveDecimal } from "@/lib/calc/number-text";
import { usePersistentState } from "@/lib/use-persistent-state";
import { CalculatorWorkspace } from "@/components/calculator/calculator-workspace";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/copy-button";
interface Props {peptideName:string;peptideSlug?:string;commonVialStrengthsMg:number[];suggestedDoseMcg:number;standalone?:boolean;}
export function PeptideCalc({peptideName,peptideSlug,standalone=false}:Props){
 const iu=peptideSlug==="hcg";const [mass,setMass]=usePersistentState(`bacwater.compound.${peptideSlug}.mass`,"");const [volume,setVolume]=usePersistentState(`bacwater.compound.${peptideSlug}.volume`,"");const [amount,setAmount]=usePersistentState(`bacwater.compound.${peptideSlug}.amount`,"");
 const m=Number(mass),v=Number(volume),a=Number(amount);const empty=!mass.trim()||!volume.trim()||!amount.trim();
 const valid=!empty&&[mass,volume,amount].every(n=>positiveDecimal(n)!==null);const c=m/v,ml=(iu?a:a/1000)/c,u=ml*100;
 const usable=valid&&[c,ml,u].every(n=>Number.isFinite(n)&&n>0);
 const text=usable?`${c.toLocaleString('en-US',{maximumSignificantDigits:8})} ${iu?'IU':'mg'}/mL; ${ml.toLocaleString('en-US',{maximumSignificantDigits:8})} mL; ${u.toLocaleString('en-US',{maximumSignificantDigits:8})} U-100 units`:'';
 if(!standalone)return <section className="rounded-2xl border-2 bg-card p-5 sm:p-8" aria-label={`${peptideName} calculation`}>
  <h3 className="text-xl font-serif">Calculate without distractions.</h3>
  <p className="mt-3 text-sm">Open the full-screen calculator. Use the amounts and final volume from your own instructions.</p>
  <Button asChild variant="brand" className="mt-5 min-h-12"><Link href={`/calculate/${peptideSlug || "custom"}`}>Open {peptideName} calculator</Link></Button>
  <p className="mt-3 text-xs text-muted-foreground">No account needed. We check math, not what you should take.</p>
 </section>;
 if (!iu) return <ReferenceMassCalculator name={peptideName} slug={peptideSlug || "custom"}/>;
 return <CalculatorWorkspace title={`${peptideName} calculator`} description={iu?"Use IU from your product label. These are not syringe units.":"Use mg from your vial label and mcg for the amount to measure."} backHref={`/peptides/${peptideSlug || "custom"}`} help={<><UnitHelp/><SupplyChecklist volumeMl={usable?v:undefined} measurementMl={usable?ml:undefined}/></>}><section className="rounded-2xl border-2 bg-card p-5 sm:p-8" aria-label={`${peptideName} calculation`}><h3 className="text-xl font-serif">Check your label numbers</h3><p className="mt-2 text-sm text-muted-foreground">Enter values from existing instructions. No amount or mixing volume is preselected. {iu?'Product IU is not the same as a syringe unit.':'The amount field uses micrograms; the vial field uses milligrams.'}</p><div className="mt-5 grid gap-4 sm:grid-cols-3"><div><label htmlFor="compound-total">Total in container ({iu?'IU':'mg'})</label><Input id="compound-total" type="text" inputMode="decimal" maxLength={32} value={mass} onChange={e=>setMass(e.target.value)} className="mt-2 min-h-12" /></div><div><label htmlFor="compound-volume">Final volume (mL)</label><Input id="compound-volume" type="text" inputMode="decimal" maxLength={32} value={volume} onChange={e=>setVolume(e.target.value)} className="mt-2 min-h-12" /></div><div><label htmlFor="compound-amount">Entered amount ({iu?'IU':'mcg'})</label><Input id="compound-amount" type="text" inputMode="decimal" maxLength={32} value={amount} onChange={e=>setAmount(e.target.value)} className="mt-2 min-h-12" /></div></div><div role="status" aria-live="polite" className="bac-result-card mt-5 break-words">{empty?'Enter all three values to check the calculation.':usable?text:'Enter positive, finite numbers using decimal points. This result is outside the supported range.'}</div>{usable&&<div className="mt-3"><CopyButton value={text+". Arithmetic only; verify product and device instructions."} label="Copy calculation" /></div>}<p className="mt-4 text-sm">U-100 describes a scale, not graduation spacing or a device recommendation. Values are displayed to eight significant digits. A number above a device's capacity is not an instruction to use that device.</p><div className="mt-5 flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={()=>{setMass('');setVolume('');setAmount('');}}>Clear inputs</Button><Button asChild variant="brand"><Link href={iu?'/methodology':'/plan'}>{iu?'Read unit limitations':'Open the full planner'}</Link></Button></div><p className="mt-3 text-xs text-muted-foreground">Your entries stay in this browser tab when storage is available. Saved plans are separate. <Link href="/methodology" className="underline">Read the methodology.</Link></p></section></CalculatorWorkspace>;
}

function ReferenceMassCalculator({name,slug}:{name:string;slug:string}) {
 const [draft,patch]=useMassDraft();
 useEffect(()=>{ selectMassProduct(null, slug, slug === "custom" ? name : ""); },[slug,name]);
 const total=massText(draft.vial,draft.vialUnit,"mg"),mass=positiveDecimal(total),volume=positiveDecimal(draft.volume);
 const amount=amountSchedule({amount:draft.amount,unit:draft.amountUnit,basis:draft.basis,frequency:draft.frequency});
 const concentration=mass!==null&&volume!==null?mass/volume:null;
 const each=amount.kind==="value"?amount.eachMcg/1000:null;
 const ml=concentration!==null&&each!==null?each/concentration:null;
 const valid=concentration!==null&&Number.isFinite(concentration)&&concentration>0;
 const allowed=valid&&amount.kind!=="error"&&(each===null||each<=mass!)&&(ml===null||Number.isFinite(ml)&&ml>0);
 const text=!valid?"Enter the total in your vial and the final liquid volume.":!allowed?amount.kind==="error"?amount.message:"Check your amount. It cannot be more than the total in the vial.":`${scheduleNumber(concentration!)} mg/mL${ml===null?". Add an amount for one time to see its volume.":`; ${scheduleNumber(ml)} mL = ${scheduleNumber(ml*100)} U-100 scale units for one time.`}`;
 return <CalculatorWorkspace title={`${name} calculator`} description="Start with your vial label. Then tell us your amount and schedule." backHref={`/peptides/${slug}`} help={<><UnitHelp/><SupplyChecklist/></>}>
 <SessionNotice/><section className="bac-calc-card p-5 sm:p-7" aria-label={`${name} calculation`}>
 <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="reference-total">Total in container (mg)</label><Input id="reference-total" className="mt-2 min-h-12" type="text" inputMode="decimal" maxLength={64} value={total} onChange={e=>patch({vial:e.target.value,vialUnit:"mg"})}/><p className="mt-2 text-xs text-muted-foreground">The whole vial, not the amount for one time.</p></div><div><label htmlFor="reference-volume">Final volume (mL)</label><Input id="reference-volume" className="mt-2 min-h-12" type="text" inputMode="decimal" maxLength={64} value={draft.volume} onChange={e=>patch({volume:e.target.value})}/><p className="mt-2 text-xs text-muted-foreground">Use the final liquid volume from your instructions. Do not assume how much water to add.</p></div></div>
 <div className="mt-6"><AmountSchedule value={{amount:draft.amount,unit:draft.amountUnit,basis:draft.basis,frequency:draft.frequency}} onChange={p=>patch({...(p.amount!==undefined?{amount:p.amount}:{}),...(p.unit?{amountUnit:p.unit}:{}),...(p.basis?{basis:p.basis}:{}),...(p.frequency!==undefined?{frequency:p.frequency}:{})})}/></div>
 <div role="status" className="bac-result-card mt-5 break-words" aria-live="polite">{text}</div><p className="mt-4 text-sm text-muted-foreground">U-100 is a volume scale, not product activity units. Follow the actual device markings. No amount, schedule or preparation method is chosen here.</p><div className="mt-5 flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={clearMassNumbers}>Clear inputs</Button>{allowed&&<CopyButton value={text} label="Copy calculation"/>}<Button asChild variant="brand"><Link href="/plan">Open the full planner</Link></Button></div>
 </section></CalculatorWorkspace>;
}
