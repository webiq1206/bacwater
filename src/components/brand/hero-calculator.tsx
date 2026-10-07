"use client";
import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, Calculator, Expand, X } from "lucide-react";
import { SiteSearchButton } from "@/components/search/site-search";
import { UnitHelp } from "@/components/tools/unit-help";
import styles from "./hero-calculator.module.css";
import type { PlanSaveState } from "@/components/plan/plan-form";
const GuidedPlan = dynamic(() => import("@/components/plan/plan-form").then(m => m.PlanForm), {
  loading: () => <p className={styles.stepHint} role="status">Loading your step-by-step calculator...</p>,
});
export function HeroCalculator() {
  const [open,setOpen] = useState(false);
  const [saving,setSaving] = useState(false), [savedPlan,setSavedPlan] = useState<PlanSaveState["savedPlan"]>(null);
  const dialogRef = useRef<HTMLDivElement>(null), expandRef = useRef<HTMLButtonElement>(null);
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

  function content() { return <div className={styles.panel}><GuidedPlan mode="beginner" presentation="hero" saveState={{saving,setSaving,savedPlan,setSavedPlan}}/></div>; }
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <div className={styles.calculator} data-hero-calculator role="region" aria-label="Live BAC water calculator">
      <div className={styles.top}><span><Calculator size={18} aria-hidden="true"/>CALCULATOR</span><div className={styles.topActions}><UnitHelp compact/><button type="button" ref={expandRef} onClick={() => setOpen(true)} aria-label="Open hero calculator full screen"><Expand size={15} aria-hidden="true"/><span className={styles.expandLabel}>Expand</span></button></div></div>
      {/* Only one form is mounted. Session-backed steps and fields survive this move. */}
      {!open ? content() : <p className={styles.stepHint}>Your calculator is open full screen.</p>}
      <noscript><p className={styles.stepHint}>Enable JavaScript to use this calculator. <Link href="/methodology">Read the formulas</Link>.</p></noscript>
    </div>
    <Dialog.Portal><Dialog.Overlay className={styles.overlay}/><Dialog.Content ref={dialogRef} className={styles.focus} data-hero-focus
      onEscapeKeyDown={e => { if (e.target instanceof Element && e.target.closest('[data-unit-help]')) e.preventDefault(); }}
      onOpenAutoFocus={e => { e.preventDefault(); requestAnimationFrame(() => { const target = dialogRef.current?.querySelector<HTMLElement>("[data-hero-title]"); target?.focus({preventScroll:true}); }); }}
      onCloseAutoFocus={e => { e.preventDefault(); expandRef.current?.focus({preventScroll:true}); }}>
      <div className={styles.focusBar}><div><Dialog.Title data-hero-title tabIndex={-1}>BAC water calculator</Dialog.Title><Dialog.Description>One step at a time. Your entries stay when you close this screen.</Dialog.Description></div><UnitHelp compact/><SiteSearchButton compact/><Dialog.Close aria-label="Return to homepage"><X size={22} aria-hidden="true"/></Dialog.Close></div>
      <div className={styles.focusBody} data-hero-scroll>{content()}</div>
      <div className={styles.focusFooter}><Dialog.Close>Back to homepage</Dialog.Close><Link href="/peptide-calculator">Guided workspace<ArrowUpRight size={17} aria-hidden="true"/></Link></div>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}
