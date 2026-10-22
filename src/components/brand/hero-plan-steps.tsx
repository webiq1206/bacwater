"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { Copy, Loader2, Save, Wand2 } from "lucide-react";
import { SYRINGES, findSyringe, type CalcResult, type SyringeType } from "@/lib/calc";
import { decimalError, positiveDecimal } from "@/lib/calc/number-text";
import { formatDose, formatDoseVolumeMl, formatNumeric, formatSyringeReading } from "@/lib/calc/format";
import { amountSchedule, type AmountSchedule } from "@/lib/calc/amount-schedule";
import { unitsText } from "@/lib/calc/bac-water-suggestion";
import { plainWarnings } from "@/lib/calc/plain-warnings";
import type { PlanPreviewState } from "@/lib/calc/plan-preview";
import { trackUsage } from "@/lib/analytics";
import { BeginnerHelp } from "@/components/plan/beginner-help";
import { ExploreProductResearch } from "@/components/partners/explore-product-research";
import { GuidedAmountFields } from "@/components/calculator/guided-amount-fields";
import { SyringeVisual } from "@/components/plan/syringe-visual";
import { BrandSelect } from "@/components/calculator/brand-select";
import { QuestionSteps, type Question } from "@/components/calculator/question-steps";
import { RememberOnDevice } from "@/components/calculator/remember-on-device";
import styles from "./hero-calculator.module.css";

interface Props {
  step: string; onStep: (step: string) => void;
  product: ReactNode; productChosen: boolean; customName?: ReactNode; secondary?: ReactNode;
  secondaryQuestions?: Question[];
  /** Lets someone skip the product list and go straight to their numbers. */
  onSkipProduct?: () => void;
  vialOptions: readonly number[];
  vial: string; unit: "mg" | "mcg"; onVial: (value: string) => void; onUnit: (unit: "mg" | "mcg") => void;
  amount: AmountSchedule; onAmount: (value: AmountSchedule) => void;
  volume: string; onVolume: (value: string) => void;
  date: string; onDate: (value: string) => void;
  device: SyringeType; onDevice: (value: SyringeType) => void;
  preview: PlanPreviewState; result: CalcResult;
  name: string; onName: (value: string) => void; onSave: () => void; saving: boolean;
  onClear: () => void; saveLabel: string; customSchedule: boolean; onCustom: (value: boolean) => void;
}

/** Plain words for each syringe, for someone who has never used one. */
const SYRINGE_HINTS: Record<SyringeType, string> = {
  "insulin-0.3ml": "Small insulin syringe. The biggest number printed on it is 30.",
  "insulin-0.5ml": "Medium insulin syringe. The biggest number printed on it is 50.",
  "insulin-1ml": "The most common insulin syringe. The biggest number printed on it is 100.",
  "tuberculin-1ml": "Marked in mL, not units. The biggest number printed on it is 1.",
  "syringe-3ml": "A larger syringe marked in mL. The biggest number printed on it is 3.",
};

