import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { References } from "@/components/common/references";
import { Button } from "@/components/ui/button";

// Search Console (July to September 2026) shows this URL receiving almost
// only storage questions: expiration, "in fridge", refrigerated, shelf life
// after opening, room temperature, freezing, unopened, "after 28 days". Each
// section below is one of those questions with a label- or CDC-sourced
// answer. No universal shelf life, peptide day count or refrigeration rule
// is asserted; the earlier per-peptide table stays removed.
const references = [
  { title: "Bacteriostatic Water for Injection, USP: product labeling", source: "Pfizer Medical", url: "https://www.pfizermedical.com/bacteriostatic-water", note: "Storage temperature for this specific product and product-specific dilution instructions." },
  { title: "Preventing Unsafe Injection Practices: multi-dose vials", source: "CDC", url: "https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html", note: "Opened-vial dating, manufacturer exceptions and contamination limitations." },
];
const description = "BAC water expiry, storage and the 28-day opened-vial rule, including manufacturer exceptions. Understand why mixed products need their own instructions.";
const PATH = "/learn/bac-water-shelf-life";

// The visible question sections and the FAQPage schema share these entries.
const FAQS = [
  { q: "How long does unopened BAC water last?", a: "Until the expiry date printed by the manufacturer, when stored as the label directs. Pfizer's Bacteriostatic Water for Injection label specifies storage at 20 to 25°C (68 to 77°F). The printed date is the limit; nothing on this site extends it." },
  { q: "How long does BAC water last after opening?", a: "CDC guidance for an opened multi-dose vial is to date it when first punctured and discard it within 28 days, unless the manufacturer specifies a different opened-vial period, and never beyond the printed expiry. Write the opening date on the vial." },
  { q: "Does BAC water need to be refrigerated?", a: "Do not assume it does. Pfizer's label specifies 20 to 25°C (68 to 77°F), which is controlled room temperature, not a refrigerator. Follow the exact label for the product you have. Once a substance is added, that product's storage instructions govern the mixture." },
  { q: "Can BAC water be stored at room temperature?", a: "For the Pfizer product, controlled room temperature is the labeled storage condition: 20 to 25°C (68 to 77°F). Keep the container closed and protected as the label directs, and check the container itself, because other manufacturers can state different conditions." },
  { q: "Can you freeze BAC water?", a: "The label specifies 20 to 25°C and gives no instruction for frozen storage, so freezing is outside the labeled range. A container that has been frozen should be treated as a deviation from the label: ask the dispensing pharmacist or manufacturer rather than assuming it is usable." },
  { q: "Does BAC water expire, and can you use it past 28 days?", a: "Yes. CDC guidance is to discard an opened multi-dose vial within 28 days unless the manufacturer states another opened-vial date, and never beyond the printed expiry. This site cannot assess an expired or long-opened container; questionable sterility is a reason to discard a vial even before its dated limit." },
  { q: "How long does a reconstituted peptide last?", a: "That depends on the exact product and formulation, not on the water. The water's expiry and the 28-day opened-vial guidance do not transfer to a mixture. Use the storage and discard instructions for the specific product, and record the mix date separately from any calculation." },
];

export const metadata: Metadata = withSocialMetadata({
  title: "How Long Does BAC Water Last? Opened and Unopened", description,
  alternates: { canonical: PATH },
  openGraph: { title: "How Long Does BAC Water Last? Opened and Unopened", description, url: PATH, type: "article" },
});

