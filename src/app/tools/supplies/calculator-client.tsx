"use client";
import { CalculationPanel } from "@/components/tools/calculation-panel";
import { positiveDecimal } from "@/lib/calc/number-text";
import { formatNumeric } from "@/lib/calc/format";
import { usePersistentState } from "@/lib/use-persistent-state";
export default function SupplyCalculatorPage(){
 const [mass,setMass]=usePersistentState("bacwater.tool.inventory.mass.v2","");const [amount,setAmount]=usePersistentState("bacwater.tool.inventory.amount.v2","");const [count,setCount]=usePersistentState("bacwater.tool.inventory.count.v2","");const [volume,setVolume]=usePersistentState("bacwater.tool.inventory.volume.v2","");
 const m=positiveDecimal(mass),a=positiveDecimal(amount),c=positiveDecimal(count),v=volume.trim()?positiveDecimal(volume):null;
 const portions=m!==null&&a!==null?m/(a/1000):0;const perVial=Math.abs(portions-Math.round(portions))<Number.EPSILON*Math.max(1,portions)*4?Math.round(portions):Math.floor(portions);
 const valid=m!==null&&a!==null&&c!==null&&Number.isInteger(c)&&c<=1000000&&perVial>=1&&perVial<=10000000&&(!volume.trim()||v!==null);
 const vials=valid?Math.ceil(c!/perVial):0;
 const text=!mass.trim()||!amount.trim()||!count.trim()?"Fill in the vial amount, your dose, and how many doses you need.":valid?`One vial gives you ${perVial.toLocaleString('en-US')} complete measurements (doses). You need ${vials.toLocaleString('en-US')} ${vials===1?"vial":"vials"} for ${c!.toLocaleString('en-US')} doses.${v!==null?` That is ${formatNumeric(vials*v,6)} mL of BAC water in total.`:''}`:"Type numbers bigger than zero and a whole count up to 1,000,000. One dose must fit inside one vial.";
 return <CalculationPanel slug="supplies" title="How many vials do I need?" description="Type your vial amount, your dose, and how many doses you want. We count the vials and the BAC water for you." fields={[{id:"inventory-mass",label:"Mass per vial",massUnit:"mg",text:mass,set:setMass,hint:"The number next to mg on your vial label."},{id:"inventory-amount",label:"Amount for one time",massUnit:"mcg",text:amount,set:setAmount,hint:"Your dose, from your own instructions."},{id:"inventory-count",label:"Number of measurements",text:count,set:setCount,hint:"How many doses you want in total. Example: once a day for 30 days is 30."},{id:"inventory-volume",label:"Final volume per vial (mL, optional)",text:volume,set:setVolume,hint:"How much BAC water you put in each vial. We add it up for you."}]} result={{ready:valid,text}} onClear={()=>{setMass("");setAmount("");setCount("");setVolume("");}}>
 <h2 className="text-2xl font-serif">How this works</h2><p>Vial amount divided by dose gives the doses in one vial. Your total doses divided by that number, rounded up, gives the vials you need.</p><p>Example: a 10 mg vial holds twenty 500 mcg doses. If you need 41 doses, that is 3 vials. The last vial will have some left over.</p><h2 className="text-2xl font-serif">Real life loses a little</h2><p>A tiny bit of liquid always stays in the vial and the syringe. If you are close to the edge, plan for one extra vial. This tool counts math only. It does not set a schedule or tell you what to buy.</p>
 </CalculationPanel>;
}
