"use client";
import { CalculationPanel } from "@/components/tools/calculation-panel";
import { positiveDecimal } from "@/lib/calc/number-text";
import { formatNumeric } from "@/lib/calc/format";
import { useSessionValue } from "@/lib/session/use-session-draft";
import { useMassDraft } from "@/lib/session/use-mass-draft";
import { massInMg } from "@/lib/session/mass-draft";
import { amountTiming } from "@/lib/calc/amount-timing";
import { AmountAndTiming } from "@/components/calculator/amount-and-timing";
export default function SupplyCalculatorPage(){
 const {draft,update,clear}=useMassDraft("Vial count");
 const [count,setCount]=useSessionValue<string>("inventory.count","");
 const mass=massInMg(draft),m=positiveDecimal(mass),timing=amountTiming(draft),c=positiveDecimal(count),v=draft.volume.trim()?positiveDecimal(draft.volume):null;
 const portions=m!==null&&timing.kind==="value"?m/timing.perUseMg:0;
 const perVial=Math.abs(portions-Math.round(portions))<Number.EPSILON*Math.max(1,portions)*4?Math.round(portions):Math.floor(portions);
 const valid=m!==null&&timing.kind==="value"&&c!==null&&Number.isInteger(c)&&c<=1000000&&perVial>=1&&perVial<=10000000&&(!draft.volume.trim()||v!==null);
 const vials=valid?Math.ceil(c!/perVial):0;
 const text=timing.kind!=="value"?timing.message:valid?`${perVial.toLocaleString('en-US')} complete measurements per vial before losses. ${vials.toLocaleString('en-US')} vials for ${c!.toLocaleString('en-US')} measurements. ${timing.explanation}${v!==null?` Total final solution volume: ${formatNumeric(vials*v,6)} mL.`:''}`:"Enter the whole-vial amount and a whole count of uses. Each use must fit in one vial. Do not enter a number of weeks as a number of uses.";
 return <CalculationPanel slug="supplies" title="Vial and measurement inventory calculator" description="Count whole vials using your amount for each use. This does not set a treatment length." fields={[{id:"inventory-mass",label:"Mass per vial (mg)",text:mass,set:value=>update({vial:value,vialUnit:"mg"})},{id:"inventory-count",label:"Number of measurements",text:count,set:setCount,hint:"Count uses, not weeks. For example, 2 uses per week for 3 weeks is 6 uses. Use only your existing instructions."},{id:"inventory-volume",label:"Final volume per vial (mL, optional)",text:draft.volume,set:volume=>update({volume})}]} inputExtra={<div className="mt-5 border-t pt-5"><AmountAndTiming value={draft} onChange={v=>update(v)}/></div>} result={{ready:valid,text}} onClear={()=>{clear();setCount("");}}>
 <h2 className="text-2xl font-serif">Count whole portions, not treatment cycles</h2><p>Remaining partial amounts are not combined across vials. The count does not account for loss, usable shelf life or product handling. It is not an instruction to buy or use a particular supply.</p>
 </CalculationPanel>;
}
