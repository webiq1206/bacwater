import Link from "next/link";
import { prisma } from "@/lib/db";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to the most common questions about BAC water, peptide reconstitution, dosing, storage, and shopping with BACwater.ai.",
};

const CORE = [
  {
    q: "What is BAC water?",
    a: "Bacteriostatic water is sterile water containing 0.9% benzyl alcohol as a preservative. The preservative prevents bacterial growth, which is why the same vial can be safely used across multiple doses over several weeks.",
  },
  {
    q: "How much BAC water should I add to my vial?",
    a: "Enough to make your dose land at a clean, easy-to-read number on your syringe. Our planner suggests an amount that yields ~10 units on a U-100 insulin syringe. You can always override it.",
  },
  {
    q: "What syringe should I use?",
    a: "For most peptides, a 1 mL insulin syringe (U-100) is a good default. Smaller doses under 30 units are easier to draw accurately on a 0.3 mL insulin syringe with half-unit markings.",
  },
  {
    q: "How long is reconstituted peptide good for?",
    a: "Most reconstituted peptides remain stable for about 28-30 days refrigerated. Some are more stable, some less. Our planner uses each peptide's typical shelf life and lets you override it.",
  },
  {
    q: "Do I need a prescription?",
    a: "In the US, bacteriostatic water is prescription-only when labeled for human use. Our products are sold for laboratory research and educational purposes. We do not provide medical advice.",
  },
  {
    q: "Is BACwater.ai a medical service?",
    a: "No. We provide calculation tools and research supplies. We do not diagnose, prescribe, or provide medical advice. Consult a qualified professional for any medical guidance.",
  },
  {
    q: "Do I need an account?",
    a: "Yes. A free account is required to use the planner, save plans, and check out. Creating one takes just a few seconds.",
  },
];

export default async function FaqPage() {
  const dbFaqs = await prisma.contentBlock.findMany({
    where: { kind: "faq", published: true },
    orderBy: { createdAt: "asc" },
  });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CORE.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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
      <div className="mt-8">
        <Accordion type="single" collapsible>
          {CORE.map((f, i) => (
            <AccordionItem key={i} value={`c-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
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
                    <div className="whitespace-pre-line">{f.body}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : null}
      </div>
    </div>
  );
}
