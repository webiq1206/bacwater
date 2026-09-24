"use client";
import { CalculationPanel } from "@/components/tools/calculation-panel";
import { positiveDecimal } from "@/lib/calc/number-text";
import { formatNumeric } from "@/lib/calc/format";
import { useSessionValue } from "@/lib/session/use-session-draft";
import { useMassDraft } from "@/lib/session/use-mass-draft";
import { massInMg } from "@/lib/session/mass-draft";
import { amountTiming } from "@/lib/calc/amount-timing";
import { AmountAndTiming } from "@/components/calculator/amount-and-timing";
export default function ReverseBacCalculatorPage(){
 const {draft,update,clear}=useMassDraft("Reverse volume");
 const [units,setUnits]=useSessionValue<string>("reverse.targetUnits","");
 const mass=massInMg(draft),m=positiveDecimal(mass),timing=amountTiming(draft),u=positiveDecimal(units);
 const volume=m!==null&&timing.kind==="value"&&u!==null?m*(u/100)/timing.perUseMg:null;
 const ready=volume!==null&&Number.isFinite(volume)&&volume>=1e-12&&volume<=1e12;
 const text=timing.kind!=="value"?timing.message:ready?`Hypothetical final volume: ${formatNumeric(volume!,8)} mL. Concentration: ${formatNumeric(m!/volume!,8)} mg/mL. ${timing.explanation} This is not a recommendation to add that volume or use a particular liquid.`:"Enter the whole-vial amount and a U-100 reading to check this relationship.";
 return <CalculationPanel slug="reverse-bac" title="Reverse BAC water calculation" description="Check an amount against a U-100 reading. This gives a hypothetical volume, not instructions to add water." fields={[{id:"reverse-mass",label:"Total mass (mg)",text:mass,set:value=>update({vial:value,vialUnit:"mg",isExample:false}),hint:"The whole bottle, not one use."},{id:"reverse-units",label:"Hypothetical U-100 reading (units)",text:units,set:setUnits,hint:"Your actual preparation volume is kept separately and is not replaced by this example."}]} inputExtra={<div className="mt-5 border-t pt-5"><AmountAndTiming value={draft} onChange={v=>update(v)}/></div>} result={{ready,text}} onClear={()=>{clear();setUnits("");}}>
 <h2 className="text-2xl font-serif">How the reverse calculation works</h2><p>Final volume equals total mass multiplied by a measurement volume, divided by the amount for each use. A weekly total must be split using the timing you supply.</p><p>This explores a mathematical relationship. It does not check product compatibility or decide a preparation. Your known final volume is not overwritten by this hypothetical result.</p>
 </CalculationPanel>;
}
