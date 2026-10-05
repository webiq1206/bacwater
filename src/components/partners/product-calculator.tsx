"use client";
import { CalculationOutcome } from "@/components/calculator/calculation-events";
import { useId, useEffect, useState } from "react";
import { useCalculationSession, chooseCalculationProduct, useSessionDraft } from "@/lib/session/calculation-session";
import { eachAmountText, amountSchedule } from "@/lib/calc/amount-schedule";
import { convertMassText } from "@/lib/calc/mass-text";
import { editMassField, switchMassField, syncMassField, type MassFieldDraft } from "@/lib/calc/mass-field";
import { positiveDecimal } from "@/lib/calc/number-text";
import { AmountScheduleFields, SessionValuesNotice, isCustomSchedule, type ScheduleSection } from "@/components/calculator/amount-schedule";
import { BrandSelect } from "@/components/calculator/brand-select";
import { QuestionSteps, type Question } from "@/components/calculator/question-steps";
import type { SupplierProduct } from "@/lib/partners/supplier-catalog";
import { emptyProductValues, readProductValues, blendIngredients, productCalculation, type ProductValues } from "@/lib/partners/product-calculation";
import { usePersistentState } from "@/lib/use-persistent-state";
import { CalculatorWorkspace } from "@/components/calculator/calculator-workspace";
import { CopyButton } from "@/components/common/copy-button";
import { Input } from "@/components/ui/input";

