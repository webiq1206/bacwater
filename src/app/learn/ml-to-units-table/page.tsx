import { withSocialMetadata } from "@/lib/seo/social-metadata";
import { ShortAnswer } from "@/components/common/short-answer";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { References } from "@/components/common/references";
import { Button } from "@/components/ui/button";
import { SEARCH_SNIPPETS } from "@/lib/seo/search-appearance";
import { FDA_SCALE_NOTE, ML_CAPACITY, ML_FAQS, ML_TO_UNITS_ROWS, REVERSE_LINES } from "@/lib/learn/b4-math";

// Static unit reference. Rows come from exact fractions in b4-math.
// No inputs, no transmitted values, and no analytics events.
const PATH = "/learn/ml-to-units-table";
const { title, description } = SEARCH_SNIPPETS[PATH];
const references = [
  { title: "SI Units – Volume", source: "NIST", url: "https://www.nist.gov/pml/owm/si-units-volume", note: "1 cm³ = 1 mL, and 1,000 mL = 1 L." },
  { title: "Metric (SI) Prefixes", source: "NIST", url: "https://www.nist.gov/pml/owm/metric-si-prefixes", note: "Milli means one thousandth." },
  { title: "FDA alert on compounded injectable measurement-unit errors", source: "FDA", url: "https://www.fda.gov/drugs/human-drug-compounding/fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded", note: FDA_SCALE_NOTE },
];

export const metadata = withSocialMetadata({ title, description, alternates: { canonical: PATH }, openGraph: { title, description, url: PATH, type: "article" } });

function FaqAnswer({ text }: { text: string }) {
  const parts = text.split(/(mg vs mg\/mL|amount-to-volume tool|what syringe units mean)/);
  return <>{parts.map((part, index) => {
    if (part === "mg vs mg/mL") return <Link key={index} className="underline" href="/learn/mg-vs-mg-per-ml">mg vs mg/mL</Link>;
    if (part === "amount-to-volume tool") return <Link key={index} className="underline" href="/tools/dose">amount-to-volume tool</Link>;
    if (part === "what syringe units mean") return <Link key={index} className="underline" href="/learn/what-syringe-units-mean">what syringe units mean</Link>;
    return part;
  })}</>;
}

