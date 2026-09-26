"use client";
import { CalculationOutcome } from "@/components/calculator/calculation-events";
import { useId, useEffect } from "react";
import { useCalculationSession, chooseCalculationProduct } from "@/lib/session/calculation-session";
import { eachAmountText } from "@/lib/calc/amount-schedule";
import { convertMassText } from "@/lib/calc/mass-text";
import { positiveDecimal } from "@/lib/calc/number-text";
import { AmountScheduleFields, SessionValuesNotice } from "@/components/calculator/amount-schedule";
import type { SupplierProduct } from "@/lib/partners/supplier-catalog";
import { emptyProductValues, readProductValues, blendIngredients, productCalculation, type ProductValues } from "@/lib/partners/product-calculation";
import { usePersistentState } from "@/lib/use-persistent-state";
import { CalculatorWorkspace, WorkspaceActions } from "@/components/calculator/calculator-workspace";
import { UnitHelp } from "@/components/tools/unit-help";
import { BeginnerHelp } from "@/components/plan/beginner-help";
import { CopyButton } from "@/components/common/copy-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export function ProductCalculator({product}:{product:SupplierProduct}){
 const id=useId(),[raw,set]=usePersistentState(`bacwater.product.${product.id}.v1`,emptyProductValues(product));
 const shared=useCalculationSession();
 useEffect(()=>{chooseCalculationProduct(product.id,product.kind,product.reference||"");},[product.id,product.kind,product.reference]);
 const converted=convertMassText(shared.vialInput,shared.vialUnit);
 const values=product.kind==="single"?{...readProductValues(raw,product),total:converted.kind==="value"?converted.mg:shared.vialInput,volume:shared.finalVolume,amount:eachAmountText(shared)}:readProductValues(raw,product);
 const expectedIngredients=blendIngredients(product);
 const calculated=productCalculation(product,values);
 const total=positiveDecimal(values.total),volume=positiveDecimal(values.volume);
 const concentrationOnly=product.kind==="single" && !shared.amount.trim() && total!==null && volume!==null && Number.isFinite(total/volume) && total/volume>0;
 const result=concentrationOnly?{ready:true,text:`${Number((total!/volume!).toPrecision(10))} mg/mL. Add the amount for one time below to find its liquid volume.`,lines:[`${Number((total!/volume!).toPrecision(10))} mg/mL`,"Add the amount for one time to find mL and U-100 units."]}:calculated;
 function updateField(key:keyof Omit<ProductValues,"ingredients"|"blendMode">,value:string){if(product.kind!=="single"){set({...values,[key]:value});return;}if(key==="total")shared.patch({vialInput:value,vialUnit:"mg"});if(key==="volume")shared.patch({finalVolume:value});}
 const field=(key:keyof Omit<ProductValues,"ingredients"|"blendMode">,label:string,hint?:string)=><div key={key} className="min-w-0"><label htmlFor={`${id}-${key}`} className="block text-sm font-medium">{label}</label><Input id={`${id}-${key}`} type="text" inputMode={key==="ingredient"?"text":key==="count"?"numeric":"decimal"} value={values[key]} maxLength={key==="ingredient"?80:32} onChange={e=>updateField(key,e.target.value)} aria-describedby={hint?`${id}-${key}-help`:undefined} className="mt-2 min-h-12"/>{hint&&<p id={`${id}-${key}-help`} className="mt-2 text-xs text-muted-foreground">{hint}</p>}</div>;
 const description=product.kind==="water"?"Add up liquid volumes you already know.":product.kind==="spray"?"This is a ready-made solution. Check its label, not a mixing recipe.":product.kind==="blend"?"Calculate the premixed blend’s total concentration, or check its individual ingredients from the label.":"Enter your label numbers. We show the concentration and volume.";
 return <CalculatorWorkspace title={`${product.name} calculator`} description={description} backHref="/recommendations" help={<p>All products are listed for lab research only, not for people or animals. This calculation does not verify a product or tell you what to use. The supplier link opens the exact product page. Images are our own artwork, not packaging.</p>}>
  {product.kind==="single"&&<SessionValuesNotice/>}<CalculationOutcome ready={result.ready}/><section className="bac-calc-card p-5 sm:p-7" aria-label="Product calculation inputs" style={{maxWidth:760,marginInline:"auto"}}>
   {(product.kind==="blend"||product.id==="bpc-tb-spray")&&<fieldset className="mb-5 rounded-lg border p-4"><legend className="px-1 text-sm font-semibold">What do you want to calculate?</legend><div className="flex flex-wrap gap-4"><label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm"><input type="radio" name={`${id}-blend-mode`} checked={values.blendMode!=="ingredients"} onChange={()=>set({...values,blendMode:"total",...(product.kind==="spray"?{total:""}:{})})}/>Total premixed blend</label><label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm"><input type="radio" name={`${id}-blend-mode`} checked={values.blendMode==="ingredients"} onChange={()=>set({...values,blendMode:"ingredients",...(product.kind==="spray"?{total:""}:{})})}/>{product.kind==="spray"?"One ingredient":"Individual ingredients"}</label></div><p className="mt-2 text-sm text-muted-foreground">Use an ingredient breakdown only when the label states its amount or concentration.</p></fieldset>}
   <div className="grid gap-5 sm:grid-cols-2">
    {product.kind==="water"?<>{field("volume","Liquid volume per container (mL)","The amount needed in each container, from your own instructions.")}{field("count","Number of containers")}{field("total","Volume per bottle (mL)","The liquid amount printed on the supply bottle.")}</>:product.kind==="spray"?<>{product.id==="bpc-tb-spray"&&values.blendMode==="ingredients"&&field("ingredient","Ingredient from the label")}{field("total",product.id==="bpc-tb-spray"&&values.blendMode!=="ingredients"?"Total blend concentration (mg/mL)":"Label concentration (mg/mL)",product.id==="bpc-tb-spray"?(values.blendMode==="ingredients"?"Use this named ingredient’s concentration, not the combined blend total.":"Use the labeled combined concentration of the premixed blend."):"Copy the concentration printed on the solution label.")}{field("amount","Sample volume (mL)","The amount of liquid you want to calculate, not a dose chosen by this tool.")}</>:product.kind==="blend"?<>
     {values.blendMode==="ingredients"?<>{values.ingredients.map((ingredient,index)=><fieldset className="min-w-0 rounded-lg border p-3" key={index}><legend className="px-1 text-sm">{expectedIngredients?.[index] || `Ingredient ${index+1}`}</legend><label htmlFor={`${id}-name-${index}`} className="text-sm">Ingredient {index+1} name</label><Input id={`${id}-name-${index}`} value={ingredient.name} readOnly={Boolean(expectedIngredients)} maxLength={80} onChange={e=>set({...values,ingredients:values.ingredients.map((row,i)=>i===index?{...row,name:e.target.value}:row)})}/><label htmlFor={`${id}-mass-${index}`} className="mt-3 block text-sm">Ingredient {index+1} amount (mg)</label><Input id={`${id}-mass-${index}`} type="text" inputMode="decimal" value={ingredient.mass} maxLength={32} onChange={e=>set({...values,ingredients:values.ingredients.map((row,i)=>i===index?{...row,mass:e.target.value}:row)})}/></fieldset>)}
     {!expectedIngredients&&<div className="flex flex-wrap gap-3 sm:col-span-2"><Button type="button" variant="outline" disabled={values.ingredients.length>=6} onClick={()=>set({...values,ingredients:[...values.ingredients,{name:"",mass:""}]})}>Add ingredient</Button>{values.ingredients.length>2&&<Button type="button" variant="outline" onClick={()=>set({...values,ingredients:values.ingredients.slice(0,-1)})}>Remove last ingredient</Button>}</div>}</>:field("total","Total blend in container (mg)","The combined mass printed on the label, not the amount of one ingredient.")}
     {field("volume","Final volume (mL)","Use the final volume from your product instructions.")}<details className="sm:col-span-2"><summary className="cursor-pointer py-2 text-sm font-semibold">Optional: calculate the amount in a sample</summary><div className="mt-3">{field("amount","Sample volume (mL)","Leave blank for concentration only. This tool does not select a dose.")}</div></details>
    </>:<>{field("total","Total in container (mg)","Copy the total amount printed on the vial label.")}{field("volume","Final volume (mL)","Use your product instructions. Final volume is not always the amount of water added.")}</>}
   </div>

   <UnitHelp/>
   {product.kind==="single"&&<BeginnerHelp kind="amount"/>}
   <div className="bac-result-card mt-5 break-words [overflow-wrap:anywhere]" data-product-result role="status" aria-live="polite" aria-atomic="true">{result.ready?result.lines.map((line,i)=><p className="mt-2 first:mt-0" key={i}>{line}</p>):result.text}</div>
   {product.kind==="single"&&<details className="mt-6 border-t pt-5" open={shared.amount.trim()?true:undefined}><summary className="cursor-pointer py-2 text-base font-semibold">Optional: amount and schedule</summary><div className="mt-4"><AmountScheduleFields/></div></details>}
   <p className="mt-4 text-sm text-muted-foreground">{product.kind==="spray"?"Do not add BAC water based on this tool. It does not calculate spray counts or injection units.":product.kind==="blend"?"A premixed blend stays one product. The total combines all ingredients; an individual breakdown requires each labeled amount. No ratio is guessed.":product.kind==="water"?"This only adds your entered volumes. It does not tell you which liquid to use.":"U-100 means 100 scale units per mL. Check the actual device and its capacity. These are not product activity units."}</p>
   <p className="mt-3 text-xs text-muted-foreground">No dose, treatment, or storage period is selected. Entries stay in this tab for this session when storage is available. Results show up to eight significant digits.</p>
  </section>
  <WorkspaceActions><Button type="button" variant="outline" onClick={()=>{if(product.kind==="single")shared.clear();else set(emptyProductValues(product));}}>Clear inputs</Button>{result.ready&&<CopyButton value={result.text+". Arithmetic only; check product instructions."} label="Copy result"/>}</WorkspaceActions>
 </CalculatorWorkspace>;
}
