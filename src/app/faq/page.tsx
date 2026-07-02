import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { RelatedReadingDynamic } from "@/components/learn/related-reading-dynamic";
import { Infographic } from "@/components/common/infographic";
import { ImageJsonLd } from "@/components/common/image-json-ld";
import { storageSvg, storageAlt } from "@/lib/infographics/static";

export const metadata = {
  title: "BAC Water FAQ: Storage, Dosing, Prescription & Uses",
  description:
    "Direct answers on BAC water: what it is, how much to add, whether it needs refrigerating, how long it lasts, ingredients and pH, prescription status, and safety.",
  alternates: { canonical: "/faq" },
};

const CORE: {
  q: string;
  a: string;
  cta?: { href: string; text: string; tail: string };
}[] = [
  {
    q: "What is BAC water (bacteriostatic water)?",
    a: "Bacteriostatic water (BAC water) is sterile water that contains 0.9% benzyl alcohol as a preservative. BAC stands for bacteriostatic, meaning the benzyl alcohol suppresses bacterial growth. That preservative is why the same vial can be used safely across multiple doses over several weeks.",
  },
  {
    q: "What is BAC water used for?",
    a: "BAC water is used to reconstitute (mix) lyophilized research peptides and other powders into a solution. Because it is preserved, it is the standard diluent for multi-dose peptide vials that you draw from more than once, unlike single-use sterile water.",
  },
  {
    q: "What is BAC water made of, and what is its pH?",
    a: "BAC water is sterile water for injection with 0.9% benzyl alcohol added as a bacteriostatic preservative. Its pH typically falls in a mildly acidic to neutral range (about 4.5 to 7). The benzyl alcohol is the only meaningful difference between BAC water and plain sterile water.",
  },
  {
    q: "How much BAC water should I add to reconstitute a peptide?",
    a: "Add enough BAC water so your dose lands at a clean, easy-to-read number on your insulin syringe. For a 5 mg peptide vial, 2 mL of BAC water is a common starting point, which makes a 250 mcg dose about 10 units.",
    cta: {
      href: "/tools/bac-water",
      text: "BAC water calculator",
      tail: " gives the exact amount for your vial strength and dose.",
    },
  },
  {
    q: "What size insulin syringe should I use for peptides?",
    a: "For most peptides, a 1 mL (U-100) insulin syringe is the best default. If your dose is consistently under 30 units, a 0.3 mL insulin syringe with half-unit markings is easier to read accurately. A 0.5 mL syringe is a good middle ground.",
    cta: {
      href: "/tools/syringe-units",
      text: "syringe unit converter",
      tail: " helps you convert between mL and syringe units.",
    },
  },
  {
    q: "Does BAC water need to be refrigerated, and how long does it last?",
    a: "Refrigerate BAC water after the first puncture. An opened 30 mL vial is generally good for about 28 days in the fridge, while unopened BAC water is stable at room temperature until its printed expiration date. Reconstituted peptides also belong in the fridge and are usually stable for about 28 to 30 days.",
    cta: {
      href: "/plan",
      text: "plan builder",
      tail: " tracks the shelf life and expiration date for your peptide automatically.",
    },
  },
  {
    q: "Do I need a prescription to buy BAC water?",
    a: "In the US, bacteriostatic water is prescription-only when it is labeled for human use. The BAC water sold here is for laboratory research and educational purposes, so it is not sold over the counter for human use, and we do not provide medical advice.",
  },
  {
    q: "Is BAC water safe?",
    a: "Used correctly, BAC water is a standard, well-established diluent. The main precautions are to swab the stopper before each draw, refrigerate after opening, and discard the vial if it turns cloudy or develops particles. Benzyl alcohol sensitivity is uncommon but possible, so check the ingredients if you have known allergies.",
  },
  {
    q: "Is BACwater.ai a medical service?",
    a: "No. BACwater.ai provides a BAC water calculator, reconstitution guides, and research supplies. We do not diagnose, prescribe, or provide medical advice. Consult a licensed healthcare provider for any medical guidance.",
  },
];

/** Plain text for schema/answer fields (strips markdown markers). */
function stripMarkdown(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/[`#>_]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/** Renders a stored FAQ body with basic markdown (bold, paragraphs). */
function FaqBody({ body }: { body: string }) {
  const blocks = body.split(/\n\n+/);
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const html = block
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/\*([^*]+)\*/g, "<em>$1</em>");
        return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </div>
  );
}

export default async function FaqPage() {
  const dbFaqs = await prisma.contentBlock.findMany({
    where: { kind: "faq", published: true },
    orderBy: { createdAt: "asc" },
  });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      ...CORE.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
      ...dbFaqs.map((f) => ({
        "@type": "Question",
        name: f.title,
        acceptedAnswer: { "@type": "Answer", text: stripMarkdown(f.body) },
      })),
    ],
  };
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WebPageJsonLd
        name="Frequently Asked Questions"
        description="Answers to the most common questions about BAC water, peptide reconstitution, dosing, storage, and shopping with BACwater.ai."
        url="/faq"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "FAQ", url: "/faq" },
        ]}
      />
      <ImageJsonLd
        url="/learn/storage-infographic.svg"
        caption={storageAlt()}
        width={720}
        height={210}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ", href: "/faq" }]} />
      <div className="eyebrow">Help</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        Frequently asked questions
      </h1>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        Quick answers to the most common questions about BAC water, peptide
        reconstitution, and shopping with us. Can&apos;t find what you&apos;re
        looking for?{" "}
        <Link href="/contact" className="text-foreground font-medium underline">
          Contact us
        </Link>
        .
      </p>
      <div className="mt-8 callout-panel">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 accent-check mt-0.5 shrink-0" />
          <div>
            <div className="font-medium text-foreground">New to BAC water? Start at the top</div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              The questions below cover what BAC water is, how much to add, storage
              and refrigeration, and whether you need a prescription. For exact
              numbers, our <Link href="/plan" className="text-foreground font-medium underline">Plan Builder</Link> does the math automatically.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Infographic
          svg={storageSvg()}
          caption="Storage and shelf life at a glance: refrigerate, use within about 28 days, keep it dark, and never freeze."
        />
      </div>

      {/* Contextual panel: appears only after the user has shown interest in a
          specific peptide. The full generic FAQ set stays below, unchanged. */}
      <div className="mt-6">
        <RelatedReadingDynamic
          useInterest
          hideWhenNoSignal
          topics={["storage", "dosage", "reconstitution-method"]}
          title="Based on the peptide you were looking at"
          limit={4}
        />
      </div>

      <div className="mt-6">
        <Accordion type="single" collapsible>
          {CORE.map((f, i) => (
            <AccordionItem key={i} value={`c-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>
                {f.a}
                {f.cta && (
                  <span>
                    {" "}Our{" "}
                    <Link href={f.cta.href} className="font-medium underline">
                      {f.cta.text}
                    </Link>
                    {f.cta.tail}
                  </span>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {dbFaqs.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-xl font-semibold">More from our team</h2>
            <Accordion type="single" collapsible className="mt-2">
              {dbFaqs.map((f) => (
                <AccordionItem key={f.id} value={f.slug}>
                  <AccordionTrigger>{f.title}</AccordionTrigger>
                  <AccordionContent>
                    <FaqBody body={f.body} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : null}
      </div>

      <div className="mt-10 border border-border bg-surface p-6 sm:p-8">
        <div className="font-medium text-foreground">Still not sure?</div>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          The Plan Builder walks you through everything step by step. Just pick your peptide,
          vial, and dose, and we handle the rest. No math required.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="brand">
            <Link href="/plan">
              Build my plan <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/learn">Read the guides</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
