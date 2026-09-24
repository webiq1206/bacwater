"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { ArrowUpRight, Calculator, Check, Copy, Expand, RotateCcw, X } from "lucide-react";
import { QUICK_EXAMPLE, type QuickMode } from "@/lib/brand/quick-calculation";
import { EMPTY_HERO, heroMeasurement, heroResult, type HeroValues } from "@/lib/brand/hero-calculation";
import { BeginnerHelp } from "@/components/plan/beginner-help";
import { SiteSearchButton } from "@/components/search/site-search";
import { CalculatorProductTools } from "@/components/partners/calculator-products";
import styles from "./hero-calculator.module.css";
import { useMassDraft } from "@/lib/session/use-mass-draft";
import { massInMg } from "@/lib/session/mass-draft";
import { useSessionDraft, useSessionValue } from "@/lib/session/use-session-draft";
import { EMPTY_MASS_ENTRY, readMassEntry, EMPTY_VOLUME_ENTRY, readVolumeEntry } from "@/lib/session/converter-drafts";
import { convertMassText } from "@/lib/calc/mass-text";
import { amountTiming, showNumber } from "@/lib/calc/amount-timing";
import { AmountAndTiming } from "@/components/calculator/amount-and-timing";
const modes: { id: QuickMode; label: string }[] = [
  { id: "concentration", label: "BAC water" }, { id: "mass", label: "mg to mcg" }, { id: "units", label: "U-100 to mL" }
];
const smallScreen = () => window.matchMedia("(max-width: 780px)").matches;

