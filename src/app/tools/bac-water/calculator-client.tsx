"use client";
import { BAC_WATER_FAQS } from "./faqs";
import { CalculationOutcome } from "@/components/calculator/calculation-events";
import { MassProductGate } from "@/components/calculator/mass-product-selection";
import { useState, useRef, useLayoutEffect } from "react";
import { CalculatorWorkspace, WorkspaceActions } from "@/components/calculator/calculator-workspace";

import Link from "next/link";
import { SupplyChecklist } from "@/components/tools/supply-checklist";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/copy-button";
import { useVialContext, type MassUnit } from "@/lib/tools/vial-context";
import { usePersistentState } from "@/lib/use-persistent-state";
import { plainWarnings } from "@/lib/calc/plain-warnings";
import { decimalError, positiveDecimal } from "@/lib/calc/number-text";

/** Short, readable numbers for the screen; the copy buttons keep more digits. */
function display(value: number, digits = 4): string {
  if (value > 0 && (value < 0.000001 || value >= 1000000000)) return value.toExponential(3);
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: digits, useGrouping: false }).format(value);
}
const precise = (value: number) => display(value, 10);

function UnitChoice({ value, onChange, label }: { value: MassUnit; onChange: (unit: MassUnit) => void; label: string }) {
  return <div className="flex shrink-0 gap-1" role="group" aria-label={label}>{(["mg", "mcg"] as const).map(unit => <Button key={unit} type="button" variant={value === unit ? "brand" : "outline"} aria-pressed={value === unit} onClick={() => onChange(unit)} className="min-h-11 px-3">{unit}</Button>)}</div>;
}

