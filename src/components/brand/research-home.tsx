import Link from "next/link";
import { ArrowUpRight, Calculator, Scale, Ruler, FileText, LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { ResearchHero } from "./research-hero";
import styles from "./research-home.module.css";
/* The home page is the calculator. Below it: three small tools and nothing else to read. */
const tools=[
 {id:"01",icon:Scale,title:"Change mg to mcg",example:<>mg <span>↔</span> mcg</>,text:"Two ways to write the same amount. 1 mg is 1,000 mcg.",href:"/tools/mg-to-mcg",label:"Open converter"},
 {id:"02",icon:Ruler,title:"Syringe units to mL",example:<>units <span>↔</span> mL</>,text:"On an insulin syringe, 100 units is 1 mL. Convert either way.",href:"/tools/syringe-units",label:"Open converter"},
 {id:"03",icon:FileText,title:"Print a vial label",example:<>save <span>→</span> print</>,text:"Stick your numbers on the vial so you never have to work them out again.",href:"/tools/vial-labels",label:"Make a label"}
];
export function ResearchHome({supplier}:{supplier?:ReactNode}){return <div className={styles.home}>
 <div className={styles.heroGround}><ResearchHero/><div className={styles.benefitRail}><p><Calculator size={16} aria-hidden="true"/>Four quick questions.</p><p><FileText size={16} aria-hidden="true"/>Save or print the answer.</p><p><LockKeyhole size={16} aria-hidden="true"/>No account needed.</p></div></div>
 <section id="toolkit" className={styles.toolkit} aria-labelledby="toolkit-title"><div className={styles.sectionTop}><div><p className={styles.eyebrow}>THREE SMALL TOOLS</p><h2 id="toolkit-title">Need just one thing?</h2></div><Link href="/tools" className={styles.textLink}>All calculators <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
 <div className={styles.toolGrid}>{tools.map(tool=><Link key={tool.id} href={tool.href} className={styles.toolCard}><div className={styles.toolTop}><tool.icon size={19} strokeWidth={1.4} aria-hidden="true"/><span>{tool.id}</span></div><div className={styles.toolExample} aria-hidden="true">{tool.example}</div><h3>{tool.title}</h3><p>{tool.text}</p><div className={styles.toolBottom}><span>{tool.label}</span><span className={styles.arrowCircle}><ArrowUpRight size={18} aria-hidden="true"/></span></div></Link>)}</div>
 </section>
 {supplier}
</div>;}
