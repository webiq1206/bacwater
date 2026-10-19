import Link from "next/link";
import styles from "./hero-calculator.module.css";
/** Server-rendered context stays outside the first viewport and active calculator. */
export function HeroMathContext() { return <section className={styles.mathContext} aria-labelledby="reconstitution-math-title">
 <div><h2 id="reconstitution-math-title">How this peptide reconstitution calculator works</h2><p>BAC water is the liquid you add to the powder in your vial. Type the amount on your vial label and the amount you use each time. The calculator suggests how much BAC water to add, or you can type the amount from your instructions.</p><p>Then it tells you where to fill your syringe and how many doses are in the vial. It does the math from your numbers. It never picks your dose for you.</p><Link href="/methodology">Check the formulas and limits</Link></div>
 <div className={styles.mathSteps}><div><span>01 / STRENGTH</span><p>Vial amount ÷ BAC water</p><small>mg ÷ mL = mg in each mL</small></div><div><span>02 / YOUR DOSE</span><p>Dose ÷ strength</p><small>mg ÷ mg/mL = mL to draw</small></div><div><span>03 / SYRINGE LINE</span><p>mL × 100</p><small>On a U-100 insulin syringe</small></div></div>
 </section>; }
