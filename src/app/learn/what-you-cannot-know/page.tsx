import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { References } from "@/components/common/references";
import { Button } from "@/components/ui/button";
const title = "What a Peptide Calculator Cannot Verify About Your Vial";
const description = "A calculation checks relationships between entered numbers. It cannot verify identity, amount, sterility, compatibility, device accuracy or a product's shelf life.";
export const metadata = withSocialMetadata({ title, description, alternates: { canonical: "/learn/what-you-cannot-know" }, openGraph: { title, description, url: "/learn/what-you-cannot-know", type: "article" } });
const references = [
  { title: "Bacteriostatic Water for Injection: labeling", source: "Pfizer", url: "https://labeling.pfizer.com/ShowLabeling.aspx?id=4666", note: "Compatibility, preparation and storage require the applicable product instructions." },
  { title: "Preventing Unsafe Injection Practices", source: "CDC", url: "https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html", note: "Opened-container dates and preservative do not eliminate contamination risk." },
  { title: "SI prefixes", source: "NIST", url: "https://www.nist.gov/pml/owm/metric-si-prefixes", note: "Milli and micro are distinct decimal prefixes." },
];
const sections = [
  { id: "whats-in-your-vial", heading: "The contents are not an input the calculator can verify", body: "Entering 10 mg tells the software to use 10 mg in its arithmetic. It does not prove that the vial contains that amount, the stated substance or an uncontaminated material. A product name, label image or supplier link cannot substitute for applicable product documentation and appropriate testing." },
  { id: "research-grade", heading: "Research wording does not establish suitability", body: "A research-use label describes a stated use. It does not establish that a material is appropriate for human or animal use, that it meets a particular pharmaceutical specification, or that a preparation method is suitable. Check the exact product identity and the evidence supporting any claimed specification." },
  { id: "ten-times-mistake", heading: "Mass, concentration and volume are different quantities", body: "One mg equals 1,000 mcg. A vial amount in mg is different from a concentration in mg/mL, and neither is a syringe-volume marking. Copy units as carefully as numbers. For example, 10 mg in a final 2 mL is 5 mg/mL. That relationship does not prescribe either input." },
  { id: "between-two-marks", heading: "A displayed result does not certify a readable measurement", body: "U-100 describes a scale relationship of 100 units per mL. Capacity and graduation spacing depend on the actual device; do not assume every barrel has the same tick spacing. Displayed values may be rounded. If a result does not match a usable graduation, check the device and product instructions with the responsible professional. Do not change a diluent, final volume or prescribed amount just to make a displayed number convenient." },
  { id: "human-data", heading: "A study is evidence about its own setting", body: "A study of a particular substance, formulation or population does not validate a purchased vial or every similarly named product. Animal findings do not establish a safe human amount. The compound references identify selected research and its limits; they are not complete clinical evidence reviews or instructions for use." },
];
export default function LimitsPage() {
  return <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-16 pb-20">
    <WebPageJsonLd name={title} description={description} url="/learn/what-you-cannot-know" citations={references}/><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learning center", href: "/learn" }, { label: "Calculation limits", href: "/learn/what-you-cannot-know" }]}/>
    <p className="eyebrow">Calculation limits</p><h1 className="mt-2 text-4xl sm:text-5xl font-serif tracking-tight">What you cannot know about your vial from a calculation.</h1>
    <p className="mt-5 text-lg leading-relaxed">The tools check relationships between the numbers you enter. They cannot inspect your vial, validate its label or decide whether its contents are suitable. Correct arithmetic is one check, not product verification.</p>
    {sections.map(section=><section key={section.id} id={section.id} className="mt-9 scroll-mt-24 space-y-3"><h2 className="text-2xl font-serif">{section.heading}</h2><p className="leading-relaxed">{section.body}</p></section>)}
    <section className="mt-7 grid gap-4 sm:grid-cols-2" aria-label="Calculation scope"><div className="rounded-xl border bg-muted p-5"><h2 className="text-xl font-serif">Can calculate</h2><ul className="mt-3 list-disc space-y-2 pl-5"><li>Concentration from entered mass and volume</li><li>Conversions between matching units</li><li>Amounts, volumes and inventory from stated inputs</li></ul></div><div className="rounded-xl border p-5"><h2 className="text-xl font-serif">Cannot verify</h2><ul className="mt-3 list-disc space-y-2 pl-5"><li>Vial identity, purity or sterility</li><li>Compatibility or suitability</li><li>Storage stability or a safe discard date</li></ul></div></section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">Keep storage instructions with the record</h2><p>Neither a concentration nor a compound name establishes sterility or stability. An opened water container and the product prepared with it have separate instructions. See the <Link className="underline" href="/learn/bac-water-shelf-life">storage distinctions</Link> and keep the original label alongside any saved calculation.</p><p>For the relationships the software can check, read the <Link className="underline" href="/methodology">formulas, rounding limits and repeatable examples</Link>. Report an unexpected result through <Link className="underline" href="/contact">support</Link> with the units and steps, without private medical information.</p></section>
    <References references={references}/><Button asChild variant="brand" className="mt-8"><Link href="/peptide-calculator">Check a calculation</Link></Button>
  </article>;
}
