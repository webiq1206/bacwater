"use client";

import { useId, useState } from "react";
import { amountSchedule, scheduleNumber, type AmountSchedule } from "@/lib/calc/amount-schedule";
import { convertMassText } from "@/lib/calc/mass-text";
import { BrandSelect } from "./brand-select";
import { SCHEDULE_OPTIONS, isCustomSchedule } from "./amount-schedule";
import styles from "./amount-schedule.module.css";

/**
 * One dose, one unit, one number. The unit comes first so nobody types a
 * number and then watches it change when they pick the unit. Daily and
 * weekly totals stay out of the way until someone says they have one.
 */
export function GuidedAmountFields({value,onChange}: {value:AmountSchedule;onChange:(value:AmountSchedule)=>void}) {
  const id=useId(), [error,setError]=useState("");
  const result=amountSchedule(value), custom=isCustomSchedule(value.timesPerWeek);
  const label=value.basis==="week"?"Total amount for one week":value.basis==="day"?"Total amount for one day":"Amount each time";
  const display=(mcg:number)=>`${scheduleNumber(mcg/(value.amountUnit==="mg"?1000:1))} ${value.amountUnit}`;
  const converted=convertMassText(value.amount,value.amountUnit);
  const equivalent=converted.kind==="value"&&value.amount.trim()?(value.amountUnit==="mcg"?`= ${converted.mg} mg`:`= ${converted.mcg} mcg`):"";
  const totals=value.basis!=="each"||!!value.timesPerWeek.trim();
  return <div className={`${styles.root} ${styles.guided}`} data-guided-amount>
    <div className={styles.field}><label htmlFor={`${id}-amount`}>{label}</label><div className={`${styles.inputRow} ${styles.unitFirst}`}>
      <div className={styles.unit}><BrandSelect label="Amount unit" value={value.amountUnit} options={[{value:"mcg",label:"mcg"},{value:"mg",label:"mg"}]} onChange={v=>{const unit=v as "mg"|"mcg", c=convertMassText(value.amount,value.amountUnit);if(value.amount.trim()&&(c.kind!=="value"||c[unit].length>64)){setError("Check the number before changing units.");return;}onChange({...value,amountUnit:unit,amount:c.kind==="value"?c[unit]:""});setError("");}}/></div>
      <input id={`${id}-amount`} type="text" inputMode="decimal" autoComplete="off" maxLength={64} placeholder={value.amountUnit==="mcg"?"Example: 250":"Example: 0.25"} value={value.amount} onChange={e=>{onChange({...value,amount:e.target.value});setError("");}} aria-describedby={`${id}-help`} aria-invalid={!!value.amount.trim()&&converted.kind!=="value"}/>
    </div><p id={`${id}-help`} className={styles.equivalent}>{equivalent||"Pick the unit written in your instructions, then type the number."}</p></div>
    {error&&<p className={styles.error} role="alert">{error}</p>}
    {value.amount.trim()&&!result.ready&&<p className={styles.error} role="alert">{result.message}</p>}
    <details className={styles.explanation} open={totals||undefined}>
      <summary>My instructions give a daily or weekly total</summary>
      <fieldset className={styles.entryMode}><legend>Is this one dose, or a total?</legend><div>
        {([{value:"each",label:"One dose"},{value:"week",label:"Weekly total"},{value:"day",label:"Daily total"}] as const).map(option=><label key={option.value}><input type="radio" name={`${id}-basis`} checked={value.basis===option.value} onChange={()=>{if(value.basis!==option.value){onChange({...value,basis:option.value as AmountSchedule["basis"],amount:""});setError("");}}}/><span>{option.label}</span></label>)}
      </div></fieldset>
      <div className={styles.field}>
        <label htmlFor={`${id}-frequency`}>How many times per week?</label>
        <BrandSelect id={`${id}-frequency`} label="How many times per week?" value={custom?"custom":value.timesPerWeek||"none"} onChange={v=>onChange({...value,timesPerWeek:v==="custom"?"?":v==="none"?"":v})}
          options={SCHEDULE_OPTIONS.filter(o=>value.basis!=="day"||!["1","2","3"].includes(o.value)).map(o=>o.value==="none"?{value:"none",label:value.basis==="each"?"Skip this":"Choose how often"}:o)}/>
        {custom&&<label className={styles.custom}>Times per week (1 to 28)<input inputMode="numeric" type="text" maxLength={2} value={value.timesPerWeek==="?"?"":value.timesPerWeek} onChange={e=>onChange({...value,timesPerWeek:e.target.value||"?"})}/></label>}
      </div>
      {result.ready&&result.scheduled&&<div className={styles.guidedTotal} role="status"><span>{value.basis==="each"?"Total for one week":"Each dose"}</span><strong>{display(value.basis==="each"?result.weeklyMcg:result.eachMcg)}</strong><small>{result.count} equal doses per week</small></div>}
    </details>
  </div>;
}
