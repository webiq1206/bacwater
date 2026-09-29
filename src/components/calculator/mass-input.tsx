"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { convertMassText, type MassUnit } from "@/lib/calc/mass-text";
import { editMassField, switchMassField, syncMassField, type MassFieldDraft } from "@/lib/calc/mass-field";
/** Display units may change; the receiving calculator keeps its existing canonical unit. */
export function MassInput({id,label,value,onChange,canonicalUnit="mg",perMl=false,hint}:{id:string;label:string;value:string;onChange:(value:string)=>void;canonicalUnit?:MassUnit;perMl?:boolean;hint?:string}) {
 const [stored,setStored]=useState<MassFieldDraft>({unit:canonicalUnit,text:value,canonical:value});
 const [error,setError]=useState("");
 const draft=syncMassField(stored,value,canonicalUnit);
 const suffix=perMl?"/mL":"";
 const validation=convertMassText(draft.text,draft.unit);
 return <div className="min-w-0"><label htmlFor={id} className="block text-sm font-medium">{`${label} (${draft.unit}${suffix})`}</label><div className="mt-2 flex items-center gap-2">
  <Input id={id} type="text" inputMode="decimal" maxLength={64} autoComplete="off" value={draft.text} className="min-h-12 min-w-0 flex-1" aria-describedby={`${id}-unit-help`} aria-invalid={Boolean(error)||validation.kind==="error"||draft.canonical==="invalid"} onChange={e=>{const next=editMassField(draft,e.target.value,canonicalUnit);setStored(next);setError("");onChange(next.canonical);}}/>
  <select aria-label={`${label} unit`} value={draft.unit} className="min-h-12 max-w-[8rem] shrink-0 rounded-md border border-border bg-background px-2 text-sm" onChange={e=>{const next=switchMassField(draft,e.target.value as MassUnit);if(!next){setError("Check the number before changing its unit. Your entry has been kept.");return;}setStored(next);setError("");}}><option value="mg">mg{suffix}</option><option value="mcg">mcg{suffix}</option></select>
 </div><p id={`${id}-unit-help`} className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint?`${hint} `:""}Changing units keeps the same {perMl?"concentration":"amount"}.</p>{error&&<p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}</div>;
}
