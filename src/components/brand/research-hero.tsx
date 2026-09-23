import Link from "next/link";
import { ArrowUpRight, Check, Calculator, ArrowRight, Scale, Ruler, ChevronDown } from "lucide-react";
import styles from "./research-hero.module.css";
export function ResearchHero(){return <section className={`${styles.hero} ${styles.fullHero}`} aria-labelledby="home-title" data-home-hero>
 <div className={styles.copy}>
  <p className={styles.heroKicker}>YOUR NUMBERS. MADE CLEAR.</p>
  <h1 id="home-title">BAC water<br/><em>calculator.</em></h1>
  <p className={styles.description}>Enter your numbers.<br/>Get a clear answer, one step at a time.</p>
  <p className={styles.free}><span><Check size={15} aria-hidden="true"/>Free to use</span><span><Check size={15} aria-hidden="true"/>No account needed</span></p>
  <p className={styles.limit}>We check the math. We do not tell you what to take or what to mix.</p>
 </div>
 <div className={styles.launcher} id="quick-calculator" aria-label="Open a calculator">
  <div className={styles.launchTop}><span><Calculator size={22} aria-hidden="true"/>START HERE</span><span>FULL-SCREEN TOOLS</span></div>
  <h2>Let’s check your numbers.</h2>
  <p>Use your label and instructions. We’ll guide you through each box.</p>
  <div className={styles.launchExample} aria-label="Arithmetic example: 12 milligrams divided by 4 milliliters equals 3 milligrams per milliliter"><span>EXAMPLE ONLY</span><p>12 <small>mg</small> ÷ 4 <small>mL</small> <span>=</span> <strong>3 <small>mg/mL</small></strong></p></div>
  <Link href="/peptide-calculator" className={styles.launchPrimary}>Open calculator <ArrowUpRight size={22} aria-hidden="true"/></Link>
  <p className={styles.launchNote}>Just the calculator. Nothing in your way.</p>
  <div className={styles.launchTools} aria-label="Quick converters">
   <Link href="/tools/mg-to-mcg"><Scale size={17} aria-hidden="true"/><span>mg to mcg</span><ArrowRight size={16} aria-hidden="true"/></Link>
   <Link href="/tools/syringe-units"><Ruler size={17} aria-hidden="true"/><span>U-100 to mL</span><ArrowRight size={16} aria-hidden="true"/></Link>
  </div>
 </div>
 <a href="#toolkit" className={styles.scrollCue}>Explore the site <ChevronDown size={17} aria-hidden="true"/></a>
 </section>;}
