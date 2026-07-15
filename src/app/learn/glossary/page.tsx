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
    url: "/learn/glossary",
    type: "website",
    siteName: "BACwater.ai",
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
      "This is sterile water with 0.9% benzyl alcohol (a germ-fighting preservative) added. The preservative stops germs from growing. Because of it, you can put a needle into the same vial many times. That is why it is used to dissolve and mix dried peptides. It is often called BAC water for short. Per FDA labeling, it is not for use in newborns.",
    related: { label: "What is BAC water?", href: "/learn/what-is-bac-water" },
  },
  {
    term: "Benzyl alcohol",
    anchor: "benzyl-alcohol",
    definition:
      "This is the germ-fighting preservative in BAC water. It makes up 0.9% of the water by weight. It slows germ growth, so you can use one vial across many needle draws. Benzyl alcohol is what makes BAC water different from plain sterile water.",
    related: { label: "Benzyl alcohol, explained", href: "/learn/vs/benzyl-alcohol" },
  },
  {
    term: "Bacteriostatic",
    anchor: "bacteriostatic",
    definition:
      "\"Bacteriostatic\" means it stops germs from growing. It does not kill germs that are already there. (A different word, \"bactericidal,\" means it kills germs.) The preservative in BAC water is bacteriostatic. So the water holds off new germs, but it does not kill germs that already got in.",
  },
  {
    term: "Reconstitution",
    anchor: "reconstitution",
    definition:
      "This means adding a liquid to a dried powder to turn it back into a usable liquid. The liquid you add is called a diluent. For peptides, this usually means adding BAC water to a vial of dried powder. How much you add sets how strong the final liquid is.",
    related: {
      label: "How reconstitution works",
      href: "/learn/how-peptide-reconstitution-works",
    },
  },
  {
    term: "Lyophilization / lyophilized",
    anchor: "lyophilization",
    definition:
      "Lyophilization is just freeze-drying. First the liquid is frozen. Then the water is pulled out, leaving a dry powder or cake. A lyophilized peptide is one that comes in this dried form. Freeze-drying helps the peptide stay stable during shipping and storage until you mix it.",
  },
  {
    term: "Diluent",
    anchor: "diluent",
    definition:
      "A diluent is the liquid you use to dissolve or thin a dried substance when you mix it. For peptides, BAC water is the most common diluent. Its preservative lets you draw from the vial many times. Sterile water and other liquids can also be diluents, based on the product.",
  },
  {
    term: "Concentration (mg/mL)",
    anchor: "concentration",
    definition:
      "This is how much peptide is in each milliliter of liquid. It is shown as milligrams per milliliter (mg/mL). To find it, divide the total milligrams of peptide by the amount of liquid you added. More liquid makes it weaker. Less liquid makes it stronger.",
    related: { label: "Dose calculator", href: "/tools/dose" },
  },
  {
    term: "U-100",
    anchor: "u-100",
    definition:
      "This is a standard for insulin syringes. The scale is marked in units, and 100 units equal 1 milliliter. So on a U-100 syringe, 1 unit is 0.01 mL. Peptide users borrow these syringes and their unit marks to measure small amounts with care.",
    related: { label: "Syringe units explained", href: "/tools/syringe-units" },
  },
  {
    term: "Subcutaneous",
    anchor: "subcutaneous",
    definition:
      "\"Subcutaneous\" means the layer of fatty tissue just under the skin. A subcutaneous injection puts fluid into that layer. It usually uses a short, thin needle. It is often written as subQ or SC for short.",
  },
  {
    term: "Sterile water",
    anchor: "sterile-water",
    definition:
      "This is sterile water for injection. Sterile means it had no germs in it when it was made. But it has no preservative. Without one, an opened vial is for a single use only. That is the main difference from BAC water, which you can draw from more than once because of its preservative.",
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