export function HeroCalculator() {
  const uid = useId();
  const [savedMode,setMode] = useSessionValue<string>("hero.mode", "concentration");
  const mode: QuickMode = savedMode === "mass" || savedMode === "units" ? savedMode : "concentration";
  const {draft,update:patch,clear} = useMassDraft("Homepage");
  const [massEntry,setMassEntry]=useSessionDraft("conversion.mass",EMPTY_MASS_ENTRY,readMassEntry);
  const [volumeEntry,setVolumeEntry]=useSessionDraft("conversion.u100",EMPTY_VOLUME_ENTRY,readVolumeEntry);
  const convertedMass=convertMassText(massEntry.text,massEntry.unit);
  const mass=massEntry.unit==="mg"?massEntry.text:convertedMass.kind==="value"?convertedMass.mg:massEntry.text;
  const unitTextIsDecimal=/^\+?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d{1,3})?$/i.test(volumeEntry.text.trim());
  const units=volumeEntry.direction==="units"?volumeEntry.text:unitTextIsDecimal&&Number.isFinite(Number(volumeEntry.text))?String(Number(volumeEntry.text)*100):volumeEntry.text;
  const timing=amountTiming(draft);
  const values:HeroValues={amount:massInMg(draft),volume:draft.volume,target:timing.kind==="value"?showNumber(timing.perUseMg):"",targetUnit:"mg",mass,units};
  const [open,setOpen]=useState(false),[notice,setNotice]=useState("");
  const example=draft.isExample;
  const [measurementOpen,setMeasurementOpen]=useSessionValue<boolean>("hero.measurementOpen",false);
  const dialogRef=useRef<HTMLDivElement>(null),expandRef=useRef<HTMLButtonElement>(null);
  const wantedField=useRef<string|null>(null);
  const result=heroResult(mode,values);
  const measurement=timing.kind==="value"?heroMeasurement(values):{kind:"empty" as const};
  const entered=mode==="concentration"?!!(values.amount.trim()&&values.volume.trim()):!!values[mode==="mass"?"mass":"units"].trim();
  const invalid=entered&&!result;
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
    if(key==="amount")patch({vial:value,vialUnit:"mg",isExample:false});
    if(key==="volume")patch({volume:value,isExample:false});
    if(key==="mass")setMassEntry({unit:"mg",text:value});
    if(key==="units")setVolumeEntry({direction:"units",text:value});
    setNotice("");
  }
  function select(id: QuickMode, scope: string) { setMode(id); setNotice(""); if (scope === "inline" && smallScreen()) focusScreen(); }
  function tabKey(e: KeyboardEvent<HTMLButtonElement>, index: number, scope: string) {
    const next = e.key === "ArrowRight" ? (index + 1) % modes.length : e.key === "ArrowLeft" ? (index + modes.length - 1) % modes.length : e.key === "Home" ? 0 : e.key === "End" ? modes.length - 1 : null;
    if (next === null) return;
    e.preventDefault(); select(modes[next].id, scope); document.getElementById(`${uid}-${scope}-tab-${modes[next].id}`)?.focus();
  }
  async function copy() {
    if (!result || (mode === "concentration" && (measurement.kind === "error" || (!!draft.amount && timing.kind !== "value")))) return;
    const text = result.formula + (mode === "concentration" && measurement.kind === "value" ? `\n${measurement.formula}\n${measurement.units} U-100 units each time\n${timing.kind==="value"?timing.explanation:""}` : "");
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
        {mode === "concentration" && <details className={styles.optional} open={measurementOpen}><summary onClick={e=>{e.preventDefault();setMeasurementOpen(v=>!v);if(scope==="inline"&&smallScreen())focusScreen();}}>Amount &amp; timing: find mL for each use</summary><AmountAndTiming value={draft} onChange={v=>{patch({...v,isExample:false});setNotice("");}} showHelp={scope==="focus"}/></details>}
        <div className={styles.result} data-hero-result role="status" aria-live="polite" aria-atomic="true">
          <div className={styles.resultTop}><span>{mode === "concentration" ? "Amount in each 1 mL" : "Your converted number"}</span>{result && <Check size={18} aria-hidden="true" />}</div>
          <p className={styles.value}>{result ? <><strong className={result.value.length > 9 ? styles.longValue : undefined}>{result.value}</strong><span>{result.unit}</span></> : <span className={styles.empty}>Your numbers.<br />A clear result.</span>}</p>
          <p className={styles.formula}>{result?.formula || "Enter your values above to see the math."}</p>
          {mode === "concentration" && result && measurement.kind === "value" && <div className={styles.measurement}><p><strong>{measurement.ml}</strong> mL each time</p><p><strong>{measurement.units}</strong> U-100 units each time</p>{timing.kind==="value"&&<p className={styles.formula}>{timing.explanation}</p>}<p className={styles.formula}>{measurement.formula}</p>{measurement.warning && <p className={styles.warning}>{measurement.warning}</p>}<p className={styles.scaleNote}>U-100 is a volume scale, not the amount of a medicine.</p></div>}
        </div>
        <p id={`${id}-error`} className={styles.error} role={invalid || (mode === "concentration" && (measurement.kind === "error" || (!!draft.amount && timing.kind !== "value"))) ? "alert" : undefined}>{invalid ? "Check your entries. Use a decimal point, no commas or unit words." : mode === "concentration" && measurement.kind === "error" ? measurement.message : ""}</p>
        <div className={styles.actions}><button type="button" onClick={copy} disabled={!result || (mode === "concentration" && (measurement.kind === "error" || (!!draft.amount && timing.kind !== "value")))}><Copy size={15} aria-hidden="true" />Copy result</button><button type="button" onClick={() => { if(mode==="concentration"){clear();setMeasurementOpen(false);}else if(mode==="mass")setMassEntry(EMPTY_MASS_ENTRY);else setVolumeEntry(EMPTY_VOLUME_ENTRY);setNotice(""); }}><RotateCcw size={15} aria-hidden="true" />Clear</button><button type="button" onClick={() => { if(mode==="concentration")patch({vial:QUICK_EXAMPLE.amount,vialUnit:"mg",volume:QUICK_EXAMPLE.volume,amount:"",basis:"",frequency:"",isExample:true});else if(mode==="mass")setMassEntry({unit:"mg",text:QUICK_EXAMPLE.mass});else setVolumeEntry({direction:"units",text:QUICK_EXAMPLE.units});setNotice("");if(scope==="inline"&&smallScreen())focusScreen(); }}>Use example</button></div>
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
      <div className={styles.products}><CalculatorProductTools selectedId={draft.productId||null} /></div>
      <noscript><p className={styles.help}>Enable JavaScript to use this calculator. <Link href="/methodology">Read the formulas</Link>.</p></noscript>
    </div>
    <Dialog.Portal><Dialog.Overlay className={styles.overlay} /><Dialog.Content ref={dialogRef} className={styles.focus} data-hero-focus
      onOpenAutoFocus={e => { e.preventDefault(); requestAnimationFrame(() => { const root = dialogRef.current; const field = wantedField.current; const target = field ? root?.querySelector<HTMLInputElement>(`[data-hero-field="${field}"]`) : root?.querySelector<HTMLInputElement>("input"); target?.focus({ preventScroll: true }); }); }}
      onCloseAutoFocus={e => { e.preventDefault(); expandRef.current?.focus({ preventScroll: true }); }}>
      <div className={styles.focusBar}><div><Dialog.Title>BAC water calculator</Dialog.Title><Dialog.Description>Just your numbers. Your entries stay when you close this screen.</Dialog.Description></div><SiteSearchButton compact/><Dialog.Close aria-label="Return to homepage"><X size={22} aria-hidden="true" /></Dialog.Close></div>
      <div className={styles.focusBody}>{content("focus")}<div className={styles.products}><CalculatorProductTools selectedId={draft.productId||null} /></div><p className={styles.help}>We check arithmetic, not product safety or suitability. No dose or mixing instruction is chosen.</p></div>
      <div className={styles.focusFooter}><Dialog.Close>Back to homepage</Dialog.Close><Link href="/peptide-calculator">Guided calculator<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}
