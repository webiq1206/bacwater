"use client";
import { MassCalculator } from "@/components/calculator/mass-calculator";
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
export function PeptideCalc(props: Props){
 if (props.standalone && props.peptideSlug !== "hcg") return <MassCalculator title={`${props.peptideName} calculator`} reference={props.peptideSlug} backHref={`/peptides/${props.peptideSlug || "custom"}`}/>;
 return <IsolatedPeptideCalc {...props}/>;
}
function IsolatedPeptideCalc({peptideName,peptideSlug,standalone=false}:Props){
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
 return <CalculatorWorkspace title={`${peptideName} calculator`} description={iu?"Use IU from your product label. These are not syringe units.":"Use mg from your vial label and mcg for the amount to measure."} backHref={`/peptides/${peptideSlug || "custom"}`} help={<><UnitHelp/><SupplyChecklist volumeMl={usable?v:undefined} measurementMl={usable?ml:undefined}/></>}><section className="rounded-2xl border-2 bg-card p-5 sm:p-8" aria-label={`${peptideName} calculation`}><h3 className="text-xl font-serif">Check your label numbers</h3><p className="mt-2 text-sm text-muted-foreground">Enter values from existing instructions. No amount or mixing volume is preselected. {iu?'Product IU is not the same as a syringe unit.':'The amount field uses micrograms; the vial field uses milligrams.'}</p><div className="mt-5 grid gap-4 sm:grid-cols-3"><div><label htmlFor="compound-total">Total in container ({iu?'IU':'mg'})</label><Input id="compound-total" type="text" inputMode="decimal" maxLength={32} value={mass} onChange={e=>setMass(e.target.value)} className="mt-2 min-h-12" /></div><div><label htmlFor="compound-volume">Final volume (mL)</label><Input id="compound-volume" type="text" inputMode="decimal" maxLength={32} value={volume} onChange={e=>setVolume(e.target.value)} className="mt-2 min-h-12" /></div><div><label htmlFor="compound-amount">Entered amount ({iu?'IU':'mcg'})</label><Input id="compound-amount" type="text" inputMode="decimal" maxLength={32} value={amount} onChange={e=>setAmount(e.target.value)} className="mt-2 min-h-12" /></div></div><div role="status" aria-live="polite" className="bac-result-card mt-5 break-words">{empty?'Enter all three values to check the calculation.':usable?text:'Enter positive, finite numbers using decimal points. This result is outside the supported range.'}</div>{usable&&<div className="mt-3"><CopyButton value={text+". Arithmetic only; verify product and device instructions."} label="Copy calculation" /></div>}<p className="mt-4 text-sm">U-100 describes a scale, not graduation spacing or a device recommendation. Values are displayed to eight significant digits. A number above a device's capacity is not an instruction to use that device.</p><div className="mt-5 flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={()=>{setMass('');setVolume('');setAmount('');}}>Clear inputs</Button><Button asChild variant="brand"><Link href={iu?'/methodology':'/plan'}>{iu?'Read unit limitations':'Open the full planner'}</Link></Button></div><p className="mt-3 text-xs text-muted-foreground">Your IU entries stay in this browser tab. They are never copied into mg-based calculators. <Link href="/methodology" className="underline">Read the methodology.</Link></p></section></CalculatorWorkspace>;
}
