"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, Calculator, Check, Copy, Expand, RotateCcw, X } from "lucide-react";
import { QUICK_EXAMPLE, type QuickMode } from "@/lib/brand/quick-calculation";
import { trackUsage } from "@/lib/analytics";
import { decimalError } from "@/lib/calc/number-text";
import { heroResult, EMPTY_HERO } from "@/lib/brand/hero-calculation";
import { SiteSearchButton } from "@/components/search/site-search";
import { CalculatorProductTools } from "@/components/partners/calculator-products";
import { useCalculationSession, useSessionDraft } from "@/lib/session/calculation-session";
import { convertMassText } from "@/lib/calc/mass-text";
import styles from "./hero-calculator.module.css";
import type { PlanSaveState } from "@/components/plan/plan-form";

const GuidedPlan = dynamic(() => import("@/components/plan/plan-form").then(m => m.PlanForm), {
  loading: () => <p className={styles.stepHint} role="status">Loading your step-by-step calculator...</p>,
});
const modes: { id: QuickMode; label: string }[] = [
  { id: "concentration", label: "BAC water" }, { id: "mass", label: "mg to mcg" }, { id: "units", label: "U-100 to mL" },
];
const smallScreen = () => window.matchMedia("(max-width: 780px)").matches;

export function HeroCalculator() {
  const uid = useId(), shared = useCalculationSession();
  const [mode, setMode] = useSessionDraft<QuickMode>("hero-mode", "concentration");
  const [massConversion, setMassConversion] = useSessionDraft<{unit:"mg"|"mcg";text:string}>("mass-conversion", {unit:"mg",text:""});
  const [scaleConversion, setScaleConversion] = useSessionDraft<{direction:"units"|"ml";text:string}>("scale-conversion", {direction:"units",text:""});
  const [open, setOpen] = useState(false), [notice, setNotice] = useState(""), [example, setExample] = useState(false);
  const [saving, setSaving] = useState(false), [savedPlan, setSavedPlan] = useState<PlanSaveState["savedPlan"]>(null);
  const dialogRef = useRef<HTMLDivElement>(null), expandRef = useRef<HTMLButtonElement>(null);
  const wantedField = useRef<string | null>(null), started = useRef(false), hadError = useRef(false);
  const converted = convertMassText(massConversion.text, massConversion.unit);
  const values = { ...EMPTY_HERO,
    mass: massConversion.unit === "mg" ? massConversion.text : converted.kind === "value" ? converted.mg : "",
    units: scaleConversion.direction === "units" ? scaleConversion.text : scaleConversion.text.trim() && Number.isFinite(Number(scaleConversion.text)) && Number(scaleConversion.text) >= 0 ? String(Number(scaleConversion.text) * 100) : "",
  };
  const result = mode === "concentration" ? null : heroResult(mode, values);
  const error = mode === "units" ? decimalError(values.units, "U-100 scale units") : mode === "mass" && values.mass.trim() && !result ? "Check the mass value. Use a number without unit words or commas." : "";
  useEffect(() => {
    if (!open) return;
    const viewport = window.visualViewport;
    const update = () => {
      const el = dialogRef.current; if (!el) return;
      if (viewport && Math.abs(viewport.scale - 1) < .02) { el.style.setProperty("--hero-height", viewport.height + "px"); el.style.setProperty("--hero-top", viewport.offsetTop + "px"); }
      else { el.style.removeProperty("--hero-height"); el.style.removeProperty("--hero-top"); }
    };
    const frame = requestAnimationFrame(update);
    viewport?.addEventListener("resize", update); viewport?.addEventListener("scroll", update); window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); viewport?.removeEventListener("resize", update); viewport?.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [open]);
  useEffect(() => { if (error) hadError.current = true; if (result) { trackUsage("calculation_completed"); if (hadError.current) { trackUsage("input_corrected"); hadError.current = false; } } }, [Boolean(result), error]);
  function focusScreen(key?: string) { wantedField.current = key || null; setOpen(true); }
  function update(key: "mass" | "units", value: string) {
    if (!started.current) { trackUsage("tool_started"); started.current = true; }
    if (key === "mass") setMassConversion({unit:"mg",text:value}); else setScaleConversion({direction:"units",text:value});
    setExample(false); setNotice("");
  }
  function select(id: QuickMode) { setMode(id); setNotice(""); setExample(false); }
  function tabKey(e: KeyboardEvent<HTMLButtonElement>, index: number, scope: string) {
    const next = e.key === "ArrowRight" ? (index + 1) % modes.length : e.key === "ArrowLeft" ? (index + modes.length - 1) % modes.length : e.key === "Home" ? 0 : e.key === "End" ? modes.length - 1 : null;
    if (next === null) return;
    e.preventDefault(); select(modes[next].id); document.getElementById(uid + "-" + scope + "-tab-" + modes[next].id)?.focus();
  }
  async function copy() {
    if (!result) return;
    try { await navigator.clipboard.writeText(result.formula); setNotice("Calculation copied."); trackUsage("result_copied"); }
    catch { setNotice("Copy is unavailable. Select and copy the formula shown here."); }
  }
  function content(scope: "inline" | "focus") {
    const id = uid + "-" + scope, key = mode === "mass" ? "mass" : "units";
    return <>
      <div role="tablist" aria-label="Quick calculation type" className={styles.tabs}>{modes.map((tab, index) => <button type="button" role="tab" key={tab.id} id={id + "-tab-" + tab.id} aria-controls={id + "-panel"} aria-selected={mode === tab.id} tabIndex={mode === tab.id ? 0 : -1} onClick={() => select(tab.id)} onKeyDown={e => tabKey(e, index, scope)}>{tab.label}</button>)}</div>
      <div className={styles.panel} id={id + "-panel"} role="tabpanel" aria-labelledby={id + "-tab-" + mode}>
        {mode === "concentration" ? <GuidedPlan mode="beginner" presentation="hero" saveState={{saving,setSaving,savedPlan,setSavedPlan}}/> : <>
          <div className={styles.fields}><div className={styles.field}><label htmlFor={id + "-" + key}>{mode === "mass" ? "Amount in milligrams" : "U-100 scale units"}</label><div className={styles.inputWrap}><input id={id + "-" + key} data-hero-field={key} type="text" inputMode="decimal" value={values[key]} placeholder={mode === "mass" ? "e.g. 0.125" : "e.g. 25"} maxLength={64} autoComplete="off" spellCheck={false} onChange={e => update(key, e.target.value)} onFocus={() => { if (scope === "inline" && smallScreen()) focusScreen(key); }} aria-invalid={!!error} aria-describedby={id + "-help " + id + "-error"}/><span>{mode === "mass" ? "mg" : "units"}</span></div></div><p className={styles.unitNote}>{mode === "mass" ? <>1 mg equals<br/><strong>1,000 mcg</strong></> : <>100 U-100 units equal<br/><strong>1 mL</strong></>}</p></div>
          <div className={styles.result} data-live-result role="status" aria-live="polite" aria-atomic="true"><div className={styles.resultTop}><span>Your converted number</span>{result && <Check size={18} aria-hidden="true"/>}</div><p className={styles.value}>{result ? <><strong className={result.value.length > 9 ? styles.longValue : undefined}>{result.value}</strong><span>{result.unit}</span></> : <span className={styles.empty}>Your numbers.<br/>A clear result.</span>}</p><p className={styles.formula}>{result?.formula || "Enter your value above to see the math."}</p></div>
          <p id={id + "-error"} className={styles.error} role={error ? "alert" : undefined}>{error}</p>
          <div className={styles.actions}><button type="button" onClick={copy} disabled={!result}><Copy size={15} aria-hidden="true"/>Copy result</button><button type="button" onClick={() => { update(key, ""); setNotice(""); }}><RotateCcw size={15} aria-hidden="true"/>Clear</button><button type="button" onClick={() => { update(key, QUICK_EXAMPLE[key]); setExample(true); if (scope === "inline" && smallScreen()) focusScreen(); }}>Use example</button></div>
          <p id={id + "-help"} className={styles.help}>{example ? "Example numbers only. " : "Use your own label and instructions. "}{mode === "mass" ? "mg and mcg measure mass, not volume." : "Check that the actual device uses a U-100 scale."}</p><p className={styles.notice} role="status">{notice}</p>
        </>}
      </div>
    </>;
  }
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <div className={styles.calculator} data-hero-calculator role="region" aria-label="Live BAC water calculator">
      <div className={styles.top}><span><Calculator size={18} aria-hidden="true"/>LIVE CALCULATOR</span><button type="button" ref={expandRef} onClick={() => focusScreen()} aria-label="Open hero calculator full screen"><Expand size={15} aria-hidden="true"/><span>Full screen</span></button></div>
      {/* Only one form is mounted. Session-backed steps and fields survive this move. */}
      {!open ? content("inline") : <p className={styles.stepHint}>Your calculator is open full screen.</p>}
      {!open && <div className={styles.products}><CalculatorProductTools selectedId={shared.productId || null}/></div>}
      <noscript><p className={styles.stepHint}>Enable JavaScript to use this calculator. <Link href="/methodology">Read the formulas</Link>.</p></noscript>
    </div>
    <Dialog.Portal><Dialog.Overlay className={styles.overlay}/><Dialog.Content ref={dialogRef} className={styles.focus} data-hero-focus
      onOpenAutoFocus={e => { e.preventDefault(); requestAnimationFrame(() => { const root = dialogRef.current, field = wantedField.current; const target = field ? root?.querySelector<HTMLElement>('[data-hero-field="' + field + '"]') : root?.querySelector<HTMLElement>("[data-hero-title]"); target?.focus({preventScroll:true}); }); }}
      onCloseAutoFocus={e => { e.preventDefault(); expandRef.current?.focus({preventScroll:true}); }}>
      <div className={styles.focusBar}><div><Dialog.Title data-hero-title tabIndex={-1}>BAC water calculator</Dialog.Title><Dialog.Description>One step at a time. Your entries stay when you close this screen.</Dialog.Description></div><SiteSearchButton compact/><Dialog.Close aria-label="Return to homepage"><X size={22} aria-hidden="true"/></Dialog.Close></div>
      <div className={styles.focusBody} data-hero-scroll>{content("focus")}<div className={styles.products}><CalculatorProductTools selectedId={shared.productId || null}/></div></div>
      <div className={styles.focusFooter}><Dialog.Close>Back to homepage</Dialog.Close><Link href="/peptide-calculator">Guided workspace<ArrowUpRight size={17} aria-hidden="true"/></Link></div>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}
