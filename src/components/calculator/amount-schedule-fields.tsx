"use client";
import { useId, useState } from "react";
import { positiveDecimal } from "@/lib/calc/number-text";
import { FREQUENCIES, frequencyCount, frequencyLabel, resolveAmountSchedule, amountText, switchAmountBasis, switchAmountUnit, type AmountSchedule } from "@/lib/calc/amount-schedule";
import styles from "./amount-schedule.module.css";

export function AmountScheduleFields({ value, onChange, compactQuestion = false }: { value: AmountSchedule; onChange: (value: AmountSchedule) => void; compactQuestion?: boolean }) {
  const id = useId();
  const [custom, setCustom] = useState(false), [notice, setNotice] = useState("");
  const result = resolveAmountSchedule(value);
  const choice = value.frequency && !FREQUENCIES.some(f => f.value === value.frequency) ? "custom" : value.frequency;
  const customShown = custom || choice === "custom";
  const update = (patch: Partial<AmountSchedule>) => { setNotice(""); onChange({ ...value, ...patch }); };
  return <div className={styles.root} data-amount-schedule>
    <fieldset className={styles.basis} data-compact-question={compactQuestion}><legend>What does the amount in your instructions mean?</legend>
      <div className={styles.choices}>{(["each", "week"] as const).map(basis => <label className={styles.choice} key={basis} data-selected={value.basis === basis}>
        <input type="radio" name={`${id}-basis`} value={basis} checked={value.basis === basis} onChange={() => {
          const next = switchAmountBasis(value, basis); onChange(next);
          setNotice(value.amount ? next.amount ? "The number changed to keep the same amount each time." : "Enter the amount for this choice. Your other numbers are still here." : "");
        }} /><span><strong>{basis === "each" ? "Each time" : "Whole week"}</strong><small>{basis === "each" ? "The amount for one time." : "A weekly total to split equally."}</small></span>
      </label>)}</div>
    </fieldset>
    <div className={styles.amount}>
      <label htmlFor={`${id}-amount`}>{value.basis === "each" ? "Amount each time" : "Total amount for the whole week"}</label>
      <div className={styles.inputRow}><input id={`${id}-amount`} data-schedule-amount type="text" inputMode="decimal" autoComplete="off" maxLength={64} value={value.amount} onChange={e => update({ amount: e.target.value })} aria-describedby={`${id}-hint ${id}-error`} aria-invalid={!!value.amount && positiveDecimal(value.amount) === null}/>
        <div role="group" aria-label="Amount unit" className={styles.units}>{(["mg", "mcg"] as const).map(unit => <button key={unit} type="button" aria-pressed={unit === value.amountUnit} onClick={() => onChange(switchAmountUnit(value, unit))}>{unit}</button>)}</div>
      </div>
      <p id={`${id}-hint`}>Copy your own amount and its unit. This is not the total in the vial.</p>
    </div>
    <div className={styles.frequency}>
      <label htmlFor={`${id}-frequency`}>{value.basis === "week" ? "How many times will you split that weekly total?" : "How often do your instructions say?"}</label>
      <select id={`${id}-frequency`} value={customShown ? "custom" : value.frequency} onChange={e => { setCustom(e.target.value === "custom"); update({ frequency: e.target.value === "custom" ? "?" : e.target.value }); }}>
        <option value="">{value.basis === "each" ? "No schedule: calculate one amount" : "Choose the schedule from your instructions"}</option>
        {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        <option value="custom">Other: enter times per week</option>
      </select>
      {customShown && <div className={styles.custom}><label htmlFor={`${id}-custom`}>Times per week</label><input id={`${id}-custom`} type="text" inputMode="numeric" maxLength={2} value={value.frequency === "?" ? "" : value.frequency} onChange={e => update({ frequency: e.target.value || "?" })} aria-invalid={!!value.frequency && !frequencyCount(value.frequency)}/></div>}
      <p>{value.basis === "each" ? "The amount each time stays the same. Frequency only changes the weekly total." : "The weekly total stays the same. More times means a smaller amount each time."}</p>
    </div>
    {result.ready && <div className={styles.summary} role="status" aria-live="polite" aria-atomic="true">
      <div><span>Each time</span><strong>{amountText(result.eachMcg, value.amountUnit)} {value.amountUnit}</strong></div>
      {result.count && <><div><span>{frequencyLabel(value.frequency)}</span><strong>{result.count} time{result.count === 1 ? "" : "s"} / week</strong></div><div><span>Whole week</span><strong>{amountText(result.weeklyMcg!, value.amountUnit)} {value.amountUnit}</strong></div>
        <p>{value.basis === "week" ? `${amountText(result.weeklyMcg!, value.amountUnit)} ${value.amountUnit} per week ÷ ${result.count} = ${amountText(result.eachMcg, value.amountUnit)} ${value.amountUnit} each time.` : `${amountText(result.eachMcg, value.amountUnit)} ${value.amountUnit} each time × ${result.count} = ${amountText(result.weeklyMcg!, value.amountUnit)} ${value.amountUnit} per week.`}</p></>}
    </div>}
    <p id={`${id}-error`} className={styles.error} role={value.amount && !result.ready ? "alert" : undefined}>{value.amount && !result.ready ? result.error : ""}</p>
    {notice && <p role="status" className={styles.note}>{notice}</p>}
    <details className={styles.help}><summary>Not sure what to enter?</summary><p>Do not guess. Check the amount, unit and schedule in your existing instructions. The calculator does not choose them. If different days use different amounts, calculate each amount separately. Do not use a weekly average.</p></details>
  </div>;
}
