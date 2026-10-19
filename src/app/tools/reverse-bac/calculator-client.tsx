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
 const text=!mass.trim()||!amount.trim()||!units.trim()?"Fill in all three boxes: the vial amount, your dose, and the syringe line you want.":ready?`Hypothetical final volume: add ${formatNumeric(volume!,8)} mL of BAC water. Then each 1 mL holds ${formatNumeric(m!/volume!,8)} mg/mL and your dose is the ${units} line.${volume!>3?" That is more than most small vials hold. Try a smaller line number.":""}`:"Type numbers bigger than zero. These numbers do not give a result.";
 return <CalculationPanel slug="reverse-bac" title="Pick the syringe line, get the water" description="Want your dose to land on a certain line of the syringe? Type the line you want. We tell you how much BAC water makes that happen." fields={[{id:"reverse-mass",label:"Total mass",massUnit:"mg",text:mass,set:setMass,hint:"The number next to mg on your vial label."},{id:"reverse-amount",label:"Amount for one time",massUnit:"mcg",text:amount,set:setAmount,hint:"Your dose, from your own instructions."},{id:"reverse-units",label:"Hypothetical scale reading",scaleUnit:"units",text:units,set:setUnits,hint:"The syringe line you would like your dose to land on. 10 is a common easy line."}]} result={{ready,text}} onClear={()=>{setMass("");setAmount("");setUnits("");}}>
 <h2 className="text-2xl font-serif">How this works</h2><p>This is the BAC water calculator backwards. Normally you choose the water and we tell you the line. Here you choose the line and we tell you the water.</p><p>Example: a 10 mg vial, a 500 mcg dose, and you want the 10 line. 10 mg × 0.1 mL ÷ 0.5 mg = 2 mL of BAC water. The math assumes the water mixes evenly, which it does for a normal powder vial.</p><h2 className="text-2xl font-serif">Make sure it fits</h2><p>Small vials often hold about 3 mL. If the answer is bigger than your vial can hold, pick a smaller line number. If your instructions give a water amount, use theirs instead.</p>
 </CalculationPanel>;
}
