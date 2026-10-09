"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { Copy, Loader2, Save } from "lucide-react";
import { SYRINGES, type CalcResult, type SyringeType } from "@/lib/calc";
import { decimalError, positiveDecimal } from "@/lib/calc/number-text";
import { formatDose, formatDoseVolumeMl, formatNumeric, formatSyringeReading } from "@/lib/calc/format";
import { type AmountSchedule } from "@/lib/calc/amount-schedule";
import type { PlanPreviewState } from "@/lib/calc/plan-preview";
import { trackUsage } from "@/lib/analytics";
import { BeginnerHelp } from "@/components/plan/beginner-help";
import { ExploreProductResearch } from "@/components/partners/explore-product-research";
import { AmountScheduleFields, isCustomSchedule, type ScheduleSection } from "@/components/calculator/amount-schedule";
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

/** Presentation only. PlanForm still owns validation, arithmetic and saving. */
export function HeroPlanSteps(p: Props) {
  const id = useId(), [notice, setNotice] = useState("");
  const customSchedule = p.customSchedule || isCustomSchedule(p.amount.timesPerWeek);
  const ready = p.preview.ready;
  const vialError = decimalError(p.vial, "Amount in vial") || p.preview.entries[1].issue;
  const volumeError = decimalError(p.volume, "Final liquid volume") || p.preview.entries[3].issue;
  const readout = formatSyringeReading(p.result.syringeReadout), volume = formatDoseVolumeMl(p.result.doseVolumeMl);
  const formula = `${formatNumeric(p.result.input.vialStrengthMg, 4)} mg ÷ ${p.volume} mL = ${p.preview.concentrationText}`;
  const fields = (section:ScheduleSection) => <AmountScheduleFields section={section} value={p.amount} onChange={p.onAmount} custom={customSchedule} onCustom={p.onCustom}/>;
  async function copy() {
    if (!ready) return;
    const schedule = p.preview.schedule;
    const text = `${p.result.input.peptideName}\n${formula}\nFor one time: ${volume}; ${readout} on ${SYRINGES.find(s => s.id === p.device)?.label}.${schedule.ready && schedule.scheduled ? `\n${schedule.count} times per week; ${formatDose(schedule.weeklyMcg)} total per week.` : ""}\n${p.result.warnings.join("\n")}`;
    try { await navigator.clipboard.writeText(text); setNotice("Calculation copied."); trackUsage("result_copied"); }
    catch { setNotice("Copy is unavailable. Select and copy the numbers shown here."); }
  }
  const questions: Question[] = [
    {id:"product",label:"Product",title:"What is the name on your label?",complete:p.productChosen,content:<div className={styles.startFields}>{p.product}<p className={styles.startHint}>Choose the exact name. We’ll ask for its numbers next.</p><div className={styles.startGuide} data-hero-start-guide><p>Your numbers. <em>A clear result.</em></p><small>One question at a time. No amount is chosen for you.</small></div></div>},
    ...(p.customName?[{id:"name",label:"Name",title:"What is your product called?",complete:p.preview.entries[0].complete,content:p.customName}]:[]),
    {id:"vial",label:"Vial amount",title:"What amount is on the vial?",complete:p.preview.entries[1].complete,content:<><div className={styles.vialChoices}>{p.vialOptions.slice(0,3).map(mg=><button type="button" key={mg} onClick={()=>p.onVial(String(p.unit==="mg"?mg:mg*1000))}>{mg} mg</button>)}</div><p className={styles.stepHint}>Tap a size that matches your label, or type yours below.</p><label className={styles.stepLabel} htmlFor={`${id}-vial`}>Amount in vial</label><div className={styles.inputWrap}><input id={`${id}-vial`} type="text" inputMode="decimal" maxLength={64} autoComplete="off" value={p.vial} onChange={e=>p.onVial(e.target.value)} aria-invalid={!!vialError} aria-describedby={`${id}-vial-error`}/><BrandSelect label="Vial amount unit" value={p.unit} onChange={value=>p.onUnit(value as "mg"|"mcg")} options={[{value:"mg",label:"mg"},{value:"mcg",label:"mcg"}]}/></div><p id={`${id}-vial-error`} className={styles.error} role={vialError?"alert":undefined}>{vialError}</p><BeginnerHelp kind="vial"/></>},
    ...(p.secondaryQuestions||[]),
    {id:"volume",label:"Liquid volume",title:"How much BAC water will you mix?",complete:p.preview.entries[3].complete,content:<><label className={styles.stepLabel} htmlFor={`${id}-volume`}>Total liquid after mixing</label><div className={styles.inputWrap}><input id={`${id}-volume`} type="text" inputMode="decimal" maxLength={64} autoComplete="off" value={p.volume} onChange={e=>p.onVolume(e.target.value)} aria-invalid={!!volumeError} aria-describedby={`${id}-volume-error`}/><span>mL</span></div><p id={`${id}-volume-error`} className={styles.error} role={volumeError?"alert":undefined}>{volumeError}</p><p className={styles.stepHint}>Enter the total mL after mixing. Include any liquid already in the vial.</p><BeginnerHelp kind="volume"/></>},
    {id:"amount",label:"Amount",title:"How much do you want to measure?",complete:p.preview.entries[2].complete,content:<>{fields("all")}<ExploreProductResearch/></>},
    {id:"device",label:"Scale",title:"Which scale is on your device?",complete:ready,content:<><BrandSelect label="Syringe size and scale" value={p.device} onChange={value=>p.onDevice(value as SyringeType)} options={SYRINGES.map(s=>({value:s.id,label:s.label}))}/><p className={styles.stepHint}>Match the actual size and markings. The scale does not choose an amount.</p>{p.preview.issues.length>0&&<ul className={styles.stepErrors} role="alert">{p.preview.issues.map(issue=><li key={issue}>{issue}</li>)}</ul>}</>},
    {id:"review",label:"Result",title:"Here are your numbers",complete:ready,content:<>
      {ready&&<div className={styles.result} data-live-result role="status" aria-live="polite" aria-atomic="true"><div className={styles.resultTop}><span>Liquid for one time</span><button type="button" onClick={copy} aria-label="Copy result"><Copy size={16} aria-hidden="true"/></button></div><p className={styles.value}><strong className={volume.length>11?styles.longValue:undefined}>{volume.replace(/ mL$/,"")}</strong><span>mL</span><span className={styles.readout}>{readout} on {p.result.syringeReadout.kind==="u100"?"U-100":"mL"} scale</span></p><p className={styles.formula}>{formula}</p><p className={styles.formula}>{formatDose(p.result.schedule?.dosePerInjectionMcg??p.result.input.doseMcg)} for one time = {volume}</p><p className={styles.scaleNote}>Readings may be rounded. Check the device’s markings.</p></div>}
      {ready&&p.result.warnings.length>0&&<ul className={styles.stepWarnings}>{p.result.warnings.map(warning=><li key={warning}>{warning}</li>)}</ul>}
      {p.secondary}
      <details className={styles.optional}><summary>Review or change answers</summary><dl className={styles.reviewRows}>{p.preview.entries.map(entry=><div key={entry.field}><dt>{entry.label}</dt><dd><span>{entry.value}</span><button type="button" onClick={()=>p.onStep(entry.field)} aria-label={`Edit ${entry.label.toLowerCase()}`}>Edit</button></dd></div>)}<div><dt>Schedule</dt><dd><span>{p.amount.timesPerWeek?`${p.amount.timesPerWeek} times per week`:"No schedule"}</span><button type="button" onClick={()=>p.onStep("amount")}>Edit schedule</button></dd></div><div><dt>Device</dt><dd><span>{SYRINGES.find(s=>s.id===p.device)?.label}</span><button type="button" onClick={()=>p.onStep("device")}>Edit device</button></dd></div></dl></details>
      <details name={`${id}-optional`} className={styles.optional}><summary>Plan name: {p.name}</summary><label className={styles.stepLabel} htmlFor={`${id}-name`}>Plan name</label><input className={styles.stepSelect} id={`${id}-name`} value={p.name} onChange={e=>p.onName(e.target.value)} maxLength={120}/></details>
      <details name={`${id}-optional`} className={styles.optional}><summary>Optional: mixing date</summary><label className={styles.stepLabel} htmlFor={`${id}-date`}>Mixing date (optional)</label><input className={styles.stepSelect} id={`${id}-date`} type="date" value={p.date} onChange={e=>p.onDate(e.target.value)}/><p className={styles.stepHint}>A record only. This is not an expiry date.</p></details>
      <p className={styles.stepHint}>Saving creates a shareable link, PDF and printable labels.</p>
    </>},
  ];
  return <QuestionSteps questions={questions} current={p.step} onStep={p.onStep} onClear={()=>{p.onClear();p.onCustom(false);setNotice("");}} finalAction={<button type="button" className={styles.stepPrimary} disabled={!ready||p.saving} onClick={p.onSave}>{p.saving?<Loader2 size={17} className="animate-spin" aria-hidden="true"/>:<Save size={17} aria-hidden="true"/>}{p.saving?"Saving...":p.saveLabel}</button>}>
    <p className={styles.stepNotice} role="status">{notice}</p><p className={styles.stepSafety}>Research math only. <Link href="/disclaimer">Not for human use.</Link></p>
  </QuestionSteps>;
}
