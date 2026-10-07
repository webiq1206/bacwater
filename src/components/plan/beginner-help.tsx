import Link from "next/link";
import { Info } from "lucide-react";
import styles from "./beginner-help.module.css";
const HELP={
 vial:{summary:"Where do I find this?",text:"Look for the total amount on your vial label, such as a number followed by mg. A vial is the small bottle. Copy your own number, not an example from this site.",href:"/learn/how-to-read-a-peptide-vial",link:"Help reading a label"},
 amount:{summary:"I don't know what amount to enter",text:"Enter the amount for one measurement from your lab instructions. This is not the total in the bottle. If you only have a daily or weekly total, open the optional schedule section. If the amount is unknown, ask whoever supplied the lab instructions. The calculator does not choose it.",href:"/learn/what-you-cannot-know",link:"What the calculator cannot decide"},
 volume:{summary:"Does this mean how much water to add?",text:"The math uses all the liquid in the vial after mixing. For a dry vial, your lab instructions may treat the added water as that total. If the vial already contains liquid, adding 1 mL of water does not mean it holds only 1 mL. Use the final total from your lab instructions.",href:"/methodology",link:"How the calculation works"},
 units:{summary:"What do these units mean?",text:"mg and mcg measure an amount. 1 mg equals 1,000 mcg. mL measures liquid volume. A U-100 scale has 100 units in 1 mL. These are different kinds of numbers, so copy the unit too.",href:"/learn/glossary",link:"Simple definitions"}
} as const;
export function BeginnerHelp({kind}:{kind:keyof typeof HELP}){const h=HELP[kind];return <details className={styles.help}><summary><Info size={16} aria-hidden="true"/>{h.summary}</summary><div><p>{h.text}</p><Link href={h.href}>{h.link}</Link></div></details>;}
