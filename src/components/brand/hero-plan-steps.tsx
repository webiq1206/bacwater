"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { Copy, Loader2, Save, Sparkles } from "lucide-react";
import { SYRINGES, findSyringe, type CalcResult, type SyringeType } from "@/lib/calc";
import { decimalError, positiveDecimal } from "@/lib/calc/number-text";
import { formatDose, formatDoseVolumeMl, formatNumeric, formatSyringeReading } from "@/lib/calc/format";
import { amountSchedule, type AmountSchedule } from "@/lib/calc/amount-schedule";
import { suggestBacWaterMl, mlText, unitsText } from "@/lib/calc/bac-water-suggestion";
import type { PlanPreviewState } from "@/lib/calc/plan-preview";
import { trackUsage } from "@/lib/analytics";
import { BeginnerHelp } from "@/components/plan/beginner-help";
import { ExploreProductResearch } from "@/components/partners/explore-product-research";
import { GuidedAmountFields } from "@/components/calculator/guided-amount-fields";
import { SyringeVisual } from "@/components/plan/syringe-visual";
import { BrandSelect } from "@/components/calculator/brand-select";
import { QuestionSteps, type Question } from "@/components/calculator/question-steps";
import styles from "./hero-calculator.module.css";

interface Props {
  step: string; onStep: (step: string) => void;
  product: ReactNode; productChosen: boolean; customName?: ReactNode; secondary?: ReactNode;
  secondaryQuestions?: Question[];
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
  const volumeError = decimalError(p.volume, "BAC water") || p.preview.entries[3].issue;
  const readout = formatSyringeReading(p.result.syringeReadout), volume = formatDoseVolumeMl(p.result.doseVolumeMl);
  const formula = `${formatNumeric(p.result.input.vialStrengthMg, 4)} mg ÷ ${p.volume} mL = ${p.preview.concentrationText}`;
  const u100 = p.result.syringeReadout.kind === "u100";
  const unitsNow = p.result.syringeUnits;
  const lineLabel = u100 ? `${unitsText(unitsNow)}` : formatNumeric(p.result.doseVolumeMl, 2);
  const doseEach = formatDose(p.result.schedule?.dosePerInjectionMcg ?? p.result.input.doseMcg);

  // The water suggestion needs only the vial amount and the amount for one time.
  const vialMg = p.preview.entries[1].complete ? (positiveDecimal(p.vial) ?? 0) / (p.unit === "mcg" ? 1000 : 1) : 0;
  const schedule = amountSchedule(p.amount);
  const suggestion = vialMg > 0 && schedule.ready ? suggestBacWaterMl(vialMg, schedule.eachMcg) : null;
  const usingSuggestion = suggestion !== null && positiveDecimal(p.volume) === suggestion.ml;

  async function copy() {
    if (!ready) return;
    const text = `${p.result.input.peptideName}\n1. Add ${p.volume} mL of BAC water to the ${formatNumeric(p.result.input.vialStrengthMg, 4)} mg vial.\n2. Each time, fill the syringe to the ${lineLabel} ${u100 ? "units" : "mL"} line (${volume}).\n3. About ${p.result.dosesPerVial} doses in the vial.\n${formula}\n${readout} on ${SYRINGES.find(s => s.id === p.device)?.label}.${schedule.ready && schedule.scheduled ? `\n${schedule.count} times per week; ${formatDose(schedule.weeklyMcg)} total per week.` : ""}\n${p.result.warnings.join("\n")}`;
    try { await navigator.clipboard.writeText(text); setNotice("Copied."); trackUsage("result_copied"); }
    catch { setNotice("Copy is unavailable. Select and copy the numbers shown here."); }
  }

