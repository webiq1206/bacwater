"use client";
import { useEffect } from "react";
import { useCalculationSession, setMassUnit, resumeMassCalculation, chooseCalculationProduct } from "@/lib/session/calculation-session";
import { positiveDecimal } from "@/lib/calc/number-text";
import { eachAmountText } from "@/lib/calc/amount-schedule";
export type MassUnit="mg"|"mcg";
export interface StoredVial {peptideSlug:string;vialInput:number;vialUnit:MassUnit;doseInput:number;doseUnit:MassUnit}
export function vialMgOf(v:Pick<StoredVial,"vialInput"|"vialUnit">){return v.vialUnit==="mg"?v.vialInput:v.vialInput/1000;}
export function doseMcgOf(v:Pick<StoredVial,"doseInput"|"doseUnit">){return v.doseUnit==="mcg"?v.doseInput:Math.round(v.doseInput*100000)/100;}
export function useVialContext(){
 useEffect(resumeMassCalculation,[]);
 const s=useCalculationSession(),v={peptideSlug:s.peptideSlug,vialInput:s.vialInput.trim()?(positiveDecimal(s.vialInput)??NaN):0,vialUnit:s.vialUnit,doseInput:s.amount.trim()?(positiveDecimal(eachAmountText(s,s.amountUnit))??NaN):0,doseUnit:s.amountUnit};
 return {...v,vialText:s.vialInput,amountText:eachAmountText(s,s.amountUnit),setVialText:(text:string)=>s.patch({vialInput:text}),setAmountText:(text:string)=>s.patch({amount:text,basis:"each"}),vialMg:vialMgOf(v),doseMcg:doseMcgOf(v),
 setPeptideSlug:(slug:string)=>chooseCalculationProduct("","single",slug),
 setVialInput:(n:number)=>s.patch({vialInput:n===0?"":String(n)}),setVialUnit:(u:MassUnit)=>setMassUnit("vial",u),
 setVialMg:(n:number)=>s.patch({vialInput:n===0?"":String(n),vialUnit:"mg"}),
 setDoseInput:(n:number)=>s.patch({amount:n===0?"":String(n),basis:"each"}),setDoseUnit:(u:MassUnit)=>setMassUnit("amount",u),
 carriedOver:s.carried,clear:s.clear,hydrated:s.ready};
}
export type VialContext=ReturnType<typeof useVialContext>;
