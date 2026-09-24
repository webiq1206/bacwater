"use client";
import { useSessionDraft } from "@/lib/session/calculation-session";
import { CalculatorWorkspace } from "@/components/calculator/calculator-workspace";
import { SupplyChecklist } from "@/components/tools/supply-checklist";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { convertMassText, type MassUnit } from "@/lib/calc/mass-text";
import { trackUsage } from "@/lib/analytics";
const KEY = "bacwater.tool.mass.v2";
type Entry = { unit: MassUnit; text: string };
const empty: Entry = { unit: "mg", text: "" };
export default function MgMcgConverterPage() {
  const recorded=useRef("");
  const [entry,setEntry]=useSessionDraft<Entry>("mass-conversion",empty);
  const result = convertMassText(entry.text, entry.unit);
  const value = (unit: MassUnit) => unit === entry.unit ? entry.text : result.kind === "value" ? result[unit] : "";
  return <CalculatorWorkspace title="mg to mcg converter" description="Type in either box. The other number updates right away." help={<>    <section className="mt-10"><h2 className="text-2xl font-serif">Check the relationship</h2><div className="mt-4 overflow-x-auto rounded-xl border border-border" role="region" tabIndex={0} aria-label="Mass conversion examples"><table className="w-full text-left text-sm"><caption className="sr-only">Equivalent amounts in milligrams and micrograms</caption><thead><tr><th scope="col" className="p-3">Milligrams</th><th scope="col" className="p-3">Micrograms</th></tr></thead><tbody>{[["0", "0"], ["0.000001", "0.001"], ["0.125", "125"], ["0.5", "500"], ["1", "1000"], ["12", "12000"]].map(([mg, mcg]) => <tr key={mg} className="border-t border-border"><td className="p-3">{mg} mg</td><td className="p-3">{mcg} mcg</td></tr>)}</tbody></table></div></section>
    <section className="mt-10 space-y-3"><h2 className="text-2xl font-serif">Mass is not volume or syringe units</h2><p>mg and mcg both measure mass. Neither specifies mL or a U-100 marking unless the solution concentration is also known. This converter does not choose a dose or a preparation.</p><p>The conversion shifts decimal places in text, rather than rounding through binary floating-point arithmetic. It accepts up to 64 input characters and exponents from -100 to 100. Other site calculators have separate numeric display limits.</p><p>See <a className="underline" href="https://www.nist.gov/pml/owm/metric-si-prefixes" rel="noopener noreferrer" target="_blank">NIST's SI prefix definitions</a>, <Link href="/methodology" className="underline">our calculation methodology</Link> and the <Link href="/learn/how-to-read-a-peptide-vial" className="underline">vial-label guide</Link>.</p></section>
  <SupplyChecklist/></>}>
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-7" aria-label="Mass conversion">
      <div className="grid gap-5 sm:grid-cols-2">
        {(["mg", "mcg"] as const).map(unit => <div key={unit}>
          <label htmlFor={`mass-${unit}`} className="block font-medium">{unit === "mg" ? "Milligrams (mg)" : "Micrograms (mcg)"}</label>
          <Input id={`mass-${unit}`} type="text" inputMode="decimal" autoComplete="off" spellCheck={false} maxLength={64} value={value(unit)}
            aria-invalid={result.kind === "error" && entry.unit === unit} aria-describedby="mass-help mass-status"
            onChange={e => setEntry({ unit, text: e.target.value })}
            onBlur={() => { if (result.kind === "value" && recorded.current!==result.mg) { recorded.current=result.mg; trackUsage("calculation_completed"); } }} className="mt-2 min-h-12 text-base" />
        </div>)}
      </div>
      <p id="mass-help" className="mt-3 text-sm text-muted-foreground">Use a decimal point, without commas. Your last entry stays in this tab for this session. It also follows you to the same converter on the homepage. No account is needed.</p>
      <div id="mass-status" role="status" aria-live="polite" aria-atomic="true" className="mt-5 rounded-xl border border-border p-4 break-words [overflow-wrap:anywhere]">
        {result.kind === "value" ? <><p className="font-semibold">{result.mg} mg = {result.mcg} mcg</p><p className="mt-2 text-sm">{entry.unit === "mg" ? "Multiply mg by 1,000." : "Divide mcg by 1,000."} This changes the unit, not the amount.</p></> : <p>{result.kind === "error" ? result.message : "Enter a mass in either field."}</p>}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3"><Button type="button" variant="outline" onClick={() => setEntry(empty)}>Clear conversion</Button><Link className="inline-flex min-h-11 items-center underline" href="/tools/dose">Need amount and volume calculations?</Link></div>
    </section>
  </CalculatorWorkspace>;
}
