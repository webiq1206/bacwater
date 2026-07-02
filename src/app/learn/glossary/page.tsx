import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ReviewedBy } from "@/components/common/reviewed-by";
import { References } from "@/components/common/references";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CORE_BACWATER_REFERENCES } from "@/lib/content/references";

export const metadata: Metadata = {
  title: "Peptide Reconstitution Glossary",
  description:
    "Plain-English definitions of BAC water, benzyl alcohol, reconstitution, lyophilization, U-100, subcutaneous, and more.",
  alternates: { canonical: "/learn/glossary" },
  openGraph: {
    title: "Peptide Reconstitution Glossary",
    description: "Plain-English definitions for peptide reconstitution.",
  },
};

interface Term {
  term: string;
  anchor: string;
  definition: string;
  related?: { label: string; href: string };
}

const TERMS: Term[] = [
  {
    term: "Bacteriostatic water",
    anchor: "bacteriostatic-water",
    definition:
      "Sterile water with 0.9% benzyl alcohol added as a preservative that inhibits the growth of bacteria. Because of the preservative, the same vial can be punctured multiple times, which is why it is commonly used to dissolve and dilute lyophilized peptides. It is often shortened to BAC water. Per FDA labeling, it is not for use in newborns.",
    related: { label: "What is BAC water?", href: "/learn/what-is-bac-water" },
  },
  {
    term: "Benzyl alcohol",
    anchor: "benzyl-alcohol",
    definition:
      "The bacteriostatic preservative in BAC water, present at 0.9% by weight. It slows bacterial growth so a multi-dose vial stays usable across repeated punctures. Benzyl alcohol is what distinguishes bacteriostatic water from plain sterile water.",
    related: { label: "Benzyl alcohol, explained", href: "/learn/vs/benzyl-alcohol" },
  },
  {
    term: "Bacteriostatic",
    anchor: "bacteriostatic",
    definition:
      "Describes an agent that inhibits bacterial growth rather than killing bacteria outright. This is different from bactericidal, which means actively killing bacteria. The preservative in BAC water is bacteriostatic, so the water resists contamination but is not sterilizing anything already introduced.",
  },
  {
    term: "Reconstitution",
    anchor: "reconstitution",
    definition:
      "The process of adding a liquid, called a diluent, to a dried powder to return it to a usable solution. For peptides, this usually means drawing bacteriostatic water into a vial of lyophilized powder. The amount of diluent you add determines the final concentration.",
    related: {
      label: "How reconstitution works",
      href: "/learn/how-peptide-reconstitution-works",
    },
  },
  {
    term: "Lyophilization / lyophilized",
    anchor: "lyophilization",
    definition:
      "Lyophilization is freeze-drying: freezing a solution and then removing the water under vacuum, leaving a stable dry powder or cake. A lyophilized peptide is one supplied in this dried form. Freeze-drying helps the peptide stay stable in shipping and storage until it is reconstituted.",
  },
  {
    term: "Diluent",
    anchor: "diluent",
    definition:
      "The liquid used to dissolve or dilute a dried substance during reconstitution. For peptides, bacteriostatic water is the most common diluent because its preservative supports repeated vial punctures. Sterile water and other solutions can also serve as diluents depending on the product.",
  },
  {
    term: "Concentration (mg/mL)",
    anchor: "concentration",
    definition:
      "How much peptide is dissolved in each milliliter of solution, expressed in milligrams per milliliter. It is calculated by dividing the total milligrams of peptide by the volume of diluent added. Adding more diluent lowers the concentration; adding less raises it.",
    related: { label: "Dose calculator", href: "/tools/dose" },
  },
  {
    term: "U-100",
    anchor: "u-100",
    definition:
      "A standard for insulin syringes where the scale is marked in units, with 100 units equal to 1 milliliter. On a U-100 syringe, 1 unit equals 0.01 mL. Peptide users borrow these syringes and their unit markings to measure small volumes precisely.",
    related: { label: "Syringe units explained", href: "/tools/syringe-units" },
  },
  {
    term: "Subcutaneous",
    anchor: "subcutaneous",
    definition:
      "Refers to the layer of fatty tissue just beneath the skin. A subcutaneous injection places fluid into that layer, typically using a short, fine needle. The abbreviation is often written as subQ or SC.",
  },
  {
    term: "Sterile water",
    anchor: "sterile-water",
    definition:
      "Water for injection that has been purified and sterilized but contains no preservative. Without a bacteriostatic agent, an opened vial is intended for a single use. This is the main practical difference from bacteriostatic water, which can be re-entered because of its preservative.",
    related: { label: "Sterile water vs BAC water", href: "/learn/vs/sterile-water" },
  },
];

