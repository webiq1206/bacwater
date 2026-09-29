import Link from "next/link";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { HeroCalculator } from "./hero-calculator";
import styles from "./research-hero-restored.module.css";

export function ResearchHero() {
  return <section id="quick-calculator" className={styles.hero} aria-labelledby="home-title" data-home-hero data-hero-design="editorial-live">
    <div className={styles.copy}>
      <p className={styles.eyebrow}>YOUR NUMBERS. CLEAR MATH.</p>
      <h1 id="home-title" className={styles.headline}>BAC water <em>calculator.</em></h1>
      <p className={styles.description}>Check concentration, mL and U-100 units from your own numbers.</p>
      <p className={styles.free}><span><Check size={15} aria-hidden="true"/>Free to use</span><span><Check size={15} aria-hidden="true"/>No account needed</span></p>
      <Link href="/tools" className={styles.secondary}>More tools <ArrowRight size={18} aria-hidden="true"/></Link>
    </div>
    <div className={styles.scene}>
      <div className={styles.orbit} aria-hidden="true"/>
      <HeroCalculator/>
    </div>
    <a href="#toolkit" className={styles.scrollCue}>Explore the site <ChevronDown size={18} aria-hidden="true"/></a>
  </section>;
}
