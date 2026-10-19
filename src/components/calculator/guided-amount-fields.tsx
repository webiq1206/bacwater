"use client";

import { useId, useState } from "react";
import { amountSchedule, scheduleNumber, type AmountSchedule } from "@/lib/calc/amount-schedule";
import { convertMassText } from "@/lib/calc/mass-text";
import { BrandSelect } from "./brand-select";
import { SCHEDULE_OPTIONS, isCustomSchedule } from "./amount-schedule";
import styles from "./amount-schedule.module.css";

/** A clearer presentation of the same shared arithmetic, never a suggested schedule. */
export function GuidedAmountFields({value,onChange}: {value:AmountSchedule;onChange:(value:AmountSchedule)=>void}) {
  const id=useId(), [error,setError]=useState("");
  const result=amountSchedule(value), custom=isCustomSchedule(value.timesPerWeek);
  const label=value.basis==="week"?"Total amount for one week":value.basis==="day"?"Total amount for one day":"Amount each time";
  const display=(mcg:number)=>`${scheduleNumber(mcg/(value.amountUnit==="mg"?1000:1))} ${value.amountUnit}`;
  return <div className={`${styles.root} ${styles.guided}`} data-guided-amount>
    <div className={styles.field}><label htmlFor={`${id}-amount`}>{label}</label><div className={styles.inputRow}>
      <input id={`${id}-amount`} type="text" inputMode="decimal" autoComplete="off" maxLength={64} placeholder="Example: 250" value={value.amount} onChange={e=>{onChange({...value,amount:e.target.value});setError("");}} aria-describedby={`${id}-help`} aria-invalid={!!value.amount.trim()&&convertMassText(value.amount,value.amountUnit).kind!=="value"}/>
      <div className={styles.unit}><BrandSelect label="Amount unit" value={value.amountUnit} options={[{value:"mg",label:"mg"},{value:"mcg",label:"mcg"}]} onChange={v=>{const unit=v as "mg"|"mcg", converted=convertMassText(value.amount,value.amountUnit);if(value.amount.trim()&&(converted.kind!=="value"||converted[unit].length>64)){setError("Check the number before changing units.");return;}onChange({...value,amountUnit:unit,amount:converted.kind==="value"?converted[unit]:""});setError("");}}/></div>
    </div><p id={`${id}-help`}>Type the number and pick its unit. Your instructions say mcg or mg next to the number. 1 mg is 1,000 mcg.</p></div>
    <div className={styles.field}>
      <label htmlFor={`${id}-frequency`}>How many times per week?</label>
      <BrandSelect id={`${id}-frequency`} label="How many times per week?" value={custom?"custom":value.timesPerWeek||"none"} onChange={v=>onChange({...value,timesPerWeek:v==="custom"?"?":v==="none"?"":v})}
        options={SCHEDULE_OPTIONS.map(o=>o.value==="none"?{value:"none",label:value.basis==="each"?"Skip this (optional)":"Choose how often"}:o)}/>
      {custom&&<label className={styles.custom}>Times per week (1 to 28)<input inputMode="numeric" type="text" maxLength={2} value={value.timesPerWeek==="?"?"":value.timesPerWeek} onChange={e=>onChange({...value,timesPerWeek:e.target.value||"?"})}/></label>}
      <p>Optional. It only matters if your instructions give you a total for a day or a week.</p>
    </div>
    <fieldset className={styles.entryMode}><legend>Is this one dose, or a total?</legend><div>
      {([{value:"each",label:"One dose"},{value:"week",label:"Weekly total"},...(value.basis==="day"?[{value:"day",label:"Daily total"}]:[])] as const).map(option=><label key={option.value}><input type="radio" name={`${id}-basis`} checked={value.basis===option.value} onChange={()=>{if(value.basis!==option.value){onChange({...value,basis:option.value as AmountSchedule["basis"],amount:""});setError("");}}}/><span>{option.label}</span></label>)}
    </div></fieldset>
    {error&&<p className={styles.error} role="alert">{error}</p>}
    {value.amount.trim()&&!result.ready&&<p className={styles.error} role="alert">{result.message}</p>}
    {result.ready&&result.scheduled&&<div className={styles.guidedTotal} role="status"><span>{value.basis==="each"?"Total for one week":"Each time"}</span><strong>{display(value.basis==="each"?result.weeklyMcg:result.eachMcg)}</strong><small>{result.count} equal doses per week</small></div>}
  </div>;
}