export default function BacWaterCalculatorPage() {
  const vial = useVialContext();
  const [screen,setScreen] = useState<"inputs"|"result">("inputs");
  const panels=useRef<HTMLDivElement>(null);
  const previousScreen=useRef(screen);
  function switchScreen(next:"inputs"|"result") {
    setScreen(next);
  }
  useLayoutEffect(()=>{
      if(previousScreen.current===screen)return;
      previousScreen.current=screen;
      // The next screen starts at the top of the scrolling area, so nobody
      // lands on the bottom of the previous one and has to scroll up.
      // Set focus with the committed screen, before a subsequent input action.
      // A deferred frame can otherwise steal focus halfway through clearing a field.
      const screenPanel=panels.current?.querySelector<HTMLElement>(`[data-screen="${screen}"]`);
      screenPanel?.scrollIntoView({block:"start",behavior:"instant"});
      const heading=screenPanel?.querySelector<HTMLElement>("h2");
      if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
  },[screen]);
  const [savedVolume, setVolume] = usePersistentState<string>("bacwater.tool.bacwater.volume.v2", "");
  const volumeText = typeof savedVolume === "string" ? savedVolume : "";
  const vialAmount = Number(vial.vialInput);
  const measurementAmount = Number(vial.doseInput);
  const vialMg = vial.vialUnit === "mcg" ? vialAmount / 1000 : vialAmount;
  const measurementMg = vial.doseUnit === "mcg" ? measurementAmount / 1000 : measurementAmount;
  const amountsValid = [vialMg, measurementMg].every(n => Number.isFinite(n) && n > 0);
  const volume = positiveDecimal(volumeText) ?? 0;
  const concentration = Number.isFinite(vialMg) && vialMg > 0 && volume > 0 ? vialMg / volume : 0;
  const concentrationValid = [volume, concentration].every(n => Number.isFinite(n) && n > 0);
  const measurementMl = concentration > 0 ? measurementMg / concentration : 0;
  const units = measurementMl * 100;
  const valid = amountsValid && [volume, concentration, measurementMl, units].every(n => Number.isFinite(n) && n > 0);
  const dosesPerVial = valid ? Math.floor(vialMg / measurementMg + 1e-9) : 0;
  const invalidAmount = [vialAmount, measurementAmount].some(n => !Number.isFinite(n) || n < 0);
  const invalidVolume = volumeText.trim() !== "" && (!Number.isFinite(volume) || volume <= 0);
  const outsideRange = vialMg > 0 && volume > 0 && (!concentrationValid || (measurementMg > 0 && !valid));
  const error = decimalError(vial.vialText, "Total amount in the vial") || decimalError(vial.amountText, "Amount to measure") || decimalError(volumeText, "Final liquid volume") || (invalidAmount ? "Type numbers bigger than zero and check the units." : invalidVolume ? "Final liquid volume must be greater than zero." : outsideRange ? "These numbers are too big or too small for this calculator. Check the amounts and units." : measurementMg > vialMg && amountsValid ? "Your measurement amount is bigger than the whole vial. Check the number and whether it is mg or mcg." : "");
  const canShowResult = concentrationValid && !error;

  function clear() {
    vial.clear();
    setVolume("");
  }

  return (
    <CalculatorWorkspace title="BAC water calculator: mL and concentration" description={<><p>Use this <strong>BAC water calculator</strong> (bacteriostatic water) when you need to check <strong>how many mL</strong> relate to concentration for peptide research math. Enter the total mass from the vial label and an <em>independently specified</em> final liquid volume, for example <strong>2 mL</strong>, to see mg/mL and optional U-100 scale equivalents.</p><p>This tool does concentration and volume arithmetic only. It does <strong>not</strong> select a diluent, dose, or preparation volume, and it is not for human or veterinary use. Follow the product instructions that specify the final volume.</p></>} help={<SupplyChecklist volumeMl={valid?volume:undefined} measurementMl={valid?measurementMl:undefined}/>} reference={<>
      <section className="mt-10 max-w-3xl space-y-3">
        <h2 className="text-2xl font-serif">How the volume changes concentration</h2>
        <p>BAC water is short for bacteriostatic water. This bacteriostatic water calculator checks concentration arithmetic: total mass in mg divided by final liquid volume in mL gives mg/mL. The name does not establish which liquid a product requires.</p>
        <p>Worked arithmetic example: 10 mg in a final volume of 2 mL is 5 mg/mL. An entered amount of 0.4 mg corresponds to 0.08 mL, or 8 U-100 scale units. At a final volume of 4 mL, the concentration is 2.5 mg/mL and the same entered mass corresponds to 0.16 mL, or 16 U-100 scale units.</p>
        <p>These examples compare numbers; they do not recommend a volume, dose or preparation method. Read <Link href="/learn/what-you-cannot-know" className="underline">what a calculator cannot check</Link>.</p>
      </section>
      <p className="mt-4"><Link href="/methodology#checks" className="underline">Formulas and reproducible checks</Link> · <Link href="/learn/bac-water-concentration-table" className="underline">Compare concentration examples</Link></p>
      <section className="mt-9 max-w-3xl space-y-3">
        <h2 className="text-2xl font-serif">Does BAC water establish a shelf life?</h2>
        <p>No. This calculator does the math only. It cannot tell you how long a mixed vial stays good. Follow the storage and discard instructions that came with your product.</p>
        <p>The <Link href="/learn/bac-water-shelf-life" className="underline">BAC water storage guide</Link> explains the difference between an unopened bottle, an opened bottle and a mixed vial.</p>
      </section>

      <section className="mt-9 max-w-3xl" aria-labelledby="bac-water-faq-title">
        <h2 id="bac-water-faq-title" className="text-2xl font-serif">Common questions</h2>
        <dl className="mt-4 space-y-5">{BAC_WATER_FAQS.map(item => <div key={item.q}><dt className="font-medium">{item.q}</dt><dd className="mt-1 text-sm leading-relaxed text-muted-foreground"><p>{item.a}</p>{item.q === "How many mL of bacteriostatic water to mix with peptides?" && <p className="mt-2"><Link href="/tools/bac-water" className="underline">Run the BAC water calculator</Link>{" · "}<Link href="/peptide-calculator" className="underline">Peptide reconstitution calculator</Link>{" · "}<Link href="/tools/dose" className="underline">mg/mcg to mL calculator</Link></p>}</dd></div>)}</dl>
        <p className="mt-4 text-sm"><Link href="/learn/too-much-bac-water" className="underline">What if I add too much water?</Link> · <Link href="/learn/bac-water-for-peptides" className="underline">Does my product need BAC water?</Link></p>
        <p className="mt-4 text-sm leading-relaxed"><strong>Next step:</strong> Enter your label mass and the final volume from your instructions, then check concentration and mL / U-100 equivalents above. Related: <Link href="/" className="underline">Homepage calculator</Link>{" · "}<Link href="/peptide-calculator" className="underline">Peptide calculator</Link>{" · "}<Link href="/tools/dose" className="underline">Dose to syringe line</Link>{" · "}<Link href="/learn" className="underline">Guides &amp; comparisons</Link></p>
      </section>
      <section className="mt-9"><h2 className="text-2xl font-serif">Other small tools</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{[{ href: "/tools/syringe-units", title: "Units to mL", text: "Turn syringe units into mL, or mL into units." }, { href: "/tools/mg-to-mcg", title: "mg to mcg", text: "Switch between mg and mcg." }, { href: "/tools/dose", title: "Amount to volume", text: "Already know the mg/mL? Convert an entered mass to its volume equivalent." }].map(tool => <Link key={tool.href} href={tool.href} className="rounded-xl border border-border p-4 transition-colors hover:bg-muted"><h3 className="font-medium">{tool.title}</h3><p className="mt-2 text-sm text-muted-foreground">{tool.text}</p></Link>)}</div></section>
</>}>
      <MassProductGate><CalculationOutcome ready={canShowResult}/><div ref={panels} data-active-screen={screen} className="bac-screen-panels grid items-start gap-6 lg:grid-cols-2">
        <section data-screen="inputs" className="min-w-0 space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-7" aria-labelledby="volume-inputs-heading">
          <h2 id="volume-inputs-heading" className="text-xl font-semibold">Your numbers</h2>
          <div>
            <div className="flex items-center"><span aria-hidden="true" className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">1</span><label htmlFor="bac-vial-amount" className="block text-sm font-medium">Total amount in the vial</label></div>
            <div className="mt-2 flex gap-2">
              <Input id="bac-vial-amount" type="text" inputMode="decimal" maxLength={64} value={vial.vialText} onChange={e => vial.setVialText(e.target.value)} placeholder="Example: 10" className="min-w-0 flex-1" aria-describedby="bac-vial-help bac-input-error" aria-invalid={Boolean(decimalError(vial.vialText, "Total amount in the vial"))} />
              <UnitChoice value={vial.vialUnit} onChange={vial.setVialUnit} label="Vial amount unit" />
            </div>
            <p id="bac-vial-help" className="mt-2 text-sm text-muted-foreground">Look at the vial label. Type the number next to mg. If it says 10 mg, type 10.</p>
          </div>
          <div>
            <div className="flex items-center"><span aria-hidden="true" className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">2</span><label htmlFor="bac-measured-amount" className="block text-sm font-medium">Amount to measure</label></div>
            <div className="mt-2 flex gap-2">
              <Input id="bac-measured-amount" type="text" inputMode="decimal" maxLength={64} value={vial.amountText} onChange={e => vial.setAmountText(e.target.value)} placeholder="Example: 250" className="min-w-0 flex-1" aria-describedby="bac-measurement-help bac-input-error" aria-invalid={Boolean(decimalError(vial.amountText, "Amount to measure"))} />
              <UnitChoice value={vial.doseUnit} onChange={vial.setDoseUnit} label="Measurement amount unit" />
            </div>
            <p id="bac-measurement-help" className="mt-2 text-sm text-muted-foreground">Enter a mass for a research calculation, not a dose recommendation. Leave this blank to calculate concentration only.</p>
          </div>
          <div className="border-t border-border pt-5">
            <div className="flex items-center"><span aria-hidden="true" className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">3</span><label htmlFor="bac-final-volume" className="block text-sm font-medium">Final liquid volume (mL)</label></div>
            <Input id="bac-final-volume" type="text" inputMode="decimal" maxLength={64} value={volumeText} onChange={e => setVolume(e.target.value)} placeholder="Example: 2" className="mt-2" aria-describedby="bac-volume-help bac-input-error" aria-invalid={invalidVolume} />
            <p id="bac-volume-help" className="mt-2 text-sm text-muted-foreground">Enter the stated final liquid volume, not an assumed amount of water to add. Recheck any restored value; an earlier version may have suggested it. This calculator cannot select a diluent or preparation volume.</p>
          </div>
          <p id="bac-input-error" role={error ? "alert" : undefined} className="text-sm text-destructive">{error}</p>
          <Button type="button" variant="outline" onClick={clear}>Clear entered values</Button>
        </section>

        <section data-screen="result" className="section-dark min-w-0 rounded-2xl p-5 sm:p-7" aria-labelledby="volume-result-heading">
          <h2 id="volume-result-heading" className="text-xl font-semibold">Your result</h2>
          <p className="mt-2 text-sm text-muted-foreground">Based only on your entered mass and final volume. Research arithmetic, not dosing or preparation advice.</p>
          <div className="mt-5" role="status" aria-live="polite" aria-atomic="true" id="bac-result">
            {canShowResult ? <ol className="space-y-4">
              <li className="flex gap-3"><span className="mt-0.5 inline-grid h-7 w-7 shrink-0 place-items-center rounded-full bg-background text-sm font-semibold text-foreground">1</span><div><p className="text-sm text-muted-foreground">Entered final liquid volume</p><p className="mt-1 break-words text-3xl font-semibold">{display(volume)} mL</p></div></li>
              <li className="flex gap-3"><span className="mt-0.5 inline-grid h-7 w-7 shrink-0 place-items-center rounded-full bg-background text-sm font-semibold text-foreground">2</span><div><p className="text-sm text-muted-foreground">Each 1 mL of liquid then holds</p><p className="mt-1 break-words text-2xl font-semibold">{display(concentration)} mg/mL</p></div></li>
              {valid && <li className="flex gap-3"><span className="mt-0.5 inline-grid h-7 w-7 shrink-0 place-items-center rounded-full bg-background text-sm font-semibold text-foreground">3</span><div><p className="text-sm text-muted-foreground">Equivalent on a U-100 scale</p><p className="mt-1 break-words text-3xl font-semibold">{display(units)} U-100 scale units</p><p className="mt-1 break-words text-sm">That is {display(measurementMl)} mL for the entered {display(measurementMg)} mg. The total mass contains {dosesPerVial} whole equal portions, ignoring losses.</p></div></li>}
            </ol> : <p className="rounded-lg border border-border p-4 text-sm">{error || "Enter the total mass and final liquid volume. Add a measurement amount to see its volume equivalent."}</p>}
          </div>
          {canShowResult && <CopyButton className="mt-3" value={`${precise(vialMg)} mg ÷ ${precise(volume)} mL = ${precise(concentration)} mg/mL`} label="Copy the strength" />}
          {canShowResult && valid && <>
            <CopyButton className="mt-3" value={`${precise(vialMg)} mg in ${precise(volume)} mL final volume = ${precise(concentration)} mg/mL. Entered mass ${precise(measurementMg)} mg = ${precise(measurementMl)} mL = ${precise(units)} U-100 scale units. ${dosesPerVial} whole equal portions, ignoring losses. Research math only; not dosing or preparation advice. Not for human use.`} label="Copy calculation" />
            {measurementMl > 1 && <p className="mt-3 rounded-lg border border-border p-3 text-sm">{plainWarnings(["exceeds the capacity of the selected syringe"])[0]}</p>}
          </>}
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">U-100 means the syringe has 100 units in 1 mL. Scale units are a volume conversion, not product potency units or a preparation instruction. Numbers are rounded for display. This does not tell you how long a mixed vial lasts.</p>
          <div className="mt-5 flex flex-wrap gap-3"><Button asChild variant="brand"><Link href="/plan">Save or print this</Link></Button></div>
        </section>
      </div>

      <WorkspaceActions>
        <div className="bac-mobile-calculation-controls">
          {screen === "result" ? <Button variant="outline" size="lg" onClick={()=>switchScreen("inputs")}>Edit numbers</Button> : <Button variant="brand" size="lg" disabled={!canShowResult} onClick={()=>switchScreen("result")}>See my result</Button>}
          <p>{screen === "result" ? "Your numbers are saved here. Change them any time." : error ? "Fix the field marked above, then try again." : canShowResult ? "Ready. View the calculation." : "Enter the mass and final volume to continue."}</p>
        </div>
      </WorkspaceActions>
    </MassProductGate></CalculatorWorkspace>
  );
}
