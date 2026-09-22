"use client";
import { CalculationPanel } from "@/components/tools/calculation-panel";
import { positiveDecimal } from "@/lib/calc/number-text";
import { formatNumeric } from "@/lib/calc/format";
import { usePersistentState } from "@/lib/use-persistent-state";
export default function ReverseBacCalculatorPage(){
 const [mass,setMass]=usePersistentState("bacwater.tool.reverse.mass.v2","");const [amount,setAmount]=usePersistentState("bacwater.tool.reverse.amount.v2","");const [units,setUnits]=usePersistentState("bacwater.tool.reverse.units.v2","");
 const m=positiveDecimal(mass),a=positiveDecimal(amount),u=positiveDecimal(units);
 const volume=m!==null&&a!==null&&u!==null?m*(u/100)/(a/1000):null;
 const ready=volume!==null&&Number.isFinite(volume)&&volume>=1e-12&&volume<=1e12;
 const text=!mass.trim()||!amount.trim()||!units.trim()?"Enter all three known values to explore the mathematical relationship.":ready?`Hypothetical final volume: ${formatNumeric(volume!,8)} mL. Concentration: ${formatNumeric(m!/volume!,8)} mg/mL. This is not a recommendation to add that volume or use a particular diluent.`:"Use positive decimal numbers within the supported range. The inputs do not produce a supported result.";
 return <CalculationPanel slug="reverse-bac" title="Reverse BAC water calculation" description="Explore which final volume would mathematically match a stated amount and a U-100 reading. A convenient mark does not establish a compatible or appropriate preparation." fields={[{id:"reverse-mass",label:"Total mass (mg)",text:mass,set:setMass},{id:"reverse-amount",label:"Entered amount (mcg)",text:amount,set:setAmount},{id:"reverse-units",label:"Hypothetical U-100 reading (units)",text:units,set:setUnits}]} result={{ready,text}} onClear={()=>{setMass("");setAmount("");setUnits("");}}>
 <h2 className="text-2xl font-serif">How the reverse calculation works</h2><p>Convert the entered amount to mg and the U-100 reading to mL. Final volume equals total mass multiplied by that measurement volume, divided by the entered amount.</p><p>Example: 10 mg × 0.1 mL ÷ 0.5 mg gives a hypothetical 2 mL final volume. That relationship assumes a uniform solution. It does not check displacement, product compatibility, losses or container capacity.</p><h2 className="text-2xl font-serif">Do not use convenience as a preparation instruction</h2><p>Use the final volume and diluent specified for the exact product. If a result conflicts with those instructions or the actual device, resolve the mismatch with the responsible professional. Do not change a formulation just to reach a round syringe mark.</p>
 </CalculationPanel>;
}
