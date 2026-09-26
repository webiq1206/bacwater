"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { ArrowUpRight, Calculator, Check, Copy, Expand, RotateCcw, X } from "lucide-react";
import { QUICK_EXAMPLE, type QuickMode } from "@/lib/brand/quick-calculation";
import { MassProductSelection, isSelectedMassProduct } from "@/components/calculator/mass-product-selection";
import { trackUsage } from "@/lib/analytics";
import { decimalError } from "@/lib/calc/number-text";
import { heroMeasurement, heroResult, type HeroValues } from "@/lib/brand/hero-calculation";
import { BeginnerHelp } from "@/components/plan/beginner-help";
import { SiteSearchButton } from "@/components/search/site-search";
import { CalculatorProductTools } from "@/components/partners/calculator-products";
import styles from "./hero-calculator.module.css";
import { useCalculationSession, useSessionDraft, patchCalculation, clearCalculation, resumeMassCalculation } from "@/lib/session/calculation-session";
import { convertMassText } from "@/lib/calc/mass-text";
import { amountSchedule, eachAmountText } from "@/lib/calc/amount-schedule";
import { AmountScheduleFields, SessionValuesNotice } from "@/components/calculator/amount-schedule";
const modes: { id: QuickMode; label: string }[] = [
  { id: "concentration", label: "BAC water" }, { id: "mass", label: "mg to mcg" }, { id: "units", label: "U-100 to mL" }
];
const smallScreen = () => window.matchMedia("(max-width: 780px)").matches;