export function ProductCalculator({product}:{product:SupplierProduct}) {
  const id=useId(),[raw,set]=usePersistentState(`bacwater.product.${product.id}.v1`,emptyProductValues(product));
  const [step,setStep]=useSessionDraft(`product-questions:${product.id}`,"start");
  const [massDrafts,setMassDrafts]=useSessionDraft<Record<string,MassFieldDraft>>(`product-mass-units:${product.id}`,{});
  const [sample,setSample]=useSessionDraft(`product-sample:${product.id}`,false);
  const [custom,setCustom]=useSessionDraft(`product-custom-schedule:${product.id}`,false);
  const [unitError,setUnitError]=useState("");
  const shared=useCalculationSession();
  const [contextRestored,setContextRestored]=useState(false);
  useEffect(()=>{setContextRestored(false);chooseCalculationProduct(product.id,product.kind,product.reference||"");setContextRestored(true);},[product.id,product.kind,product.reference]);
  const converted=convertMassText(shared.vialInput,shared.vialUnit);
  const values=product.kind==="single"?{...readProductValues(raw,product),total:converted.kind==="value"?converted.mg:shared.vialInput,volume:shared.finalVolume,amount:eachAmountText(shared)}:readProductValues(raw,product);
  const expectedIngredients=blendIngredients(product), customSchedule=custom||isCustomSchedule(shared.timesPerWeek);
  const calculated=productCalculation(product,values), total=positiveDecimal(values.total),volume=positiveDecimal(values.volume);
  const concentrationOnly=product.kind==="single"&&!sample&&!shared.amount.trim()&&total!==null&&volume!==null&&Number.isFinite(total/volume)&&total/volume>0;
  const result=concentrationOnly?{ready:true,text:`${Number((total!/volume!).toPrecision(10))} mg/mL`,lines:[`${Number((total!/volume!).toPrecision(10))} mg/mL`]}:calculated;
  const questions:Question[]=[];
  const valid=(text:string)=>positiveDecimal(text)!==null;
  function update(key:keyof Omit<ProductValues,"ingredients"|"blendMode">,value:string) {
    if(product.kind!=="single"){set({...values,[key]:value});return;}
    if(key==="total")shared.patch({vialInput:value,vialUnit:"mg"});
    if(key==="volume")shared.patch({finalVolume:value});
  }
  function field(key:string,label:string,value:string,onChange:(value:string)=>void,hint?:string,numeric=true) {
    return <div><label htmlFor={`${id}-${key}`} className="block text-sm font-medium">{label}</label><Input id={`${id}-${key}`} type="text" inputMode={numeric?"decimal":"text"} value={value} maxLength={numeric?64:80} onChange={e=>onChange(e.target.value)} aria-describedby={`${id}-${key}-help`} aria-invalid={numeric&&!!value.trim()&&!valid(value)} className="mt-2 min-h-12"/><p id={`${id}-${key}-help`} className="mt-2 text-sm text-muted-foreground">{hint}</p>{numeric&&value.trim()&&!valid(value)&&<p role="alert" className="mt-2 text-sm text-destructive">Enter a number greater than zero.</p>}</div>;
  }
  function numberQuestion(key:"total"|"volume"|"amount"|"count",label:string,title:string,hint:string) {
    questions.push({id:key,label,title,hint,complete:key==="count"?/^[1-9]\d{0,5}$/.test(values[key]):valid(values[key]),content:field(key,label,values[key],value=>update(key,value))});
  }
  function massQuestions(key:string,label:string,value:string,onChange:(value:string)=>void,perMl=false) {
    const stored=massDrafts[key], draft=syncMassField(stored&&["mg","mcg"].includes(stored.unit)?stored:{unit:"mg",text:value,canonical:value},value,"mg");
    const suffix=perMl?"/mL":"";
    questions.push({id:`${key}-unit`,label:"Label unit",title:`Which unit is shown for ${label.toLowerCase()}?`,complete:true,content:<><BrandSelect label={`${label} unit`} value={draft.unit} options={[{value:"mg",label:`mg${suffix}`},{value:"mcg",label:`mcg${suffix}`}]} onChange={value=>{const next=switchMassField(draft,value as "mg"|"mcg");if(!next){setUnitError("Check the number before changing its unit. Your entry is kept.");return;}setMassDrafts({...massDrafts,[key]:next});setUnitError("");}}/>{unitError&&<p role="alert" className="mt-2 text-sm text-destructive">{unitError}</p>}</>});
    questions.push({id:key,label,title:`What is ${label.toLowerCase()}?`,complete:valid(value),content:field(key,`${label} (${draft.unit}${suffix})`,draft.text,text=>{const next=editMassField(draft,text,"mg");setMassDrafts({...massDrafts,[key]:next});setUnitError("");onChange(next.canonical);},"Copy this number from the actual label.")});
  }
  const blend=product.kind==="blend",blendSpray=product.id==="bpc-tb-spray";
  if(blend||blendSpray)questions.push({id:"mode",label:"Calculation",title:"What do you want to check?",complete:true,content:<BrandSelect label="Blend calculation" value={values.blendMode||"total"} options={[{value:"total",label:"The whole premixed blend"},{value:"ingredients",label:blend?"Each ingredient":"One named ingredient"}]} onChange={mode=>set({...values,blendMode:mode as "total"|"ingredients",...(blendSpray?{total:"",ingredient:""}:{})})}/>,hint:"Use an ingredient breakdown only if the label lists each amount. We never guess a ratio."});
  if(product.kind==="water") {
    numberQuestion("volume","Liquid volume per container (mL)","How much liquid goes in each container?","Use the amount from your own instructions.");
    numberQuestion("count","Number of containers","How many containers are there?","Enter a whole number.");
    numberQuestion("total","Volume per bottle (mL)","How much liquid is in each bottle?","Copy the bottle volume from its label.");
  } else if(blend&&values.blendMode==="ingredients") {
    if(!expectedIngredients)questions.push({id:"ingredient-count",label:"Ingredient count",title:"How many ingredients are on the label?",complete:true,content:<BrandSelect label="Number of ingredients" value={String(values.ingredients.length)} options={[2,3,4,5,6].map(n=>({value:String(n),label:String(n)}))} onChange={v=>set({...values,ingredients:Array.from({length:Number(v)},(_,i)=>values.ingredients[i]||{name:"",mass:""})})}/>});
    values.ingredients.forEach((ingredient,index)=>{
      if(!expectedIngredients)questions.push({id:`ingredient-name-${index}`,label:`Ingredient ${index+1}`,title:`What is ingredient ${index+1} called?`,complete:!!ingredient.name.trim(),content:field(`name-${index}`,`Ingredient ${index+1} name`,ingredient.name,name=>set({...values,ingredients:values.ingredients.map((row,i)=>i===index?{...row,name,mass:""}:row)}),undefined,false)});
      massQuestions(`ingredient-${index}`,`${expectedIngredients?.[index]||ingredient.name||`Ingredient ${index+1}`} amount`,ingredient.mass,mass=>set({...values,ingredients:values.ingredients.map((row,i)=>i===index?{...row,mass}:row)}));
    });
  } else {
    if(blendSpray&&values.blendMode==="ingredients")questions.push({id:"ingredient-name",label:"Ingredient",title:"Which ingredient are you checking?",complete:!!values.ingredient.trim(),content:field("ingredient","Ingredient from the label",values.ingredient,value=>{set({...values,ingredient:value,total:""});},"Copy its exact name.",false)});
    massQuestions("total",blend?"Total blend in container":product.kind==="spray"?blendSpray&&values.blendMode!=="ingredients"?"Total blend concentration":"Label concentration":"Total in container",values.total,value=>update("total",value),product.kind==="spray");
  }
  if(product.kind!=="water") {
    if(product.kind!=="spray")numberQuestion("volume","Final volume (mL)","What is the final liquid volume?","Use the final volume from your instructions. This may differ from the water added.");
    if(blend||product.kind==="single") {
      const selected=sample||!!(product.kind==="single"?shared.amount:values.amount).trim();
      questions.push({id:"sample-choice",label:"Result type",title:"What would you like to see?",complete:true,content:<BrandSelect label="Result type" value={selected?"sample":"concentration"} options={[{value:"concentration",label:"Concentration only"},{value:"sample",label:blend?"Amount in a liquid sample":"Liquid volume for an amount"}]} onChange={value=>{setSample(value==="sample");if(value==="concentration"){if(product.kind==="single")shared.patch({amount:"",timesPerWeek:""});else set({...values,amount:""});}}}/>});
      if(selected&&blend)numberQuestion("amount","Sample volume (mL)","How much liquid is in the sample?","Enter a volume you already know. This tool does not choose it.");
      if(selected&&product.kind==="single") {
        const schedule=amountSchedule(shared),amountOnly=amountSchedule({...shared,basis:"each",timesPerWeek:""});
        const part=(section:ScheduleSection)=><AmountScheduleFields section={section} value={{amount:shared.amount,amountUnit:shared.amountUnit,basis:shared.basis,timesPerWeek:shared.timesPerWeek}} onChange={value=>{setSample(true);shared.patch(value);}} custom={customSchedule} onCustom={setCustom}/>;
        questions.push({id:"basis",label:"Amount meaning",title:"What does your amount mean?",complete:true,content:part("basis")},
          {id:"amount-unit",label:"Amount unit",title:"Which unit do your instructions use?",complete:true,content:part("unit")},
          {id:"amount",label:"Amount",title:"What amount do your instructions give?",complete:amountOnly.ready,content:part("amount")},
          {id:"schedule",label:"Schedule",title:"How often do your instructions say?",complete:customSchedule||schedule.ready,content:part("schedule")});
        if(customSchedule)questions.push({id:"custom-schedule",label:"Weekly count",title:"How many times in a full week?",complete:schedule.ready,content:part("custom")});
      }
    } else if(product.kind==="spray")numberQuestion("amount","Sample volume (mL)","How much liquid is in the sample?","Enter a known volume. This does not calculate spray counts.");
  }
  questions.push({id:"review",label:"Result",title:"Here are your numbers",complete:result.ready,content:<><div className="bac-result-card break-words [overflow-wrap:anywhere]" data-product-result role="status" aria-live="polite" aria-atomic="true">{result.ready?result.lines.map((line,i)=><p className="mt-2 first:mt-0" key={i}>{line}</p>):result.text}</div><details className="mt-5"><summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold">Review or change answers</summary><div className="grid gap-2">{questions.map(question=><button data-edit-question={question.id} key={question.id} type="button" className="min-h-11 text-left text-sm underline" onClick={()=>setStep(question.id)}>{question.title}</button>)}</div></details><p className="mt-4 text-sm text-muted-foreground">{product.kind==="spray"?"This is a ready-made solution. Do not add BAC water based on this tool.":blend?"All listed ingredients share the same liquid. No ratio is guessed.":product.kind==="water"?"These totals do not select a liquid or mixing method.":"U-100 means 100 scale units per mL. Match the actual device and its capacity."}</p></>});
  return <CalculatorWorkspace title={`${product.name} calculator`} description="One question at a time. Use your own label and instructions." backHref="/recommendations" help={<p>Research math only. This calculator does not select an amount, verify a product, or give instructions for use.</p>}>
    {product.kind==="single"&&<SessionValuesNotice/>}<CalculationOutcome ready={result.ready}/>
    <section className="bac-calc-card mx-auto w-full max-w-3xl p-5 sm:p-7" aria-label="Product calculation inputs">
      {contextRestored&&shared.ready?<QuestionSteps questions={questions} current={step} onStep={setStep} onClear={()=>{if(product.kind==="single")shared.clear();else set(emptyProductValues(product));setMassDrafts({});setSample(false);setCustom(false);}} finalAction={result.ready?<CopyButton value={result.text+". Arithmetic only; check product instructions."} label="Copy result"/>:undefined}/>:<p role="status">Restoring your calculation...</p>}
      <p className="mt-3 text-xs text-muted-foreground">Research math only. No dose, treatment, or storage period is selected. Results show up to eight significant digits.</p>
    </section>
  </CalculatorWorkspace>;
}
