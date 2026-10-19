"use client";
import Link from "next/link";
import { useCalculationSession, useSessionDraft } from "@/lib/session/calculation-session";
import { convertMassText } from "@/lib/calc/mass-text";
import { eachAmountText } from "@/lib/calc/amount-schedule";
import { CalculationPanel } from "@/components/tools/calculation-panel";
import { positiveDecimal } from "@/lib/calc/number-text";
import { formatNumeric } from "@/lib/calc/format";
import { usePersistentState } from "@/lib/use-persistent-state";
export default function DoseCalculatorPage(){
 const [mode,setMode]=usePersistentState("bacwater.tool.amount.mode.v2","volume");
 const shared=useCalculationSession();
 const converted=convertMassText(shared.vialInput,shared.vialUnit),mass=converted.kind==="value"?positiveDecimal(converted.mg):null,volume=positiveDecimal(shared.finalVolume);
 const fingerprint=JSON.stringify([shared.productId,shared.vialInput,shared.vialUnit,shared.finalVolume]);
 const [override,setOverride]=useSessionDraft("known-concentration",{fingerprint:"",text:""});
 const derived=mass!==null&&volume!==null&&Number.isFinite(mass/volume)?String(mass/volume):"";
 const conc=override.fingerprint===fingerprint?override.text:derived;
 const setConc=(text:string)=>setOverride({fingerprint,text});
 const [sampleVolume,setSampleVolume]=useSessionDraft("known-sample-volume","");
 const value=mode!=="mass"?eachAmountText(shared):sampleVolume;
 const setValue=(text:string)=>{if(mode!=="mass")shared.patch({amount:text,amountUnit:"mcg",basis:"each"});else setSampleVolume(text);};
 const volumeMode=mode!=="mass",c=positiveDecimal(conc),v=positiveDecimal(value);
 const n=c!==null&&v!==null?(volumeMode?v/1000/c:c*v):null;
 const ready=n!==null&&Number.isFinite(n)&&n>0&&n<=1e12;
 const result={ready,text:!conc.trim()||!value.trim()?(volumeMode?"Type the mg per mL and your dose. We will show the syringe line.":"Type the mg per mL and the mL you measured. We will show the amount."):ready?volumeMode?`Fill the syringe to the ${formatNumeric(n!*100,6)} U-100 units line. That is ${formatNumeric(n!,8)} mL for your ${value} mcg dose at ${conc} mg/mL.`:`${formatNumeric(n!,8)} mg (${formatNumeric(n!*1000,6)} mcg) is in ${value} mL at ${conc} mg/mL.`:"Type numbers bigger than zero. These numbers do not give a result."};
 return <CalculationPanel slug="dose" title="Dose to syringe line" description="Already mixed your vial and know the mg per mL? Type your dose to see which line to fill the syringe to. Or go the other way: type the mL to see the amount in it." fields={[{id:"known-concentration",label:"Known concentration",massUnit:"mg",perMl:true,text:conc,set:setConc,hint:"How many mg are in each 1 mL of your mixed vial. If you used the BAC water calculator, this number is filled in for you. You can type a different one."},{id:"known-amount",label:volumeMode?"Amount for one time":"Measured volume",massUnit:volumeMode?"mcg":undefined,scaleUnit:volumeMode?undefined:"ml",text:value,set:setValue,hint:volumeMode?"Your dose, from your own instructions.":"The amount of liquid you measured."}]} result={result} onClear={()=>{setConc("");setValue("");}} controls={<div role="group" aria-label="What to calculate" className="mb-5 flex flex-wrap gap-2">{[["volume","Find volume from amount"],["mass","Find amount from volume"]].map(([m,label])=><button type="button" key={m} aria-pressed={(volumeMode?"volume":"mass")===m} className="min-h-11 rounded-xl border px-4 py-2 text-sm aria-pressed:font-bold aria-pressed:underline" onClick={()=>setMode(m)}>{label}</button>)}</div>}>
 <h2 className="text-2xl font-serif">How this works</h2><p>Your dose divided by the strength (mg per mL) gives the mL to draw. Then mL times 100 gives the line on a U-100 insulin syringe. Going the other way, mL times the strength gives the amount in that liquid.</p><p>Example: a 300 mcg dose is 0.3 mg. At 3 mg per mL, that is 0.1 mL, which is the 10 line on an insulin syringe. In reverse, 0.1 mL at 3 mg per mL holds 0.3 mg.</p><h2 className="text-2xl font-serif">Check your syringe</h2><p>The 100-units-per-mL rule only works on a syringe marked U-100. Look for U-100 on the package or barrel. The <Link href="/tools/syringe-units" className="underline">units to mL converter</Link> is there if you only need that step.</p><p>Very small results show in scientific notation so they never round to zero. This tool does the math. It does not pick a dose for you.</p>
 </CalculationPanel>;
}
