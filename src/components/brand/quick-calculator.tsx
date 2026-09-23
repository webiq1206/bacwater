"use client";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, RotateCcw, Copy, Check, Equal } from "lucide-react";
import { QUICK_EXAMPLE, quickCalculation, type QuickMode, type QuickValues } from "@/lib/brand/quick-calculation";
import styles from "./research-hero.module.css";
const tabs: { id: QuickMode; label: string }[] = [
  { id: "concentration", label: "Concentration" }, { id: "mass", label: "mg to mcg" }, { id: "units", label: "U-100 to mL" }
];
const destinations: Record<QuickMode,string> = {concentration:"/tools/bac-water",mass:"/tools/mg-to-mcg",units:"/tools/syringe-units"};
export function QuickCalculator() {
  const uid = useId(), refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [mode, setMode] = useState<QuickMode>("concentration"), [values,setValues]=useState<QuickValues>({...QUICK_EXAMPLE});
  const [copied,setCopied]=useState(false), [message,setMessage]=useState("");
  const result=quickCalculation(mode,values);
  const nonempty=mode==="concentration"?Boolean(values.amount.trim()&&values.volume.trim()):Boolean(values[mode==="mass"?"mass":"units"].trim());
  const invalid=nonempty&&!result;
  function select(id:QuickMode){setMode(id);setCopied(false);setMessage("");}
  function keydown(e:KeyboardEvent<HTMLButtonElement>,index:number){
    let to:number|undefined;
    if(e.key==="ArrowRight")to=(index+1)%tabs.length;
    if(e.key==="ArrowLeft")to=(index+tabs.length-1)%tabs.length;
    if(e.key==="Home")to=0;if(e.key==="End")to=tabs.length-1;
    if(to!==undefined){e.preventDefault();select(tabs[to].id);refs.current[to]?.focus();}
  }
  function update(key:keyof QuickValues,text:string){setValues(v=>({...v,[key]:text}));setCopied(false);setMessage("");}
  async function copy(){
    if(!result)return;
    try{if(!navigator.clipboard?.writeText)throw new Error("unavailable");await navigator.clipboard.writeText(result.formula);setCopied(true);setMessage("Calculation copied.");}
    catch{setMessage("Copy is unavailable in this browser. Select the calculation text below.");}
  }
  const field=(key:keyof QuickValues,label:string,unit:string)=><div className={styles.field}>
    <label htmlFor={`${uid}-${key}`}>{label}</label><div className={styles.inputWrap}>
    <input id={`${uid}-${key}`} value={values[key]} onChange={e=>update(key,e.target.value)} type="text" inputMode="decimal" maxLength={64} autoComplete="off" spellCheck={false} aria-invalid={invalid} aria-describedby={`${uid}-help ${uid}-error`}/><span>{unit}</span></div></div>;
  return <div id="quick-calculator" className={styles.calculator}>
    <div className={styles.cardTop}><span className={styles.cardBrand}><Equal aria-hidden="true" size={16}/> QUICK CALCULATOR</span><span className={styles.liveLabel}>EDIT & EXPLORE</span></div>
    <div role="tablist" aria-label="Quick calculation type" className={styles.tabs}>{tabs.map((tab,i)=><button key={tab.id} id={`${uid}-tab-${tab.id}`} role="tab" type="button" aria-selected={mode===tab.id} aria-controls={`${uid}-panel`} tabIndex={mode===tab.id?0:-1} ref={el=>{refs.current[i]=el;}} onClick={()=>select(tab.id)} onKeyDown={e=>keydown(e,i)}>{tab.label}</button>)}</div>
    <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${mode}`} className={styles.panel}>
      <div className={styles.fields}>
        {mode==="concentration"?<>{field("amount","Amount on the label","mg")}{field("volume","Total liquid after mixing","mL")}</>:mode==="mass"?<>{field("mass","Amount in mg","mg")}<p className={styles.conversionNote}>1 milligram<br/><strong>1,000 micrograms</strong></p></>:<>{field("units","U-100 scale units","units")}<p className={styles.conversionNote}>100 U-100 units<br/><strong>1 milliliter</strong></p></>}
      </div>
      <div className={styles.result} aria-live="polite" aria-atomic="true">
        <div className={styles.resultTop}><span>{result?.label||(mode==="concentration"?"Concentration":"Conversion")}</span><span aria-hidden="true">{result?<Check size={15}/>:<Equal size={15}/>}</span></div>
        <p className={styles.resultValue}>{result?<><strong className={result.value.length>12?styles.longValue:undefined}>{result.value}</strong><span>{result.unit}</span></>:<span className={styles.emptyValue}>Enter your values</span>}</p>
        <p className={styles.formula}>{result?.formula||"Your result will appear here."}</p>
      </div>
      <p id={`${uid}-error`} className={styles.error} role={invalid?"alert":undefined}>{invalid?(mode==="mass"?"Use a non-negative decimal, without commas or a unit suffix.":"Enter positive decimals from 0.000000000001 to 1,000,000,000,000."):""}</p>
      <div className={styles.cardActions}><button type="button" onClick={copy} disabled={!result}><Copy size={14} aria-hidden="true"/>{copied?"Copied":"Copy calculation"}</button><button type="button" onClick={()=>{setValues({...QUICK_EXAMPLE});setMessage("");setCopied(false);}}><RotateCcw size={14} aria-hidden="true"/>Reset example</button></div>
      <p id={`${uid}-help`} className={styles.inputHelp}>Example numbers. Use your own instructions.{mode==="units"?" Check that your device says U-100.":mode==="mass"?" This changes mg to mcg, not mL.":" Use the total liquid, not a guessed amount of water."}</p>
      <p role="status" className={styles.copyMessage}>{message}</p>
    </div>
    <Link href={destinations[mode]} className={styles.cardFooter}>Open the full {mode==="concentration"?"calculator":"converter"}<ArrowUpRight size={17} aria-hidden="true"/></Link>
  </div>;
}
