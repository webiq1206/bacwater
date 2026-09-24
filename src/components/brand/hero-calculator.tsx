"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { ArrowUpRight, Calculator, Check, Copy, Expand, RotateCcw, X } from "lucide-react";
import { QUICK_EXAMPLE, type QuickMode } from "@/lib/brand/quick-calculation";
import { heroMeasurement, heroResult, type HeroValues } from "@/lib/brand/hero-calculation";
import { useMassDraft, useSessionState } from "@/lib/use-calculator-session";
import { massText, clearMassNumbers } from "@/lib/calculator-session";
import { positiveDecimal } from "@/lib/calc/number-text";
import { amountSchedule, amountScheduleText } from "@/lib/calc/amount-schedule";
import { AmountSchedule } from "@/components/plan/amount-schedule";
import { SessionNotice } from "@/components/calculator/session-notice";
import { BeginnerHelp } from "@/components/plan/beginner-help";
import { SiteSearchButton } from "@/components/search/site-search";
import { CalculatorProductTools } from "@/components/partners/calculator-products";
import styles from "./hero-calculator.module.css";
const modes: { id: QuickMode; label: string }[] = [
  { id: "concentration", label: "BAC water" }, { id: "mass", label: "mg to mcg" }, { id: "units", label: "U-100 to mL" }
];
const smallScreen = () => window.matchMedia("(max-width: 780px)").matches;

