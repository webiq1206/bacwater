import Link from "next/link";
import { Info } from "lucide-react";
import styles from "./beginner-help.module.css";
const HELP={
 vial:{summary:"Where do I find this?",text:"Look for the total amount on your vial label, such as a number followed by mg. A vial is the small bottle. Copy your own number, not an example from this site.",href:"/learn/how-to-read-a-peptide-vial",link:"Help reading a label"},
 amount:{summary:"I don't know what amount to enter",text:"Use the amount given in your own instructions. The total amount in a vial is not the same as the amount to measure. Do not guess. Check with the person who supplied the instructions or, for medical use, your clinician.",href:"/learn/what-you-cannot-know",link:"What the calculator cannot decide"},
 volume:{summary:"Does this mean how much water to add?",text:"Not necessarily. Enter the total liquid volume after preparation, from your product instructions. The calculator cannot decide which liquid to use or how much to add.",href:"/methodology",link:"How the calculation works"},
 units:{summary:"What do these units mean?",text:"mg and mcg measure an amount. 1 mg equals 1,000 mcg. mL measures liquid volume. A U-100 scale has 100 units in 1 mL. These are different kinds of numbers, so copy the unit too.",href:"/learn/glossary",link:"Simple definitions"}
} as const;
export function BeginnerHelp({kind}:{kind:keyof typeof HELP}){const h=HELP[kind];return <details className={styles.help}><summary><Info size={16} aria-hidden="true"/>{h.summary}</summary><div><p>{h.text}</p><Link href={h.href}>{h.link}</Link></div></details>;}