export default function MlToUnitsTablePage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Learning center", href: "/learn" }, { label: "mL to units table", href: PATH }];
  return <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-16 pb-20">
    <WebPageJsonLd name={title} description={description} url={PATH} citations={references} breadcrumb={crumbs.map(c => ({ name: c.label, url: c.href }))} />
    <FaqJsonLd items={ML_FAQS} />
    <Breadcrumbs items={crumbs} />
    <p className="eyebrow">Unit reference</p>
    <h1 className="mt-2 text-4xl sm:text-5xl font-serif tracking-tight">How many units is 1, 2, 3 or 5 mL? A U-100 table, with the math shown.</h1><ShortAnswer>{description}</ShortAnswer>
    <p className="mt-5 text-lg leading-relaxed">On a U-100 scale, 100 units equals 1 mL. So 1 mL reads as {ML_TO_UNITS_ROWS.find(row => row.volume === "1 mL")!.units}, 2 mL as {ML_TO_UNITS_ROWS.find(row => row.volume === "2 mL")!.units}, 3 mL as {ML_TO_UNITS_ROWS.find(row => row.volume === "3 mL")!.units} and 5 mL as {ML_TO_UNITS_ROWS.find(row => row.volume === "5 mL")!.units}. The rule is the same whatever the liquid is: BAC water, sterile water or anything else. U-100 measures volume, not what is dissolved in it. For readings under 1 mL, see <Link className="underline" href="/learn/u-100-units-explained">how to convert mL to U-100 units</Link>.</p>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">The formula</h2>
      <p className="rounded-xl border bg-muted p-5 font-medium">U-100 units = volume (mL) × 100</p>
      <p className="leading-relaxed">Going the other way: volume (mL) = U-100 units ÷ 100</p>
      <ul className="list-disc space-y-2 pl-5 leading-relaxed">
        <li><strong>mL (milliliter):</strong> one thousandth of a liter. NIST defines the milliliter as the same volume as one cubic centimeter (1 mL = 1 cm³, sometimes written &ldquo;cc&rdquo;).</li>
        <li><strong>U-100:</strong> a syringe scale on which 100 units marks 1 mL, so 1 unit is 0.01 mL.</li>
        <li><strong>Unit (on a U-100 scale):</strong> a volume marking. It is not a milligram, and it is not an international unit (IU) of a product.</li>
      </ul>
    </section>
    <section className="mt-9">
      <h2 className="text-2xl font-serif">Whole-mL table</h2>
      <p className="mt-2 text-sm text-muted-foreground">Illustrative volumes only, not product instructions.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border" role="region" aria-label="Whole milliliter to U-100 units" tabIndex={0}>
        <table className="w-full text-sm responsive-comparison">
          <caption className="sr-only">Volumes in mL, the ×100 calculation, the U-100 scale equivalent, and how that compares with a 1 mL U-100 syringe.</caption>
          <thead><tr className="text-left"><th scope="col" className="p-4">Volume</th><th scope="col" className="p-4">Calculation</th><th scope="col" className="p-4">U-100 scale equivalent</th><th scope="col" className="p-4">Compared with a 1 mL (100-unit) U-100 syringe</th></tr></thead>
          <tbody>
            {ML_TO_UNITS_ROWS.map(row => <tr key={row.volume} className="border-t border-border"><th scope="row" className="p-4 text-left">{row.volume}</th><td data-label="Calculation" className="p-4">{row.calculation}</td><td data-label="U-100 scale equivalent" className="p-4">{row.units}</td><td data-label="Compared with a 1 mL U-100 syringe" className="p-4">{row.capacity}</td></tr>)}
          </tbody>
        </table>
      </div>
      <p className="mt-3 leading-relaxed">Each row is exact. Multiplying by 100 moves the decimal point two places to the right, so nothing is rounded.</p>
    </section>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">Check it in reverse</h2>
      <p className="leading-relaxed">Divide by 100 to get back to mL:</p>
      <ul className="list-disc space-y-2 pl-5">{REVERSE_LINES.map(line => <li key={line}>{line}</li>)}</ul>
      <p className="leading-relaxed">If the reverse doesn&apos;t give you the volume you started with, one of the numbers or units is wrong.</p>
    </section>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">More than the syringe holds</h2>
      <p className="leading-relaxed">Any volume over 1 mL has more U-100 units than a 1 mL U-100 syringe can show. 2 mL works out to {ML_CAPACITY.twoMl}, but a 1 mL syringe stops at {ML_CAPACITY.oneMl.replace(" units", "")}. So for volumes like 2, 3 or 5 mL, the units figure is a scale equivalent, not a reading you will find on one barrel.</p>
      <p className="leading-relaxed">U-100 sets the ratio. The capacity (how much a syringe holds) and the spacing between marks are separate details. A 0.3 mL U-100 syringe holds up to {ML_CAPACITY.holdsPointThree} and a 0.5 mL one holds up to {ML_CAPACITY.holdsPointFive}, but neither number tells you the gap between marks. See <Link className="underline" href="/learn/insulin-syringe-sizes">syringe capacity, U-100 scale and tick spacing</Link>. A result that is bigger than the device has turned up a mismatch. It doesn&apos;t tell you how to split a volume or change a product&apos;s instructions.</p>
    </section>
    <section className="mt-9">
      <h2 className="text-2xl font-serif">Common questions</h2>
      <dl className="mt-4 space-y-5">{ML_FAQS.map(item => <div key={item.q}><dt className="font-medium">{item.q}</dt><dd className="mt-1 leading-relaxed"><FaqAnswer text={item.a} /></dd></div>)}</dl>
    </section>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">Related reading</h2>
      <p>For readings under 1 mL, see <Link className="underline" href="/learn/u-100-units-explained">mL to U-100 units: worked table</Link>. A printed percent does not change this conversion; see the <Link className="underline" href="/learn/bac-water-preservative-percent">preservative percent math</Link>. The <Link className="underline" href="/methodology#scales">formula guide</Link> lists every formula and rounding limit. A correct conversion still can&apos;t verify a device or a product; see <Link className="underline" href="/learn/what-you-cannot-know">what no calculation can verify</Link>.</p>
    </section>
    <aside className="mt-8 rounded-xl border p-4 text-sm"><h2 className="font-semibold">Scope</h2><p className="mt-2">BACwater.ai does math on numbers you enter. It does not recommend compounds, quantities, devices or use.</p></aside>
    <References references={references} />
    <Button asChild variant="brand" className="mt-8"><Link href="/tools/syringe-units">Check a conversion</Link></Button>
  </article>;
}
