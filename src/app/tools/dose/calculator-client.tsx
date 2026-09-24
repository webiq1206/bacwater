"use client";
import { CalculationPanel } from "@/components/tools/calculation-panel";
import { positiveDecimal } from "@/lib/calc/number-text";
import { formatNumeric } from "@/lib/calc/format";
import { useSessionDraft, useSessionValue } from "@/lib/session/use-session-draft";
import { useMassDraft } from "@/lib/session/use-mass-draft";
import { massInMg } from "@/lib/session/mass-draft";
import { amountTiming } from "@/lib/calc/amount-timing";
import { AmountAndTiming } from "@/components/calculator/amount-and-timing";
export default function DoseCalculatorPage(){
 const {draft,update}=useMassDraft("Known concentration");
 const [mode,setMode]=useSessionValue<string>("known.mode","volume"),[sample,setSample]=useSessionValue<string>("known.sample","");
 const base=JSON.stringify([draft.vial,draft.vialUnit,draft.volume]);
 const [override,setOverride]=useSessionDraft("known.concentration",{base:"",text:""},r=>{const v=r as {base?:unknown;text?:unknown}|null;return {base:typeof v?.base==="string"?v.base.slice(0,256):"",text:typeof v?.text==="string"?v.text.slice(0,64):""};});
 const m=positiveDecimal(massInMg(draft)),volume=positiveDecimal(draft.volume);
 const derived=m!==null&&volume!==null?formatNumeric(m/volume,10):"";
 const conc=override.base===base?override.text:derived;
 const setConc=(text:string)=>setOverride({base,text});
 const timing=amountTiming(draft),volumeMode=mode!=="mass",c=positiveDecimal(conc),v=positiveDecimal(sample);
 const n=c===null?null:volumeMode?timing.kind==="value"?timing.perUseMg/c:null:v===null?null:c*v;
 const ready=n!==null&&Number.isFinite(n)&&n>0&&n<=1e12;
 const text=ready?volumeMode?`${formatNumeric(n!,8)} mL = ${formatNumeric(n!*100,6)} U-100 units each time at ${conc} mg/mL. ${timing.kind==="value"?timing.explanation:""}`:`${formatNumeric(n!,8)} mg = ${formatNumeric(n!*1000,6)} mcg in ${sample} mL at ${conc} mg/mL.`:volumeMode&&timing.kind!=="value"?timing.message:"Enter a positive concentration and the missing amount or volume.";
 return <CalculationPanel slug="dose" title="Dose, volume and concentration calculator" description="Already know the amount in each mL? Enter it here. Your weekly total and each-use amount stay separate." fields={[{id:"known-concentration",label:"Known concentration (mg/mL)",text:conc,set:setConc,hint:derived&&override.base!==base?"Brought from your current vial amount divided by final volume. Check the label.":"mg/mL means amount in each 1 mL, not the whole bottle."},...(!volumeMode?[{id:"known-amount",label:"Measured volume (mL)",text:sample,set:setSample}]:[])]} inputExtra={volumeMode?<div className="mt-5 border-t pt-5"><AmountAndTiming value={draft} onChange={v=>update(v)}/></div>:undefined} result={{ready,text}} onClear={()=>{setConc("");if(volumeMode)update({amount:"",basis:"",frequency:""});else setSample("");}} controls={<div role="group" aria-label="What to calculate" className="mb-5 flex flex-wrap gap-2">{[["volume","Find volume from amount"],["mass","Find amount from volume"]].map(([m,label])=><button type="button" key={m} aria-pressed={(volumeMode?"volume":"mass")===m} className="min-h-11 rounded-xl border px-4 py-2 text-sm aria-pressed:font-bold aria-pressed:underline" onClick={()=>setMode(m)}>{label}</button>)}</div>}>
 <h2 className="text-2xl font-serif">Two directions, one relationship</h2><p>Amount equals concentration multiplied by volume. Volume equals amount divided by concentration. Changing concentration here does not silently change the original bottle amount or final volume in another tool. Each field keeps its meaning.</p>
 </CalculationPanel>;
}
