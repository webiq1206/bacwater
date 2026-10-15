import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { References } from "@/components/common/references";
import { Button } from "@/components/ui/button";

// Math-only explainer separating an amount (mg) from a concentration (mg/mL).
// Examples are illustrative divisions; no compound or amount to use is named.
const PATH = "/learn/mg-vs-mg-per-ml";
const title = "mg vs mg/mL: Amount Is Not Concentration";
const description = "A vial labeled 10 mg states an amount, not a concentration. Learn the difference and the one division that connects mg to mg/mL.";
export const metadata = withSocialMetadata({ title, description, alternates: { canonical: PATH }, openGraph: { title, description, url: PATH, type: "article" } });
const references = [
  { title: "SI prefixes", source: "NIST", url: "https://www.nist.gov/pml/owm/metric-si-prefixes", note: "1 mg = 1,000 mcg; milli and micro are distinct decimal prefixes." },
];
export default function MgVsMgPerMlPage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Learning center", href: "/learn" }, { label: "mg vs mg/mL", href: PATH }];
  return <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-16 pb-20">
    <WebPageJsonLd name={title} description={description} url={PATH} citations={references} breadcrumb={crumbs.map(c => ({ name: c.label, url: c.href }))}/><Breadcrumbs items={crumbs}/>
    <p className="eyebrow">Unit reference</p><h1 className="mt-2 text-4xl sm:text-5xl font-serif tracking-tight">mg vs mg/mL: why the number on the vial isn&apos;t a concentration.</h1>
    <p className="mt-5 text-lg leading-relaxed">A vial label like &ldquo;10 mg&rdquo; states how much material is in the vial. It does not state how much is in each mL. That depends on the final liquid volume.</p>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">The one division</h2><p className="rounded-xl border bg-muted p-5 font-medium">concentration (mg/mL) = amount (mg) ÷ final volume (mL)</p>
      <ul className="list-disc space-y-2 pl-5"><li>10 mg in a final 2 mL = 5 mg/mL</li><li>10 mg in a final 4 mL = 2.5 mg/mL</li></ul>
      <p className="leading-relaxed">Same amount, different concentration. These are illustrative divisions. Neither example says what final volume to choose; that comes from the exact product&apos;s instructions, not from this site.</p></section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">mcg vs mg</h2><p className="leading-relaxed">1 mg = 1,000 mcg. Convert both numbers to the same unit before dividing. Mixing the two is the usual cause of 1,000× errors: 0.5 mg is 500 mcg, not 5 mcg.</p></section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">From concentration to a volume reading</h2><p className="leading-relaxed">volume (mL) = entered amount ÷ concentration. On a U-100 scale, multiply mL by 100. For example, 1 mg ÷ 5 mg/mL = 0.2 mL, which reads as 20 units on a U-100 scale. The arithmetic checks numbers you already have; it does not choose any of them. See <Link className="underline" href="/learn/u-100-units-explained">what U-100 means</Link>.</p></section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">Related reading</h2><p>The <Link className="underline" href="/methodology">methodology page</Link> lists every formula and rounding limit, and <Link className="underline" href="/learn/what-you-cannot-know">what no calculation can verify</Link> covers what a correct result still cannot tell you.</p></section>
    <aside className="mt-8 rounded-xl border p-4 text-sm"><h2 className="font-semibold">Scope</h2><p className="mt-2">Math only. This is not guidance on compounds, quantities or use.</p></aside>
    <References references={references}/><Button asChild variant="brand" className="mt-8"><Link href="/tools/bac-water">Run your numbers</Link></Button>
  </article>;
}
