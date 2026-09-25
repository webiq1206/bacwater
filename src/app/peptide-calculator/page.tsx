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

export const metadata: Metadata = {
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
};

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
    a: "A peptide calculator converts the labeled amount and final liquid volume into concentration. Enter the amount to measure from instructions you already have to find its mL and syringe-unit equivalent. It does not select a diluent, dose or treatment.",
  },
  {
    q: "How do you calculate peptide reconstitution?",
    a: "Concentration equals the vial amount divided by the final liquid volume. The volume to measure equals the amount you want divided by that concentration. On a U-100 insulin syringe, that volume times 100 gives the units. This calculator shows every step so you can check it.",
  },
  {
    q: "How much bacteriostatic water should I add to a peptide vial?",
    a: "Vial strength alone cannot answer that question. Use the volume and diluent in the exact product instructions. An arithmetic comparison can show how concentration changes, but it does not establish compatibility, vial capacity or a safe preparation.",
  },
  {
    q: "How many syringe units is my measurement?",
    a: "On a U-100 insulin syringe, 100 units equal 1 mL, so 0.1 mL is 10 units and 0.05 mL is 5 units. Enter your concentration and the amount you want, and the calculator shows the corresponding scale reading. Displayed values may be rounded; verify the actual device graduations.",
  },
  {
    q: "Does this calculator tell me how much peptide to take?",
    a: "No. It calculates concentration and measurement from the numbers you enter. It does not recommend an amount, a frequency, or whether a compound is safe or suitable for anyone. Those questions are not math, and this site does not answer them.",
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
              name: `${p.label} reconstitution calculator`,
              url: `${SITE_URL}/peptides/${p.slug}`,
            })),
          }),
        }}
      />

      <CalculatorWorkspace title="Peptide calculator" description="One question at a time. Use the numbers from your own instructions." backHref="/" help={<>
      {/* How it works: answer-first teaching, targets long-tail + AI overviews. */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          How the peptide calculator works
        </h2>
        <p className="mt-4 text-foreground/90 leading-relaxed">
          The calculator uses your numbers and shows these steps:
        </p>
        <ol className="mt-5 space-y-4">
          {[
            ["Concentration", "Vial amount divided by final liquid volume. An illustrative 5 mg in a final 2 mL is 2.5 mg/mL."],
            ["Volume to measure", "The amount you want divided by the concentration. 250 mcg at 2.5 mg/mL is 0.1 mL."],
            ["Syringe units", "On a U-100 insulin syringe, 100 units equal 1 mL, so 0.1 mL is 10 units."],
            ["Measurements per vial", "The vial amount divided by the amount per measurement. This is a quantity estimate, not a safe storage period."],
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
          It calculates concentration and measurement from the numbers you enter.
          It does not recommend how much to use, how often, or whether a compound
          is safe or right for anyone.{" "}
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
              <span className="font-medium">{p.label}</span>
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
