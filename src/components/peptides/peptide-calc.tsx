"use client";
import { useEffect } from "react";
import { useSessionDraft, chooseCalculationProduct } from "@/lib/session/calculation-session";
import { productForReference } from "@/lib/partners/supplier-catalog";
import { PlanForm } from "@/components/plan/plan-form";
import { QuestionSteps, type Question } from "@/components/calculator/question-steps";
import { MassInput } from "@/components/calculator/mass-input";
import { productDisplayName } from "@/lib/partners/supplier-catalog";
import { SessionValuesNotice, AmountScheduleFields } from "@/components/calculator/amount-schedule";
import { SupplyChecklist } from "@/components/tools/supply-checklist";
import { positiveDecimal } from "@/lib/calc/number-text";
import { usePersistentState } from "@/lib/use-persistent-state";
import { CalculatorWorkspace } from "@/components/calculator/calculator-workspace";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/copy-button";
interface Props {peptideName:string;peptideSlug?:string;commonVialStrengthsMg:number[];suggestedDoseMcg:number;standalone?:boolean;}
export function PeptideCalc({peptideName,peptideSlug,standalone=false}:Props){
 peptideName=productDisplayName(peptideSlug||"",peptideName);
 const [step,setStep]=useSessionDraft(`compound-questions:${peptideSlug}`,"mass");
 useEffect(()=>{if(standalone&&peptideSlug&&peptideSlug!=="hcg"){const product=productForReference(peptideSlug);chooseCalculationProduct(product?.id||"","single",peptideSlug);}},[standalone,peptideSlug]);
 const iu=peptideSlug==="hcg";const [mass,setMass]=usePersistentState(`bacwater.compound.${peptideSlug}.mass`,"");const [volume,setVolume]=usePersistentState(`bacwater.compound.${peptideSlug}.volume`,"");const [amount,setAmount]=usePersistentState(`bacwater.compound.${peptideSlug}.amount`,"");
 const m=Number(mass),v=Number(volume),a=Number(amount);const empty=!mass.trim()||!volume.trim()||!amount.trim();
 const valid=!empty&&[mass,volume,amount].every(n=>positiveDecimal(n)!==null);const c=m/v,ml=(iu?a:a/1000)/c,u=ml*100;
 const usable=valid&&a<=m&&[c,ml,u].every(n=>Number.isFinite(n)&&n>0);
 const text=usable?`${c.toLocaleString('en-US',{maximumSignificantDigits:8})} ${iu?'IU':'mg'}/mL; ${ml.toLocaleString('en-US',{maximumSignificantDigits:8})} mL; ${u.toLocaleString('en-US',{maximumSignificantDigits:8})} U-100 units`:'';
 if(!standalone)return <section className="rounded-2xl border-2 bg-card p-5 sm:p-8" aria-label={`${peptideName} calculation`}>
  <h2 className="text-xl font-serif">Calculate without distractions.</h2>
  <p className="mt-3 text-sm">Open the full-screen calculator. Use the amounts and final volume from your own instructions.</p>
  <Button asChild variant="brand" className="mt-5 min-h-12"><Link href={`/calculate/${peptideSlug || "custom"}`}>Open {peptideName} calculator</Link></Button>
  <p className="mt-3 text-xs text-muted-foreground">No account needed. We check math, not what you should take.</p>
 </section>;
 if(!iu)return <CalculatorWorkspace title={`${peptideName} calculator`} description="One question at a time. Copy the numbers from your label." backHref={`/peptides/${peptideSlug || "custom"}`}><PlanForm mode="beginner"/></CalculatorWorkspace>;
 const fields=[{id:"mass",label:"Total in container (IU)",title:"How many IU are in the container?",value:mass,set:setMass,hint:"Copy the total IU from the product label. These are product activity units."},{id:"amount",label:"Amount for one time (IU)",title:"What amount do your instructions give?",value:amount,set:setAmount,hint:"Enter the IU for one time. This tool does not choose an amount."},{id:"volume",label:"Final volume (mL)",title:"What is the final liquid volume?",value:volume,set:setVolume,hint:"Use the final volume from your instructions."}];
 const questions:Question[]=fields.map(field=>({id:field.id,label:field.label,title:field.title,hint:field.hint,complete:positiveDecimal(field.value)!==null,content:<><label htmlFor={`compound-${field.id}`}>{field.label}</label><Input id={`compound-${field.id}`} type="text" inputMode="decimal" maxLength={64} value={field.value} onChange={e=>field.set(e.target.value)} className="mt-2 min-h-12" aria-invalid={!!field.value.trim()&&positiveDecimal(field.value)===null}/>{field.value.trim()&&positiveDecimal(field.value)===null&&<p role="alert" className="mt-2 text-sm text-destructive">Enter a number greater than zero within the supported range.</p>}</>}));
 questions.push({id:"review",label:"Result",title:"Here are your numbers",complete:usable,content:<><div role="status" aria-live="polite" className="bac-result-card break-words">{usable?text:a>m?"The amount for one time is larger than the container total. Check the IU values.":"Check your numbers. The result is outside the supported range."}</div><details className="mt-4"><summary className="min-h-11 cursor-pointer py-2">Review or change answers</summary>{fields.map(field=><button type="button" className="block min-h-11 text-sm underline" key={field.id} onClick={()=>setStep(field.id)}>{field.label}: {field.value}</button>)}</details><p className="mt-4 text-sm">Product IU and U-100 scale units are different. U-100 means 100 scale units per mL. Check the actual device and its capacity.</p></>});
 return <CalculatorWorkspace title={`${peptideName} calculator`} description="One question at a time. Use IU from the product label." backHref={`/peptides/${peptideSlug || "custom"}`} help={<SupplyChecklist volumeMl={usable?v:undefined} measurementMl={usable?ml:undefined}/>}> <section className="bac-calc-card mx-auto w-full max-w-3xl p-5 sm:p-7" aria-label={`${peptideName} calculation`}><QuestionSteps questions={questions} current={step} onStep={setStep} onClear={()=>{setMass("");setAmount("");setVolume("");}} finalAction={usable?<CopyButton value={text+". Arithmetic only; verify product and device instructions."} label="Copy calculation"/>:undefined}/><p className="mt-3 text-xs text-muted-foreground">Research math only. No amount, mixing method, or device is selected for you.</p></section></CalculatorWorkspace>;
}
