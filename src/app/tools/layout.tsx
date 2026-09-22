import Link from "next/link";
import type {ReactNode} from "react";
import styles from "./tools.module.css";
export default function ToolsLayout({children}:{children:ReactNode}){return <div className={styles.workspace}>{children}<nav aria-label="Calculator selection and verification" className="mx-auto flex max-w-5xl flex-wrap gap-4 px-4 pb-10 text-sm sm:px-6"><Link href="/compare-calculators" className="underline">Compare calculator interfaces</Link><Link href="/methodology" className="underline">Check formulas and limits</Link></nav></div>;}
