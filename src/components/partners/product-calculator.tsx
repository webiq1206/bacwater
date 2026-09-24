"use client";
import { useId } from "react";
import type { SupplierProduct } from "@/lib/partners/supplier-catalog";
import { emptyProductValues, readProductValues, productCalculation, type ProductValues } from "@/lib/partners/product-calculation";
import { usePersistentState } from "@/lib/use-persistent-state";
import { CalculatorWorkspace, WorkspaceActions } from "@/components/calculator/calculator-workspace";
import { CopyButton } from "@/components/common/copy-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export function ProductCalculator({product}:{product:SupplierProduct}){
 const id=useId(),[raw,set]=usePersistentState(`bacwater.product.${product.id}.v1`,emptyProductValues());
 const values=readProductValues(raw),result=productCalculation(product,values);
 const field=(key:keyof Omit<ProductValues,"ingredients">,label:string,hint?:string)=><div key={key} className="min-w-0"><label htmlFor={`${id}-${key}`} className="block text-sm font-medium">{label}</label><Input id={`${id}-${key}`} type="text" inputMode={key==="ingredient"?"text":key==="count"?"numeric":"decimal"} value={values[key]} maxLength={key==="ingredient"?80:32} onChange={e=>set({...values,[key]:e.target.value})} aria-describedby={hint?`${id}-${key}-help`:undefined} className="mt-2 min-h-12"/>{hint&&<p id={`${id}-${key}-help`} className="mt-2 text-xs text-muted-foreground">{hint}</p>}</div>;
 const description=product.kind==="water"?"Add up liquid volumes you already know.":product.kind==="spray"?"This is a ready-made solution. Check its label, not a mixing recipe.":product.kind==="blend"?"Keep each ingredient separate. Copy its amount from the label.":"Enter your label numbers. We show the concentration and volume.";
 return <CalculatorWorkspace title={`${product.name} calculator`} description={description} backHref="/recommendations" help={<p>All products are listed for lab research only, not for people or animals. This calculation does not verify a product or tell you what to use. The supplier link opens the exact product page. Images are our own artwork, not packaging.</p>}>
  <section className="bac-calc-card p-5 sm:p-7" aria-label="Product calculation inputs" style={{maxWidth:760,marginInline:"auto"}}>
   <div className="grid gap-5 sm:grid-cols-2">
    {product.kind==="water"?<>{field("volume","Liquid volume per container (mL)")}{field("count","Number of containers")}{field("total","Volume per bottle (mL)")}</>:product.kind==="spray"?<>{product.id==="bpc-tb-spray"&&field("ingredient","Ingredient from the label")}{field("total","Label concentration (mg/mL)","For a blend, use the concentration of one named ingredient, not a combined total.")}{field("amount","Sample volume (mL)")}</>:product.kind==="blend"?<>
     {values.ingredients.map((ingredient,index)=><fieldset className="min-w-0 rounded-lg border p-3" key={index}><legend className="px-1 text-sm">Ingredient {index+1}</legend><label htmlFor={`${id}-name-${index}`} className="text-sm">Ingredient {index+1} name</label><Input id={`${id}-name-${index}`} value={ingredient.name} maxLength={80} onChange={e=>set({...values,ingredients:values.ingredients.map((row,i)=>i===index?{...row,name:e.target.value}:row)})}/><label htmlFor={`${id}-mass-${index}`} className="mt-3 block text-sm">Ingredient {index+1} amount (mg)</label><Input id={`${id}-mass-${index}`} type="text" inputMode="decimal" value={ingredient.mass} maxLength={32} onChange={e=>set({...values,ingredients:values.ingredients.map((row,i)=>i===index?{...row,mass:e.target.value}:row)})}/></fieldset>)}
     <div className="flex flex-wrap gap-3 sm:col-span-2"><Button type="button" variant="outline" disabled={values.ingredients.length>=6} onClick={()=>set({...values,ingredients:[...values.ingredients,{name:"",mass:""}]})}>Add ingredient</Button>{values.ingredients.length>2&&<Button type="button" variant="outline" onClick={()=>set({...values,ingredients:values.ingredients.slice(0,-1)})}>Remove last ingredient</Button>}</div>
     {field("volume","Final volume (mL)")}{field("amount","Sample volume (mL)")}
    </>:<>{field("total","Total in container (mg)")}{field("volume","Final volume (mL)","Use your product instructions. Final volume is not always the amount of water added.")}{field("amount","Amount to measure (mcg)","Use an amount from instructions you already have. 1 mg = 1,000 mcg.")}</>}
   </div>
   <div className="bac-result-card mt-5 break-words [overflow-wrap:anywhere]" role="status" aria-live="polite" aria-atomic="true">{result.ready?result.lines.map((line,i)=><p className="mt-2 first:mt-0" key={i}>{line}</p>):result.text}</div>
   <p className="mt-4 text-sm text-muted-foreground">{product.kind==="spray"?"Do not add BAC water based on this tool. It does not calculate spray counts or injection units.":product.kind==="blend"?"No ratio is guessed. Each result uses that ingredient’s entered mass and the same final volume.":product.kind==="water"?"This only adds your entered volumes. It does not tell you which liquid to use.":"U-100 means 100 scale units per mL. Check the actual device and its capacity. These are not product activity units."}</p>
   <p className="mt-3 text-xs text-muted-foreground">No dose, treatment, or storage period is selected. Entries stay on this device when storage is available. Results show up to eight significant digits.</p>
  </section>
  <WorkspaceActions><Button type="button" variant="outline" onClick={()=>set(emptyProductValues())}>Clear inputs</Button>{result.ready&&<CopyButton value={result.text+". Arithmetic only; check product instructions."} label="Copy result"/>}</WorkspaceActions>
 </CalculatorWorkspace>;
}