export function HeroCalculator() {
  const uid = useId();
  const [draft, patchDraft] = useMassDraft();
  const [storedMode, setMode] = useSessionState<QuickMode>("bacwater.hero.mode", "concentration");
  const mode = modes.some(m => m.id === storedMode) ? storedMode : "concentration";
  const [converter, setConverter] = useSessionState("bacwater.tool.mass.v2", { unit: "mg" as "mg" | "mcg", text: "" });
  const [scale, setScale] = useSessionState("bacwater.tool.syringe.conversion.v2", { direction: "units", text: "" });
  const values: HeroValues = { amount: massText(draft.vial, draft.vialUnit, "mg"), volume: draft.volume,
    target: draft.amount, targetUnit: draft.amountUnit,
    mass: massText(converter.text, converter.unit === "mcg" ? "mcg" : "mg", "mg"), units: scale.direction !== "ml" ? scale.text : scale.text.trim() === "" ? "" : positiveDecimal(scale.text) !== null ? String(Number(scale.text) * 100) : scale.text };
  const [open, setOpen] = useState(false), [notice, setNotice] = useState("");
  const [example, setExample] = useState(false);
  const [measurementOpen, setMeasurementOpen] = useSessionState("bacwater.hero.amountOpen", false);
  const dialogRef = useRef<HTMLDivElement>(null), expandRef = useRef<HTMLButtonElement>(null);
  const wantedField = useRef<string | null>(null);
  const amount = amountSchedule({ amount: draft.amount, unit: draft.amountUnit, basis: draft.basis, frequency: draft.frequency });
  const amountMeaning = amountScheduleText({ amount: draft.amount, unit: draft.amountUnit, basis: draft.basis, frequency: draft.frequency });
  const result = heroResult(mode, values);
  const measurement = amount.kind === "error" ? amount : heroMeasurement({ ...values, target: amount.kind === "value" ? String(amount.eachMcg) : "", targetUnit: "mcg" });
  const entered = mode === "concentration" ? !!(values.amount.trim() && values.volume.trim()) : !!values[mode === "mass" ? "mass" : "units"].trim();
  const invalid = entered && !result;
  const hiddenAmountError = mode === "concentration" && !measurementOpen && measurement.kind === "error";
  useEffect(() => {
    if (!open) return;
    const viewport = window.visualViewport;
    const update = () => {
      const element = dialogRef.current; if (!element) return;
      if (viewport && Math.abs(viewport.scale - 1) < .02) {
        element.style.setProperty("--hero-height", `${viewport.height}px`);
        element.style.setProperty("--hero-top", `${viewport.offsetTop}px`);
      } else { element.style.removeProperty("--hero-height"); element.style.removeProperty("--hero-top"); }
    };
    const frame = requestAnimationFrame(update);
    viewport?.addEventListener("resize", update); viewport?.addEventListener("scroll", update); window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); viewport?.removeEventListener("resize", update); viewport?.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [open]);
  function focusScreen(key?: string) { wantedField.current = key || null; setOpen(true); }
  function update(key: keyof HeroValues, value: string) {
    if (key === "amount") patchDraft({ vial: value, vialUnit: "mg" });
    else if (key === "volume") patchDraft({ volume: value });
    else if (key === "mass") setConverter({ unit: "mg", text: value });
    else if (key === "units") setScale({ direction: "units", text: value });
    else if (key === "target") patchDraft({ amount: value });
    setExample(false); setNotice("");
  }
  function clearCurrent() {
    if (mode === "concentration") { clearMassNumbers(); setMeasurementOpen(false); }
    else if (mode === "mass") setConverter({unit:"mg",text:""});
    else setScale({direction:"units",text:""});
    setNotice(""); setExample(false);
  }
  function loadExample(scope: "inline" | "focus") {
    if (mode === "concentration") patchDraft({vial:QUICK_EXAMPLE.amount,vialUnit:"mg",volume:QUICK_EXAMPLE.volume,amount:"",basis:"each",frequency:null});
    else if (mode === "mass") setConverter({unit:"mg",text:QUICK_EXAMPLE.mass});
    else setScale({direction:"units",text:QUICK_EXAMPLE.units});
    setExample(true); setNotice(""); if(scope==="inline"&&smallScreen())focusScreen();
  }
  function select(id: QuickMode, scope: string) { setMode(id); setNotice(""); if (scope === "inline" && smallScreen()) focusScreen(); }
  function tabKey(e: KeyboardEvent<HTMLButtonElement>, index: number, scope: string) {
    const next = e.key === "ArrowRight" ? (index + 1) % modes.length : e.key === "ArrowLeft" ? (index + modes.length - 1) % modes.length : e.key === "Home" ? 0 : e.key === "End" ? modes.length - 1 : null;
    if (next === null) return;
    e.preventDefault(); select(modes[next].id, scope); document.getElementById(`${uid}-${scope}-tab-${modes[next].id}`)?.focus();
  }
  async function copy() {
    if (!result || (mode === "concentration" && measurement.kind === "error")) return;
    const text = result.formula + (mode === "concentration" && measurement.kind === "value" ? `\n${amountMeaning}\n${measurement.formula}\n${measurement.units} U-100 units` : "");
    try { await navigator.clipboard.writeText(text); setNotice("Calculation copied."); }
    catch { setNotice("Copy is unavailable. You can select and copy the formula shown here."); }
  }
  function content(scope: "inline" | "focus") {
    const id = `${uid}-${scope}`;
    const field = (key: "amount" | "volume" | "mass" | "units" | "target", label: string, unit: string, placeholder: string) => <div className={styles.field}>
      <label htmlFor={`${id}-${key}`}>{label}</label>
      <div className={styles.inputWrap}><input id={`${id}-${key}`} data-hero-field={key} type="text" inputMode="decimal" value={values[key]} placeholder={placeholder} maxLength={64} autoComplete="off" spellCheck={false}
        onChange={e => update(key, e.target.value)} onFocus={() => { if (scope === "inline" && smallScreen()) focusScreen(key); }}
        aria-invalid={key === "target" ? measurement.kind === "error" : invalid} aria-describedby={`${id}-help ${id}-error`} /><span>{unit}</span></div>
    </div>;
    return <>
      <div role="tablist" aria-label="Quick calculation type" className={styles.tabs}>{modes.map((tab, index) => <button type="button" role="tab" key={tab.id} id={`${id}-tab-${tab.id}`} aria-controls={`${id}-panel`} aria-selected={mode === tab.id} tabIndex={mode === tab.id ? 0 : -1} onClick={() => select(tab.id, scope)} onKeyDown={e => tabKey(e, index, scope)}>{tab.label}</button>)}</div>
      <div className={styles.panel} id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${mode}`}>
        <div className={styles.fields}>{mode === "concentration" ? <>{field("amount", "Amount in vial", "mg", "e.g. 12")}{field("volume", "Final liquid volume", "mL", "e.g. 4")}</> : mode === "mass" ? <>{field("mass", "Amount in milligrams", "mg", "e.g. 0.125")}<p className={styles.unitNote}>1 mg equals<br /><strong>1,000 mcg</strong></p></> : <>{field("units", "U-100 scale units", "units", "e.g. 25")}<p className={styles.unitNote}>100 U-100 units equal<br /><strong>1 mL</strong></p></>}</div>
        {mode === "concentration" && <details className={styles.optional} open={measurementOpen}><summary onClick={e => { e.preventDefault(); setMeasurementOpen(v => !v); if (scope === "inline" && smallScreen()) focusScreen(); }}>Also find mL and U-100 units</summary>
          <AmountSchedule value={{ amount: draft.amount, unit: draft.amountUnit, basis: draft.basis, frequency: draft.frequency }} onChange={p => {
            patchDraft({ ...(p.amount !== undefined ? { amount: p.amount } : {}), ...(p.unit ? { amountUnit: p.unit } : {}), ...(p.basis ? { basis: p.basis } : {}), ...(p.frequency !== undefined ? { frequency: p.frequency } : {}) });
            setExample(false); setNotice("");
          }} />
        </details>}
        <div data-hero-result className={styles.result} role="status" aria-label="Calculation result" aria-live="polite" aria-atomic="true">
          <div className={styles.resultTop}><span>{mode === "concentration" ? "Amount in each 1 mL" : "Your converted number"}</span>{result && <Check size={18} aria-hidden="true" />}</div>
          <p className={styles.value}>{result ? <><strong className={result.value.length > 9 ? styles.longValue : undefined}>{result.value}</strong><span>{result.unit}</span></> : <span className={styles.empty}>Your numbers.<br />A clear result.</span>}</p>
          <p className={styles.formula}>{result?.formula || "Enter your values above to see the math."}</p>
          {mode === "concentration" && result && measurement.kind === "value" && <div className={styles.measurement}><p className={styles.scaleNote}>{amountMeaning}</p><p><strong>{measurement.ml}</strong> mL</p><p><strong>{measurement.units}</strong> U-100 units</p><p className={styles.formula}>{measurement.formula}</p>{measurement.warning && <p className={styles.warning}>{measurement.warning}</p>}<p className={styles.scaleNote}>U-100 is a volume scale, not the amount of a medicine.</p></div>}
        </div>
        <p id={`${id}-error`} className={styles.error} role={invalid || hiddenAmountError ? "alert" : undefined}>{invalid ? "Check your entries. Use a decimal point, no commas or unit words." : hiddenAmountError && measurement.kind === "error" ? measurement.message : ""}</p>
        <div className={styles.actions}><button type="button" onClick={copy} disabled={!result || (mode === "concentration" && measurement.kind === "error")}><Copy size={15} aria-hidden="true" />Copy result</button><button type="button" onClick={clearCurrent}><RotateCcw size={15} aria-hidden="true" />Clear</button><button type="button" onClick={() => loadExample(scope)}>Use example</button></div>
        <p id={`${id}-help`} className={styles.help}>{example ? "Example numbers only. Not mixing instructions. " : "Use your own label and instructions. "}{mode === "concentration" ? "Use the final volume from your instructions, not an assumed amount of water. Shown values may be rounded." : mode === "mass" ? "mg and mcg measure mass, not volume." : "Check that the actual device uses a U-100 scale."}</p>
        <p className={styles.notice} role="status">{notice}</p>
        {scope === "focus" && <BeginnerHelp kind={mode==="concentration"?"volume":"units"}/>}
      </div>
    </>;
  }
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <div className={styles.calculator} data-hero-calculator role="region" aria-label="Live BAC water calculator">
      <div className={styles.top}><span><Calculator size={18} aria-hidden="true" />LIVE CALCULATOR</span><button type="button" ref={expandRef} onClick={() => focusScreen()} aria-label="Open hero calculator full screen"><Expand size={15} aria-hidden="true" /><span>Full screen</span></button></div>
      {content("inline")}
      <div className={styles.products}><CalculatorProductTools selectedId={draft.productId} /></div>
      <noscript><p className={styles.help}>Enable JavaScript to use this calculator. <Link href="/methodology">Read the formulas</Link>.</p></noscript>
    </div>
    <Dialog.Portal><Dialog.Overlay className={styles.overlay} /><Dialog.Content ref={dialogRef} className={styles.focus} data-hero-focus
      onOpenAutoFocus={e => { e.preventDefault(); requestAnimationFrame(() => { const root = dialogRef.current; const field = wantedField.current; const target = field ? root?.querySelector<HTMLInputElement>(`[data-hero-field="${field}"]`) : root?.querySelector<HTMLInputElement>("input"); target?.focus({ preventScroll: true }); }); }}
      onCloseAutoFocus={e => { e.preventDefault(); expandRef.current?.focus({ preventScroll: true }); }}>
      <div className={styles.focusBar}><div><Dialog.Title>BAC water calculator</Dialog.Title><Dialog.Description>Just your numbers. Your entries stay when you close this screen.</Dialog.Description></div><SiteSearchButton compact/><Dialog.Close aria-label="Return to homepage"><X size={22} aria-hidden="true" /></Dialog.Close></div>
      <div className={styles.focusBody}><SessionNotice />{content("focus")}<div className={styles.products}><CalculatorProductTools selectedId={draft.productId} /></div><p className={styles.help}>We check arithmetic, not product safety or suitability. No dose or mixing instruction is chosen.</p></div>
      <div className={styles.focusFooter}><Dialog.Close>Back to homepage</Dialog.Close><Link href="/peptide-calculator">Guided calculator<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}
