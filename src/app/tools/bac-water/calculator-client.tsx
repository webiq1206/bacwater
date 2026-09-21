"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CopyButton } from "@/components/common/copy-button";
import { CarriedOverNotice } from "@/components/tools/carried-over-notice";
import { useVialContext, type MassUnit } from "@/lib/tools/vial-context";
import { usePersistentState } from "@/lib/use-persistent-state";
import { recommendBacWaterMl } from "@/lib/calc";

function display(value: number): string {
  if (value > 0 && (value < 0.000001 || value >= 1000000000)) return value.toExponential(6);
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: 12, useGrouping: false }).format(value);
}

function UnitChoice({ value, onChange, label }: { value: MassUnit; onChange: (unit: MassUnit) => void; label: string }) {
  return <div className="flex shrink-0 gap-1" role="group" aria-label={label}>{(["mg", "mcg"] as const).map(unit => <Button key={unit} type="button" variant={value === unit ? "brand" : "outline"} aria-pressed={value === unit} onClick={() => onChange(unit)} className="min-h-11 px-3">{unit}</Button>)}</div>;
}

export default function BacWaterCalculatorPage() {
  const vial = useVialContext();
  const [savedMode, setMode] = usePersistentState<"known" | "example">("bacwater.tool.bacwater.mode.v2", "known");
  const [savedVolume, setVolume] = usePersistentState<string>("bacwater.tool.bacwater.volume.v2", "");
  const mode = savedMode === "example" ? "example" : "known";
  const volumeText = typeof savedVolume === "string" ? savedVolume : "";
  const vialAmount = Number(vial.vialInput);
  const measurementAmount = Number(vial.doseInput);
  const vialMg = vial.vialUnit === "mcg" ? vialAmount / 1000 : vialAmount;
  const measurementMg = vial.doseUnit === "mcg" ? measurementAmount / 1000 : measurementAmount;
  const amountsValid = [vialMg, measurementMg].every(n => Number.isFinite(n) && n > 0);
  const exampleVolume = amountsValid ? recommendBacWaterMl(vialMg, measurementMg * 1000) : 0;
  const volume = mode === "example" ? exampleVolume : Number(volumeText);
  const concentration = amountsValid && volume > 0 ? vialMg / volume : 0;
  const measurementMl = concentration > 0 ? measurementMg / concentration : 0;
  const units = measurementMl * 100;
  const valid = amountsValid && [volume, concentration, measurementMl, units].every(n => Number.isFinite(n) && n > 0);
  const invalidAmount = [vialAmount, measurementAmount].some(n => !Number.isFinite(n) || n < 0);
  const invalidVolume = mode === "known" && volumeText.trim() !== "" && (!Number.isFinite(volume) || volume <= 0);
  const outsideRange = amountsValid && volume > 0 && !valid;
  const error = invalidAmount ? "Enter positive, finite amounts and confirm their units." : invalidVolume ? "The final liquid volume must be greater than zero." : outsideRange ? "These values exceed the supported numeric range. Check the entered amounts and units." : "";

  function clear() {
    vial.clear();
    setVolume("");
    setMode("known");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-10 sm:pt-14 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "BAC water calculator", href: "/tools/bac-water" }]} />
      <div className="max-w-3xl">
        <div className="eyebrow">Concentration and volume</div>
        <h1 className="mt-3 text-4xl sm:text-5xl font-serif">BAC water volume calculator</h1>
        <p className="mt-4 text-lg leading-relaxed">Vial strength alone cannot tell you how much BAC water to add. Enter the final liquid volume from your product instructions or an existing solution to check concentration and measurement units.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A calculation does not choose a compatible diluent, dose, treatment or safe storage period. Use the instructions for the exact product. No purchase or account is required.</p>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
        <section className="min-w-0 space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-7" aria-labelledby="volume-inputs-heading">
          <h2 id="volume-inputs-heading" className="text-xl font-semibold">Your label values</h2>
          <CarriedOverNotice visible={vial.carriedOver} onClear={clear} />
          <div>
            <label htmlFor="bac-vial-amount" className="block text-sm font-medium">Total amount in the vial</label>
            <div className="mt-2 flex gap-2">
              <Input id="bac-vial-amount" type="number" inputMode="decimal" min="0" step="any" value={vial.vialInput || ""} onChange={e => vial.setVialInput(e.target.value === "" ? 0 : Number(e.target.value))} placeholder="Amount from the label" className="min-w-0 flex-1" aria-describedby="bac-input-error" aria-invalid={vialAmount < 0 || !Number.isFinite(vialAmount)} />
              <UnitChoice value={vial.vialUnit} onChange={vial.setVialUnit} label="Vial amount unit" />
            </div>
          </div>
          <div>
            <label htmlFor="bac-measured-amount" className="block text-sm font-medium">Amount to measure</label>
            <div className="mt-2 flex gap-2">
              <Input id="bac-measured-amount" type="number" inputMode="decimal" min="0" step="any" value={vial.doseInput || ""} onChange={e => vial.setDoseInput(e.target.value === "" ? 0 : Number(e.target.value))} placeholder="Amount from your instructions" className="min-w-0 flex-1" aria-describedby="bac-measurement-help bac-input-error" aria-invalid={measurementAmount < 0 || !Number.isFinite(measurementAmount)} />
              <UnitChoice value={vial.doseUnit} onChange={vial.setDoseUnit} label="Measurement amount unit" />
            </div>
            <p id="bac-measurement-help" className="mt-2 text-xs text-muted-foreground">This is an input you supply, not an amount recommended by the website.</p>
          </div>
          <div className="border-t border-border pt-5">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Volume calculation mode">
              <Button type="button" variant={mode === "known" ? "brand" : "outline"} aria-pressed={mode === "known"} onClick={() => setMode("known")}>Use a known volume</Button>
              <Button type="button" variant={mode === "example" ? "brand" : "outline"} aria-pressed={mode === "example"} onClick={() => setMode("example")}>Show a math example</Button>
            </div>
            {mode === "known" ? <div className="mt-4"><label htmlFor="bac-final-volume" className="block text-sm font-medium">Final liquid volume in mL</label><Input id="bac-final-volume" type="number" inputMode="decimal" min="0" step="any" value={volumeText} onChange={e => setVolume(e.target.value)} placeholder="Volume from your instructions" className="mt-2" aria-describedby="bac-volume-help bac-input-error" aria-invalid={invalidVolume} /><p id="bac-volume-help" className="mt-2 text-xs text-muted-foreground">Use the final solution volume. The tool cannot verify dissolution, contents or vial capacity.</p></div> : <p className="mt-4 rounded-lg bg-muted p-3 text-sm leading-relaxed">This optional example picks a volume from 1 to 3 mL in 0.5 mL steps, aiming near 10 U-100 units for the amount you entered. Rounding and those limits can change the resulting units. It is not an instruction to use that volume.</p>}
          </div>
          <p id="bac-input-error" role={error ? "alert" : undefined} className="text-sm text-destructive">{error}</p>
          <Button type="button" variant="outline" onClick={clear}>Clear entered values</Button>
        </section>

        <section className="section-dark min-w-0 rounded-2xl p-5 sm:p-7" aria-labelledby="volume-result-heading">
          <h2 id="volume-result-heading" className="text-xl font-semibold">{mode === "example" ? "Illustrative result" : "Calculated result"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{mode === "example" ? "Example inputs are not product instructions." : "Based only on the values you entered."}</p>
          <div className="mt-5" role="status" aria-live="polite" aria-atomic="true" id="bac-result">
            {valid ? <dl className="space-y-5">
              <div><dt className="text-sm text-muted-foreground">Final liquid volume</dt><dd className="mt-1 break-words text-2xl font-semibold">{display(volume)} mL</dd></div>
              <div><dt className="text-sm text-muted-foreground">Concentration</dt><dd className="mt-1 break-words text-3xl font-semibold">{display(concentration)} mg/mL</dd></div>
              <div><dt className="text-sm text-muted-foreground">Entered measurement</dt><dd className="mt-1 break-words text-2xl font-semibold">{display(measurementMl)} mL</dd><dd className="mt-1 break-words text-sm">{display(units)} U-100 units</dd></div>
            </dl> : <p className="rounded-lg border border-border p-4 text-sm">Enter both amounts and {mode === "known" ? "the final liquid volume" : "check their units"} to see a calculation.</p>}
          </div>
          {valid && <>
            <CopyButton className="mt-3" value={`${display(vialMg)} mg in ${display(volume)} mL = ${display(concentration)} mg/mL. Entered ${display(measurementMg)} mg = ${display(measurementMl)} mL = ${display(units)} U-100 units. Calculation only, not preparation or dosing instructions.`} label="Copy calculation" />
            {measurementMg > vialMg && <p className="mt-3 rounded-lg border border-border p-3 text-sm">The entered measurement exceeds the total amount in the vial. Check the amounts and units before using this result.</p>}
            {measurementMl > 1 && <p className="mt-3 rounded-lg border border-border p-3 text-sm">This volume exceeds a 1 mL syringe's capacity. A conversion is not an instruction to use a different device or preparation.</p>}
          </>}
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">U-100 means 100 units per mL. Confirm the scale, capacity and graduation spacing on the actual device. Display values are rounded; very small or large values use scientific notation. No shelf life or safe-use date is calculated.</p>
          <div className="mt-5 flex flex-wrap gap-3"><Button asChild variant="brand"><Link href="/plan">Build a saved plan</Link></Button><Button asChild variant="outline"><Link href="/editorial-policy">See the methodology</Link></Button></div>
        </section>
      </div>

      <section className="mt-10 max-w-3xl space-y-3">
        <h2 className="text-2xl font-serif">How the volume changes concentration</h2>
        <p>Concentration in mg/mL equals the total amount in mg divided by the final liquid volume in mL. The volume for an entered measurement equals that measurement in mg divided by the concentration.</p>
        <p>For a mathematical example, 10 mg in a final 2 mL is 5 mg/mL. An entered 0.4 mg measurement corresponds to 0.08 mL, or 8 U-100 units. In a final 4 mL instead, the concentration would be 2.5 mg/mL and that same amount would correspond to 0.16 mL.</p>
        <p>These examples demonstrate arithmetic, not product preparation. Changing liquid volume may be incompatible with the product instructions or vial capacity. Read <Link href="/learn/what-you-cannot-know" className="underline">what a calculator cannot verify</Link>.</p>
      </section>
      <section className="mt-9 max-w-3xl space-y-3">
        <h2 className="text-2xl font-serif">Does BAC water establish a shelf life?</h2>
        <p>This calculator cannot establish sterility or stability. Do not treat a preservative, a clear-looking solution or a correct calculation as proof that a mixture remains usable. Follow the exact product's storage and discard instructions.</p>
        <p>The <Link href="/learn/bac-water-shelf-life" className="underline">BAC water storage reference</Link> separates unopened expiry, opened-vial guidance and reconstituted-product instructions. They are different questions.</p>
      </section>
      <section className="mt-9"><h2 className="text-2xl font-serif">Related calculations</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{[{ href: "/tools/syringe-units", title: "U-100 units and mL", text: "Convert volume units without assuming syringe markings." }, { href: "/tools/mg-to-mcg", title: "mg and mcg", text: "Check milligram and microgram conversions." }, { href: "/tools/dose", title: "Known concentration", text: "Check the amount in a stated liquid volume." }].map(tool => <Link key={tool.href} href={tool.href} className="rounded-xl border border-border p-4 transition-colors hover:bg-muted"><h3 className="font-medium">{tool.title}</h3><p className="mt-2 text-sm text-muted-foreground">{tool.text}</p></Link>)}</div></section>
    </div>
  );
}