const FAQS = [
  {
    q: "What is the difference between bacteriostatic water and sterile water?",
    a: "Both are sterile at the point of manufacture, but bacteriostatic water contains 0.9% benzyl alcohol as a preservative while sterile water contains no preservative. The preservative lets a bacteriostatic vial be punctured and re-entered multiple times, whereas a sterile water vial is intended for single use once opened.",
  },
  {
    q: "What does U-100 mean on an insulin syringe?",
    a: "U-100 means the syringe is scaled so that 100 units equal 1 milliliter, so each unit is 0.01 mL. The unit markings make it easier to measure the very small volumes common in peptide reconstitution without converting to fractions of a milliliter.",
  },
];

export default function GlossaryPage() {
  const termSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Peptide Reconstitution Glossary",
    url: "https://bacwater.ai/learn/glossary",
    hasDefinedTerm: TERMS.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
      url: "https://bacwater.ai/learn/glossary#" + t.anchor,
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-14 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Peptide Reconstitution Glossary"
        description="Plain-English definitions of the core terms used across BAC water and peptide reconstitution, from bacteriostatic water and benzyl alcohol to concentration, U-100, and subcutaneous injection."
        url="/learn/glossary"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Learning Center", url: "/learn" },
          { name: "Glossary", url: "/learn/glossary" },
        ]}
        reviewed
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termSet) }}
      />
      <FaqJsonLd items={FAQS} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learning Center", href: "/learn" },
          { label: "Glossary", href: "/learn/glossary" },
        ]}
      />

      <div className="eyebrow">Reference</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        Peptide Reconstitution Glossary
      </h1>
      <p className="mt-3 text-foreground/90 leading-relaxed">
        Plain-English definitions of the core terms used across BAC water and
        peptide reconstitution. Whether you are reading a guide, following a
        protocol, or working through the math, this reference explains what
        words like bacteriostatic water, diluent, concentration, and U-100
        actually mean. It is for research and educational use, not medical
        advice.
      </p>
      <ReviewedBy className="mt-2" />

      <div className="mt-8 border border-border bg-surface p-6">
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
          Jump to
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {TERMS.map((t) => (
            <li key={t.anchor}>
              <a
                href={`#${t.anchor}`}
                className="text-foreground underline decoration-border underline-offset-2 hover:decoration-foreground"
              >
                {t.term}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 space-y-10">
        {TERMS.map((t) => (
          <div key={t.anchor}>
            <h2
              id={t.anchor}
              className="text-2xl font-serif font-medium tracking-tight scroll-mt-24"
            >
              {t.term}
            </h2>
            <p className="mt-3 text-foreground/90 leading-relaxed">
              {t.definition}
            </p>
            {t.related && (
              <p className="mt-2 text-sm text-muted-foreground">
                Learn more:{" "}
                <Link
                  href={t.related.href}
                  className="text-foreground font-medium underline decoration-border underline-offset-2 hover:decoration-foreground"
                >
                  {t.related.label}
                </Link>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-14 border-t border-border pt-8">
        <h2 className="text-2xl font-serif font-medium tracking-tight">
          Common questions
        </h2>
        <Accordion type="single" collapsible className="mt-2">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <References references={CORE_BACWATER_REFERENCES} />

      <div className="mt-14 border border-border bg-surface p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="font-medium text-foreground">
            Ready to put the terms to work?
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Turn these definitions into numbers. The Plan Builder does the
            reconstitution math for you.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Button asChild variant="brand">
            <Link href="/plan">Build a reconstitution plan</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/learn">Learning center</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
