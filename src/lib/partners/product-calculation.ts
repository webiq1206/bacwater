import type { SupplierProduct } from "./supplier-catalog";
import { positiveDecimal } from "@/lib/calc/number-text";
export interface IngredientInput {name:string;mass:string}
export interface ProductValues {total:string;volume:string;amount:string;count:string;ingredient:string;ingredients:IngredientInput[]}
export const emptyProductValues=():ProductValues=>({total:"",volume:"",amount:"",count:"",ingredient:"",ingredients:[{name:"",mass:""},{name:"",mass:""}]});
export function readProductValues(raw:unknown):ProductValues {
 const r=raw&&typeof raw==="object"&&!Array.isArray(raw)?raw as Record<string,unknown>:{};
 const text=(v:unknown)=>typeof v==="string"?v.slice(0,80):"";
 const rows=Array.isArray(r.ingredients)?r.ingredients.slice(0,6):[];
 return {total:text(r.total),volume:text(r.volume),amount:text(r.amount),count:text(r.count),ingredient:text(r.ingredient),ingredients:rows.length>=2?rows.map(item=>({name:text(item?.name),mass:text(item?.mass)})):emptyProductValues().ingredients};
}
export function numberLabel(n:number):string {return n!==0&&(Math.abs(n)<1e-6||Math.abs(n)>=1e9)?n.toExponential(7).replace(/\.?0+e/,"e"):new Intl.NumberFormat("en-US",{maximumSignificantDigits:8,useGrouping:false}).format(n);}
export function productCalculation(product:SupplierProduct,values:ProductValues):{ready:boolean;text:string;lines:string[]} {
 const need=(text:string)=>({ready:false,text,lines:[] as string[]});
 const done=(lines:string[])=>({ready:true,text:lines.join("; "),lines});
 const n=(v:string)=>positiveDecimal(v);
 if(product.kind==="blend"){
  const v=n(values.volume),sample=n(values.amount);
  if(!v||!sample||values.ingredients.length<2||values.ingredients.length>6||values.ingredients.some(i=>!i.name.trim()||!n(i.mass)))return need("Copy each ingredient and its amount from the label. Then enter the final volume and sample volume.");
  if(sample>v)return need("The sample volume is larger than the final volume. Check your numbers.");
  return done(values.ingredients.map(i=>`${i.name.trim()}: ${numberLabel(n(i.mass)!/v)} mg/mL; ${numberLabel(n(i.mass)!/v*sample)} mg in your sample`));
 }
 if(product.kind==="spray"){
  const c=n(values.total),sample=n(values.amount);
  if(!c||!sample||(product.id==="bpc-tb-spray"&&!values.ingredient.trim()))return need("Enter the label concentration and a sample volume. For a blend, name the ingredient you are checking.");
  return done([`${values.ingredient.trim()?values.ingredient.trim()+": ":""}${numberLabel(c*sample)} mg (${numberLabel(c*sample*1000)} mcg) in ${numberLabel(sample)} mL`]);
 }
 if(product.kind==="water"){
  const per=n(values.volume),bottle=n(values.total),count=/^[1-9]\d{0,5}$/.test(values.count)?Number(values.count):null;
  if(!per||!bottle||!count)return need("Enter the volume per container, a whole number of containers, and the bottle volume.");
  const total=per*count;if(!Number.isSafeInteger(Math.ceil(total/bottle)))return need("The bottle count is too large to count exactly. Check the units.");return done([`${numberLabel(total)} mL total`,`${Math.ceil(total/bottle)} bottle${Math.ceil(total/bottle)===1?"":"s"} by volume, before any loss`]);
 }
 const total=n(values.total),v=n(values.volume),amount=n(values.amount);
 if(!total||!v||!amount)return need("Enter all three label values using positive numbers.");
 if(amount/1000>total)return need("The amount to measure is larger than the stated total. Check mg and mcg.");
 const c=total/v,ml=amount/1000/c;
 if(![c,ml,ml*100].every(x=>Number.isFinite(x)&&x>0))return need("These values are outside the supported numeric range.");
 return done([`${numberLabel(c)} mg/mL`,`${numberLabel(ml)} mL = ${numberLabel(ml*100)} U-100 scale units`]);
}
