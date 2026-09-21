import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
const description = "Learn what BACwater.ai calculates, how the arithmetic is checked, what saved links share, and what the tools cannot determine. Free to use; no products sold.";
export const metadata = { title: "About BACwater.ai: Calculation Method and Limits", description, alternates: { canonical: "/about" }, openGraph: { title: "About BACwater.ai", description, url: "/about", type: "website" } };
export default function AboutPage() {
  return <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
    <WebPageJsonLd name="About BACwater.ai" description={description} url="/about" breadcrumb={[{ name: "Home", url: "/" }, { name: "About", url: "/about" }]} />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />
    <div className="eyebrow">About the tools</div>
    <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">Check the numbers. Understand their limits.</h1>
    <p className="mt-5 text-lg leading-relaxed">BACwater.ai is a free concentration and measurement utility. Enter the amounts and volumes from instructions you already have. The tools show the arithmetic, explain units and let you keep a calculation for later. We do not sell products or recommend vendors.</p>
    <section className="mt-10 space-y-4 leading-relaxed"><h2 className="text-2xl font-serif">How the calculation works</h2>
      <p>Concentration is the total amount divided by the final liquid volume. A measurement volume is the entered amount divided by that concentration. On a U-100 scale, 100 units represent 1 mL. These relationships are built into code; an AI model does not calculate the results.</p>
      <p>For example, 10 mg in a final volume of 2 mL is 5 mg/mL. Measuring an entered 0.4 mg would correspond to 0.08 mL, or 8 U-100 units. These are illustrative inputs, not a dilution or dose recommendation.</p>
      <p>The code uses automated arithmetic and boundary tests. Display values may be rounded for readability, and small values may use scientific notation rather than appearing to be zero. The scale and graduation spacing of an actual syringe must be checked separately. A mathematical answer is not a guarantee of physical measurement precision.</p>
    </section>
    <section className="mt-10 space-y-4 leading-relaxed"><h2 className="text-2xl font-serif">Choose the tool for your question</h2>
      <p>The <Link href="/peptide-calculator" className="underline">concentration calculator</Link> brings the main conversions together. The <Link href="/plan" className="underline">plan builder</Link> guides entry and supports saved links, PDFs and printable labels.</p>
      <p>For one conversion, use the <Link href="/tools/syringe-units" className="underline">U-100 units and mL converter</Link>, <Link href="/tools/mg-to-mcg" className="underline">mg and mcg converter</Link>, or <Link href="/tools" className="underline">complete tool directory</Link>. Basic calculations do not require an account.</p>
    </section>
    <section className="mt-10 space-y-4 leading-relaxed"><h2 className="text-2xl font-serif">What a saved link shares</h2>
      <p>Anyone with a shared plan link can read its calculation. A shared link does not grant editing permission or access to private notes. Editing requires the owning account or the creation secret kept on the original device. Share only information you intend others to see.</p>
      <p>The optional assistant explains the numbers. It cannot certify their clinical suitability. See the <Link href="/privacy" className="underline">privacy notice</Link> for account storage and provider use.</p>
    </section>
    <section className="mt-10 space-y-4 leading-relaxed"><h2 className="text-2xl font-serif">What no calculation can establish</h2>
      <p>These tools do not select a compound, dose, treatment schedule, diluent or preparation method. They cannot verify a product's identity, purity, sterility, stability or safe-use period. Labels do not generate expiry dates. Follow the instructions for the exact product, and direct medication questions to the dispensing pharmacist or prescriber.</p>
      <p>Read the <Link href="/learn/what-you-cannot-know" className="underline">calculation limitations</Link> and <Link href="/editorial-policy" className="underline">editorial policy</Link>. A source citation or automated test is not a substitute for qualified medical review.</p>
    </section>
    <section className="mt-10 space-y-3"><h2 className="text-2xl font-serif">Report an issue</h2><p className="leading-relaxed">Use <Link href="/contact" className="underline">support</Link> to report a calculation or website problem. Include the page, expected behavior and non-sensitive example inputs. Never send passwords, recovery links or private medical information.</p></section>
    <div className="mt-8 flex flex-wrap gap-3"><Button asChild variant="brand"><Link href="/peptide-calculator">Open calculator</Link></Button><Button asChild variant="outline"><Link href="/learn">Read the guides</Link></Button></div>
  </div>;
}
