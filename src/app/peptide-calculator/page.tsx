import { productDisplayName } from "@/lib/partners/supplier-catalog";
import { withSocialMetadata } from "@/lib/seo/social-metadata";
import { CalculatorWorkspace } from "@/components/calculator/calculator-workspace";
import { safeJson } from "@/lib/seo/safe-json";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PlanForm } from "@/components/plan/plan-form";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { SoftwareAppJsonLd } from "@/components/common/software-app-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { AnswerBox } from "@/components/common/answer-box";
import { Callout } from "@/components/common/callout";
import { SITE_URL } from "@/lib/seo/schema";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const TITLE = "Peptide Calculator: Reconstitution, BAC Water & Syringe Units";
const DESCRIPTION =
  "Free peptide calculator for concentration, mL and U-100 units. Enter your label values and final liquid volume. Save a plan or print a vial label.";

export const metadata: Metadata = withSocialMetadata({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/peptide-calculator" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/peptide-calculator",
    type: "website",
    siteName: "BACwater.ai",
  },
});

// A curated set of high-search compounds for the ItemList / quick links.
const POPULAR = [
  { slug: "tirzepatide", label: "Tirzepatide" },
  { slug: "retatrutide", label: "Retatrutide" },
  { slug: "semaglutide", label: "Semaglutide" },
  { slug: "bpc-157", label: "BPC-157" },
  { slug: "tb-500", label: "TB-500" },
  { slug: "ipamorelin", label: "Ipamorelin" },
];

const FAQS = [
  {
    q: "What is a peptide calculator?",
    a: "It turns three numbers into clear steps. You give it the amount on your vial, your dose, and the BAC water you add (or let it suggest the water). It tells you how strong each mL is, which line to fill the syringe to, and how many doses are in the vial. It does not choose your dose.",
  },
  {
    q: "How do you calculate peptide reconstitution?",
    a: "Vial amount divided by BAC water gives the strength in mg per mL. Your dose divided by that strength gives the mL to draw. mL times 100 gives the line on a U-100 insulin syringe. Example: 5 mg in 2 mL is 2.5 mg/mL, so a 250 mcg dose is 0.1 mL, the 10 line.",
  },
  {
    q: "How much bacteriostatic water should I add to a peptide vial?",
    a: "Use the amount in your product instructions if they give one. If they do not, the calculator suggests an amount, usually 1 to 3 mL, that makes your dose land on an easy syringe line. Any amount works for the math. More water just means a longer draw for the same dose.",
  },
  {
    q: "How many syringe units is my measurement?",
    a: "On a U-100 insulin syringe, 100 units is 1 mL. So 0.1 mL is the 10 line and 0.05 mL is the 5 line. The calculator shows your line from your vial amount, your dose and your BAC water. Check the lines on your real syringe.",
  },
  {
    q: "Does this calculator tell me how much peptide to take?",
    a: "No. Your dose comes from your own instructions. The calculator only turns that dose into a syringe line. It never recommends an amount, how often, or whether a product is safe for anyone.",
  },
];

export default function PeptideCalculatorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 sm:pt-10 pb-12">
      <WebPageJsonLd
        name={TITLE}
        description={DESCRIPTION}
        url="/peptide-calculator"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Peptide Calculator", url: "/peptide-calculator" },
        ]}
      />
      <SoftwareAppJsonLd
        name="Peptide Calculator"
        description="Free concentration and measurement calculator using your stated vial amount, final volume and amount to measure. Includes printable labels and optional saved plans."
        url="/peptide-calculator"
      />
      <FaqJsonLd items={FAQS} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJson({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Per-compound peptide calculators",
            itemListElement: POPULAR.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${productDisplayName(p.slug,p.label)} reconstitution calculator`,
              url: `${SITE_URL}/peptides/${p.slug}`,
            })),
          }),
        }}
      />

      <CalculatorWorkspace title="Peptide calculator" description="Pick your product, type your vial amount and your dose. We tell you how much BAC water to add and where to fill your syringe." backHref="/" help={<>
      {/* How it works: answer-first teaching, targets long-tail + AI overviews. */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          How the peptide calculator works
        </h2>
        <p className="mt-4 text-foreground/90 leading-relaxed">
          You answer four quick questions. The calculator does these steps:
        </p>
        <ol className="mt-5 space-y-4">
          {[
            ["How much BAC water", "If your instructions say an amount, use that. If not, we suggest one that puts your dose on an easy syringe line. Example: 2 mL for a 5 mg vial and a 250 mcg dose."],
            ["How strong each mL is", "Vial amount divided by the water. 5 mg in 2 mL is 2.5 mg in every mL."],
            ["Where to fill the syringe", "Your dose divided by the strength. 250 mcg at 2.5 mg/mL is 0.1 mL, which is the 10 line on an insulin syringe."],
            ["How many doses in the vial", "Vial amount divided by your dose. 5 mg holds twenty 250 mcg doses. This is a count, not how long it stays good."],
          ].map(([t, b], i) => (
            <li key={i} className="flex gap-4">
              <span className="step-number step-number--filled text-[11px] shrink-0">{i + 1}</span>
              <div>
                <div className="font-medium">{t}</div>
                <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{b}</p>
              </div>
            </li>
          ))}
        </ol>
        <Callout variant="note" className="mt-6" title="What this calculator does not decide">
          It does the math from your numbers. It never picks your dose, how often
          you use it, or whether a product is right for anyone.{" "}
          <Link href="/learn/what-you-cannot-know" className="font-medium underline underline-offset-4">
            What no calculation can verify.
          </Link>
        </Callout>
      </section>

      {/* Per-compound calculators (ItemList). */}
      <section className="mt-16">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Calculators by compound
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
          Each compound page combines a calculator with identity context,
          arithmetic examples and selected research where available.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR.map((p) => (
            <Link
              key={p.slug}
              href={`/peptides/${p.slug}`}
              className="group flex items-center justify-between border border-border p-4 hover:bg-muted transition-colors"
            >
              <span className="font-medium">{productDisplayName(p.slug,p.label)}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/peptides" className="text-sm font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">
            All compounds
          </Link>
        </div>
      </section>

      {/* FAQ (FAQPage schema). */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Peptide calculator FAQ
        </h2>
        <Accordion type="single" collapsible className="mt-4">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Related tools + guides. */}
      <section className="mt-14 border-t border-border pt-8 max-w-3xl">
        <h2 className="text-lg font-semibold tracking-tight">Related tools and guides</h2>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/tools/bac-water" className="text-muted-foreground hover:text-foreground underline transition-colors">BAC water calculator</Link>
          <Link href="/tools/reverse-bac" className="text-muted-foreground hover:text-foreground underline transition-colors">Reverse BAC water calculator</Link>
          <Link href="/tools/syringe-units" className="text-muted-foreground hover:text-foreground underline transition-colors">Syringe unit converter</Link>
          <Link href="/learn/how-peptide-reconstitution-works" className="text-muted-foreground hover:text-foreground underline transition-colors">How reconstitution works</Link>
          <Link href="/learn/what-you-cannot-know" className="text-muted-foreground hover:text-foreground underline transition-colors">What you cannot know about your vial</Link>
        </div>
      </section>
      </>}>
        <PlanForm mode="beginner" />
      </CalculatorWorkspace>
    </div>
  );
}
