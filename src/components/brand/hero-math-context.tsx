import Link from "next/link";
import styles from "./hero-calculator.module.css";
/** Server-rendered context stays outside the first viewport and active calculator. */
export function HeroMathContext() { return <section className={styles.mathContext} aria-labelledby="reconstitution-math-title">
 <div><h2 id="reconstitution-math-title">How this peptide reconstitution calculator works</h2><p>BAC water means bacteriostatic water. Enter the total mass and an independently specified final liquid volume. The calculator divides mass by volume to show concentration.</p><p>An optional measurement amount gives a volume equivalent and scale conversion. The tool cannot select a diluent, dose or preparation volume, or establish compatibility, sterility or shelf life. Research examples are not for human use.</p><Link href="/methodology">Check the formulas and limits</Link></div>
 <div className={styles.mathSteps}><div><span>01 / STRENGTH</span><p>Total mass ÷ final volume</p><small>mg ÷ mL = mg in each mL</small></div><div><span>02 / ENTERED MASS</span><p>Entered mass ÷ concentration</p><small>mg ÷ mg/mL = volume equivalent</small></div><div><span>03 / SCALE CONVERSION</span><p>mL × 100</p><small>U-100 scale units, not product IU</small></div></div>
 </section>; }
