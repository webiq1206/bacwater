import { withSocialMetadata } from "@/lib/seo/social-metadata";
import { ShortAnswer } from "@/components/common/short-answer";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { References } from "@/components/common/references";
import { Button } from "@/components/ui/button";
import { SEARCH_SNIPPETS } from "@/lib/seo/search-appearance";
import {
  CONTAINER_TOTALS,
  ONE_PERCENT_LINE,
  OVERFILL_MISTAKE,
  PERCENT_DERIVATION,
  PERCENT_FAQS,
  PERCENT_REVERSE,
  PERCENT_ROWS,
  PERCENT_SLIPS,
  SECOND_TOTAL_CHECK,
  VOLUME_MASS_HEADERS,
  VOLUME_MASS_ROWS,
} from "@/lib/learn/b4-math";

// Static percent conversion. Every displayed value comes from exact fractions
// in b4-math. No inputs, no query-string values, and no analytics events.
const PATH = "/learn/bac-water-preservative-percent";
const { title, description } = SEARCH_SNIPPETS[PATH];
const references = [
  { title: "Bacteriostatic Water for Injection, USP", source: "Pfizer Medical", url: "https://www.pfizermedical.com/bacteriostatic-water", note: "Product labeling: 0.9% (9 mg/mL) or 1.1% (11 mg/mL) benzyl alcohol, and the 30 mL and 20 mL-fill presentations." },
  { title: "General Notices and Requirements", source: "USP–NF", url: "https://www.uspnf.com/sites/default/files/usp_pdf/EN/USPNF/generalNoticesandRequirementsFinal.pdf", note: "Percent w/v means grams of solute in 100 mL of solution, plus the meaning of an unqualified percent." },
  { title: "Metric (SI) Prefixes", source: "NIST", url: "https://www.nist.gov/pml/owm/metric-si-prefixes", note: "Milli and micro are decimal prefixes, so 1 g = 1,000 mg and 1 mg = 1,000 mcg." },
];

export const metadata = withSocialMetadata({ title, description, alternates: { canonical: PATH }, openGraph: { title, description, url: PATH, type: "article" } });

function FaqAnswer({ text }: { text: string }) {
  const parts = text.split(/(BAC water vs benzyl alcohol|mL to units table|BAC water calculator)/);
  return <>{parts.map((part, index) => {
    if (part === "BAC water vs benzyl alcohol") return <Link key={index} className="underline" href="/learn/vs/benzyl-alcohol">BAC water vs benzyl alcohol</Link>;
    if (part === "mL to units table") return <Link key={index} className="underline" href="/learn/ml-to-units-table">mL to units table</Link>;
    if (part === "BAC water calculator") return <Link key={index} className="underline" href="/tools/bac-water">BAC water calculator</Link>;
    return part;
  })}</>;
}

