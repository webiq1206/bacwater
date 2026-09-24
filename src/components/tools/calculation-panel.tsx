"use client";
import { CalculatorWorkspace } from "@/components/calculator/calculator-workspace";
import { UnitHelp } from "@/components/tools/unit-help";
import type { ReactNode } from "react";
import { SupplyChecklist } from "./supply-checklist";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/copy-button";
export function CalculationPanel({slug,title,description,fields,result,onClear,children,controls}:{slug:string;title:string;description:string;fields:{id:string;label:string;text:string;set:(value:string)=>void;hint?:string}[];result:{ready:boolean;text:string};onClear:()=>void;children:ReactNode;controls?:ReactNode}){
 return <CalculatorWorkspace title={title} description={description} help={<><UnitHelp/><SupplyChecklist/><div className="mt-9 space-y-4 leading-relaxed">{children}<p><Link href="/methodology" className="underline">Formulas and limits</Link> · <Link href="/tools" className="underline">All calculators</Link> · <Link href="/contact" className="underline">Report a calculation issue</Link></p></div></>}>
<section aria-label={title} className="bac-calc-card p-5 sm:p-7">{controls}<div className="grid gap-5 sm:grid-cols-2">{fields.map(f=><div key={f.id}><label className="block font-medium" htmlFor={f.id}>{f.label}</label><Input id={f.id} type="text" inputMode="decimal" value={f.text} onChange={e=>f.set(e.target.value)} maxLength={64} aria-describedby={f.hint?`${f.id}-help`:undefined} className="mt-2 min-h-12" />{f.hint&&<p id={`${f.id}-help`} className="mt-2 text-sm text-muted-foreground">{f.hint}</p>}</div>)}</div><div role="status" aria-live="polite" aria-atomic="true" className="bac-result-card mt-5 break-words [overflow-wrap:anywhere]">{result.text}</div><div className="mt-5 flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={onClear}>Clear inputs</Button>{result.ready&&<CopyButton value={result.text+" Arithmetic only. Verify product and device instructions."} label="Copy result" />}</div><p className="mt-3 text-xs text-muted-foreground">Entries stay in this browser tab while the session is open. No account is required.</p></section>
 </CalculatorWorkspace>;
}
