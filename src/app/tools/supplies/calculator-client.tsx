"use client";
import { CalculationPanel } from "@/components/tools/calculation-panel";
import { positiveDecimal } from "@/lib/calc/number-text";
import { formatNumeric } from "@/lib/calc/format";
import { useSharedNumbers } from "@/lib/tools/use-shared-numbers";
import { SessionNote } from "@/components/calculator/session-note";
import { usePersistentState } from "@/lib/use-persistent-state";
export default function SupplyCalculatorPage(){
 const { mass, setMass, amount, setAmount, volume, setVolume, clear } = useSharedNumbers();
 const [count,setCount]=usePersistentState("mass-tool:inventory.count","");
 const m=positiveDecimal(mass),a=positiveDecimal(amount),c=positiveDecimal(count),v=volume.trim()?positiveDecimal(volume):null;
 const portions=m!==null&&a!==null?m/(a/1000):0;const perVial=Math.abs(portions-Math.round(portions))<Number.EPSILON*Math.max(1,portions)*4?Math.round(portions):Math.floor(portions);
 const valid=m!==null&&a!==null&&c!==null&&Number.isInteger(c)&&c<=1000000&&perVial>=1&&perVial<=10000000&&(!volume.trim()||v!==null);
 const vials=valid?Math.ceil(c!/perVial):0;
 const text=!mass.trim()||!amount.trim()||!count.trim()?"Enter total mass per vial, amount per measurement and the planned count.":valid?`${perVial.toLocaleString('en-US')} complete measurements per vial before losses. ${vials.toLocaleString('en-US')} vials for ${c!.toLocaleString('en-US')} measurements, assuming no partial measurements are combined across vials.${v!==null?` Total final solution volume across those vials: ${formatNumeric(vials*v,6)} mL.`:''}`:"Use positive decimal values and a whole count up to 1,000,000. A complete entered amount must fit within one vial. This is a software range, not a regimen.";
 return <CalculationPanel slug="supplies" title="Vial and measurement inventory calculator" description="Use the amounts and count from your own instructions. We’ll count whole vials. We do not set a schedule." fields={[{id:"inventory-mass",label:"Mass per vial (mg)",text:mass,set:setMass},{id:"inventory-amount",label:"Amount each time (mcg)",text:amount,set:setAmount},{id:"inventory-count",label:"Number of measurements",text:count,set:setCount},{id:"inventory-volume",label:"Final volume per vial (mL, optional)",text:volume,set:setVolume}]} result={{ready:valid,text}} controls={<SessionNote/>} onClear={()=>{clear();setCount("");}}>
 <h2 className="text-2xl font-serif">Count whole portions, not treatment cycles</h2><p>For example, 10 mg contains twenty 500 mcg portions before losses. Forty-one such measurements need three vials under this model. The last vial will not be fully used.</p><p>The optional volume field adds the final solution volumes across complete vials. It is not a count of BAC water bottles to buy and does not account for displacement, shelf life, shipping, waste or opened-container restrictions.</p><h2 className="text-2xl font-serif">Supplies need a separate check</h2><p>Device type, packaging, preparation supplies and handling requirements come from the exact product and device instructions. This site does not sell supplies or determine an administration protocol. No measurement schedule is inferred from the compound name.</p>
 </CalculationPanel>;
}
