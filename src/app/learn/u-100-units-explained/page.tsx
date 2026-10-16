import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { References } from "@/components/common/references";
import { Button } from "@/components/ui/button";

// Math-only explainer of the U-100 scale relationship (100 units = 1 mL).
// Every number below is an illustrative volume conversion. No compound,
// amount to use or device recommendation is stated.
const PATH = "/learn/u-100-units-explained";
const title = "Convert mL to Units on a U-100 Scale: Worked Table";
const description = "How to convert mL to U-100 units: multiply mL by 100. Worked table for 0.10, 0.25 and 0.50 mL, the reverse formula and three common unit mistakes.";
export const metadata = withSocialMetadata({ title, description, alternates: { canonical: PATH }, openGraph: { title, description, url: PATH, type: "article" } });
const references = [
  { title: "SI prefixes", source: "NIST", url: "https://www.nist.gov/pml/owm/metric-si-prefixes", note: "Milli and micro are distinct decimal prefixes." },
];
const EXAMPLES: [string, string][] = [["0.10 mL", "10 units"], ["0.25 mL", "25 units"], ["0.50 mL", "50 units"]];
const MISTAKES = [
  { heading: "Treating units as mg", body: "Units on a U-100 scale measure volume. They say nothing about mass until a concentration in mg/mL is known." },
  { heading: "Assuming every scale is U-100", body: "Read the markings on the actual device. U-40 scales and plain mL graduations also exist, and the 100-units-per-mL relationship does not apply to them." },
  { heading: "Skipping the concentration step", body: "The order is: concentration (mg/mL) = vial amount ÷ final volume; volume (mL) = entered amount ÷ concentration; U-100 reading = mL × 100. Each step depends on the one before it." },
];
export default function U100UnitsPage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Learning center", href: "/learn" }, { label: "mL to U-100 units", href: PATH }];
  return <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-16 pb-20">
    <WebPageJsonLd name={title} description={description} url={PATH} citations={references} breadcrumb={crumbs.map(c => ({ name: c.label, url: c.href }))}/><Breadcrumbs items={crumbs}/>
    <p className="eyebrow">Unit reference</p><h1 className="mt-2 text-4xl sm:text-5xl font-serif tracking-tight">How to convert mL to U-100 units, with the math shown.</h1>
    <p className="mt-5 text-lg leading-relaxed">U-100 is a scale marking: 100 units equals 1 mL, so 1 unit equals 0.01 mL. A volume of 0.25 mL reads as 25 units on a U-100 scale. For what the units themselves represent, and why they are not mass, read <Link className="underline" href="/learn/what-syringe-units-mean">what syringe units mean</Link>. It is not an amount to use, and it does not apply to devices marked on a different scale.</p>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">The formula</h2><p className="rounded-xl border bg-muted p-5 font-medium">U-100 reading (units) = volume (mL) × 100</p><p className="leading-relaxed">Going the other way, volume (mL) = units ÷ 100.</p></section>
    <section className="mt-9"><h2 className="text-2xl font-serif">Worked examples</h2><p className="mt-2 text-sm text-muted-foreground">Illustrative volumes only, not product instructions.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border" role="region" aria-label="mL to U-100 examples" tabIndex={0}>
        <table className="w-full text-sm responsive-comparison"><caption className="sr-only">Volumes in mL and their U-100 scale readings.</caption><thead><tr className="text-left"><th scope="col" className="p-4">Volume</th><th scope="col" className="p-4">U-100 reading</th></tr></thead><tbody>
          {EXAMPLES.map(([ml, units]) => <tr key={ml} className="border-t border-border"><th scope="row" className="p-4 text-left">{ml}</th><td data-label="U-100 reading" className="p-4">{units}</td></tr>)}
        </tbody></table>
      </div>
    </section>
    <section className="mt-9"><h2 className="text-2xl font-serif">Three common mistakes</h2><ol className="mt-4 list-decimal space-y-4 pl-5">{MISTAKES.map(m => <li key={m.heading}><strong>{m.heading}.</strong> {m.body}</li>)}</ol></section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">Related reading</h2><p>For whole-mL volumes, including 1, 2, 3 and 5 mL, see the <Link className="underline" href="/learn/ml-to-units-table">mL to units table</Link>. For the mass-to-concentration step, read <Link className="underline" href="/learn/mg-vs-mg-per-ml">mg vs mg/mL</Link>. The <Link className="underline" href="/learn/glossary">glossary</Link> define the other terms. A correct conversion does not verify a device or a product; see <Link className="underline" href="/learn/what-you-cannot-know">what no calculation can verify</Link>.</p></section>
    <aside className="mt-8 rounded-xl border p-4 text-sm"><h2 className="font-semibold">Scope</h2><p className="mt-2">BACwater.ai does math on numbers you enter. It does not recommend compounds, quantities or use.</p></aside>
    <References references={references}/><Button asChild variant="brand" className="mt-8"><Link href="/tools/syringe-units">Check a conversion</Link></Button>
  </article>;
}