export default function BacWaterPreservativePercentPage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Learning center", href: "/learn" }, { label: "Preservative percent math", href: PATH }];
  const labeled = PERCENT_ROWS.filter((row) => row.labeled);
  const [pointNine, onePointOne] = labeled;
  const [atPointNine, atOnePointOne] = VOLUME_MASS_HEADERS;
  return <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-16 pb-20">
    <WebPageJsonLd name={title} description={description} url={PATH} citations={references} breadcrumb={crumbs.map(c => ({ name: c.label, url: c.href }))} />
    <FaqJsonLd items={PERCENT_FAQS} />
    <Breadcrumbs items={crumbs} />
    <p className="eyebrow">Guide</p>
    <h1 className="mt-2 text-4xl sm:text-5xl font-serif tracking-tight">BAC water preservative percent: what 0.9% and 1.1% mean in mg/mL, with the math shown.</h1><ShortAnswer>{description}</ShortAnswer>
    <p className="mt-5 text-lg leading-relaxed">Bacteriostatic water labels state the preservative, benzyl alcohol, as a percent. One manufacturer&apos;s labeling lists <strong>{pointNine.percent} ({pointNine.mgPerMl})</strong> or <strong>{onePointOne.percent} ({onePointOne.mgPerMl})</strong>. The shortcut is: <strong>mg/mL = percent × 10</strong>. This page shows where the ×10 comes from, how to turn a label percent into a total per container, and what the percent does not tell you.</p>
    <p className="mt-3 text-sm text-muted-foreground">Illustrative arithmetic and notation only, not product instructions.</p>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">Where the ×10 comes from</h2>
      <p className="leading-relaxed">A weight-in-volume percent (w/v) is the number of grams of solute in 100 mL of solution (USP definition). So:</p>
      <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
        {PERCENT_DERIVATION.map(step => <li key={step.result}>{step.lead} <strong>{step.result}</strong>{step.note ? ` ${step.note}` : ""}</li>)}
      </ol>
      <p className="leading-relaxed">{ONE_PERCENT_LINE} So:</p>
      <p className="rounded-xl border bg-muted p-5 font-medium">concentration (mg/mL) = percent (w/v) × 10</p>
      <p className="leading-relaxed">Going the other way: <strong>percent (w/v) = concentration (mg/mL) ÷ 10</strong></p>
      <ul className="list-disc space-y-2 pl-5 leading-relaxed">
        <li><strong>Percent w/v:</strong> grams of an ingredient in 100 mL of the finished solution.</li>
        <li><strong>mg/mL:</strong> milligrams in each 1 mL of that solution.</li>
        <li><strong>Preservative:</strong> the added ingredient named on the label. In the cited BAC water labeling it is benzyl alcohol. See <Link className="underline" href="/learn/what-is-bac-water">what BAC water is</Link>.</li>
      </ul>
    </section>
    <section className="mt-9">
      <h2 className="text-2xl font-serif">Percent to mg/mL table</h2>
      <p className="mt-2 leading-relaxed">Each row is the percent × 10 for mg/mL, then × 1,000 for mcg/mL. Values are exact.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border" role="region" aria-label="Label percent to milligrams per milliliter" tabIndex={0}>
        <table className="w-full text-sm responsive-comparison">
          <caption className="sr-only">Weight-in-volume percents converted to grams per 100 mL, mg/mL, mcg/mL and grams per liter.</caption>
          <thead><tr className="text-left"><th scope="col" className="p-4">Label percent (w/v)</th><th scope="col" className="p-4">Grams per 100 mL</th><th scope="col" className="p-4">mg/mL</th><th scope="col" className="p-4">mcg/mL</th><th scope="col" className="p-4">Grams per liter</th></tr></thead>
          <tbody>
            {PERCENT_ROWS.map(row => <tr key={row.percent} className="border-t border-border">
              <th scope="row" className="p-4 text-left">{row.labeled ? <strong>{row.percent}</strong> : row.percent}</th>
              <td data-label="Grams per 100 mL" className="p-4">{row.gramsPer100Ml}</td>
              <td data-label="mg/mL" className="p-4">{row.labeled ? <strong>{row.mgPerMl}</strong> : row.mgPerMl}</td>
              <td data-label="mcg/mL" className="p-4">{row.mcgPerMl}</td>
              <td data-label="Grams per liter" className="p-4">{row.gramsPerLiter}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <p className="mt-3 leading-relaxed">The bold rows match the two strengths printed on the cited labeling. The other rows are there to show the pattern. They are not product strengths. To check a mg-to-mcg step, use the <Link className="underline" href="/tools/mg-to-mcg">mg and mcg converter</Link>.</p>
    </section>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">Check it in reverse</h2>
      <p className="leading-relaxed">Divide mg/mL by 10 to get back to percent:</p>
      <ul className="list-disc space-y-2 pl-5">{PERCENT_REVERSE.map(line => <li key={line}>{line}</li>)}</ul>
      <p className="leading-relaxed">If the reverse doesn&apos;t give you the percent on the label, a decimal point has moved. The two most common slips are {PERCENT_SLIPS}.</p>
    </section>
    <section className="mt-9">
      <h2 className="text-2xl font-serif">Total in a container</h2>
      <p className="mt-2 leading-relaxed">A percent is a concentration, not a total. To get the total, multiply by the volume of liquid:</p>
      <p className="mt-3 rounded-xl border bg-muted p-5 font-medium">total (mg) = concentration (mg/mL) × volume (mL)</p>
      <p className="mt-3 leading-relaxed">The cited labeling lists two presentations. Here is the arithmetic for each:</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border" role="region" aria-label="Total preservative in each labeled presentation" tabIndex={0}>
        <table className="w-full text-sm responsive-comparison">
          <caption className="sr-only">Fill volume, the multiplication, and the total milligrams for the two cited presentations.</caption>
          <thead><tr className="text-left"><th scope="col" className="p-4">Presentation (as listed on the label)</th><th scope="col" className="p-4">Liquid volume</th><th scope="col" className="p-4">Calculation</th><th scope="col" className="p-4">Total benzyl alcohol</th></tr></thead>
          <tbody>
            {CONTAINER_TOTALS.map(row => <tr key={row.presentation} className="border-t border-border">
              <th scope="row" className="p-4 text-left">{row.presentation}</th>
              <td data-label="Liquid volume" className="p-4">{row.volume}</td>
              <td data-label="Calculation" className="p-4">{row.calculation}</td>
              <td data-label="Total benzyl alcohol" className="p-4">{row.total}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <p className="mt-3 leading-relaxed">Use the <strong>fill volume</strong>, not the vial size. The second presentation is a 30 mL vial holding 20 mL of liquid. {OVERFILL_MISTAKE} would be wrong because the vial isn&apos;t full.</p>
      <p className="mt-3 leading-relaxed">Checking it a second way: {SECOND_TOTAL_CHECK}. Same answer.</p>
    </section>
    <section className="mt-9">
      <h2 className="text-2xl font-serif">Same concentration, any volume you measure</h2>
      <p className="mt-2 leading-relaxed">Measuring out part of the liquid doesn&apos;t change its concentration. It only changes the total in that part. Every mL of a {pointNine.mgPerMl} liquid still holds {pointNine.mgPerMl.replace(" mg/mL", " mg")}.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border" role="region" aria-label="Mass in a measured volume at each labeled concentration" tabIndex={0}>
        <table className="w-full text-sm responsive-comparison">
          <caption className="sr-only">Milligrams in 0.5, 1, 2, 3 and 5 mL at 9 mg/mL and at 11 mg/mL.</caption>
          <thead><tr className="text-left"><th scope="col" className="p-4">Volume of label liquid</th><th scope="col" className="p-4">{atPointNine}</th><th scope="col" className="p-4">{atOnePointOne}</th></tr></thead>
          <tbody>
            {VOLUME_MASS_ROWS.map(row => <tr key={row.volume} className="border-t border-border">
              <th scope="row" className="p-4 text-left">{row.volume}</th>
              <td data-label={atPointNine} className="p-4">{row.atPointNine}</td>
              <td data-label={atOnePointOne} className="p-4">{row.atOnePointOne}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <p className="mt-3 leading-relaxed">These are arithmetic examples. They are not amounts to measure or use.</p>
    </section>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">Same percent, different substance</h2>
      <p className="leading-relaxed">A percent tells you strength, not identity. 0.9% sodium chloride is also {pointNine.mgPerMl} by the same w/v arithmetic, but {pointNine.mgPerMl} of salt and {pointNine.mgPerMl} of benzyl alcohol are different liquids. Matching numbers don&apos;t make two products interchangeable. See <Link className="underline" href="/learn/vs/sodium-chloride">BAC water vs sodium chloride</Link>.</p>
    </section>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">When the ×10 rule does not apply</h2>
      <p className="leading-relaxed">The ×10 rule is for <strong>weight in volume</strong> (w/v) only.</p>
      <ul className="list-disc space-y-2 pl-5 leading-relaxed">
        <li>If a label says <strong>v/v</strong> (mL of ingredient per 100 mL), the percent is a volume ratio. Turning it into mg needs the ingredient&apos;s density, so ×10 doesn&apos;t apply.</li>
        <li>If a label says <strong>w/w</strong> (grams per 100 g), the percent is a mass ratio. ×10 doesn&apos;t apply to that either.</li>
        <li>Under USP conventions, an unqualified percent means w/v for a solid dissolved in a liquid, and v/v for a liquid mixed into a liquid. Benzyl alcohol is a liquid, so rely on a label that prints mg/mL next to the percent (as the cited labeling does) rather than assuming.</li>
      </ul>
      <p className="leading-relaxed">The ×10 rule converts a printed w/v percent. It is not a way to make, mix or adjust a solution. A correct percentage calculation doesn&apos;t approve preparing a vehicle. See <Link className="underline" href="/learn/vs/benzyl-alcohol">BAC water vs benzyl alcohol</Link>.</p>
    </section>
    <section className="mt-9">
      <h2 className="text-2xl font-serif">Common questions</h2>
      <dl className="mt-4 space-y-5">{PERCENT_FAQS.map(item => <div key={item.q}><dt className="font-medium">{item.q}</dt><dd className="mt-1 leading-relaxed"><FaqAnswer text={item.a} /></dd></div>)}</dl>
    </section>
    <section className="mt-9 space-y-3">
      <h2 className="text-2xl font-serif">Related reading</h2>
      <p>The <Link className="underline" href="/learn/bac-water-concentration-table">BAC water concentration table</Link> applies the same division to vial contents. The <Link className="underline" href="/learn/ml-to-units-table">mL to units table</Link> converts whole-mL volumes to U-100 units. For amount vs concentration, read <Link className="underline" href="/learn/mg-vs-mg-per-ml">mg vs mg/mL</Link>. The <Link className="underline" href="/methodology#concentration">formula guide</Link> lists every formula and rounding limit. A correct conversion still can&apos;t confirm what is in a container or whether it is suitable. See <Link className="underline" href="/learn/what-you-cannot-know">what no calculation can verify</Link>.</p>
    </section>
    <aside className="mt-8 rounded-xl border p-4 text-sm"><h2 className="font-semibold">Scope</h2><p className="mt-2">Math only. BACwater.ai does math on numbers you enter. It does not recommend compounds, quantities, preservatives, formulations or use.</p></aside>
    <References references={references} />
    <Button asChild variant="brand" className="mt-8"><Link href="/tools/bac-water">Check your numbers</Link></Button>
  </article>;
}
