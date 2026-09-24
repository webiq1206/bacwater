import Link from "next/link";
import styles from "./hero-calculator.module.css";
/** Server-rendered context stays outside the first viewport and active calculator. */
export function HeroMathContext() { return <section className={styles.mathContext} aria-labelledby="reconstitution-math-title">
 <div><h2 id="reconstitution-math-title">How this peptide reconstitution calculator works</h2><p>Enter the amount in your vial and the final liquid volume from your instructions. The calculator divides the amount by the volume to show how much is in each mL.</p><p>Need a measurement? Enter an amount in mg or mcg. You will see its volume in mL and the matching U-100 scale reading. The tool checks your numbers; it does not choose a dose or a mixing method.</p><Link href="/methodology">Check the formulas and limits</Link></div>
 <div className={styles.mathSteps}><div><span>01 / CONCENTRATION</span><p>Vial amount ÷ final volume</p><small>mg ÷ mL = mg/mL</small></div><div><span>02 / MEASUREMENT</span><p>Your amount ÷ concentration</p><small>mg ÷ mg/mL = mL</small></div><div><span>03 / U-100 SCALE</span><p>Volume in mL × 100</p><small>Only for a U-100 scale</small></div></div>
 </section>; }