export function HeroCalculator() {
  const uid = useId();
  const [mode, setMode] = useSessionDraft<QuickMode>("hero-mode", "concentration");
  const shared = useCalculationSession();
  const [massConversion,setMassConversion]=useSessionDraft<{unit:"mg"|"mcg";text:string}>("mass-conversion",{unit:"mg",text:""});
  const [scaleConversion,setScaleConversion]=useSessionDraft<{direction:"units"|"ml";text:string}>("scale-conversion",{direction:"units",text:""});
  const cm=convertMassText(massConversion.text,massConversion.unit);
  const converters={mass:massConversion.unit==="mg"?massConversion.text:cm.kind==="value"?cm.mg:"",units:scaleConversion.direction==="units"?scaleConversion.text:scaleConversion.text.trim()&&Number.isFinite(Number(scaleConversion.text))&&Number(scaleConversion.text)>=0?String(Number(scaleConversion.text)*100):""};

  useEffect(resumeMassCalculation,[]);
  const mass = convertMassText(shared.vialInput, shared.vialUnit);
  const values: HeroValues = { ...converters, amount: mass.kind === "value" ? mass.mg : shared.vialInput, volume: shared.finalVolume, target: shared.amount, targetUnit: shared.amountUnit };
  const [open, setOpen] = useState(false), [notice, setNotice] = useState("");
  const [example, setExample] = useState(false);
  const [measurementOpen,setMeasurementOpen]=useSessionDraft("hero-measurement-open",false);
  const dialogRef = useRef<HTMLDivElement>(null), expandRef = useRef<HTMLButtonElement>(null);
  const wantedField = useRef<string | null>(null);
  const productReady = isSelectedMassProduct(shared);
  const result = mode === "concentration" && !productReady ? null : heroResult(mode, values), schedule = amountSchedule(shared);
  const measurement = shared.amount.trim() && !schedule.ready
    ? { kind:"error" as const, message:schedule.message }
    : heroMeasurement({ ...values, target:eachAmountText(shared, shared.amountUnit) });
  const entered = mode === "concentration" ? !!(values.amount.trim() && values.volume.trim()) : !!values[mode === "mass" ? "mass" : "units"].trim();
  const errors: Partial<Record<keyof HeroValues, string>> = mode === "concentration"
    ? { amount: decimalError(values.amount, "Amount in vial"), volume: decimalError(values.volume, "Final liquid volume") }
    : mode === "units" ? { units: decimalError(values.units, "U-100 scale units") }
    : { mass: values.mass.trim() && !result ? (() => { const converted = convertMassText(values.mass, "mg"); return converted.kind === "error" ? converted.message : "Check the mass value."; })() : "" };
  const invalid = (mode !== "concentration" || productReady) && (Object.values(errors).some(Boolean) || (entered && !result));
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
  const started = useRef(false), hadError = useRef(false);
  useEffect(() => { if (invalid) hadError.current = true; if (result) { trackUsage("calculation_completed"); if (hadError.current) { trackUsage("input_corrected"); hadError.current = false; } } }, [Boolean(result), invalid]);
  function update(key: keyof HeroValues, value: string) {
    if (!started.current) { trackUsage("tool_started"); started.current = true; }
    if(key==="amount")patchCalculation({vialInput:value,vialUnit:"mg"});
    else if(key==="volume")patchCalculation({finalVolume:value});
    else if(key==="target")patchCalculation({amount:value});
    else if(key==="mass")setMassConversion({unit:"mg",text:value});
    else if(key==="units")setScaleConversion({direction:"units",text:value});
    setExample(false);setNotice("");
  }
  function select(id: QuickMode, scope: string) { setMode(id); setNotice(""); if (scope === "inline" && smallScreen()) focusScreen(); }
  function tabKey(e: KeyboardEvent<HTMLButtonElement>, index: number, scope: string) {
    const next = e.key === "ArrowRight" ? (index + 1) % modes.length : e.key === "ArrowLeft" ? (index + modes.length - 1) % modes.length : e.key === "Home" ? 0 : e.key === "End" ? modes.length - 1 : null;
    if (next === null) return;
    e.preventDefault(); select(modes[next].id, scope); document.getElementById(`${uid}-${scope}-tab-${modes[next].id}`)?.focus();
  }
  async function copy() {
    if (!result || (mode === "concentration" && measurement.kind === "error")) return;
    const text = result.formula + (mode === "concentration" && measurement.kind === "value" ? `\nFor one time: ${measurement.formula}\n${measurement.units} U-100 units${schedule.ready&&schedule.scheduled?`\n${schedule.count} times per week; ${schedule.weeklyMcg} mcg total per week`:""}` : "");
    try { await navigator.clipboard.writeText(text); setNotice("Calculation copied."); trackUsage("result_copied"); }
    catch { setNotice("Copy is unavailable. You can select and copy the formula shown here."); }
  }
  function content(scope: "inline" | "focus") {
    const id = `${uid}-${scope}`;
    const field = (key: "amount" | "volume" | "mass" | "units" | "target", label: string, unit: string, placeholder: string) => <div className={styles.field}>
      <label htmlFor={`${id}-${key}`}>{label}</label>
      <div className={styles.inputWrap}><input id={`${id}-${key}`} data-hero-field={key} type="text" inputMode="decimal" value={values[key]} placeholder={placeholder} maxLength={64} disabled={mode === "concentration" && !productReady} autoComplete="off" spellCheck={false}
        onChange={e => update(key, e.target.value)} onFocus={() => { if (scope === "inline" && smallScreen()) focusScreen(key); }}
        aria-invalid={key === "target" ? measurement.kind === "error" : Boolean(errors[key])} aria-describedby={`${id}-help ${id}-${key}-error`} /><span>{unit}</span></div><p id={`${id}-${key}-error`} className={styles.error} role={errors[key] ? "alert" : undefined}>{errors[key]}</p>
    </div>;
    return <>
      <div role="tablist" aria-label="Quick calculation type" className={styles.tabs}>{modes.map((tab, index) => <button type="button" role="tab" key={tab.id} id={`${id}-tab-${tab.id}`} aria-controls={`${id}-panel`} aria-selected={mode === tab.id} tabIndex={mode === tab.id ? 0 : -1} onClick={() => select(tab.id, scope)} onKeyDown={e => tabKey(e, index, scope)}>{tab.label}</button>)}</div>
      <div className={styles.panel} id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${mode}`}>
        <div className="pt-4">{mode === "concentration" && <MassProductSelection/>}</div>
        <div className={styles.fields}>{mode === "concentration" ? <>{field("amount", "Amount in vial", "mg", "e.g. 12")}{field("volume", "Final liquid volume", "mL", "e.g. 4")}</> : mode === "mass" ? <>{field("mass", "Amount in milligrams", "mg", "e.g. 0.125")}<p className={styles.unitNote}>1 mg equals<br /><strong>1,000 mcg</strong></p></> : <>{field("units", "U-100 scale units", "units", "e.g. 25")}<p className={styles.unitNote}>100 U-100 units equal<br /><strong>1 mL</strong></p></>}</div>
        {mode === "concentration" && productReady && <details className={styles.optional} open={measurementOpen}>
          <summary onClick={e=>{e.preventDefault();setMeasurementOpen(v=>!v);if(scope==="inline"&&smallScreen())focusScreen();}}>Find the amount of liquid for each time</summary>
          <AmountScheduleFields/>
        </details>}
        <div className={styles.result} data-live-result role="status" aria-live="polite" aria-atomic="true">
          <div className={styles.resultTop}><span>{mode === "concentration" ? "Amount in each 1 mL" : "Your converted number"}</span>{result && <Check size={18} aria-hidden="true" />}</div>
          <p className={styles.value}>{result ? <><strong className={result.value.length > 9 ? styles.longValue : undefined}>{result.value}</strong><span>{result.unit}</span></> : <span className={styles.empty}>Your numbers.<br />A clear result.</span>}</p>
          <p className={styles.formula}>{result?.formula || (mode === "concentration" && !productReady ? "Choose your product first to use the correct fields and units." : "Enter your values above to see the math.")}</p>
          {mode === "concentration" && result && measurement.kind === "value" && <div className={styles.measurement}><p><strong>{measurement.ml}</strong> mL</p><p><strong>{measurement.units}</strong> U-100 units</p><p className={styles.formula}>{measurement.formula}</p>{measurement.warning && <p className={styles.warning}>{measurement.warning}</p>}<p className={styles.scaleNote}>U-100 is a volume scale, not the amount of a medicine.</p></div>}
        </div>
        <p id={`${id}-error`} className={styles.error} role={invalid || (mode === "concentration" && measurement.kind === "error") ? "alert" : undefined}>{invalid ? "Correct the highlighted field to update the result." : mode === "concentration" && measurement.kind === "error" ? measurement.message : ""}</p>
        <div className={styles.actions}><button type="button" onClick={copy} disabled={!result || (mode === "concentration" && measurement.kind === "error")}><Copy size={15} aria-hidden="true" />Copy result</button><button type="button" onClick={() => { if(mode==="concentration")clearCalculation();else if(mode==="mass")setMassConversion({unit:"mg",text:""});else setScaleConversion({direction:"units",text:""}); setNotice(""); setExample(false); setMeasurementOpen(false); }}><RotateCcw size={15} aria-hidden="true" />Clear</button><button type="button" onClick={() => { if(mode==="concentration")patchCalculation({vialInput:QUICK_EXAMPLE.amount,vialUnit:"mg",finalVolume:QUICK_EXAMPLE.volume,amount:"",basis:"each",timesPerWeek:""});else if(mode==="mass")setMassConversion({unit:"mg",text:QUICK_EXAMPLE.mass});else setScaleConversion({direction:"units",text:QUICK_EXAMPLE.units});setExample(true); setNotice(""); if (scope === "inline" && smallScreen()) focusScreen(); }}>Use example</button></div>
        <p id={`${id}-help`} className={styles.help}>{example ? "Example numbers only. Not mixing instructions. " : "Use your own label and instructions. "}{mode === "concentration" ? "Use the final volume from your instructions, not an assumed amount of water. Shown values may be rounded." : mode === "mass" ? "mg and mcg measure mass, not volume." : "Check that the actual device uses a U-100 scale."}</p>
        <p className={styles.notice} role="status">{notice}</p>
        {scope === "focus" && <BeginnerHelp kind={mode==="concentration"?"volume":"units"}/>}
      </div>
    </>;
  }
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <div className={styles.calculator} data-hero-calculator role="region" aria-label="Live BAC water calculator">
      <div className={styles.top}><span><Calculator size={18} aria-hidden="true" />LIVE CALCULATOR</span><button type="button" ref={expandRef} onClick={() => focusScreen()} aria-label="Open hero calculator full screen"><Expand size={15} aria-hidden="true" /><span>Full screen</span></button></div>
      <SessionValuesNotice/>{content("inline")}
      <div className={styles.products}><CalculatorProductTools selectedId={shared.productId||null} /></div>
      <noscript><p className={styles.help}>Enable JavaScript to use this calculator. <Link href="/methodology">Read the formulas</Link>.</p></noscript>
    </div>
    <Dialog.Portal><Dialog.Overlay className={styles.overlay} /><Dialog.Content ref={dialogRef} className={styles.focus} data-hero-focus
      onOpenAutoFocus={e => { e.preventDefault(); requestAnimationFrame(() => { const root = dialogRef.current; const field = wantedField.current; const target = field ? root?.querySelector<HTMLInputElement>(`[data-hero-field="${field}"]`) : root?.querySelector<HTMLInputElement>("input"); target?.focus({ preventScroll: true }); }); }}
      onCloseAutoFocus={e => { e.preventDefault(); expandRef.current?.focus({ preventScroll: true }); }}>
      <div className={styles.focusBar}><div><Dialog.Title>BAC water calculator</Dialog.Title><Dialog.Description>Just your numbers. Your entries stay when you close this screen.</Dialog.Description></div><SiteSearchButton compact/><Dialog.Close aria-label="Return to homepage"><X size={22} aria-hidden="true" /></Dialog.Close></div>
      <div className={styles.focusBody}>{content("focus")}<div className={styles.products}><CalculatorProductTools selectedId={shared.productId||null} /></div><p className={styles.help}>We check arithmetic, not product safety or suitability. No dose or mixing instruction is chosen.</p></div>
      <div className={styles.focusFooter}><Dialog.Close>Back to homepage</Dialog.Close><Link href="/peptide-calculator">Guided calculator<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}
