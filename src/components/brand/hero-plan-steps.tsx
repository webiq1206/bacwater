"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Loader2, RotateCcw, Save } from "lucide-react";
import { SYRINGES, type CalcResult, type SyringeType } from "@/lib/calc";
import { decimalError } from "@/lib/calc/number-text";
import { formatDose, formatDoseVolumeMl, formatNumeric, formatSyringeReading } from "@/lib/calc/format";
import { GUIDED_STEPS, canContinueGuided, guidedStep } from "@/lib/calc/guided-steps";
import type { PlanPreviewState } from "@/lib/calc/plan-preview";
import { clearCalculation } from "@/lib/session/calculation-session";
import { trackUsage } from "@/lib/analytics";
import { BeginnerHelp } from "@/components/plan/beginner-help";
import styles from "./hero-calculator.module.css";

interface Props {
  step: number; onStep: (step: number) => void;
  product: ReactNode; schedule: ReactNode; secondary?: ReactNode;
  vial: string; unit: "mg" | "mcg"; onVial: (value: string) => void; onUnit: (unit: "mg" | "mcg") => void;
  volume: string; onVolume: (value: string) => void;
  date: string; onDate: (value: string) => void;
  device: SyringeType; onDevice: (value: SyringeType) => void;
  preview: PlanPreviewState; result: CalcResult;
  name: string; onName: (value: string) => void; onSave: () => void; saving: boolean;
}

