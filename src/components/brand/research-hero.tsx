import Link from "next/link";
import { ArrowUpRight, ArrowRight, Check, ChevronDown } from "lucide-react";
import { HeroCalculator } from "./hero-calculator";
import styles from "./research-hero-restored.module.css";
import live from "./hero-calculator.module.css";

export function ResearchHero() {
  return <section id="quick-calculator" className={`${styles.hero} ${live.heroAccent}`} aria-labelledby="home-title" data-home-hero data-hero-design="editorial-live">
    <div className={styles.copy}>
      <h1 id="home-title" className={`${styles.headline} ${live.headlineAccent}`}>BAC water<br /><em>calculator.</em></h1>
      <p className={`${styles.description} ${live.descriptionAccent}`}>A free peptide reconstitution calculator.<br />Check concentration, mL and U-100 units<br className={live.desktopOnly} /> from your own numbers.</p>
      <div className={styles.actions}>
        <Link href="/peptide-calculator" className={styles.primary}>Open calculator <ArrowUpRight size={21} aria-hidden="true" /></Link>
        <Link href="/tools" className={styles.secondary}>More tools <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
      <p className={styles.free}><span><Check size={15} aria-hidden="true" />Free to use</span><span><Check size={15} aria-hidden="true" />No account needed</span></p>
    </div>
    <div className={`${styles.scene} ${live.sceneAccent}`}>
      <div className={styles.orbit} aria-hidden="true" />
      <HeroCalculator />
      <p className={styles.sceneLabel} aria-hidden="true">REAL INPUTS. LIVE RESULTS.</p>
    </div>
    <a href="#toolkit" className={styles.scrollCue}>Explore the site <ChevronDown size={18} aria-hidden="true" /></a>
  </section>;
}
