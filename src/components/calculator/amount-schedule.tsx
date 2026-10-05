"use client";
import { useId, useState } from "react";
import { useCalculationSession, setMassUnit } from "@/lib/session/calculation-session";
import { amountSchedule, scheduleNumber, type AmountSchedule } from "@/lib/calc/amount-schedule";
import { convertMassText } from "@/lib/calc/mass-text";
import { BrandSelect } from "./brand-select";
import styles from "./amount-schedule.module.css";

export const SCHEDULE_OPTIONS = [
  {value:"none",label:"One calculation. No schedule."},
  {value:"1",label:"Once a week"},{value:"2",label:"Twice a week"},{value:"3",label:"Three times a week"},
  {value:"7",label:"Every day (once a day)"},{value:"14",label:"Twice a day"},
  {value:"21",label:"Three times a day"},{value:"28",label:"Four times a day"},
  {value:"custom",label:"Other number of times each week"},
] as const;
export const isCustomSchedule = (value:string) => !["","1","2","3","7","14","21","28"].includes(value);
export type ScheduleSection = "all" | "basis" | "unit" | "amount" | "schedule" | "custom";

export function AmountScheduleFields({value,onChange,compact=false,section="all",custom,onCustom}: {
  value?:AmountSchedule;onChange?:(value:AmountSchedule)=>void;compact?:boolean;section?:ScheduleSection;
  custom?:boolean;onCustom?:(value:boolean)=>void;
} = {}) {
  const id=useId(), session=useCalculationSession();
  const [customOpen,setCustomOpen]=useState(false),[unitError,setUnitError]=useState("");
  const s = value ? { ...value, patch:(patch:Partial<AmountSchedule>)=>onChange?.({...value,...patch}) } : session;
  const r=amountSchedule(s), show=(part:ScheduleSection)=>section==="all"||section===part;
  const customSelected=custom??(customOpen||isCustomSchedule(s.timesPerWeek));
  const display=(mcg:number)=>`${scheduleNumber(mcg/(s.amountUnit==="mg"?1000:1))} ${s.amountUnit}`;
  const amountLabel=s.basis==="each"?"Amount for one time":s.basis==="day"?"Total amount for one day":"Total amount for one week";
  const unitSelect=<BrandSelect label="Amount unit" value={s.amountUnit} options={[{value:"mg",label:"mg"},{value:"mcg",label:"mcg"}]} onChange={v=>{
    const unit=v as "mg"|"mcg", converted=convertMassText(s.amount,s.amountUnit);
    if(s.amount.trim() && (converted.kind!=="value" || converted[unit].length>64)){setUnitError("Check the number before changing its unit.");return;}
    setUnitError("");if(!value)setMassUnit("amount",unit);else onChange?.({...value,amount:converted.kind==="value"?converted[unit]:"",amountUnit:unit});
  }}/>;
  return <div className={`${styles.root} ${compact ? styles.compact : ""}`} data-amount-schedule data-schedule-section={section}>
    {show("basis")&&<fieldset><legend>This amount is for</legend><div className={styles.basis}>
      {([["each","One time","The amount each time."],["day","Whole day","A total to split over one day."],["week","Whole week","A total to split over one week."]] as const).map(([basis,title,hint])=><label key={basis} className={styles.choice}><input type="radio" name={`${id}-basis`} checked={s.basis===basis} onChange={()=>{
        if(basis===s.basis)return;
        // An old per-time amount must never silently become a daily or weekly total.
        s.patch({basis,amount:"",timesPerWeek:""});setCustomOpen(false);onCustom?.(false);
      }}/><span><strong>{title}</strong>{!compact&&<small>{hint}</small>}</span></label>)}
    </div><details className={styles.explanation}><summary>Amount and schedule help</summary>
      <p>Choose <strong>One time</strong> if the number is for each time. Choose <strong>Whole day</strong> or <strong>Whole week</strong> if the number is a total to split.</p>
      <p>Example math: 2 mg each time, twice a week, totals 4 mg. A 2 mg weekly total split twice is 1 mg each time. These are examples, not suggested amounts.</p>
      <p>If amounts change from day to day, make a separate calculation for each amount. Do not average them. Check with the person who supplied your instructions if the meaning is unclear.</p>
    </details></fieldset>}
    {section==="unit"&&<div className={styles.field}><label>Amount unit</label>{unitSelect}<p>Copy mg or mcg from your instructions. Changing units keeps the same amount.</p></div>}
    {show("amount")&&<div className={styles.field}><label htmlFor={`${id}-amount`}>{amountLabel}{section!=="all"&&<span aria-hidden="true"> ({s.amountUnit})</span>}</label>
      <div className={styles.inputRow}><input id={`${id}-amount`} data-schedule-amount type="text" inputMode="decimal" autoComplete="off" maxLength={64} value={s.amount} onChange={e=>{s.patch({amount:e.target.value});setUnitError("");}} aria-describedby={`${id}-amount-help`} aria-invalid={Boolean(s.amount.trim())&&convertMassText(s.amount,s.amountUnit).kind!=="value"}/>
      {section==="all"&&<div className={styles.unit}>Unit{unitSelect}</div>}</div>
      <p id={`${id}-amount-help`}>Copy the amount from your instructions. This is not the total in the vial.</p>
    </div>}
    {unitError&&<p className={styles.error} role="alert">{unitError}</p>}
    {show("schedule")&&<div className={styles.field}><label htmlFor={`${id}-frequency`}>Schedule from your instructions</label>
      <BrandSelect id={`${id}-frequency`} label="Schedule from your instructions" value={customSelected?"custom":s.timesPerWeek||"none"} onChange={v=>{
        const isCustom=v==="custom";setCustomOpen(isCustom);onCustom?.(isCustom);s.patch({timesPerWeek:isCustom?"?":v==="none"?"":v});
      }} options={SCHEDULE_OPTIONS.filter(option=>s.basis!=="day"||!["1","2","3"].includes(option.value)).map(option=>option.value==="none"&&s.basis!=="each"?{value:"none",label:"Choose a schedule"}:option)}/>
      <p>{s.basis==="each"?"Use a schedule you already have, or choose one calculation.":"We need this to split your total. Use the schedule you already have."}</p>
    </div>}
    {(section==="custom"||(section==="all"&&customSelected))&&<label className={styles.custom}>Times in a full week<input type="text" inputMode="numeric" maxLength={2} value={s.timesPerWeek==="?"?"":s.timesPerWeek} onChange={e=>s.patch({timesPerWeek:e.target.value||"?"})}/></label>}
    {section==="all"&&r.ready&&<div className={styles.summary} role="status" aria-live="polite"><p>What your entries mean</p><dl><div><dt>Each time</dt><dd>{display(r.eachMcg)}</dd></div>{r.scheduled&&<div><dt>Total for one week</dt><dd>{display(r.weeklyMcg)}</dd></div>}</dl></div>}
    {!r.ready&&s.amount.trim()&&["all","schedule","custom"].includes(section)&&<p className={styles.error} role="alert">{r.message}</p>}
    {section==="amount"&&s.amount.trim()&&convertMassText(s.amount,s.amountUnit).kind!=="value"&&<p className={styles.error} role="alert">Enter a number greater than zero.</p>}
  </div>;
}
export function SessionValuesNotice() { const s=useCalculationSession();return !s.persistent?<p className={styles.carried} role="status">Browser storage is unavailable. Your numbers can follow links in this tab, but may be lost if you refresh or close it.</p>:s.carried?<p className={styles.carried} role="status">Your numbers came with you. Check that they match this product’s label. <button type="button" onClick={()=>s.patch({carried:false})}>Checked</button><button type="button" onClick={s.clear}>Start fresh</button></p>:null; }
