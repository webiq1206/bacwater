"use client";
import Link from "next/link";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { ArrowRight, Check, ChevronDown, FlaskConical } from "lucide-react";
import { findSyringe, type CalcResult } from "@/lib/calc";
import { formatDose, formatDoseVolumeMl, formatSyringeReading, formatNumeric } from "@/lib/calc/format";
import type { PlanPreviewState, PreviewField } from "@/lib/calc/plan-preview";
import { referenceArtwork } from "@/lib/search/public-index";
import { ProductArtwork } from "@/components/partners/product-artwork";
import { SyringeVisual } from "./syringe-visual";
import styles from "./live-plan-preview.module.css";

export function LivePlanPreview({ preview, result, expanded, onExpand, onEdit, children }: {
  preview: PlanPreviewState; result: CalcResult; expanded: boolean;
  onExpand: (value: boolean) => void; onEdit: (field: PreviewField) => void; children?: ReactNode;
}) {
  const uid = useId(), root = useRef<HTMLElement>(null);
  const product = preview.entries[0], artwork = product.complete && result.input.peptideSlug ? referenceArtwork(result.input.peptideSlug) : undefined;
  const scale = findSyringe(result.input.syringeType);
  const reading = preview.ready ? formatSyringeReading(result.syringeReadout) : "";
  useEffect(() => {
    const element = root.current, scroller = element?.closest<HTMLElement>("[data-calculator-scroll]");
    if (!element) return;
    const resize = () => {
      const padding = scroller ? getComputedStyle(scroller) : null;
      const inset = padding ? parseFloat(padding.paddingTop) + parseFloat(padding.paddingBottom) : 0;
      element.style.setProperty("--preview-height", `${Math.max(160, (scroller?.clientHeight || window.innerHeight) - inset - 32)}px`);
    };
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (scroller) observer?.observe(scroller);
    resize(); window.addEventListener("resize", resize);
    return () => { observer?.disconnect(); window.removeEventListener("resize", resize); };
  }, []);
  return <aside ref={root} className={styles.preview} data-live-plan-preview data-preview-state={preview.ready ? "ready" : "incomplete"} data-clarity-mask="true" aria-labelledby={`${uid}-title`} tabIndex={-1}>
    <div className={styles.topline}><h2 id={`${uid}-title`}>Your calculation</h2><span className={styles.live}><span aria-hidden="true" />Live</span></div>
    <div className={styles.product}>
      <div className={styles.art}>{artwork ? <ProductArtwork product={artwork} compact /> : <FlaskConical size={23} aria-hidden="true" />}</div>
      <div><strong data-preview-product>{product.value}</strong><p>{preview.ready ? "Based on your entries" : `${preview.completed} of 4 required fields entered`}</p></div>
    </div>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{preview.ready ? `Calculation updated. ${reading}. ${preview.concentrationText}.` : `${preview.completed} of 4 required fields entered. ${preview.remaining.map(entry => entry.label).join(", ")} still needed.`}</p>
    {!preview.ready && <progress className={styles.progress} aria-label="Required fields entered" value={preview.completed} max={4} />}
    {preview.ready && <div className={styles.answer} data-preview-answer><span>Your entered amount equals</span><strong>{reading}</strong><p>{formatDoseVolumeMl(result.doseVolumeMl)} per measurement on the selected {scale.scale === "u100" ? "U-100" : "mL"} scale</p></div>}
    <button className={styles.mobileToggle} type="button" onClick={() => onExpand(!expanded)} aria-expanded={expanded} aria-controls={`${uid}-body`}>{expanded ? "Hide calculation details" : "Show calculation details"}<ChevronDown size={17} aria-hidden="true" /></button>
    <div id={`${uid}-body`} className={styles.previewBody} data-expanded={expanded}>
      <dl className={styles.entries}>{preview.entries.slice(1).map(entry => <div key={entry.field} data-preview-field={entry.field}>
        <dt>{entry.label}</dt><dd>{entry.value}{entry.complete && <Check size={13} aria-hidden="true" />}</dd>
      </div>)}<div><dt>Selected device</dt><dd>{scale.label}</dd></div></dl>
      {preview.concentrationText && <div className={styles.metrics}>
        <div><span>Concentration</span><strong data-preview-concentration>{preview.concentrationText}</strong></div>
        {preview.ready && <div><span>Equal measurements</span><strong data-preview-portions>{result.dosesPerVial} per vial</strong></div>}
      </div>}
      {preview.ready ? <>
        {preview.schedule.ready && preview.schedule.scheduled && <p className={styles.schedule}>{formatDose(preview.schedule.eachMcg)} each time, {preview.schedule.count} times per week. Weekly total: {formatDose(preview.schedule.weeklyMcg)}.</p>}
        <div className={styles.syringe}><SyringeVisual fillPercent={result.syringeReadout.fillPercent} readoutLabel={reading} scale={result.syringeReadout.kind} maxLabel={scale.scale === "u100" ? `${scale.maxVolumeMl * 100} units` : `${scale.maxVolumeMl} mL`} /></div>
        {result.secondary && <p className={styles.schedule}>The same measured volume also contains {formatDose(result.secondary.companionDoseMcg)} of {result.secondary.peptideName}.</p>}
        {result.warnings.length > 0 && <div className={styles.issues}><strong>Check these details</strong><ul>{result.warnings.map(warning => <li key={warning}>{warning}</li>)}</ul></div>}
        <details className={styles.formula}><summary>How these numbers are calculated</summary><p>{formatNumeric(result.input.vialStrengthMg, 6)} mg ÷ {formatNumeric(result.usedBacMl, 6)} mL = {preview.concentrationText}.</p><p>{formatNumeric((result.schedule?.dosePerInjectionMcg || result.input.doseMcg) / 1000, 6)} mg ÷ {preview.concentrationText} = {formatDoseVolumeMl(result.doseVolumeMl)} per measurement.</p><p>Confirm the scale, capacity and graduation spacing on your actual device. Rounded displays are not instructions to round an amount.</p></details>
        {children && <details className={styles.full}><summary>View the full calculation</summary>{children}</details>}
      </> : <>
        <div className={styles.next}><h3>{preview.issues.length ? "Check your entries" : "Still needed"}</h3><p>{preview.concentrationText ? "Concentration is ready. Complete the remaining fields to calculate the amount to measure." : "Your entries appear above as you type. No missing numbers are assumed."}</p>
          {preview.remaining.map(entry => <button type="button" key={entry.field} onClick={() => onEdit(entry.field)}>{entry.field === "product" ? "Choose a product" : entry.field === "amount" ? "Enter the amount to measure" : entry.field === "vial" ? "Enter vial amount" : "Enter final liquid volume"}<ArrowRight size={15} aria-hidden="true" /></button>)}
          {preview.secondaryPending && <button type="button" onClick={() => onEdit("blend")}>Complete blend details<ArrowRight size={15} aria-hidden="true" /></button>}
          {preview.issues.length > 0 && <ul>{preview.issues.map(issue => <li key={issue}>{issue}</li>)}</ul>}
          {result.input.peptideSlug === "hcg" && <Link href="/calculate/hcg">Open the IU calculator</Link>}
        </div>
      </>}
      <p className={styles.note}>Updates as you type. Nothing is saved until you choose Save. Use your label and instructions; this is calculation support, not preparation or dosing advice.</p>
    </div>
  </aside>;
}
