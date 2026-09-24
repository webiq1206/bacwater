import Link from "next/link";
import { Info } from "lucide-react";
import styles from "./beginner-help.module.css";
const HELP={
 vial:{summary:"Where do I find this?",text:"Look for the total amount on your vial label, such as a number followed by mg. A vial is the small bottle. Copy your own number, not an example from this site.",href:"/learn/how-to-read-a-peptide-vial",link:"Help reading a label"},
 amount:{summary:"I don't know what amount to enter",text:"Copy the amount and unit from the instructions you already have. If they give an amount for each use, choose Each time. If they give a total for the week, choose Whole week and enter how often that total is split. The number on the bottle is the whole bottle, not one use. The tool cannot choose an amount or timing for you. For medical use, ask your clinician when instructions are unclear.",href:"/learn/what-you-cannot-know",link:"What the calculator cannot decide"},
 volume:{summary:"Does this mean how much water to add?",text:"Not necessarily. Enter the total liquid volume after preparation, from your product instructions. The calculator cannot decide which liquid to use or how much to add.",href:"/methodology",link:"How the calculation works"},
 units:{summary:"What do these units mean?",text:"mg and mcg measure an amount. 1 mg equals 1,000 mcg. mL measures liquid volume. A U-100 scale has 100 units in 1 mL. These are different kinds of numbers, so copy the unit too.",href:"/learn/glossary",link:"Simple definitions"}
} as const;
export function BeginnerHelp({kind}:{kind:keyof typeof HELP}){const h=HELP[kind];return <details className={styles.help}><summary><Info size={16} aria-hidden="true"/>{h.summary}</summary><div><p>{h.text}</p><Link href={h.href}>{h.link}</Link></div></details>;}
