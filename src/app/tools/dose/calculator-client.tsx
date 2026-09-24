"use client";
import Link from "next/link";
import { useCalculatorSession, useMassDraft } from "@/lib/use-calculator-session";
import { massText, patchMassDraft, clearMassNumbers } from "@/lib/calculator-session";
import { amountSchedule } from "@/lib/calc/amount-schedule";
import { CalculationPanel } from "@/components/tools/calculation-panel";
import { positiveDecimal } from "@/lib/calc/number-text";
import { formatNumeric } from "@/lib/calc/format";
import { usePersistentState } from "@/lib/use-persistent-state";
export default function DoseCalculatorPage(){
 const [mode,setMode]=usePersistentState("bacwater.tool.amount.mode.v2","volume");
 const [savedConc,setConc]=usePersistentState("bacwater.tool.amount.conc.v2","");
 const state=useCalculatorSession(),[draft]=useMassDraft();
 const m=positiveDecimal(massText(draft.vial,draft.vialUnit,"mg")),final=positiveDecimal(draft.volume);
 const derived=m!==null&&final!==null?String(m/final):"";
 const conc=Object.hasOwn(state.tools,"bacwater.tool.amount.conc.v2")?savedConc:derived;
 const [sample,setSample]=usePersistentState("bacwater.tool.amount.sample.v3","");
 const schedule=amountSchedule({amount:draft.amount,unit:draft.amountUnit,basis:draft.basis,frequency:draft.frequency});
 const value=mode==="mass"?sample:schedule.kind==="value"?String(schedule.eachMcg):draft.basis==="each"?massText(draft.amount,draft.amountUnit,"mcg"):"";
 const setValue=(text:string)=>{if(mode==="mass")setSample(text);else patchMassDraft({amount:text,amountUnit:"mcg",basis:"each"});};
 const volumeMode=mode!=="mass",c=positiveDecimal(conc),v=positiveDecimal(value);
 const n=c!==null&&v!==null?(volumeMode?v/1000/c:c*v):null;
 const ready=n!==null&&Number.isFinite(n)&&n>0&&n<=1e12;
 const result={ready,text:!conc.trim()||!value.trim()?"Enter a known concentration and the amount or volume from your instructions.":ready?volumeMode?`${formatNumeric(n!,8)} mL = ${formatNumeric(n!*100,6)} U-100 units for the entered ${value} mcg at ${conc} mg/mL.`:`${formatNumeric(n!,8)} mg = ${formatNumeric(n!*1000,6)} mcg in the entered ${value} mL at ${conc} mg/mL.`:"Enter positive decimal numbers within the supported software range. No result is available for these inputs."};
 return <CalculationPanel slug="dose" title="Dose, volume and concentration calculator" description="Know the amount in each mL? Put it here. We’ll find a volume or amount from your numbers. We do not choose a dose." fields={[{id:"known-concentration",label:"Known concentration (mg/mL)",text:conc,set:setConc,hint:conc===derived&&derived?"Carried from your vial amount and final volume. Changing this field does not rewrite those label values.":"Use the mg/mL value from your label. This is not the total amount in the vial."},{id:"known-amount",label:volumeMode?"Amount for one time (mcg)":"Measured volume (mL)",text:value,set:setValue,hint:volumeMode?"This is for one time. A weekly total is divided by your chosen count before it arrives here. Editing this field sets an amount for one time.":undefined}]} result={result} onClear={()=>{setConc("");if(volumeMode)clearMassNumbers();else setSample("");}} controls={<div role="group" aria-label="What to calculate" className="mb-5 flex flex-wrap gap-2">{[["volume","Find volume from amount"],["mass","Find amount from volume"]].map(([m,label])=><button type="button" key={m} aria-pressed={(volumeMode?"volume":"mass")===m} className="min-h-11 rounded-xl border px-4 py-2 text-sm aria-pressed:font-bold aria-pressed:underline" onClick={()=>{setMode(m);}}>{label}</button>)}</div>}>
 <h2 className="text-2xl font-serif">Two directions, one relationship</h2><p>Amount equals concentration multiplied by volume. Volume equals amount divided by concentration. Convert mcg to mg before using a concentration written in mg/mL.</p><p>For an arithmetic example, 300 mcg is 0.3 mg. At 3 mg/mL, that amount occupies 0.1 mL. In reverse, 3 mg/mL multiplied by 0.1 mL is 0.3 mg.</p><h2 className="text-2xl font-serif">Why syringe units need a scale</h2><p>On U-100 only, multiply mL by 100. That scale relationship does not identify the device's capacity, tick spacing or suitability. The <Link href="/tools/syringe-units" className="underline">U-100 converter</Link> keeps those distinctions visible.</p><p>Values are displayed with bounded decimal precision; very small nonzero results use scientific notation instead of becoming zero. These are arithmetic examples, not instructions to prepare or administer a product.</p>
 </CalculationPanel>;
}