/** Presentation only. PlanForm still owns validation, arithmetic and saving. */
export function HeroPlanSteps(p: Props) {
  const id = useId(), [notice, setNotice] = useState("");
  const syringe = findSyringe(p.device);
  const ready = p.preview.ready;
  const vialError = decimalError(p.vial, "Amount in vial") || p.preview.entries[1].issue;
  const volumeError = decimalError(p.volume, "Final liquid volume") || p.preview.entries[3].issue;
  const readout = formatSyringeReading(p.result.syringeReadout), volume = formatDoseVolumeMl(p.result.doseVolumeMl);
  const formula = `${formatNumeric(p.result.input.vialStrengthMg, 4)} mg ÷ ${p.volume} mL = ${p.preview.concentrationText}`;
  const u100 = p.result.syringeReadout.kind === "u100";
  const unitsNow = p.result.syringeUnits;
  const lineLabel = u100 ? unitsText(unitsNow) : formatNumeric(p.result.doseVolumeMl, 2);
  const doseEach = formatDose(p.result.schedule?.dosePerInjectionMcg ?? p.result.input.doseMcg);

  // Check entered mass against total mass without choosing a volume.
  const vialMg = p.preview.entries[1].complete ? (positiveDecimal(p.vial) ?? 0) / (p.unit === "mcg" ? 1000 : 1) : 0;
  const schedule = amountSchedule(p.amount);
  // The classic mistake: a dose typed in mg that was really mcg.
  const doseTooBig = vialMg > 0 && schedule.ready && schedule.eachMcg / 1000 > vialMg;
  const likelyMcg = doseTooBig && p.amount.amountUnit === "mg" && schedule.eachMcg / 1000 / 1000 <= vialMg;
  async function copy() {
    if (!ready) return;
    const text = `${p.result.input.peptideName}\nEntered final volume: ${p.volume} mL.\n${formula}\nEntered mass ${doseEach} corresponds to ${volume}: ${readout} on ${syringe.label}.\n${p.result.dosesPerVial} whole equal portions, ignoring losses.\nResearch arithmetic only; not dosing or preparation advice. Not for human use.\n${plainWarnings(p.result.warnings).join("\n")}`;
    try { await navigator.clipboard.writeText(text); setNotice("Copied."); trackUsage("result_copied"); }
    catch { setNotice("Copy is unavailable. Select and copy the numbers shown here."); }
  }

  const questions: Question[] = [
    {id:"product",label:"Product",title:"What is the name on your vial?",complete:p.productChosen,content:<div className={styles.startFields}>{p.product}{p.onSkipProduct&&<button type="button" className={styles.skipButton} onClick={()=>{p.onSkipProduct?.();p.onStep("vial");}}>Not listed? Skip and type my numbers</button>}<div className={styles.startGuide} data-hero-start-guide><p>Answer a few quick questions. <em>We do the math.</em></p><div className={styles.startOutputs}><div><strong>mL</strong><span>Entered final volume</span></div><div><strong>Line</strong><span>Volume scale equivalent</span></div><div><strong>Portions</strong><span>How many are in the vial</span></div></div><small>No account. Nothing is saved until you choose Save.</small></div></div>},
    ...(p.customName?[{id:"name",label:"Name",title:"What is your product called?",complete:p.preview.entries[0].complete,content:<>{p.customName}<p className={styles.stepHint}>Type the name exactly as it appears on your label.</p></>}]:[]),
    {id:"vial",label:"Vial amount",title:"What amount is on the vial?",complete:p.preview.entries[1].complete,content:<><p className={styles.stepHint}>Find the number next to <strong>mg</strong> on the vial label. If it says 5 mg, type 5.</p><div className={styles.vialChoices}>{p.vialOptions.slice(0,3).map(mg=><button type="button" key={mg} onClick={()=>p.onVial(String(p.unit==="mg"?mg:mg*1000))}>{mg} mg</button>)}</div><label className={styles.stepLabel} htmlFor={`${id}-vial`}>Amount in vial</label><div className={styles.inputWrap}><input id={`${id}-vial`} type="text" inputMode="decimal" maxLength={64} autoComplete="off" placeholder="Example: 5" value={p.vial} onChange={e=>p.onVial(e.target.value)} aria-invalid={!!vialError} aria-describedby={`${id}-vial-error`}/><BrandSelect label="Vial amount unit" value={p.unit} onChange={value=>p.onUnit(value as "mg"|"mcg")} options={[{value:"mg",label:"mg"},{value:"mcg",label:"mcg"}]}/></div><p id={`${id}-vial-error`} className={styles.error} role={vialError?"alert":undefined}>{vialError}</p><BeginnerHelp kind="vial"/></>},
    ...(p.secondaryQuestions||[]),
    {id:"amount",label:"Measurement",title:"What mass do you want to measure?",complete:p.preview.entries[2].complete&&!doseTooBig,content:<><p className={styles.stepHint}>Enter a mass for the calculation. The calculator does not choose an amount or schedule.</p><GuidedAmountFields value={p.amount} onChange={p.onAmount}/>
      {doseTooBig&&<div className={styles.fixCard} role="alert"><p><strong>That is more than the whole vial holds.</strong> {likelyMcg?`Check the unit on your source. Did you mean ${p.amount.amount} mcg?`:"Check the number and whether it should be mg or mcg."}</p>{likelyMcg&&<button type="button" onClick={()=>p.onAmount({...p.amount,amountUnit:"mcg"})}><Wand2 size={15} aria-hidden="true"/>Yes, use {p.amount.amount} mcg</button>}</div>}
      <BeginnerHelp kind="amount"/><ExploreProductResearch/></>},
    {id:"volume",label:"Final volume",title:"What is the final liquid volume?",complete:p.preview.entries[3].complete,content:<>
      <p className={styles.stepHint}>Enter an independently specified final liquid volume. Added water may not equal final volume. No preparation volume is suggested. Recheck any restored value; an earlier version may have suggested it.</p>
      <label className={styles.stepLabel} htmlFor={`${id}-volume`}>Final liquid volume</label><div className={styles.inputWrap}><input id={`${id}-volume`} type="text" inputMode="decimal" maxLength={64} autoComplete="off" placeholder="Example: 2" value={p.volume} onChange={e=>p.onVolume(e.target.value)} aria-invalid={!!volumeError} aria-describedby={`${id}-volume-error`}/><span>mL</span></div><p id={`${id}-volume-error`} className={styles.error} role={volumeError?"alert":undefined}>{volumeError}</p>
      <BeginnerHelp kind="volume"/></>},
    {id:"review",label:"Result",title:"Here are your numbers",complete:ready,content:<>
      {ready&&<div className={styles.result} data-live-result role="status" aria-live="polite" aria-atomic="true"><div className={styles.resultTop}><span>Calculated scale equivalent</span><button type="button" onClick={copy} aria-label="Copy result"><Copy size={16} aria-hidden="true"/></button></div><p className={styles.value}><strong className={lineLabel.length>6?styles.longValue:undefined}>{lineLabel}</strong>{" "}<span>{u100?"units":"mL"}</span><span className={styles.readout}>{readout} on {u100?"U-100":"mL"} scale · {volume}</span></p></div>}
      {ready&&<ol className={styles.todo} aria-label="Calculation details"><li><span>1</span><div><strong>Entered final volume: {p.volume} mL.</strong> Total mass: {formatNumeric(p.result.input.vialStrengthMg,4)} mg.</div></li><li><span>2</span><div><strong>Entered mass: {doseEach}.</strong> Volume equivalent: {volume}. Scale equivalent: {lineLabel} {u100?"U-100 units":"mL"}.</div></li><li><span>3</span><div><strong>{p.result.dosesPerVial} whole equal portions, ignoring losses.</strong> Concentration: {p.preview.concentrationText}.</div></li></ol>}
      {ready&&!p.result.syringeReadout.exceedsSyringe&&<SyringeVisual compact fillPercent={p.result.syringeReadout.fillPercent} readoutLabel={readout} scale={syringe.scale} maxValue={syringe.maxVolumeMl*(syringe.scale==="u100"?100:1)} maxLabel={syringe.label}/>}
      {ready&&plainWarnings(p.result.warnings).length>0&&<ul className={styles.stepWarnings}>{plainWarnings(p.result.warnings).map(warning=><li key={warning}>{warning}</li>)}</ul>}
      <details className={styles.syringeChange}><summary>Using a {syringe.label}. Change</summary><BrandSelect label="Syringe size and scale" value={p.device} onChange={value=>p.onDevice(value as SyringeType)} options={SYRINGES.map(s=>({value:s.id,label:s.label}))}/><p className={styles.stepHint}>{SYRINGE_HINTS[p.device]} Look at the biggest number printed on your syringe.</p></details>
      {p.secondary}
      {ready&&<RememberOnDevice/>}
      <details className={styles.optional}><summary>Details and plan options</summary>
      <details className={styles.optional}><summary>See the math</summary><p className={styles.formula}>{formula}</p><p className={styles.formula}>{doseEach} ÷ {p.preview.concentrationText} = {volume}</p>{u100&&<p className={styles.formula}>{volume} × 100 = {unitsText(unitsNow)} units (U-100 syringe)</p>}</details>
      <details className={styles.optional}><summary>Review or change answers</summary><dl className={styles.reviewRows}>{p.preview.entries.map(entry=><div key={entry.field}><dt>{entry.label}</dt><dd><span>{entry.value}</span><button type="button" onClick={()=>p.onStep(entry.field)} aria-label={`Edit ${entry.label}`}>Edit</button></dd></div>)}<div><dt>How often</dt><dd><span>{p.amount.timesPerWeek?`${p.amount.timesPerWeek} times per week`:"Not set"}</span><button type="button" onClick={()=>p.onStep("amount")}>Edit how often</button></dd></div></dl></details>
      <details name={`${id}-optional`} className={styles.optional}><summary>Plan name: {p.name}</summary><label className={styles.stepLabel} htmlFor={`${id}-name`}>Plan name</label><input className={styles.stepSelect} id={`${id}-name`} value={p.name} onChange={e=>p.onName(e.target.value)} maxLength={120}/></details>
      <details name={`${id}-optional`} className={styles.optional}><summary>Optional: mixing date</summary><label className={styles.stepLabel} htmlFor={`${id}-date`}>Mixing date (optional)</label><input className={styles.stepSelect} id={`${id}-date`} type="date" value={p.date} onChange={e=>p.onDate(e.target.value)}/><p className={styles.stepHint}>Just a note of the day you mixed it. It is not an expiry date.</p></details>
      <p className={styles.stepHint}>Save to get a link, a PDF and a label you can stick on the vial.</p>
      </details>
    </>},
  ];
  return <QuestionSteps questions={questions} current={p.step} onStep={p.onStep} onClear={()=>{p.onClear();p.onCustom(false);setNotice("");}} finalAction={<button type="button" className={styles.stepPrimary} disabled={!ready||p.saving} onClick={p.onSave}>{p.saving?<Loader2 size={17} className="animate-spin" aria-hidden="true"/>:<Save size={17} aria-hidden="true"/>}{p.saving?"Saving...":p.saveLabel}</button>}>
    <p className={styles.stepNotice} role="status">{notice}</p><p className={styles.stepSafety}>Research arithmetic only. No dosing or preparation advice. <Link href="/disclaimer">Not for human use.</Link></p>
  </QuestionSteps>;
}
