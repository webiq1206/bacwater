import Link from "next/link";
import { ArrowUpRight, ArrowRight, Check, ChevronDown, Calculator, Expand, Equal } from "lucide-react";
import styles from "./research-hero-restored.module.css";

/** The approved editorial hero, with real links into distraction-free tools. */
export function ResearchHero() {
  return <section className={styles.hero} aria-labelledby="home-title" data-home-hero data-hero-design="editorial-restored">
    <div className={styles.copy}>
      <h1 id="home-title">
        <span className={styles.eyebrow}><span aria-hidden="true" />The BAC water calculator</span>
        <span className={styles.headline}>Your numbers.<br />Made <em>clear.</em></span>
      </h1>
      <p className={styles.description}>Put in the numbers from your label.<br />See the math. Keep your result.</p>
      <div className={styles.actions}>
        <Link href="/peptide-calculator" className={styles.primary}>Open calculator <ArrowUpRight size={21} aria-hidden="true" /></Link>
        <Link href="/tools" className={styles.secondary}>More tools <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
      <p className={styles.free}><span><Check size={15} aria-hidden="true" />Free to use</span><span><Check size={15} aria-hidden="true" />No account needed</span></p>
      <p className={styles.limit}>We check the math. We do not tell you what to take or what to mix.</p>
    </div>

    <div className={styles.scene}>
      <div className={styles.orbit} aria-hidden="true" />
      <div className={styles.preview} role="region" aria-label="Calculator preview">
        <div className={styles.previewTop}><span><Calculator size={19} aria-hidden="true" />CALCULATOR PREVIEW</span><span>EXAMPLE / 01</span></div>
        <nav className={styles.tools} aria-label="Open a full-screen calculator">
          <Link href="/tools/bac-water" className={styles.featuredTool}>Concentration</Link>
          <Link href="/tools/mg-to-mcg">mg to mcg</Link>
          <Link href="/tools/syringe-units">U-100 to mL</Link>
        </nav>
        <div className={styles.example}>
          <dl className={styles.values}>
            <div><dt>Amount on the label</dt><dd>12 <span>mg</span></dd></div>
            <div><dt>Total liquid</dt><dd>4 <span>mL</span></dd></div>
          </dl>
          <div className={styles.result}>
            <div className={styles.resultTop}><span>How much is in each mL</span><Equal size={21} aria-hidden="true" /></div>
            <p className={styles.resultValue}><strong>3</strong><span>mg/mL</span></p>
            <p className={styles.formula}>12 mg ÷ 4 mL = 3 mg/mL</p>
          </div>
          <p className={styles.exampleNote}>Example numbers, not mixing instructions.</p>
        </div>
        <Link href="/peptide-calculator" className={styles.cardAction}><span>Start with my numbers</span><ArrowUpRight size={21} aria-hidden="true" /></Link>
        <p className={styles.focusNote}><Expand size={14} aria-hidden="true" />Just the calculator. Nothing in your way.</p>
      </div>
      <p className={styles.sceneLabel} aria-hidden="true">LESS CLUTTER. MORE CLARITY.</p>
    </div>

    <a href="#toolkit" className={styles.scrollCue}>Explore the site <ChevronDown size={18} aria-hidden="true" /></a>
  </section>;
}
