import Link from "next/link";
import { ArrowRight, Calculator, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { SectionReveals } from "@/components/common/section-reveals";

export const metadata = {
  title: "BACwater.ai: Free Calculators, Saved Plans and Vial Labels",
  description: "Check concentration, syringe units and unit conversions. Use the free calculators, save your entered values, and print labels. No product sales or dose recommendations.",
  alternates: { canonical: "/" },
};
const compounds = [["bpc-157","BPC-157"],["tb-500","TB-500"],["semaglutide","Semaglutide"],["tirzepatide","Tirzepatide"],["ipamorelin","Ipamorelin"],["ghk-cu","GHK-Cu"]];
const tools = [
  {href:"/tools/bac-water",title:"BAC water and concentration",text:"Enter the stated total amount and final volume. See concentration and the volume for a separately specified amount."},
  {href:"/tools/syringe-units",title:"U-100 units and mL",text:"Convert in either direction. The scale ratio does not establish the capacity or graduation spacing of your device."},
  {href:"/tools/mg-to-mcg",title:"Milligrams and micrograms",text:"Convert mass units without confusing them with volume. Small accepted decimals keep their value."},
];
export default function HomePage(){return <div>
  <WebPageJsonLd name="BAC water calculator" description="Free tools for concentration, mass conversion and U-100 volume arithmetic using numbers supplied by the user." url="/" />
  <SectionReveals />
  <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-9 sm:pt-20 pb-10 sm:pb-16 text-center">
    <p className="eyebrow">Concentration and measurement</p>
    <h1 className="mt-3 text-3xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-balance">BAC water calculator</h1>
    <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">Convert your label values into concentration, mL and syringe units. See the calculation, then save or print it.</p>
    <div className="mt-6 flex flex-wrap justify-center gap-3"><Button asChild size="xl" variant="brand"><Link href="/peptide-calculator">Calculate now <ArrowRight className="h-4 w-4" /></Link></Button><Button asChild size="xl" variant="outline"><Link href="/plan">Guide me step by step</Link></Button></div>
    <p className="mt-4 text-sm text-muted-foreground">Free calculations. No account or purchase required.</p>
    <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed">Use amounts and volume from existing product instructions. This website does not choose a dose, diluent, treatment or safe storage period.</p>
  </section>
  <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12" aria-labelledby="quick-tools">
    <h2 id="quick-tools" className="text-2xl sm:text-3xl font-serif">Choose the calculation you need</h2>
    <div className="mt-5 grid gap-4 md:grid-cols-3">{tools.map(tool=><Link data-reveal key={tool.href} href={tool.href} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted"><Calculator aria-hidden="true" className="h-5 w-5"/><h3 className="mt-3 text-lg font-semibold">{tool.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.text}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-medium">Open calculator <ArrowRight aria-hidden="true" className="h-4 w-4"/></span></Link>)}</div>
    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm"><Link className="underline" href="/tools/dose">Known concentration</Link><Link className="underline" href="/tools/reverse-bac">Reverse volume calculation</Link><Link className="underline" href="/tools/supplies">Portion and supply counts</Link><Link className="underline" href="/tools">All calculators</Link></div>
  </section>
  <section className="section-muted mt-7" data-reveal><div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-2">
    <div><p className="eyebrow">Know what you are entering</p><h2 className="mt-3 text-2xl sm:text-3xl font-serif">A vial amount is not a concentration.</h2><p className="mt-4 leading-relaxed">A label that states 10 mg describes an amount. In a final volume of 2 mL, the concentration would be 5 mg/mL. That arithmetic example does not tell you to add 2 mL to a particular product.</p><p className="mt-3 leading-relaxed">BAC water is a pharmaceutical diluent containing a preservative. Formulation and intended use depend on the exact label. Preservative does not prove a prepared mixture is sterile or stable.</p><p className="mt-4 text-sm"><Link href="/learn/what-is-bac-water" className="underline">Ingredients and intended purpose</Link> · <Link href="/learn/how-to-read-a-peptide-vial" className="underline">Read a vial label</Link></p><p className="mt-3 text-xs text-muted-foreground">Product context: <a href="https://www.pfizermedical.com/bacteriostatic-water" className="underline">Pfizer product labeling</a>. Checked September 22, 2026.</p></div>
    <div className="rounded-2xl border border-border p-5 sm:p-7"><h3 className="text-lg font-semibold">Three checks before calculating</h3><ol className="mt-4 list-decimal space-y-4 pl-5 text-sm leading-relaxed"><li>Copy each number with its unit. mg and mcg describe mass; mL describes volume.</li><li>Use the final volume from your instructions. Vial strength alone does not determine a suitable dilution.</li><li>Check the actual device scale. U-100 means 100 units per mL; it is not a universal conversion for every syringe.</li></ol><Link href="/methodology" className="mt-5 inline-flex min-h-11 items-center underline">See formulas and repeatable checks</Link></div>
  </div></section>
  <section className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-2">
    <div className="rounded-2xl border p-6" data-reveal><FileText aria-hidden="true" className="h-5 w-5"/><h2 className="mt-3 text-2xl font-serif">Keep the calculation.</h2><p className="mt-3 text-sm leading-relaxed">Save your entered values, download a PDF, or print vial labels. Anyone receiving a shared link can read the calculation, but not your private notes. An account is optional for calculating.</p><div className="mt-4 flex flex-wrap gap-4"><Link href="/plan" className="underline">Build a saved plan</Link><Link href="/tools/vial-labels" className="underline">Printable labels</Link><Link href="/plans" className="underline">My plans</Link></div></div>
    <div className="rounded-2xl border p-6" data-reveal><BookOpen aria-hidden="true" className="h-5 w-5"/><h2 className="mt-3 text-2xl font-serif">Check the limits.</h2><p className="mt-3 text-sm leading-relaxed">A calculation cannot confirm contents, compatibility or shelf life. The learning center separates these questions from arithmetic.</p><div className="mt-4 space-y-3 text-sm"><p><Link href="/learn/bac-water-shelf-life" className="underline">Storage and expiry</Link></p><p><Link href="/learn/what-you-cannot-know" className="underline">What no calculation can verify</Link></p><p><Link href="/faq" className="underline">Common questions</Link> · <Link href="/learn" className="underline">All guides</Link></p></div></div>
  </section>
  <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6"><h2 className="text-2xl font-serif">Compound references</h2><p className="mt-3 text-sm text-muted-foreground">These pages provide identity and evidence context, not a recommendation to use a compound.</p><div className="mt-4 flex flex-wrap gap-3">{compounds.map(([slug,label])=><Link key={slug} href={`/peptides/${slug}`} className="inline-flex min-h-11 items-center rounded-lg border px-4 text-sm hover:bg-muted">{label}</Link>)}</div><p className="mt-5 text-sm"><Link href="/peptides" className="underline">All compounds</Link> · <Link href="/peptides/compare" className="underline">Compare label context</Link> · <Link href="/learn/vs/sterile-water" className="underline">BAC water vs sterile water</Link> · <Link href="/learn/vs/saline" className="underline">BAC water vs saline</Link></p></section>
</div>;}
