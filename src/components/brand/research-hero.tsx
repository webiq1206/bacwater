import Link from "next/link";
import { ArrowUpRight, Check, ArrowRight } from "lucide-react";
import { QuickCalculator } from "./quick-calculator";
import styles from "./research-hero.module.css";
/** Calculator-first composition using the site's existing type families. */
export function ResearchHero(){return <section className={styles.hero} aria-labelledby="home-title">
  <div className={styles.copy}><h1 id="home-title"><span className={styles.eyebrow}><span aria-hidden="true"/>THE BAC WATER CALCULATOR</span>Your numbers.<br/>Made <em>clear.</em></h1>
  <p className={styles.description}>Put in the numbers from your label.<br className={styles.desktopBreak}/> See the math. Save your result.</p>
  <div className={styles.actions}><Link href="/peptide-calculator" className={styles.primary}>Open calculator <ArrowUpRight size={19} aria-hidden="true"/></Link><Link href="/plan" className={styles.secondary}>Guide me through it <ArrowRight size={17} aria-hidden="true"/></Link></div>
  <p className={styles.free}><span><Check size={14} aria-hidden="true"/> Free to calculate</span><span><Check size={14} aria-hidden="true"/> No account needed</span></p>
  <p className={styles.limit}>This checks math. It does not tell you what to take, what to mix, or how long it will keep.</p></div>
  <div className={styles.visual}><div className={styles.orbit} aria-hidden="true"/><div className={styles.visualLabel} aria-hidden="true">LESS CLUTTER. MORE CLARITY.</div><QuickCalculator/></div>
</section>;}
