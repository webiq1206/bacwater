import { productDisplayName } from "@/lib/partners/supplier-catalog";
import Link from "next/link";
import { ArrowUpRight, Calculator, Scale, Ruler, FileText, LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { ResearchHero } from "./research-hero";
import styles from "./research-home.module.css";
/* The home page is the calculator, then research products, three small tools and compound references. */
const tools=[
 {id:"01",icon:Scale,title:"Change mg to mcg",example:<>mg <span>↔</span> mcg</>,text:"Two ways to write the same amount. 1 mg is 1,000 mcg.",href:"/tools/mg-to-mcg",label:"Open converter"},
 {id:"02",icon:Ruler,title:"Syringe units to mL",example:<>units <span>↔</span> mL</>,text:"On a U-100 scale, 100 units is 1 mL. Convert either way.",href:"/tools/syringe-units",label:"Open converter"},
 {id:"03",icon:FileText,title:"Print a vial label",example:<>save <span>→</span> print</>,text:"Save a reference label with your entered numbers and calculation limits.",href:"/tools/vial-labels",label:"Make a label"}
];
export function ResearchHome({supplier}:{supplier?:ReactNode}){return <div className={styles.home}>
 <div className={styles.heroGround}><ResearchHero/><div className={styles.benefitRail}><p><Calculator size={16} aria-hidden="true"/>Four quick questions.</p><p><FileText size={16} aria-hidden="true"/>Save or print the answer.</p><p><LockKeyhole size={16} aria-hidden="true"/>No account needed.</p></div></div>
 {supplier}
 <section id="toolkit" className={styles.toolkit} aria-labelledby="toolkit-title"><div className={styles.sectionTop}><div><p className={styles.eyebrow}>THREE SMALL TOOLS</p><h2 id="toolkit-title">Need just one thing?</h2></div><Link href="/tools" className={styles.textLink}>All calculators <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
 <div className={styles.toolGrid}>{tools.map(tool=><Link key={tool.id} href={tool.href} className={styles.toolCard}><div className={styles.toolTop}><tool.icon size={19} strokeWidth={1.4} aria-hidden="true"/><span>{tool.id}</span></div><div className={styles.toolExample} aria-hidden="true">{tool.example}</div><h3>{tool.title}</h3><p>{tool.text}</p><div className={styles.toolBottom}><span>{tool.label}</span><span className={styles.arrowCircle}><ArrowUpRight size={18} aria-hidden="true"/></span></div></Link>)}</div>
 </section>
 <section className={styles.references} aria-labelledby="reference-title"><div><p className={styles.eyebrow}>LOOK UP. DON'T GUESS.</p><h2 id="reference-title">Compound references</h2><p>Look up a name. This list is not advice about what to use.</p></div><div><div className={styles.compoundLinks}>{[["bpc-157","BPC-157"],["tb-500","TB-500"],["semaglutide","Semaglutide"],["tirzepatide","Tirzepatide"],["retatrutide","Retatrutide"],["ghk-cu","GHK-Cu"]].map(([slug,label])=><Link key={slug} href={`/peptides/${slug}`}>{productDisplayName(slug,label)}<ArrowUpRight size={13} aria-hidden="true"/></Link>)}</div><p className={styles.referenceLinks}><Link href="/peptides">All compounds</Link><Link href="/peptides/compare">Compare label context</Link><Link href="/learn/vs/sterile-water">BAC water vs sterile water</Link></p></div></section>
</div>;}
