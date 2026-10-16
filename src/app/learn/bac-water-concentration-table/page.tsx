import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { References } from "@/components/common/references";
import { Button } from "@/components/ui/button";
import { SEARCH_SNIPPETS } from "@/lib/seo/search-appearance";
import { CONCENTRATION_COLUMNS, CONCENTRATION_EXAMPLES, CONCENTRATION_ROWS } from "@/lib/learn/b4-math";

// Static concentration grid. Cells come from exact fractions in b4-math.
// No inputs, no query-string values, and no analytics events.
const PATH = "/learn/bac-water-concentration-table";
const { title, description } = SEARCH_SNIPPETS[PATH];
const references = [
  { title: "Metric (SI) Prefixes", source: "NIST", url: "https://www.nist.gov/pml/owm/metric-si-prefixes", note: "Milli and micro are distinct decimal prefixes, so 1 mg = 1,000 mcg." },
  { title: "Bacteriostatic Water for Injection, USP", source: "Pfizer Medical", url: "https://www.pfizermedical.com/bacteriostatic-water", note: "Product labeling: for diluting or dissolving products according to that product manufacturer's instructions." },
];

export const metadata = withSocialMetadata({ title, description, alternates: { canonical: PATH }, openGraph: { title, description, url: PATH, type: "article" } });