/** Presentation only. PlanForm owns validation, session values, arithmetic and saving. */
export function HeroPlanSteps(p: Props) {
  const id = useId(), root = useRef<HTMLDivElement>(null);
  const step = guidedStep(p.step, p.preview), current = GUIDED_STEPS[step];
  const [notice, setNotice] = useState("");
  const started = useRef(false), hadError = useRef(false), focusNext = useRef(false);
  const ready = p.preview.ready, nextReady = canContinueGuided(step, p.preview);
  const vialError = decimalError(p.vial, "Amount in vial") || p.preview.entries[1].issue;
  const volumeError = decimalError(p.volume, "Final liquid volume") || p.preview.entries[3].issue;
  const readout = formatSyringeReading(p.result.syringeReadout);
  const volume = formatDoseVolumeMl(p.result.doseVolumeMl);
  const formula = `${formatNumeric(p.result.input.vialStrengthMg, 4)} mg ÷ ${p.volume} mL = ${p.preview.concentrationText}`;

  useEffect(() => {
    // Persist a clamped restored step so correcting its field does not jump ahead.
    if (step !== p.step) p.onStep(step);
  }, [step, p.step, p.onStep]);
  useEffect(() => {
    if (p.preview.issues.length) hadError.current = true;
    if (ready) { trackUsage("calculation_completed"); if (hadError.current) { trackUsage("input_corrected"); hadError.current = false; } }
  }, [ready, p.preview.issues.length]);
  useEffect(() => {
    if (!focusNext.current) return;
    focusNext.current = false;
    const heading = root.current?.querySelector<HTMLElement>("[data-guided-heading]");
    heading?.focus({ preventScroll: true });
    const scroller = root.current?.closest<HTMLElement>("[data-hero-scroll]");
    if (scroller) scroller.scrollTo({ top: 0, behavior: "instant" });
    else if (root.current && root.current.getBoundingClientRect().top < 100) root.current.scrollIntoView({ block: "start", behavior: "auto" });
  }, [step]);
  function move(next: number) { focusNext.current = true; setNotice(""); p.onStep(next); }
  function start() { if (!started.current) { trackUsage("tool_started"); started.current = true; } }
  async function copy() {
    if (!ready) return;
    const schedule = p.preview.schedule;
    const text = `${p.result.input.peptideName}\n${formula}\nFor one time: ${volume}; ${readout} on ${SYRINGES.find(s => s.id === p.device)?.label}.${schedule.ready && schedule.scheduled ? `\n${schedule.count} times per week; ${formatDose(schedule.weeklyMcg)} total per week.` : ""}\n${p.result.warnings.join("\n")}`;
    try { await navigator.clipboard.writeText(text); setNotice("Calculation copied."); trackUsage("result_copied"); }
    catch { setNotice("Copy is unavailable. Select and copy the numbers shown here."); }
  }

  return <div ref={root} className={styles.guided} data-hero-guided data-guided-step={step} onChangeCapture={start} onClickCapture={start}>
    <div className={styles.progress} role="group" aria-label={`Step ${step + 1} of ${GUIDED_STEPS.length}: ${current.label}`}>
      <div aria-hidden="true">{GUIDED_STEPS.map((s, i) => <span key={s.label} data-complete={i <= step}/>)}</div>
      <p><span>Step {step + 1} of {GUIDED_STEPS.length}</span><span>{current.label}</span></p>
    </div>
    <h2 data-guided-heading tabIndex={-1} className={styles.stepTitle}>{current.title}</h2>
    <p className={styles.stepHint}>{current.hint}</p>
    {step === 0 && <div className={styles.stepFields}>{p.product}{p.secondary}</div>}
    {step === 1 && <div className={styles.stepFields}>
      <label className={styles.stepLabel} htmlFor={`${id}-vial`}>Amount in vial</label>
      <div className={styles.guidedInputRow}><div className={styles.inputWrap}><input id={`${id}-vial`} type="text" inputMode="decimal" maxLength={64} autoComplete="off" value={p.vial} placeholder="e.g. 12" onChange={e => p.onVial(e.target.value)} aria-invalid={!!vialError} aria-describedby={`${id}-vial-error`}/></div>
        <label className={styles.stepUnit}>Unit<select aria-label="Vial amount unit" value={p.unit} onChange={e => p.onUnit(e.target.value as "mg" | "mcg")}><option value="mg">mg</option><option value="mcg">mcg</option></select></label>
      </div><p id={`${id}-vial-error`} className={styles.error} role={vialError ? "alert" : undefined}>{vialError}</p>
      <BeginnerHelp kind="vial"/>
    </div>}
    {step === 2 && <div className={styles.stepFields}>{p.schedule}{p.preview.schedule.ready && p.preview.entries[2].issue && <p className={styles.error} role="alert">{p.preview.entries[2].issue}</p>}</div>}
    {step === 3 && <div className={styles.stepFields}>
      <label className={styles.stepLabel} htmlFor={`${id}-volume`}>Final liquid volume</label><div className={styles.inputWrap}><input id={`${id}-volume`} type="text" inputMode="decimal" maxLength={64} autoComplete="off" value={p.volume} placeholder="e.g. 4" onChange={e => p.onVolume(e.target.value)} aria-invalid={!!volumeError} aria-describedby={`${id}-volume-error`}/><span>mL</span></div>
      <p id={`${id}-volume-error`} className={styles.error} role={volumeError ? "alert" : undefined}>{volumeError}</p><BeginnerHelp kind="volume"/>
    </div>}
    {step === 4 && <div className={styles.stepFields}>
      <label className={styles.stepLabel} htmlFor={`${id}-device`}>Syringe size and scale</label><select id={`${id}-device`} className={styles.stepSelect} value={p.device} onChange={e => p.onDevice(e.target.value as SyringeType)}>{SYRINGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
      <label className={styles.stepLabel} htmlFor={`${id}-date`}>Mixing date (optional)</label><input className={styles.stepSelect} id={`${id}-date`} type="date" value={p.date} onChange={e => p.onDate(e.target.value)}/>
      <p className={styles.stepHint}>Leave the date blank to skip it. This records a date, not an expiry or a storage recommendation.</p>
    </div>}
    <div className={styles.result} data-live-result role="status" aria-live="polite" aria-atomic="true">
      <div className={styles.resultTop}><span>{ready ? "Liquid for each time" : "Your calculation"}</span>{ready && <Check size={18} aria-hidden="true"/>}</div>
      <p className={styles.value}>{ready ? <><strong className={volume.length > 11 ? styles.longValue : undefined}>{volume.replace(/ mL$/, "")}</strong><span>mL</span></> : <span className={styles.empty}>Your numbers.<br/>A clear result.</span>}</p>
      {ready ? <><p className={styles.formula}>{formula}</p><div className={styles.measurement}><p><strong>{readout}</strong> on the selected {p.result.syringeReadout.kind === "u100" ? "U-100" : "mL"} scale</p><p className={styles.formula}>{formatDose(p.result.schedule?.dosePerInjectionMcg ?? p.result.input.doseMcg)} for one time = {volume}</p><p className={styles.scaleNote}>Scale readings may be rounded. Confirm the markings on your actual device.</p></div></> : <p className={styles.formula}>{!p.preview.entries[0].complete ? "Choose your product first to use the correct fields and units." : "Follow the steps above. Your result appears when the required values are complete."}</p>}
    </div>
    {p.preview.issues.length > 0 && step >= 4 && <ul className={styles.stepErrors} role="alert">{p.preview.issues.map(issue => <li key={issue}>{issue}</li>)}</ul>}
    {ready && p.result.warnings.length > 0 && <ul className={styles.stepWarnings}>{p.result.warnings.map(warning => <li key={warning}>{warning}</li>)}</ul>}
    {step === 5 && <>
      {p.secondary}
      <dl className={styles.reviewRows}>{p.preview.entries.map((entry, i) => <div key={entry.field}><dt>{entry.label}</dt><dd>{entry.value}</dd><button type="button" onClick={() => move(i)} aria-label={`Edit ${entry.label.toLowerCase()}`}>Edit</button></div>)}<div><dt>Device / date</dt><dd>{SYRINGES.find(s => s.id === p.device)?.label}<br/>{p.date || "No date set"}</dd><button type="button" onClick={() => move(4)} aria-label="Edit device and date">Edit</button></div></dl>
      <label className={styles.stepLabel} htmlFor={`${id}-name`}>Plan name</label><input className={styles.stepSelect} id={`${id}-name`} value={p.name} onChange={e => p.onName(e.target.value)} maxLength={120}/>
      <p className={styles.stepHint}>Saving creates a shareable link, PDF and printable labels. No account is needed.</p>
    </>}
    <div className={styles.stepNavigation}>
      {step > 0 ? <button type="button" onClick={() => move(step - 1)}><ArrowLeft size={17} aria-hidden="true"/>Back</button> : <span/>}
      {step === 5 ? <button type="button" className={styles.stepPrimary} disabled={!ready || p.saving} onClick={p.onSave}>{p.saving ? <Loader2 size={17} className="animate-spin" aria-hidden="true"/> : <Save size={17} aria-hidden="true"/>}{p.saving ? "Saving..." : "Save my plan"}</button> : <button type="button" className={styles.stepPrimary} disabled={!nextReady} onClick={() => move(step + 1)}>{step === 4 ? "Review result" : "Continue"}<ArrowRight size={17} aria-hidden="true"/></button>}
    </div>
    <div className={styles.stepActions}>{step === 5 && <button type="button" onClick={copy} disabled={!ready}><Copy size={15} aria-hidden="true"/>Copy result</button>}<button type="button" onClick={() => { clearCalculation(); move(0); }}><RotateCcw size={15} aria-hidden="true"/>Clear</button><Link href="/peptide-calculator">Open guided workspace</Link></div>
    <p className={styles.stepNotice} role="status">{notice}</p>
    <p className={styles.stepSafety}>Research arithmetic only. Not for human use. We do not choose a dose, liquid or mixing instructions.</p>
  </div>;
}