  const questions: Question[] = [
    {id:"product",label:"Product",title:"What is the name on your vial?",complete:p.productChosen,content:<div className={styles.startFields}>{p.product}<p className={styles.startHint}>The vial is the small glass bottle. Find its name on the label and pick it here. Not listed? Choose Other / Custom.</p><div className={styles.startGuide} data-hero-start-guide><p>Answer a few quick questions. <em>We do the math.</em></p><div className={styles.startOutputs}><div><strong>mL</strong><span>How much BAC water to add</span></div><div><strong>Units</strong><span>Where to fill your syringe</span></div><div><strong>Doses</strong><span>How many are in the vial</span></div></div><small>No account. Nothing is saved until you choose Save.</small></div></div>},
    ...(p.customName?[{id:"name",label:"Name",title:"What is your product called?",complete:p.preview.entries[0].complete,content:<>{p.customName}<p className={styles.stepHint}>Type the name exactly as it appears on your label.</p></>}]:[]),
    {id:"vial",label:"Vial amount",title:"What amount is on the vial?",complete:p.preview.entries[1].complete,content:<><p className={styles.stepHint}>Look at the label on the vial. Find the number next to <strong>mg</strong>. If it says 5 mg, type 5.</p><div className={styles.vialChoices}>{p.vialOptions.slice(0,3).map(mg=><button type="button" key={mg} onClick={()=>p.onVial(String(p.unit==="mg"?mg:mg*1000))}>{mg} mg</button>)}</div>{p.vialOptions.length>0&&<p className={styles.stepHint}>Tap the size on your label, or type it below.</p>}<label className={styles.stepLabel} htmlFor={`${id}-vial`}>Amount in vial</label><div className={styles.inputWrap}><input id={`${id}-vial`} type="text" inputMode="decimal" maxLength={64} autoComplete="off" placeholder="Example: 5" value={p.vial} onChange={e=>p.onVial(e.target.value)} aria-invalid={!!vialError} aria-describedby={`${id}-vial-error`}/><BrandSelect label="Vial amount unit" value={p.unit} onChange={value=>p.onUnit(value as "mg"|"mcg")} options={[{value:"mg",label:"mg"},{value:"mcg",label:"mcg"}]}/></div><p id={`${id}-vial-error`} className={styles.error} role={vialError?"alert":undefined}>{vialError}</p><BeginnerHelp kind="vial"/></>},
    ...(p.secondaryQuestions||[]),
    {id:"amount",label:"Your dose",title:"How much will you use each time?",complete:p.preview.entries[2].complete,content:<><p className={styles.stepHint}>This is your dose: the amount you use one time. It comes from your own instructions, not from the vial label. We never pick it for you.</p><GuidedAmountFields value={p.amount} onChange={p.onAmount}/><BeginnerHelp kind="amount"/><ExploreProductResearch/></>},
    {id:"volume",label:"BAC water",title:"How much BAC water will you add?",complete:p.preview.entries[3].complete,content:<>
      <p className={styles.stepHint}>BAC water is the liquid you add to the powder in your vial. Your instructions may say how much to use. If not, use our suggestion.</p>
      {vialMg>0&&schedule.ready&&!suggestion&&<p className={styles.stepErrors} role="alert">Your amount each time is bigger than the whole vial, so no water amount can work. Go back and check the number and its unit (mg or mcg).</p>}
      {suggestion&&<div className={styles.suggest} data-water-suggestion role="group" aria-label="Suggested BAC water"><div className={styles.suggestTop}><Sparkles size={16} aria-hidden="true"/><span>Suggested amount</span></div><p className={styles.suggestValue}><strong>{mlText(suggestion.ml)}</strong> mL of BAC water</p><p className={styles.suggestWhy}>With {mlText(suggestion.ml)} mL, each dose of {formatDose(schedule.eachMcg)} is <strong>{unitsText(suggestion.units)} units</strong> on an insulin syringe. That is an easy line to find. You get about {suggestion.dosesPerVial} doses from the vial.</p>{usingSuggestion?<p className={styles.suggestUsed}>Using {mlText(suggestion.ml)} mL. You can still type a different amount below.</p>:<button type="button" className={styles.suggestButton} onClick={()=>p.onVolume(String(suggestion.ml))}>Use {mlText(suggestion.ml)} mL</button>}</div>}
      <label className={styles.stepLabel} htmlFor={`${id}-volume`}>BAC water to add</label><div className={styles.inputWrap}><input id={`${id}-volume`} type="text" inputMode="decimal" maxLength={64} autoComplete="off" placeholder={suggestion?`Example: ${mlText(suggestion.ml)}`:"Example: 2"} value={p.volume} onChange={e=>p.onVolume(e.target.value)} aria-invalid={!!volumeError} aria-describedby={`${id}-volume-error`}/><span>mL</span></div><p id={`${id}-volume-error`} className={styles.error} role={volumeError?"alert":undefined}>{volumeError}</p>
      <p className={styles.stepHint}>Does your vial already have liquid in it? Then type the total liquid after you add the water.</p><BeginnerHelp kind="volume"/></>},
    {id:"device",label:"Syringe",title:"Which syringe will you use?",complete:ready,content:<><p className={styles.stepHint}>Most people use an insulin syringe. Look at the biggest number printed on it.</p><BrandSelect label="Syringe size and scale" value={p.device} onChange={value=>p.onDevice(value as SyringeType)} options={SYRINGES.map(s=>({value:s.id,label:s.label}))}/><p className={styles.stepHint}>{SYRINGE_HINTS[p.device]} Not sure? The 1 mL insulin syringe is the usual choice.</p>{p.preview.issues.length>0&&<ul className={styles.stepErrors} role="alert">{p.preview.issues.map(issue=><li key={issue}>{issue}</li>)}</ul>}</>},
    {id:"review",label:"Result",title:"Here are your numbers",complete:ready,content:<>
      {ready&&<div className={styles.result} data-live-result role="status" aria-live="polite" aria-atomic="true"><div className={styles.resultTop}><span>Fill your syringe to</span><button type="button" onClick={copy} aria-label="Copy result"><Copy size={16} aria-hidden="true"/></button></div><p className={styles.value}><strong className={lineLabel.length>6?styles.longValue:undefined}>{lineLabel}</strong>{" "}<span>{u100?"units":"mL"}</span><span className={styles.readout}>{readout} on {u100?"U-100":"mL"} scale · {volume}</span></p></div>}
      {ready&&<ol className={styles.todo} aria-label="What to do"><li><span>1</span><div><strong>Add {p.volume} mL of BAC water</strong> to your {formatNumeric(p.result.input.vialStrengthMg,4)} mg vial.</div></li><li><span>2</span><div><strong>Each time, fill the syringe to the {lineLabel} {u100?"units":"mL"} line.</strong> That is {doseEach}, or {volume}.{p.result.schedule&&p.result.schedule.injectionsPerWeek>1?` You said ${p.result.schedule.injectionsPerWeek} times per week.`:""}</div></li><li><span>3</span><div><strong>This vial gives you about {p.result.dosesPerVial} {p.result.dosesPerVial===1?"dose":"doses"}.</strong> Each 1 mL holds {p.preview.concentrationText}.</div></li></ol>}
      {ready&&!p.result.syringeReadout.exceedsSyringe&&<SyringeVisual compact fillPercent={p.result.syringeReadout.fillPercent} readoutLabel={readout} scale={syringe.scale} maxValue={syringe.maxVolumeMl*(syringe.scale==="u100"?100:1)} maxLabel={syringe.label}/>}
      <p className={styles.scaleNote}>Picture only. Check the lines on your real syringe.</p>
      {ready&&p.result.warnings.length>0&&<ul className={styles.stepWarnings}>{p.result.warnings.map(warning=><li key={warning}>{warning}</li>)}</ul>}
      {p.secondary}
      <details className={styles.optional}><summary>Details and plan options</summary>
      <details className={styles.optional}><summary>See the math</summary><p className={styles.formula}>{formula}</p><p className={styles.formula}>{doseEach} ÷ {p.preview.concentrationText} = {volume}</p>{u100&&<p className={styles.formula}>{volume} × 100 = {unitsText(unitsNow)} units (U-100 syringe)</p>}</details>
      <details className={styles.optional}><summary>Review or change answers</summary><dl className={styles.reviewRows}>{p.preview.entries.map(entry=><div key={entry.field}><dt>{entry.label}</dt><dd><span>{entry.value}</span><button type="button" onClick={()=>p.onStep(entry.field)} aria-label={`Edit ${entry.label}`}>Edit</button></dd></div>)}<div><dt>How often</dt><dd><span>{p.amount.timesPerWeek?`${p.amount.timesPerWeek} times per week`:"Not set"}</span><button type="button" onClick={()=>p.onStep("amount")}>Edit how often</button></dd></div><div><dt>Syringe</dt><dd><span>{SYRINGES.find(s=>s.id===p.device)?.label}</span><button type="button" onClick={()=>p.onStep("device")}>Edit syringe</button></dd></div></dl></details>
      <details name={`${id}-optional`} className={styles.optional}><summary>Plan name: {p.name}</summary><label className={styles.stepLabel} htmlFor={`${id}-name`}>Plan name</label><input className={styles.stepSelect} id={`${id}-name`} value={p.name} onChange={e=>p.onName(e.target.value)} maxLength={120}/></details>
      <details name={`${id}-optional`} className={styles.optional}><summary>Optional: mixing date</summary><label className={styles.stepLabel} htmlFor={`${id}-date`}>Mixing date (optional)</label><input className={styles.stepSelect} id={`${id}-date`} type="date" value={p.date} onChange={e=>p.onDate(e.target.value)}/><p className={styles.stepHint}>Just a note of the day you mixed it. It is not an expiry date.</p></details>
      <p className={styles.stepHint}>Save to get a link, a PDF and a label you can stick on the vial.</p>
      </details>
    </>},
  ];
  return <QuestionSteps questions={questions} current={p.step} onStep={p.onStep} onClear={()=>{p.onClear();p.onCustom(false);setNotice("");}} finalAction={<button type="button" className={styles.stepPrimary} disabled={!ready||p.saving} onClick={p.onSave}>{p.saving?<Loader2 size={17} className="animate-spin" aria-hidden="true"/>:<Save size={17} aria-hidden="true"/>}{p.saving?"Saving...":p.saveLabel}</button>}>
    <p className={styles.stepNotice} role="status">{notice}</p><p className={styles.stepSafety}>Math help only. Follow your own instructions. <Link href="/disclaimer">Not for human use.</Link></p>
  </QuestionSteps>;
}
