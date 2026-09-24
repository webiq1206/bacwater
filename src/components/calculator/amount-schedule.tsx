"use client";
import { useId, useState } from "react";
import { useCalculationSession, setMassUnit } from "@/lib/session/calculation-session";
import { amountSchedule, scheduleNumber, type AmountSchedule } from "@/lib/calc/amount-schedule";
import { convertMassText } from "@/lib/calc/mass-text";
import styles from "./amount-schedule.module.css";
export function AmountScheduleFields({value,onChange}:{value?:AmountSchedule;onChange?:(value:AmountSchedule)=>void} = {}) {
  const id=useId(), session=useCalculationSession();
  const [customOpen,setCustomOpen]=useState(false),[unitError,setUnitError]=useState("");
  const s = value ? { ...value, patch:(patch:Partial<AmountSchedule>)=>onChange?.({...value,...patch}) } : session;
  const r=amountSchedule(s);
  const display=(mcg:number)=>`${scheduleNumber(mcg/(s.amountUnit==="mg"?1000:1))} ${s.amountUnit}`;
  return <div className={styles.root} data-amount-schedule>
    <fieldset><legend>What does the amount in your instructions mean?</legend><div className={styles.basis}>
      {([["each","For one time","The amount each time."],["day","For the whole day","Split a daily total."],["week","For the whole week","Split a weekly total."]] as const).map(([basis,title,hint])=><label key={basis} className={styles.choice}><input type="radio" name={`${id}-basis`} checked={s.basis===basis} onChange={()=>s.patch({basis})}/><span><strong>{title}</strong><small>{hint}</small></span></label>)}
    </div></fieldset>
    <div className={styles.field}><label htmlFor={`${id}-amount`}>{s.basis==="each"?"Amount for one time":s.basis==="day"?"Total amount for one day":"Total amount for one week"}</label>
      <div className={styles.inputRow}><input id={`${id}-amount`} data-schedule-amount type="text" inputMode="decimal" autoComplete="off" maxLength={64} value={s.amount} onChange={e=>{s.patch({amount:e.target.value});setUnitError("");}} aria-describedby={`${id}-amount-help`} />
      <label className={styles.unit}>Unit<select aria-label="Amount unit" value={s.amountUnit} onChange={e=>{
        const unit=e.target.value as "mg"|"mcg", converted=convertMassText(s.amount,s.amountUnit);
        if(s.amount.trim() && (converted.kind!=="value" || converted[unit].length>64)){setUnitError("Check the number before changing its unit.");return;}
        setUnitError("");if(!value)setMassUnit("amount",unit);else onChange?.({...value,amount:converted.kind==="value"?converted[unit]:"",amountUnit:unit});
      }}><option value="mg">mg</option><option value="mcg">mcg</option></select></label></div>
      <p id={`${id}-amount-help`}>Copy the number and unit from your instructions. This is not the total amount in the bottle.</p>
    </div>
    {unitError&&<p className={styles.error} role="alert">{unitError}</p>}
    <div className={styles.field}><label htmlFor={`${id}-frequency`}>How often do your instructions say?</label><select id={`${id}-frequency`} value={customOpen||!["","1","2","3","7","14","21","28"].includes(s.timesPerWeek)?"custom":s.timesPerWeek} onChange={e=>{setCustomOpen(e.target.value==="custom");s.patch({timesPerWeek:e.target.value==="custom"?"?":e.target.value});}}>
      <option value="">Just one calculation. No schedule.</option><option value="1">Once a week</option><option value="2">Twice a week</option><option value="3">Three times a week</option><option value="7">Every day (once a day)</option><option value="14">Twice a day</option><option value="21">Three times a day</option><option value="28">Four times a day</option><option value="custom">Other number of times each week</option>
    </select>{(customOpen||!["","1","2","3","7","14","21","28"].includes(s.timesPerWeek))&&<label className={styles.custom}>Times in a full week<input type="text" inputMode="numeric" maxLength={2} value={s.timesPerWeek==="?"?"":s.timesPerWeek} onChange={e=>s.patch({timesPerWeek:e.target.value||"?"})}/></label>}
    <p>Use only a schedule you already have. Choose no schedule to check one amount without a weekly total.</p></div>
    {r.ready?<div className={styles.summary} role="status" aria-live="polite"><p>Here is what your entries mean</p><dl><div><dt>Each time</dt><dd>{display(r.eachMcg)}</dd></div>{r.scheduled&&<div><dt>Total for one week</dt><dd>{display(r.weeklyMcg)}</dd></div>}</dl>
      <p>{s.basis==="each"?`Your amount stays ${display(r.eachMcg)} each time.${r.scheduled?` ${r.count} times in a week makes ${display(r.weeklyMcg)} total.`:" No weekly schedule is assumed."}`:s.basis==="week"?`${display(r.weeklyMcg)} for the week ÷ ${r.count} times = ${display(r.eachMcg)} each time.`:`${s.amount} ${s.amountUnit} for the day ÷ ${r.count/7} times = ${display(r.eachMcg)} each time.`}</p>
    </div>:s.amount.trim()&&<p className={styles.error} role="alert">{r.message}</p>}
    <details className={styles.explanation}><summary>Not sure which option to pick?</summary><p>If your instructions give an amount each time, choose <strong>For one time</strong>. If they give one total to divide over a day or week, choose that total instead. Never enter a weekly total as the amount for one time.</p><p>For example, 2 mg each time, twice a week, is 4 mg for the week. But 2 mg for the whole week, split twice, is 1 mg each time. These are different calculations, not suggested amounts.</p><p>A schedule that changes from day to day needs a separate calculation for each amount. Do not average it. Ask the person who supplied your instructions if their meaning is unclear.</p></details>
  </div>;
}
export function SessionValuesNotice() { const s=useCalculationSession();return !s.persistent?<p className={styles.carried} role="status">Browser storage is unavailable. Your numbers can follow links in this tab, but may be lost if you refresh or close it.</p>:s.carried?<p className={styles.carried} role="status">Your numbers came with you. Check that they match this product’s label. <button type="button" onClick={()=>s.patch({carried:false})}>Checked</button><button type="button" onClick={s.clear}>Start fresh</button></p>:null; }
