"use client";
import { type SetStateAction } from "react";
import { useSessionDraft, useCalculationSession, readCalculation, patchCalculation } from "@/lib/session/calculation-session";
import { convertMassText } from "@/lib/calc/mass-text";
import { eachAmountText } from "@/lib/calc/amount-schedule";

function sharedField(key:string):"vial"|"amount"|"volume"|null {
  if(["bacwater.tool.reverse.mass.v2","bacwater.tool.inventory.mass.v2"].includes(key))return "vial";
  if(["bacwater.tool.reverse.amount.v2","bacwater.tool.inventory.amount.v2"].includes(key))return "amount";
  if(["bacwater.tool.bacwater.volume.v2","bacwater.tool.inventory.volume.v2"].includes(key))return "volume";
  if(key.startsWith("bacwater.compound.")&&!key.startsWith("bacwater.compound.hcg."))return key.endsWith(".mass")?"vial":key.endsWith(".amount")?"amount":key.endsWith(".volume")?"volume":null;
  return null;
}
/** Tab-scoped persistence plus typed bridges for compatible arithmetic inputs. */
export function usePersistentState<T>(key:string,initial:T) {
  const [local,setLocal]=useSessionDraft(key,initial),s=useCalculationSession(),field=sharedField(key);
  function value(){const c=readCalculation(),m=convertMassText(c.vialInput,c.vialUnit);return field==="vial"?(m.kind==="value"?m.mg:c.vialInput):field==="amount"?eachAmountText(c):c.finalVolume;}
  const m=convertMassText(s.vialInput,s.vialUnit);
  const shared=field==="vial"?(m.kind==="value"?m.mg:s.vialInput):field==="amount"?eachAmountText(s):s.finalVolume;
  function set(next:SetStateAction<T>){
    if(!field){setLocal(next);return;}
    const v=String(typeof next==="function"?(next as (v:T)=>T)(value() as T):next);
    patchCalculation(field==="vial"?{vialInput:v,vialUnit:"mg"}:field==="amount"?{amount:v,amountUnit:"mcg",basis:"each"}:{finalVolume:v});
  }
  return [field?shared as T:local,set] as const;
}
