"use client";
import { BAC_WATER_FAQS } from "./faqs";
import { CalculationOutcome } from "@/components/calculator/calculation-events";
import { MassProductGate } from "@/components/calculator/mass-product-selection";
import { useState, useRef } from "react";
import { CalculatorWorkspace, WorkspaceActions } from "@/components/calculator/calculator-workspace";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { SupplyChecklist } from "@/components/tools/supply-checklist";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/copy-button";
import { CarriedOverNotice } from "@/components/tools/carried-over-notice";
import { useVialContext, type MassUnit } from "@/lib/tools/vial-context";
import { usePersistentState } from "@/lib/use-persistent-state";
import { decimalError, positiveDecimal } from "@/lib/calc/number-text";
import { suggestBacWaterMl, mlText, unitsText } from "@/lib/calc/bac-water-suggestion";

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
  function switchScreen(next:"inputs"|"result") {
    setScreen(next);
    requestAnimationFrame(()=>{
      panels.current?.closest<HTMLElement>("[data-calculator-scroll]")?.scrollTo({top:0,behavior:"instant"});
      const heading=panels.current?.querySelector<HTMLElement>(`[data-screen="${next}"] h2`);
      if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
    });
  }
  const [savedMode, setMode] = usePersistentState<"known" | "example">("bacwater.tool.bacwater.mode.v2", "known");
  const [savedVolume, setVolume] = usePersistentState<string>("bacwater.tool.bacwater.volume.v2", "");
  const mode = savedMode === "example" ? "example" : "known";
  const volumeText = typeof savedVolume === "string" ? savedVolume : "";
  const vialAmount = Number(vial.vialInput);
  const measurementAmount = Number(vial.doseInput);
  const vialMg = vial.vialUnit === "mcg" ? vialAmount / 1000 : vialAmount;
  const measurementMg = vial.doseUnit === "mcg" ? measurementAmount / 1000 : measurementAmount;
  const amountsValid = [vialMg, measurementMg].every(n => Number.isFinite(n) && n > 0);
  const suggestion = amountsValid ? suggestBacWaterMl(vialMg, measurementMg * 1000) : null;
  const volume = mode === "example" ? (suggestion?.ml ?? 0) : positiveDecimal(volumeText) ?? 0;
  const concentration = Number.isFinite(vialMg) && vialMg > 0 && volume > 0 ? vialMg / volume : 0;
  const concentrationValid = [volume, concentration].every(n => Number.isFinite(n) && n > 0);
  const measurementMl = concentration > 0 ? measurementMg / concentration : 0;
  const units = measurementMl * 100;
  const valid = amountsValid && [volume, concentration, measurementMl, units].every(n => Number.isFinite(n) && n > 0);
  const dosesPerVial = valid ? Math.floor(vialMg / measurementMg + 1e-9) : 0;
  const invalidAmount = [vialAmount, measurementAmount].some(n => !Number.isFinite(n) || n < 0);
  const invalidVolume = mode === "known" && volumeText.trim() !== "" && (!Number.isFinite(volume) || volume <= 0);
  const outsideRange = vialMg > 0 && volume > 0 && (!concentrationValid || (measurementMg > 0 && !valid));
  const error = decimalError(vial.vialText, "Total amount in the vial") || decimalError(vial.amountText, "Amount for one time") || (mode === "known" ? decimalError(volumeText, "BAC water") : "") || (invalidAmount ? "Type numbers bigger than zero and check the units." : invalidVolume ? "BAC water must be greater than zero." : outsideRange ? "These numbers are too big or too small for this calculator. Check the amounts and units." : mode === "example" && !amountsValid ? "To get a suggestion, fill in the vial amount and the amount for one time." : "");
  const canShowResult = concentrationValid && !error;

  function clear() {
    vial.clear();
    setVolume("");
    setMode("known");
  }

  return (
    <CalculatorWorkspace title="BAC water calculator" description="Tell us what is in your vial and how much you use each time. We tell you how much BAC water to add and where to fill your syringe." help={<SupplyChecklist volumeMl={valid?volume:undefined} measurementMl={valid?measurementMl:undefined}/>} reference={<>
      <section className="mt-10 max-w-3xl space-y-3">
        <h2 className="text-2xl font-serif">How the volume changes concentration</h2>
        <p>BAC water is short for bacteriostatic water. It is the liquid you add to the powder in your vial. The powder amount never changes. The water only changes how strong each mL is, and so how far you fill the syringe.</p>
        <p>Example: a 10 mg vial with 2 mL of BAC water has 5 mg in every mL. A 0.4 mg dose is then 0.08 mL, which is the 8 line on an insulin syringe. With 4 mL of water instead, every mL has 2.5 mg, and the same dose is 0.16 mL, the 16 line.</p>
        <p>More water means more liquid per dose. Less water means less. Both hold the same dose. Pick an amount that fits in the vial and lands on an easy line. Read <Link href="/learn/what-you-cannot-know" className="underline">what a calculator cannot check</Link>.</p>
      </section>
      <section className="mt-9 max-w-3xl space-y-3">
        <h2 className="text-2xl font-serif">Does BAC water establish a shelf life?</h2>
        <p>No. This calculator does the math only. It cannot tell you how long a mixed vial stays good. Follow the storage and discard instructions that came with your product.</p>
        <p>The <Link href="/learn/bac-water-shelf-life" className="underline">BAC water storage guide</Link> explains the difference between an unopened bottle, an opened bottle and a mixed vial.</p>
      </section>

      <section className="mt-9 max-w-3xl" aria-labelledby="bac-water-faq-title">
        <h2 id="bac-water-faq-title" className="text-2xl font-serif">Common questions</h2>
        <dl className="mt-4 space-y-5">{BAC_WATER_FAQS.map(item => <div key={item.q}><dt className="font-medium">{item.q}</dt><dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.a}</dd></div>)}</dl>
        <p className="mt-4 text-sm"><Link href="/learn/too-much-bac-water" className="underline">What if I add too much water?</Link> · <Link href="/learn/bac-water-for-peptides" className="underline">Does my product need BAC water?</Link></p>
      </section>
      <section className="mt-9"><h2 className="text-2xl font-serif">Other small tools</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{[{ href: "/tools/syringe-units", title: "Units to mL", text: "Turn syringe units into mL, or mL into units." }, { href: "/tools/mg-to-mcg", title: "mg to mcg", text: "Switch between mg and mcg." }, { href: "/tools/dose", title: "Dose to syringe line", text: "Already know the mg per mL? Find the syringe line for your dose." }].map(tool => <Link key={tool.href} href={tool.href} className="rounded-xl border border-border p-4 transition-colors hover:bg-muted"><h3 className="font-medium">{tool.title}</h3><p className="mt-2 text-sm text-muted-foreground">{tool.text}</p></Link>)}</div></section>
</>}>
      <MassProductGate><CalculationOutcome ready={canShowResult}/><div ref={panels} data-active-screen={screen} className="bac-screen-panels grid items-start gap-6 lg:grid-cols-2">
        <section data-screen="inputs" className="min-w-0 space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-7" aria-labelledby="volume-inputs-heading">
          <h2 id="volume-inputs-heading" className="text-xl font-semibold">Your numbers</h2>
          <CarriedOverNotice visible={vial.carriedOver} onClear={clear} />
          <div>
            <div className="flex items-center"><span aria-hidden="true" className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">1</span><label htmlFor="bac-vial-amount" className="block text-sm font-medium">Total amount in the vial</label></div>
            <div className="mt-2 flex gap-2">
              <Input id="bac-vial-amount" type="text" inputMode="decimal" maxLength={64} value={vial.vialText} onChange={e => vial.setVialText(e.target.value)} placeholder="Example: 10" className="min-w-0 flex-1" aria-describedby="bac-vial-help bac-input-error" aria-invalid={Boolean(decimalError(vial.vialText, "Total amount in the vial"))} />
              <UnitChoice value={vial.vialUnit} onChange={vial.setVialUnit} label="Vial amount unit" />
            </div>
            <p id="bac-vial-help" className="mt-2 text-xs text-muted-foreground">Look at the vial label. Type the number next to mg. If it says 10 mg, type 10.</p>
          </div>
          <div>
            <div className="flex items-center"><span aria-hidden="true" className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">2</span><label htmlFor="bac-measured-amount" className="block text-sm font-medium">Amount for one time</label></div>
            <div className="mt-2 flex gap-2">
              <Input id="bac-measured-amount" type="text" inputMode="decimal" maxLength={64} value={vial.amountText} onChange={e => vial.setAmountText(e.target.value)} placeholder="Example: 250" className="min-w-0 flex-1" aria-describedby="bac-measurement-help bac-input-error" aria-invalid={Boolean(decimalError(vial.amountText, "Amount for one time"))} />
              <UnitChoice value={vial.doseUnit} onChange={vial.setDoseUnit} label="Measurement amount unit" />
            </div>
            <p id="bac-measurement-help" className="mt-2 text-xs text-muted-foreground">Your dose: how much you use one time, from your own instructions. It is not the vial total. Leave it blank if you only want the strength per mL.</p>
          </div>
          <div className="border-t border-border pt-5">
            <div className="flex items-center"><span aria-hidden="true" className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">3</span><p className="text-sm font-medium">BAC water</p></div>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="How to set the BAC water amount">
              <Button type="button" variant={mode === "known" ? "brand" : "outline"} aria-pressed={mode === "known"} onClick={() => setMode("known")}>I know how much water</Button>
              <Button type="button" variant={mode === "example" ? "brand" : "outline"} aria-pressed={mode === "example"} onClick={() => setMode("example")}>Suggest an amount for me</Button>
            </div>
            {mode === "known" ? <div className="mt-4"><label htmlFor="bac-final-volume" className="block text-sm font-medium">BAC water to add (mL)</label><Input id="bac-final-volume" type="text" inputMode="decimal" maxLength={64} value={volumeText} onChange={e => setVolume(e.target.value)} placeholder={suggestion ? `Example: ${mlText(suggestion.ml)}` : "Example: 2"} className="mt-2" aria-describedby="bac-volume-help bac-input-error" aria-invalid={invalidVolume} /><p id="bac-volume-help" className="mt-2 text-xs text-muted-foreground">Type the mL of BAC water from your instructions. If the vial already has liquid in it, type the total liquid after adding water.{suggestion ? ` Not sure? ${mlText(suggestion.ml)} mL would put your dose on the ${unitsText(suggestion.units)} line.` : ""}</p></div> : <div className="mt-4 rounded-lg bg-muted p-3 text-sm leading-relaxed">{suggestion ? <><p className="flex items-center gap-2 font-medium"><Sparkles size={16} aria-hidden="true"/>Suggested: {mlText(suggestion.ml)} mL of BAC water</p><p className="mt-1 text-muted-foreground">With {mlText(suggestion.ml)} mL, your dose lands on the {unitsText(suggestion.units)} line of an insulin syringe. That is an easy line to find. If your instructions give a different amount, use theirs.</p></> : <p>Fill in the vial amount and the amount for one time. Then we can suggest how much water to add.</p>}</div>}
          </div>
          <p id="bac-input-error" role={error ? "alert" : undefined} className="text-sm text-destructive">{error}</p>
          <Button type="button" variant="outline" onClick={clear}>Clear entered values</Button>
        </section>

        <section data-screen="result" className="section-dark min-w-0 rounded-2xl p-5 sm:p-7" aria-labelledby="volume-result-heading">
          <h2 id="volume-result-heading" className="text-xl font-semibold">{mode === "example" ? "Result with suggested water" : "Your result"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{mode === "example" ? "Using our suggested amount of water. Your instructions come first if they say otherwise." : "Based only on the numbers you typed."}</p>
          <div className="mt-5" role="status" aria-live="polite" aria-atomic="true" id="bac-result">
            {canShowResult ? <ol className="space-y-4">
              <li className="flex gap-3"><span className="mt-0.5 inline-grid h-7 w-7 shrink-0 place-items-center rounded-full bg-background text-sm font-semibold text-foreground">1</span><div><p className="text-sm text-muted-foreground">Add this much BAC water to the vial</p><p className="mt-1 break-words text-3xl font-semibold">{display(volume)} mL</p></div></li>
              <li className="flex gap-3"><span className="mt-0.5 inline-grid h-7 w-7 shrink-0 place-items-center rounded-full bg-background text-sm font-semibold text-foreground">2</span><div><p className="text-sm text-muted-foreground">Each 1 mL of liquid then holds</p><p className="mt-1 break-words text-2xl font-semibold">{display(concentration)} mg/mL</p></div></li>
              {valid && <li className="flex gap-3"><span className="mt-0.5 inline-grid h-7 w-7 shrink-0 place-items-center rounded-full bg-background text-sm font-semibold text-foreground">3</span><div><p className="text-sm text-muted-foreground">Each time, fill an insulin syringe to the</p><p className="mt-1 break-words text-3xl font-semibold">{display(units)} U-100 units line</p><p className="mt-1 break-words text-sm">That is {display(measurementMl)} mL for your {display(measurementMg)} mg dose. This vial gives you about {dosesPerVial} {dosesPerVial === 1 ? "dose" : "doses"}.</p></div></li>}
            </ol> : <p className="rounded-lg border border-border p-4 text-sm">{error || "Fill in the vial amount and the BAC water. Add the amount for one time to see where to fill your syringe."}</p>}
          </div>
          {canShowResult && <CopyButton className="mt-3" value={`${precise(vialMg)} mg ÷ ${precise(volume)} mL = ${precise(concentration)} mg/mL`} label="Copy concentration" />}
          {canShowResult && valid && <>
            <CopyButton className="mt-3" value={`Add ${precise(volume)} mL of BAC water to the ${precise(vialMg)} mg vial = ${precise(concentration)} mg/mL. Each ${precise(measurementMg)} mg dose = ${precise(measurementMl)} mL = ${precise(units)} U-100 units. About ${dosesPerVial} doses per vial. Math only; follow your own instructions.`} label="Copy all steps" />
            {measurementMg > vialMg && <p className="mt-3 rounded-lg border border-border p-3 text-sm">Your amount for one time is bigger than the whole vial. Check the numbers and the units (mg or mcg).</p>}
            {measurementMl > 1 && <p className="mt-3 rounded-lg border border-border p-3 text-sm">This is more than a 1 mL insulin syringe holds. Check your numbers, or use less water so each mL is stronger.</p>}
          </>}
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">U-100 means the syringe has 100 units in 1 mL. Check that your syringe says U-100 and look at its lines. Numbers are rounded for display. This does not tell you how long a mixed vial lasts.</p>
          <div className="mt-5 flex flex-wrap gap-3"><Button asChild variant="brand"><Link href="/plan">Save or print this</Link></Button></div>
        </section>
      </div>

      <WorkspaceActions>
        <div className="bac-mobile-calculation-controls">
          {screen === "result" ? <Button variant="outline" size="lg" onClick={()=>switchScreen("inputs")}>Edit numbers</Button> : <Button variant="brand" size="lg" disabled={!canShowResult} onClick={()=>switchScreen("result")}>See my result</Button>}
          <p>{screen === "result" ? "Your numbers are saved here. Change them any time." : error ? "Fix the field marked above, then try again." : canShowResult ? "Ready. Tap to see what to do." : "Fill in the vial amount and the BAC water to continue."}</p>
        </div>
      </WorkspaceActions>
    </MassProductGate></CalculatorWorkspace>
  );
}