export default function BacWaterConcentrationTablePage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Learning center", href: "/learn" }, { label: "Concentration table", href: PATH }];
  const [fivePerMl, twoPointFivePerMl] = CONCENTRATION_EXAMPLES.mcg;
  return <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-16 pb-20">
    <WebPageJsonLd name={title} description={description} url={PATH} citations={references} breadcrumb={crumbs.map(c => ({ name: c.label, url: c.href }))} />
    <Breadcrumbs items={crumbs} />
    <p className="eyebrow">Guide</p>
    <h1 className="mt-2 text-4xl sm:text-5xl font-serif tracking-tight">How much BAC water for a 5, 10, 20 or 30 mg vial? What each volume does to mg/mL.</h1>
    <p className="mt-5 text-lg leading-relaxed">There is no single right amount. The final liquid volume comes from the instructions for the exact product, not from the vial size and not from this site. What arithmetic can show is the concentration (the amount in each mL) that a given final volume produces. The table below does that for common vial amounts.</p>
    <p className="mt-3 text-sm text-muted-foreground">Illustrative arithmetic and notation only, not product instructions.</p>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">The one division</h2>
      <p className="rounded-xl border bg-muted p-5 font-medium">concentration (mg/mL) = total amount in the vial (mg) ÷ final liquid volume (mL)</p>
      <ul className="list-disc space-y-2 pl-5 leading-relaxed">
        <li><strong>Total amount (mg):</strong> the mass stated on the label, for example &ldquo;10 mg&rdquo;. It is an amount, not a concentration. See <Link className="underline" href="/learn/mg-vs-mg-per-ml">mg vs mg/mL</Link>.</li>
        <li><strong>Final liquid volume (mL):</strong> the volume of the finished solution. It isn&apos;t always the same as the volume of liquid added.</li>
        <li><strong>Concentration (mg/mL):</strong> how many mg are in each 1 mL of that solution.</li>
        <li><strong>mcg:</strong> microgram. 1 mg = 1,000 mcg (NIST SI prefixes). Put both numbers in the same unit before you divide.</li>
      </ul>
    </section>
    <section className="mt-9">
      <h2 className="text-2xl font-serif">Concentration table</h2>
      <p className="mt-2 leading-relaxed">Each cell is the vial amount ÷ the final volume. Values are exact, and a repeating decimal is shown as a fraction.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border" role="region" aria-label="Vial amount and final volume concentration grid" tabIndex={0}>
        <table className="w-full text-sm responsive-comparison">
          <caption className="sr-only">Concentration in mg/mL for 5, 10, 20, 30 and 50 mg in final volumes of 1 to 5 mL.</caption>
          <thead><tr className="text-left"><th scope="col" className="p-4">Vial amount</th>{CONCENTRATION_COLUMNS.map(column => <th key={column} scope="col" className="p-4">{column}</th>)}</tr></thead>
          <tbody>
            {CONCENTRATION_ROWS.map(row => <tr key={row.amount} className="border-t border-border"><th scope="row" className="p-4 text-left">{row.amount}</th>{row.cells.map((cell, index) => <td key={CONCENTRATION_COLUMNS[index]} data-label={CONCENTRATION_COLUMNS[index]} className="p-4">{cell}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      <p className="mt-3 leading-relaxed">These are math examples. They don&apos;t say how much liquid to add, how much a vial holds, or whether a volume suits a product. Each cell assumes the material is fully dissolved and spread evenly through the final liquid, with no spills or material left behind.</p>
      <p className="mt-3 leading-relaxed"><strong>Repeating decimals.</strong> 5 ÷ 3 never ends ({CONCENTRATION_EXAMPLES.repeating.replace(" mg/mL", "").replace("5/3 = ", "")}). Any rounded figure, such as 1.67 mg/mL, is an approximation, and small rounding differences grow in every step that follows. Where possible, keep the fraction or the full value and round once at the end.</p>
    </section>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">Same concentration, different vials</h2>
      <p className="leading-relaxed">The table shows that very different vials can end up with the same concentration:</p>
      <ul className="list-disc space-y-2 pl-5">{CONCENTRATION_EXAMPLES.same.map(line => <li key={line}>{line}</li>)}</ul>
      <p className="leading-relaxed">So a concentration alone doesn&apos;t tell you the vial size, and a vial size alone doesn&apos;t tell you the concentration. You need both numbers.</p>
    </section>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">More liquid doesn&apos;t change the total</h2>
      <p className="leading-relaxed">Adding more liquid lowers the mg in each mL, but the total in the vial stays the same (before any losses). 10 mg in 2 mL is {CONCENTRATION_EXAMPLES.dilution.twoMl}, and the same 10 mg in 4 mL is {CONCENTRATION_EXAMPLES.dilution.fourMl}. Both still hold {CONCENTRATION_EXAMPLES.dilution.total} in total. See <Link className="underline" href="/learn/too-much-bac-water">too much BAC water: what dilution math shows</Link>.</p>
    </section>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">To convert to mcg/mL</h2>
      <p className="leading-relaxed">Multiply mg/mL by 1,000. For example, {fivePerMl} and {twoPointFivePerMl}. Use the <Link className="underline" href="/tools/mg-to-mcg">mg and mcg converter</Link> to check.</p>
    </section>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">The next math step, if you already have an amount</h2>
      <p className="leading-relaxed">If an amount is already given, divide it by the concentration to get a volume, then multiply by 100 for a U-100 scale reading. This example is the one used on the site&apos;s <Link className="underline" href="/methodology#checks">formula page</Link>:</p>
      <ol className="list-decimal space-y-2 pl-5">{CONCENTRATION_EXAMPLES.chain.map(step => <li key={step}>{step}</li>)}</ol>
      <p className="leading-relaxed">These numbers are illustrative. None of them is a recommendation. For whole-mL conversions, see the <Link className="underline" href="/learn/ml-to-units-table">mL to units table</Link>.</p>
    </section>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">What a table can&apos;t tell you</h2>
      <p className="leading-relaxed">A correct division can&apos;t confirm what is in the vial, which liquid the product calls for, whether a volume fits the vial, or how long a solution stays usable. Bacteriostatic water labeling says it is for diluting or dissolving products according to the instructions of the product&apos;s manufacturer. Those instructions set the volume. See <Link className="underline" href="/learn/what-you-cannot-know">what no calculation can verify</Link> and <Link className="underline" href="/learn/how-to-read-a-peptide-vial">how to read a vial label</Link>.</p>
    </section>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">Related reading</h2>
      <p>The <Link className="underline" href="/learn/peptide-reconstitution-chart">peptide concentration chart</Link> has more worked rows and a printable worksheet. For a label percent such as 0.9% or 1.1%, see the <Link className="underline" href="/learn/bac-water-preservative-percent">preservative percent math</Link>. The <Link className="underline" href="/methodology#concentration">formula guide</Link> lists every formula and rounding limit.</p>
    </section>
    <aside className="mt-8 rounded-xl border p-4 text-sm"><h2 className="font-semibold">Scope</h2><p className="mt-2">Math only. BACwater.ai does math on numbers you enter. It does not recommend compounds, quantities, volumes or use.</p></aside>
    <References references={references} />
    <Button asChild variant="brand" className="mt-8"><Link href="/tools/bac-water">Check your numbers</Link></Button>
  </article>;
}
