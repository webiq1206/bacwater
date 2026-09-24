"use client";
import { useId, useState } from "react";
import { amountTiming, switchAmountUnit, TIMING_CHOICES, type AmountTiming } from "@/lib/calc/amount-timing";
import { BeginnerHelp } from "@/components/plan/beginner-help";
import styles from "./amount-and-timing.module.css";
export function AmountAndTiming({value,onChange,showHelp=true}:{value:AmountTiming;onChange:(value:AmountTiming)=>void;showHelp?:boolean}) {
 const id=useId(),[custom,setCustom]=useState(false),summary=amountTiming(value);
 const customVisible=custom || (!!value.frequency&&!TIMING_CHOICES.some(c=>c.value===value.frequency));
 return <div className={styles.block} data-amount-timing>
  <fieldset className={styles.choiceSet}><legend className={styles.legend}>Is your amount for each time or the whole week?</legend>
   <div className={styles.choices}>{([{id:"each",title:"Each time",text:"The amount for one use."},{id:"week",title:"Whole week",text:"A weekly total to split."}] as const).map(choice=><label className={styles.choice} key={choice.id}><input type="radio" name={`${id}-basis`} value={choice.id} checked={value.basis===choice.id} onChange={()=>onChange({...value,basis:choice.id})}/><span><strong>{choice.title}</strong><small>{choice.text}</small></span></label>)}</div>
  </fieldset>
  <div className={styles.amountRow}><label htmlFor={`${id}-amount`}>{value.basis==="week"?"Total amount for the week":value.basis==="each"?"Amount for each use":"Amount from your instructions"}<input id={`${id}-amount`} data-timing-amount aria-label="Amount from your instructions" type="text" inputMode="decimal" autoComplete="off" maxLength={64} value={value.amount} placeholder="Your number" onChange={e=>onChange({...value,amount:e.target.value})} aria-describedby={`${id}-units ${id}-summary`}/></label>
  <label htmlFor={`${id}-unit`}>Unit<select id={`${id}-unit`} aria-label="Amount unit" value={value.amountUnit} onChange={e=>onChange(switchAmountUnit(value,e.target.value as "mg"|"mcg"))}><option value="mg">mg</option><option value="mcg">mcg</option></select></label></div>
  <p className={styles.unitsHint} id={`${id}-units`}>Copy the number and unit from your instructions. 1 mg = 1,000 mcg. This is not the total amount in the bottle.</p>
  <fieldset className={styles.choiceSet}><legend className={styles.legend}>How often do your instructions say?</legend><div className={styles.timing}>
   <p>{value.basis==="week"?"We split the weekly total into equal amounts. Choose the timing you already have.":"Timing changes the weekly total, not the amount for each use."}</p>
   <div className={styles.timingGrid}>{TIMING_CHOICES.map(choice=><button key={choice.value} type="button" aria-pressed={value.frequency===choice.value} onClick={()=>{setCustom(false);onChange({...value,frequency:choice.value});}}>{choice.label}</button>)}</div>
   <button type="button" className={styles.none} aria-pressed={customVisible} onClick={()=>{setCustom(true);onChange({...value,frequency:""});}}>Other timing</button>{value.basis!=="week"&&<button type="button" className={styles.none} style={{marginLeft:8}} aria-pressed={!value.frequency&&!customVisible} onClick={()=>{setCustom(false);onChange({...value,frequency:""});}}>Just one use</button>}
   {customVisible&&<label className={styles.custom}>How many times in one week?<input aria-label="Uses per week" inputMode="numeric" type="text" value={value.frequency} maxLength={2} placeholder="Your count" onChange={e=>onChange({...value,frequency:e.target.value})}/></label>}
  </div></fieldset>
  <div className={styles.summary} id={`${id}-summary`} role="status" aria-live="polite" aria-atomic="true"><strong>{summary.kind==="value"?"Here is what you entered":"One more detail"}</strong><p>{summary.kind==="value"?summary.explanation:summary.message}</p>{value.basis==="week"&&<p>Different amounts on different days? Choose Each time and check each amount separately. This tool does not decide a schedule.</p>}</div>
  {showHelp&&<BeginnerHelp kind="amount"/>}
 </div>;
}
