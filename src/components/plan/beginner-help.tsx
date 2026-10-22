import Link from "next/link";
import { Info } from "lucide-react";
import styles from "./beginner-help.module.css";
const HELP={
 vial:{summary:"Where do I find this number?",text:"Look at the label on the small glass bottle. You will see a number followed by mg, like 5 mg or 10 mg. That is the amount of powder inside. Type that number here. Do not type an example from this site.",href:"/learn/how-to-read-a-peptide-vial",link:"See a labeled picture of a vial"},
 amount:{summary:"I don't know what amount to enter",text:"Enter an independently specified research measurement amount in mg or mcg. This is separate from the total mass. Optional schedule arithmetic divides an entered total into equal portions; it does not recommend an amount or schedule.",href:"/learn/what-you-cannot-know",link:"Why we never choose an amount"},
 volume:{summary:"What does final liquid volume mean?",text:"Final liquid volume is the total volume of a solution. It may differ from the water added. Use an independently specified value; this tool cannot infer it from mass or choose a preparation method. Leave it blank if unknown.",href:"/learn/bac-water-concentration-table",link:"See how the water amount changes the numbers"},
 units:{summary:"What do these units mean?",text:"mg and mcg measure how much powder. 1 mg is 1,000 mcg. mL measures liquid. On a U-100 scale, 100 scale units is 1 mL. These are not product IU. Always copy the unit along with the number.",href:"/learn/glossary",link:"Simple definitions"}
} as const;
export function BeginnerHelp({kind}:{kind:keyof typeof HELP}){const h=HELP[kind];return <details className={styles.help}><summary><Info size={16} aria-hidden="true"/>{h.summary}</summary><div><p>{h.text}</p><Link href={h.href}>{h.link}</Link></div></details>;}
