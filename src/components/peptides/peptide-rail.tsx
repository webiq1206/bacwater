import Link from "next/link";
import { Button } from "@/components/ui/button";
import styles from "./peptide-rail.module.css";
export interface RailFact{label:string;value:string;sub?:string}
export interface RailSection{id:string;label:string}
/** A secondary desktop reference. Essential facts also remain in the main column. */
export function PeptideRail({facts,sections,compound}:{facts:RailFact[];sections:RailSection[];compound:string}){return <aside aria-label={`${compound} quick reference`} className={styles.rail} tabIndex={0}>
 {sections.length>0&&<nav aria-label={`${compound} page sections`} className="mt-4 rounded-2xl border bg-card p-5"><h2 className="eyebrow">On this page</h2><ul className="mt-3 space-y-2">{sections.map(s=><li key={s.id}><a className="block text-sm underline" href={'#'+s.id}>{s.label}</a></li>)}</ul></nav>}
 <Button asChild variant="brand" className="mt-4 w-full"><Link href="/plan">Save a calculation</Link></Button>
 </aside>;}