export default function ShelfLifePage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Learning Center", href: "/learn" }, { label: "Shelf life and storage", href: PATH }];
  return <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-14 pb-24">
    <WebPageJsonLd name="How long does BAC water last? Shelf life and storage" description={description} url={PATH} citations={references} breadcrumb={crumbs.map(c => ({ name: c.label, url: c.href }))} />
    <FaqJsonLd items={FAQS} />
    <Breadcrumbs items={crumbs} />
    <div className="eyebrow">Storage reference</div>
    <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">How long does BAC water last?</h1>
    <p className="mt-5 text-lg leading-relaxed">Unopened BAC water lasts until the expiry date printed by the manufacturer. Once a multi-dose vial is opened, CDC guidance is to date it and discard it within 28 days unless the manufacturer specifies another opened-vial period, and never beyond the printed expiry. A peptide mixed with that water follows its own product instructions, not the water&apos;s dates.</p>
    <p className="mt-3 text-xs text-muted-foreground">Sources checked September 29, 2026. General reference, not a medical review or product-specific instruction.</p>

    <section className="mt-9"><h2 className="text-2xl font-serif">Three different dates</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border" role="region" aria-label="Storage and expiry comparison" tabIndex={0}>
        <table className="w-full text-sm responsive-comparison"><caption className="sr-only">Different dates apply to unopened water, opened multi-dose water and a reconstituted product.</caption><thead><tr className="text-left"><th scope="col" className="p-4">Container</th><th scope="col" className="p-4">How long it lasts</th><th scope="col" className="p-4">Where the date comes from</th></tr></thead><tbody>
          <tr className="border-t border-border"><th scope="row" className="p-4 text-left">Unopened BAC water</th><td data-label="How long it lasts" className="p-4">Until the printed manufacturer expiry</td><td data-label="Where the date comes from" className="p-4">That water product&apos;s label</td></tr>
          <tr className="border-t border-border"><th scope="row" className="p-4 text-left">Opened multi-dose vial</th><td data-label="How long it lasts" className="p-4">28 days from first puncture (CDC), unless the manufacturer states otherwise; never past expiry</td><td data-label="Where the date comes from" className="p-4">CDC guidance and manufacturer instructions</td></tr>
          <tr className="border-t border-border"><th scope="row" className="p-4 text-left">Reconstituted product</th><td data-label="How long it lasts" className="p-4">Set by the exact product&apos;s instructions</td><td data-label="Where the date comes from" className="p-4">Product-specific instructions</td></tr>
        </tbody></table>
      </div>
    </section>

    {FAQS.map(item => <section key={item.q} className="mt-9 space-y-3"><h2 className="text-2xl font-serif">{item.q}</h2><p className="leading-relaxed">{item.a}</p></section>)}

    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">What the 28-day guidance does not mean</h2>
      <p className="leading-relaxed">CDC&apos;s opened multi-dose guidance does not certify that a mixed solution remains stable for 28 days. Preservative also does not provide complete protection against contamination. Questionable sterility is a reason to discard a vial, even before its dated limit.</p>
      <p className="leading-relaxed">A clear-looking solution, a calendar reminder or a correct concentration calculation is not a test of sterility or potency. For medication-specific questions, ask the dispensing pharmacist or prescriber.</p>
    </section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">What can the calculator tell you?</h2>
      <p className="leading-relaxed">It converts entered amounts and volumes. For example, 10 mg in a final volume of 2 mL is 5 mg/mL. Neither that arithmetic nor a compound name establishes an expiry date.</p>
      <p className="leading-relaxed">Saved calculations and printed labels keep the calculation separate from product-specific storage instructions. They do not generate a safe-use date. See <Link href="/learn/what-you-cannot-know" className="underline">what no calculation can verify</Link>, <Link href="/learn/how-to-store-reconstituted-peptides" className="underline">what a product&apos;s storage instructions must state</Link> and the <Link href="/tools/vial-labels" className="underline">vial-label tool</Link>.</p>
    </section>
    <aside className="mt-8 rounded-xl border p-4 text-sm"><h2 className="font-semibold">Correction note</h2><p className="mt-2">This page replaces the site&apos;s earlier blanket recommendation to refrigerate opened BAC water and its generic per-peptide day counts. Storage must follow the exact product label.</p></aside>
    <References references={references} />
    <section className="section-dark mt-10 rounded-2xl p-6"><h2 className="text-xl font-serif">Record the opening date, then check the math</h2><p className="mt-2 text-sm">Print a small label with your mix date and concentration, or check the numbers from your existing instructions. Keep the product label alongside either.</p><div className="mt-4 flex flex-wrap gap-3"><Button asChild variant="brand"><Link href="/tools/vial-labels">Print a dated vial label</Link></Button><Button asChild variant="outline"><Link href="/peptide-calculator">Open the calculator</Link></Button></div></section>
  </div>;
}
