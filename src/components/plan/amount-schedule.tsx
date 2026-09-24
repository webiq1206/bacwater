"use client";
import { useId, useState } from "react";
import { amountSchedule, scheduleLabel, scheduleNumber, type AmountEntry } from "@/lib/calc/amount-schedule";
import { massText } from "@/lib/calculator-session";
import { BeginnerHelp } from "./beginner-help";
import styles from "./amount-schedule.module.css";
const choices = [{ value: 1, label: "Once a week" }, { value: 2, label: "Twice a week" }, { value: 3, label: "3 times a week" }, { value: 7, label: "Once a day" }, { value: 14, label: "Twice a day" }];
export function AmountSchedule({ value, onChange, amountLabel }: { value: AmountEntry; onChange: (patch: Partial<AmountEntry>) => void; amountLabel?: string }) {
  const id = useId(), result = amountSchedule(value);
  const [custom, setCustom] = useState(false);
  const showCustom = custom || (value.frequency !== null && !choices.some(c => c.value === value.frequency));
  const label = value.basis === "week" ? "Total amount for the whole week" : "Amount for one time";
  function changeBasis(basis: AmountEntry["basis"]) {
    // The number comes from the user's instructions. Do not rewrite it when
    // they clarify whether it applies once or to a whole week.
    onChange({ basis });
  }
  return <div className={styles.root} data-amount-schedule>
    <fieldset className={styles.fieldset}><legend>Is your amount for one time or the whole week?</legend>
      <div className={styles.bases}>{([{ key: "each", title: "Amount each time", sub: "The same amount for one measurement." }, { key: "week", title: "Total for the week", sub: "One weekly total, split into equal amounts." }] as const).map(item => <label key={item.key} data-active={value.basis === item.key}>
        <input type="radio" name={`${id}-basis`} value={item.key} checked={value.basis === item.key} onChange={() => changeBasis(item.key)} /><span><strong>{item.title}</strong><small>{item.sub}</small></span>
      </label>)}</div>
    </fieldset>
    <div className={styles.amount}><label htmlFor={`${id}-amount`}>{label}</label><div>
      <input id={`${id}-amount`} aria-label={amountLabel || label} type="text" inputMode="decimal" value={value.amount} maxLength={64} autoComplete="off" placeholder="Enter your amount" onChange={e => onChange({ amount: e.target.value })} aria-invalid={result.kind === "error"} aria-describedby={`${id}-amount-help ${id}-error`} />
      <label className={styles.unit}>Unit<select aria-label="Amount unit" value={value.unit} onChange={e => { const unit = e.target.value as "mg" | "mcg"; onChange({ unit, amount: massText(value.amount, value.unit, unit) }); }}><option value="mg">mg</option><option value="mcg">mcg</option></select></label>
    </div><p id={`${id}-amount-help`}>Copy the number and unit from your instructions. This is not the total in the vial.</p></div>
    <fieldset className={styles.fieldset}><legend>How often? (optional for one amount)</legend><p>Use the schedule from your own instructions.</p>
      <div className={styles.frequencies}>{choices.map(choice => <label key={choice.value} data-active={value.frequency === choice.value}><input type="radio" name={`${id}-frequency`} checked={!custom && value.frequency === choice.value} onChange={() => { setCustom(false); onChange({ frequency: choice.value }); }} /><span>{choice.label}</span></label>)}<label data-active={showCustom}><input type="radio" name={`${id}-frequency`} checked={showCustom} onChange={()=>{setCustom(true);onChange({frequency:null});}}/><span>Other schedule</span></label></div>
      {showCustom && <label className={styles.custom}>Other: times in one week<input aria-label="Times per week" type="number" min={1} max={28} step={1} inputMode="numeric" value={value.frequency ?? ""} onChange={e => onChange({ frequency: e.target.value === "" ? null : Number(e.target.value) })} /></label>}
      <button type="button" className={styles.skip} onClick={() => { setCustom(false); onChange({ frequency: null }); }} aria-pressed={value.frequency === null}>No schedule. Just check one amount.</button>
      {value.basis === "week" && value.frequency === null && <p className={styles.caution}>A weekly total needs a schedule. Choose how many times to split it, or select Amount each time.</p>}
    </fieldset>
    {result.kind === "value" && <div className={styles.summary} role="status" aria-live="polite"><strong>Your numbers mean</strong><p><b>{scheduleNumber(result.eachMcg / (value.unit === "mg" ? 1000 : 1))} {value.unit}</b> each time.</p><p>{value.basis === "week" && result.frequency !== null ? <>{value.amount} {value.unit} for the week ÷ {result.frequency} times = <b>{scheduleNumber(result.eachMcg / (value.unit === "mg" ? 1000 : 1))} {value.unit} each time.</b></> : result.frequency === null ? "One amount only. No weekly total or schedule is assumed." : <>{scheduleLabel(result.frequency)}: {scheduleNumber(result.eachMcg / (value.unit === "mg" ? 1000 : 1))} {value.unit} × {result.frequency} = <b>{scheduleNumber(result.weeklyMcg! / (value.unit === "mg" ? 1000 : 1))} {value.unit} in one week.</b></>}</p><small>{value.basis === "each" ? "Changing how often does not change the amount each time." : "The number you entered is the whole week, not one time."}</small></div>}
    <p id={`${id}-error`} role={result.kind === "error" ? "alert" : undefined} className={result.kind === "error" ? styles.caution : "sr-only"}>{result.kind === "error" ? result.message : ""}</p>
    <BeginnerHelp kind="amount" />
    <details className={styles.explanation}><summary>How do amount and schedule work together?</summary><p>Math example only: 4 mg each time, twice a week, adds up to 8 mg per week. A total of 4 mg for the whole week, split twice a week, is 2 mg each time. They are not the same.</p><p>Changing the schedule does not change concentration. Concentration only uses the total amount in the vial and the final liquid volume. This tool does not choose an amount, schedule, or preparation method.</p></details>
  </div>;
}
