import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
const description = "How BACwater.ai calculates concentration and syringe units, handles sources and corrections, and separates arithmetic from medical advice.";
export const metadata = withSocialMetadata({ title: "Calculation Methodology and Editorial Policy", description, alternates: { canonical: "/editorial-policy" }, openGraph: { title: "Calculation Methodology and Editorial Policy", description, url: "/editorial-policy", type: "website" } });
export default function EditorialPolicyPage() {
  return <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-12 pb-24">
    <WebPageJsonLd name="Calculation methodology and editorial policy" description={description} url="/editorial-policy" />
    <Breadcrumbs items={[{label:"Home",href:"/"},{label:"Editorial policy",href:"/editorial-policy"}]} />
    <div className="eyebrow">Method and limitations</div><h1 className="mt-2 text-4xl font-serif">Calculation methodology and editorial policy</h1>
    <p className="mt-5 text-lg leading-relaxed">BACwater.ai is a free calculation and reference website. The calculator works from values you enter. Publisher attribution is not a claim that a clinician has reviewed an article or approved a result.</p>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">The arithmetic</h2>
      <p>Concentration in mg/mL equals the total amount in mg divided by the final liquid volume in mL. A measurement in mL equals the entered amount in mg divided by that concentration. One mg equals 1,000 mcg.</p>
      <p>On a U-100 scale, multiply mL by 100 to obtain syringe units. On a U-40 scale, multiply by 40. Syringe capacity and syringe calibration are different: a smaller U-100 syringe still uses the U-100 ratio.</p>
      <p>For an arithmetic example, 10 mg in a final 2 mL is 5 mg/mL. An entered 0.4 mg measurement corresponds to 0.08 mL, or 8 U-100 units. These numbers demonstrate a conversion. They are not a mixing or dosing recommendation.</p>
    </section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">Inputs, rounding and warnings</h2>
      <p>The result assumes the stated amount is present and fully dissolved in the stated final volume. The website cannot inspect the vial or verify its contents. Enter the correct mass unit and use the scale printed on the actual measuring device.</p>
      <p>Calculations retain numeric precision before display formatting. A displayed rounded syringe mark is an approximation, not permission to change an instruction. Warnings flag invalid inputs, capacity problems or measurements that may be difficult to read.</p>
      <p>Automated fixtures test arithmetic and application behavior. A passing software test does not establish sterility, product quality, chemical compatibility or clinical suitability.</p>
    </section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">What the tool does not decide</h2>
      <p>The calculator does not choose a dose, treatment frequency, diluent or route of administration. It does not calculate a safe storage period. Dates in a saved plan are recordkeeping, not proof that a product remains usable.</p>
      <p>Use instructions for the exact formulation and ask the dispensing pharmacist or prescriber about medication-specific questions. Read <Link href="/learn/what-you-cannot-know" className="underline">what no calculation can verify</Link> and our <Link href="/disclaimer" className="underline">full disclaimer</Link>.</p>
    </section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">Sources and corrections</h2>
      <p>Consequential factual claims should link to applicable primary sources and identify their limits. A manufacturer label for one product is not a storage rule for every mixture. Research discussion does not establish an approved use.</p>
      <p>A content timestamp records an edit. It is not a medical review date. Corrections, changed product documentation and changes to the calculation code trigger renewed review. We do not claim that every article has received a completed clinical review.</p>
      <p>Report a problem through <Link href="/contact" className="underline">support</Link>. Include the public page, units, expected result and actual result. Leave out personal health information, account tokens and private share links.</p>
    </section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">Research-supplier recommendations and paid links</h2><p>A separately labeled supplier section may contain paid referral links after the relationship and attribution links are verified. A financial relationship influences which supplier is featured. This is not an independent ranking or a claim that BACwater has tested a product. We disclose potential commissions beside those links.</p><p>Supplier links are kept separate from calculator results, personal inputs, and clinical questions. No supplier chooses the arithmetic or endorses the calculators. We do not publish unverified quality badges, health claims, prices, stock information, or copied customer reviews. Research-use products are not recommendations for human or animal use.</p></section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">Use the right tool</h2><p><Link href="/peptide-calculator" className="underline">Full concentration calculator</Link>, <Link href="/tools/syringe-units" className="underline">syringe units to mL</Link>, <Link href="/tools/mg-to-mcg" className="underline">mg to mcg</Link>, and <Link href="/tools/vial-labels" className="underline">vial labels</Link> are available without a purchase. Saved plans and public share links have separate <Link href="/privacy" className="underline">privacy considerations</Link>.</p></section>
  </div>;
}
