"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { usePersistentState } from "@/lib/use-persistent-state";
interface ConversionInput { direction: "units" | "ml"; text: string }
function display(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: 12, useGrouping: false }).format(value);
}
export default function SyringeUnitConverterPage() {
  const [stored, setStored] = usePersistentState<ConversionInput>("bacwater.tool.syringe.conversion.v2", { direction: "units", text: "" });
  const text = typeof stored?.text === "string" ? stored.text : "";
  const direction = stored?.direction === "ml" ? "ml" : "units";
  const value = Number(text);
  const hasInput = text.trim().length > 0;
  const valid = hasInput && Number.isFinite(value) && value >= 0 && Number.isFinite(value * 100);
  const units = direction === "units" ? text : valid ? display(value * 100) : "";
  const ml = direction === "ml" ? text : valid ? display(value / 100) : "";
  const invalid = hasInput && !valid;
  return <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-16 pb-24">
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Syringe units to mL", href: "/tools/syringe-units" }]} />
    <div className="eyebrow">Volume converter</div>
    <h1 className="mt-2 text-4xl sm:text-5xl font-serif">U-100 syringe units to mL</h1>
    <p className="mt-4 text-lg leading-relaxed">On a U-100 scale, 100 units equal 1 mL. Enter either value to convert it. This tool is only for a U-100 scale, not U-40 or another calibration.</p>
    <section className="mt-7 rounded-2xl border border-border bg-card p-5 sm:p-7" aria-label="U-100 volume conversion">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label htmlFor="u100-units" className="block text-sm font-medium">U-100 syringe units</label><Input id="u100-units" type="number" inputMode="decimal" min="0" step="any" value={units} onChange={e => setStored({ direction: "units", text: e.target.value })} aria-invalid={invalid && direction === "units"} aria-describedby="u100-help u100-error" placeholder="For example, 25" className="mt-2 h-12 text-lg" /></div>
        <div><label htmlFor="u100-ml" className="block text-sm font-medium">Milliliters (mL)</label><Input id="u100-ml" type="number" inputMode="decimal" min="0" step="any" value={ml} onChange={e => setStored({ direction: "ml", text: e.target.value })} aria-invalid={invalid && direction === "ml"} aria-describedby="u100-help u100-error" placeholder="For example, 0.25" className="mt-2 h-12 text-lg" /></div>
      </div>
      <p id="u100-help" className="mt-3 text-sm text-muted-foreground">mL = U-100 units ÷ 100. U-100 units = mL × 100.</p>
      <p id="u100-error" role={invalid ? "alert" : undefined} className="mt-2 text-sm text-destructive">{invalid ? "Enter a finite, non-negative value. No conversion is shown for an invalid input." : ""}</p>
      <div className="mt-5 rounded-xl bg-muted p-4" role="status" aria-live="polite" aria-atomic="true"><p className="break-words text-xl font-semibold">{valid ? `${display(direction === "units" ? value : value * 100)} U-100 units = ${display(direction === "ml" ? value : value / 100)} mL` : "Enter a value to see the conversion."}</p></div>
      <div className="mt-5 flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={() => setStored({ direction: "units", text: "" })}>Clear values</Button><Button asChild variant="brand"><Link href="/peptide-calculator">Open the full calculator</Link></Button></div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Display values use up to 12 significant digits. A volume conversion does not check syringe capacity, select a dose, or establish how a substance should be used.</p>
    </section>
    <section className="mt-10"><h2 className="text-2xl font-serif">U-100 conversion examples</h2><div className="mt-4 rounded-xl border border-border"><table className="w-full text-left text-sm"><caption className="sr-only">U-100 units and their equivalent liquid volumes</caption><thead><tr><th scope="col" className="p-3">U-100 units</th><th scope="col" className="p-3">Volume</th></tr></thead><tbody>{[5,10,25,30,50,100,200].map(n => <tr key={n} className="border-t border-border"><th scope="row" className="p-3 font-normal">{n}</th><td className="p-3">{n / 100} mL</td></tr>)}</tbody></table></div><p className="mt-3 text-sm text-muted-foreground">These are mathematical equivalents. For example, 200 U-100 units equal 2 mL, which exceeds the capacity of a 1 mL syringe.</p></section>
    <section className="mt-10 space-y-3"><h2 className="text-2xl font-serif">Scale, capacity and markings are different</h2><p>U-100 specifies the conversion ratio. The capacity, such as 0.3 mL or 1 mL, specifies how much liquid the device holds. A smaller U-100 syringe still uses 100 units per mL.</p><p>Do not infer the spacing between small marks from capacity alone. Check the actual device labeling and instructions. This converter does not decide which syringe or mark is appropriate.</p></section>
    <section className="mt-10 space-y-3"><h2 className="text-2xl font-serif">Units are not milligrams</h2><p>Milligrams and micrograms describe an amount of material. Syringe markings depend on a volume scale. Converting a material amount into mL also requires its concentration.</p><p>Use the <Link href="/tools/dose" className="underline">concentration and measurement tool</Link> when concentration is already known, or the <Link href="/tools/mg-to-mcg" className="underline">mg to mcg converter</Link> for mass units. Read the <Link href="/editorial-policy" className="underline">calculation methodology and limitations</Link>.</p></section>
  </div>;
}
