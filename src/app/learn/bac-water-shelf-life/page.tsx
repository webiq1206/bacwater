import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { References } from "@/components/common/references";
import { Button } from "@/components/ui/button";
const references = [
  { title: "Bacteriostatic Water for Injection, USP: product labeling", source: "Pfizer Medical", url: "https://www.pfizermedical.com/bacteriostatic-water", note: "Storage temperature for this specific product and product-specific dilution instructions." },
  { title: "Preventing Unsafe Injection Practices: multi-dose vials", source: "CDC", url: "https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html", note: "Opened-vial dating, manufacturer exceptions and contamination limitations." },
];
const description = "BAC water storage depends on the product label. Learn how unopened expiry, opened-vial dating and reconstituted-product instructions differ.";
export const metadata: Metadata = withSocialMetadata({
  title: "BAC Water Shelf Life: Expiry, Opening and Storage", description,
  alternates: { canonical: "/learn/bac-water-shelf-life" },
  openGraph: { title: "BAC Water Shelf Life and Storage", description, url: "/learn/bac-water-shelf-life", type: "article" },
});
export default function ShelfLifePage() {
  return <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-14 pb-24">
    <WebPageJsonLd name="BAC Water Shelf Life and Storage" description={description} url="/learn/bac-water-shelf-life" citations={references} breadcrumb={[{ name: "Home", url: "/" }, { name: "Learning Center", url: "/learn" }, { name: "Shelf life and storage", url: "/learn/bac-water-shelf-life" }]} />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learning Center", href: "/learn" }, { label: "Shelf life and storage", href: "/learn/bac-water-shelf-life" }]} />
    <div className="eyebrow">Storage reference</div>
    <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">How long does BAC water last?</h1>
    <p className="mt-5 text-lg leading-relaxed">Use the product label for storage and expiry. For opened multi-dose vials, CDC guidance is 28 days unless the manufacturer specifies another opened-vial date, never beyond the original expiry. This is not a universal shelf life for a peptide mixed with that water.</p>
    <p className="mt-3 text-xs text-muted-foreground">Sources checked September 21, 2026. General reference, not a medical review or product-specific instruction.</p>
    <section className="mt-9"><h2 className="text-2xl font-serif">Three different dates</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border" role="region" aria-label="Storage and expiry comparison" tabIndex={0}>
        <table className="w-full text-sm"><caption className="sr-only">Different dates apply to unopened water, opened multi-dose water and a reconstituted product.</caption><thead><tr className="text-left"><th scope="col" className="p-4">Container</th><th scope="col" className="p-4">Date to check</th><th scope="col" className="p-4">Storage source</th></tr></thead><tbody>
          <tr className="border-t border-border"><th scope="row" className="p-4 text-left">Unopened BAC water</th><td className="p-4">Manufacturer expiry</td><td className="p-4">That water product's label</td></tr>
          <tr className="border-t border-border"><th scope="row" className="p-4 text-left">Opened multi-dose vial</th><td className="p-4">Opened-vial instructions and original expiry</td><td className="p-4">Manufacturer instructions</td></tr>
          <tr className="border-t border-border"><th scope="row" className="p-4 text-left">Reconstituted product</th><td className="p-4">Instructions for the exact formulation</td><td className="p-4">Product-specific instructions</td></tr>
        </tbody></table>
      </div>
    </section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">Does BAC water need refrigeration?</h2>
      <p className="leading-relaxed">Do not assume it does. Pfizer's Bacteriostatic Water for Injection labeling specifies 20 to 25°C (68 to 77°F). Follow the label for the exact product you have. Once a substance is added, its manufacturer's dilution and storage instructions govern; the water's instructions alone cannot answer that question.</p>
      <p className="leading-relaxed">This replaces the site's earlier blanket recommendation to refrigerate opened BAC water.</p>
    </section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">What the 28-day guidance does not mean</h2>
      <p className="leading-relaxed">CDC's opened multi-dose guidance does not certify that a mixed solution remains stable for 28 days. Preservative also does not provide complete protection against contamination. Questionable sterility is a reason to discard a vial, even before its dated limit.</p>
      <p className="leading-relaxed">A clear-looking solution, a calendar reminder or a correct concentration calculation is not a test of sterility or potency. For medication-specific questions, ask the dispensing pharmacist or prescriber.</p>
    </section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">What can the calculator tell you?</h2>
      <p className="leading-relaxed">It converts entered amounts and volumes. For example, 10 mg in a final volume of 2 mL is 5 mg/mL. Neither that arithmetic nor a compound name establishes an expiry date.</p>
      <p className="leading-relaxed">Saved calculations and printed labels keep the calculation separate from product-specific storage instructions. They do not generate a safe-use date. See <Link href="/learn/what-you-cannot-know" className="underline">what no calculation can verify</Link> and the <Link href="/tools/vial-labels" className="underline">vial-label tool</Link>.</p>
    </section>
    <References references={references} />
    <section className="section-dark mt-10 rounded-2xl p-6"><h2 className="text-xl font-serif">Check the math, not a shelf-life guess</h2><p className="mt-2 text-sm">Enter the numbers from your existing instructions. Keep the product label alongside your saved calculation.</p><Button asChild variant="brand" className="mt-4"><Link href="/peptide-calculator">Open the calculator</Link></Button></section>
  </div>;
}
