import type { SupplierProduct } from "./supplier-catalog";
import { positiveDecimal } from "@/lib/calc/number-text";
export interface IngredientInput {name:string;mass:string}
export interface ProductValues {total:string;volume:string;amount:string;count:string;ingredient:string;ingredients:IngredientInput[];blendMode?:"total"|"ingredients"}
// Ingredient identity only, checked against the supplier listings on 2026-09-26.
// Amounts and ratios must always come from the visitor's actual label.
const BLEND_INGREDIENTS: Readonly<Record<string, readonly string[]>> = {
 "glow": ["BPC-157", "TB-500", "GHK-Cu"],
 "klow": ["BPC-157", "TB-500", "GHK-Cu", "KPV"],
 "cjc-ipa-no-dac": ["CJC-1295 (No DAC)", "Ipamorelin"],
 "wolverine-stack": ["BPC-157", "TB-500"],
};
export const blendIngredients=(product?:SupplierProduct)=>product&&Object.hasOwn(BLEND_INGREDIENTS,product.id)?BLEND_INGREDIENTS[product.id]:undefined;
const ingredientKey=(name:string)=>name.toLowerCase().replace(/[^a-z0-9]/g, "");
export const emptyProductValues=(product?:SupplierProduct):ProductValues=>({total:"",volume:"",amount:"",count:"",ingredient:"",blendMode:"total",ingredients:(blendIngredients(product)||["",""]).map(name=>({name,mass:""}))});
export function readProductValues(raw:unknown,product?:SupplierProduct):ProductValues {
 const r=raw&&typeof raw==="object"&&!Array.isArray(raw)?raw as Record<string,unknown>:{};
 const text=(v:unknown)=>typeof v==="string"?v.slice(0,80):"";
 const rows=Array.isArray(r.ingredients)?r.ingredients.slice(0,6):[];
 const saved=rows.map(item=>({name:text(item?.name),mass:text(item?.mass)}));
 const expected=blendIngredients(product);
 // Never relabel an old amount by position. Only restore a uniquely matching ingredient.
 const ingredients=expected?expected.map(name=>{
  const matches=saved.filter(row=>ingredientKey(row.name)===ingredientKey(name));
  return {name,mass:matches.length===1?matches[0].mass:""};
 }):saved.length>=2?saved:emptyProductValues(product).ingredients;
 return {total:text(r.total),volume:text(r.volume),amount:text(r.amount),count:text(r.count),ingredient:text(r.ingredient),blendMode:r.blendMode==="ingredients"?"ingredients":"total",ingredients};
}
export function numberLabel(n:number):string {return n!==0&&(Math.abs(n)<1e-6||Math.abs(n)>=1e9)?n.toExponential(7).replace(/\.?0+e/,"e"):new Intl.NumberFormat("en-US",{maximumSignificantDigits:8,useGrouping:false}).format(n);}
export function productCalculation(product:SupplierProduct,values:ProductValues):{ready:boolean;text:string;lines:string[]} {
 const need=(text:string)=>({ready:false,text,lines:[] as string[]});
 const done=(lines:string[])=>({ready:true,text:lines.join("; "),lines});
 const n=(v:string)=>positiveDecimal(v);
 if(product.kind==="blend"){
  const v=n(values.volume),sample=n(values.amount);
  if(!v)return need("Enter the final volume from your product instructions.");
  if(values.amount.trim()&&!sample)return need("Enter a positive sample volume, or leave it blank for concentration only.");
  if(sample&&sample>v)return need("The sample volume is larger than the final volume. Check your numbers.");
  if(values.blendMode!=="ingredients"){
   const total=n(values.total);
   if(!total)return need("Enter the total blend mass from the label and the final volume.");
   return done([`${numberLabel(total/v)} mg/mL total blend concentration`,...(sample?[`${numberLabel(total/v*sample)} mg total blend in ${numberLabel(sample)} mL`]:[]),"This is the combined mass. Individual ingredient amounts cannot be determined from the total alone."]);
  }
  const expected=blendIngredients(product);
  if(expected&&(values.ingredients.length!==expected.length||expected.some(name=>values.ingredients.filter(row=>ingredientKey(row.name)===ingredientKey(name)).length!==1)))return need(`This product contains ${expected.join(", ")}. Enter each ingredient separately from its label.`);
  if(values.ingredients.length<2||values.ingredients.length>6||values.ingredients.some(i=>!i.name.trim()||!n(i.mass)))return need("For an ingredient breakdown, copy every ingredient’s amount from the label. No ratio is assumed.");
  return done(values.ingredients.map(i=>`${i.name.trim()}: ${numberLabel(n(i.mass)!/v)} mg/mL${sample?`; ${numberLabel(n(i.mass)!/v*sample)} mg in your sample`:""}`));
 }
 if(product.kind==="spray"){
  const c=n(values.total),sample=n(values.amount);
  const blend=product.id==="bpc-tb-spray",individual=blend&&values.blendMode==="ingredients";
  if(!c||!sample||(individual&&!values.ingredient.trim()))return need("Enter the label concentration and a sample volume. For an individual ingredient, name the ingredient you are checking.");
  const label=blend?(individual?values.ingredient.trim()+": ":"Total blend: "):"";
  return done([`${label}${numberLabel(c*sample)} mg (${numberLabel(c*sample*1000)} mcg) in ${numberLabel(sample)} mL`,...(blend&&!individual?["Combined mass only. Individual amounts require their own labeled concentrations."]:[])]);
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
