import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PEPTIDES } from "@/lib/calc/peptides";
import { PEPTIDE_CONTENT, CATEGORY_CONTEXT } from "@/lib/peptides/content";
import { dosageRows, reconstitutionSteps, shortName } from "@/lib/peptides/page-data";
import { VIAL_SIZE_PAGES, findVialSizePage } from "@/lib/peptides/vial-sizes";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { HowToJsonLd } from "@/components/common/howto-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { References } from "@/components/common/references";
import { ReviewedBy } from "@/components/common/reviewed-by";
import { CORE_BACWATER_REFERENCES } from "@/lib/content/references";
import { ResearchDisclaimer } from "@/components/common/research-disclaimer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const dynamicParams = false;

export function generateStaticParams() {
  return VIAL_SIZE_PAGES.map((v) => ({ slug: v.slug, size: v.sizeParam }));
}

interface Props {
  params: Promise<{ slug: string; size: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, size } = await params;
  const v = findVialSizePage(slug, size);
  const p = PEPTIDES.find((x) => x.slug === slug);
  if (!v || !p) return {};
  const short = shortName(p.name);
  const row = dosageRows(p).find((r) => r.vialMg === v.sizeMg);
  const bac = row ? row.bacMl : "";
  return {
    title: `How to Reconstitute ${v.sizeMg} mg ${short} (BAC Water Amount)`,
    description: `How much bac water for a ${v.sizeMg} mg ${short} vial? Add about ${bac} mL, get the concentration, syringe units for a typical dose, and doses per vial.`,
    alternates: { canonical: `/peptides/${slug}/${size}` },
    openGraph: {
      title: `How to Reconstitute ${v.sizeMg} mg ${short} · BACwater.ai`,
      description: `Exact bac water amount and syringe units for a ${v.sizeMg} mg ${short} vial.`,
      url: `/peptides/${slug}/${size}`,
      type: "website",
      siteName: "BACwater.ai",
    },
  };
}

export default async function VialSizePage({ params }: Props) {
  const { slug, size } = await params;
  const v = findVialSizePage(slug, size);
  const p = PEPTIDES.find((x) => x.slug === slug);
  if (!v || !p) notFound();

  const short = shortName(p.name);
  const content = PEPTIDE_CONTENT[p.slug];
  const row = dosageRows(p).find((r) => r.vialMg === v.sizeMg);
  if (!row) notFound();
  const steps = reconstitutionSteps(p);
  const doseMcg = p.suggestedDoseMcg;
  const dosesPerVial = Math.floor(v.sizeMg / (doseMcg / 1000));

  const faqs = [
    {
      q: `How much bac water for ${v.sizeMg} mg ${short}?`,
      a: `Add about ${row.bacMl} mL of bacteriostatic water to a ${v.sizeMg} mg ${short} vial. That gives ${row.concentrationMgPerMl} mg/mL, so a ${row.doseLabel} dose measures about ${row.units} units on a U-100 insulin syringe.`,
    },
    {
      q: `How many doses are in a ${v.sizeMg} mg ${short} vial?`,
      a: `At a ${row.doseLabel} dose, a ${v.sizeMg} mg vial gives about ${dosesPerVial} doses. Larger doses give fewer; smaller doses give more.`,
    },
    {
      q: `What concentration is ${v.sizeMg} mg ${short} at ${row.bacMl} mL?`,
      a: `${row.concentrationMgPerMl} mg/mL, which is ${(row.concentrationMgPerMl * 1000).toLocaleString()} mcg/mL. More bac water lowers the concentration; less raises it.`,
    },
  ];

  const otherSizes = dosageRows(p).filter((r) => r.vialMg !== v.sizeMg);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-14 pb-24 sm:pb-32">
      <WebPageJsonLd
        name={`How to reconstitute ${v.sizeMg} mg ${short}`}
        description={`Add about ${row.bacMl} mL of bacteriostatic water to a ${v.sizeMg} mg ${short} vial for clean, easy-to-measure doses.`}
        url={`/peptides/${slug}/${size}`}
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Peptides", url: "/peptides" },
          { name: short, url: `/peptides/${slug}` },
          { name: `${v.sizeMg} mg`, url: `/peptides/${slug}/${size}` },
        ]}
        citations={CORE_BACWATER_REFERENCES}
        reviewed
      />
      <HowToJsonLd
        name={`How to reconstitute ${v.sizeMg} mg ${short}`}
        description={`Step-by-step reconstitution of a ${v.sizeMg} mg ${short} vial with bacteriostatic water.`}
        steps={steps}
        supplies={[`${v.sizeMg} mg ${short} vial`, "Bacteriostatic water", "Insulin syringe", "Alcohol prep pads"]}
        tools={["Insulin syringe"]}
        totalTime="PT5M"
      />
      <FaqJsonLd items={faqs} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Peptides", href: "/peptides" },
          { label: short, href: `/peptides/${slug}` },
          { label: `${v.sizeMg} mg`, href: `/peptides/${slug}/${size}` },
        ]}
      />

      <div className="eyebrow">{short} vial guide</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        How to reconstitute {v.sizeMg} mg {short}
      </h1>

      {/* Short answer */}
      <div className="mt-5 border-l-2 border-foreground/30 bg-surface px-4 py-3">
        <p className="text-base leading-relaxed text-foreground/90">
          <strong>Short answer:</strong> add {row.bacMl} mL of bac water to a{" "}
          {v.sizeMg} mg {short} vial. A {row.doseLabel} dose then measures about{" "}
          {row.units} units on a 1 mL (U-100) insulin syringe.
        </p>
      </div>

      <p className="mt-5 text-lg leading-relaxed text-foreground/90">
        To reconstitute a {v.sizeMg} mg vial of {short}, add about{" "}
        {row.bacMl} mL of bacteriostatic water. That yields{" "}
        {row.concentrationMgPerMl} mg/mL, so a typical {row.doseLabel} dose is
        about {row.units} units on a U-100 insulin syringe and the vial holds
        roughly {dosesPerVial} doses. This page covers the {v.sizeMg} mg vial
        specifically; use more or less bac water to shift the dose to an
        easier-to-read mark.
      </p>
      <ReviewedBy className="mt-2" />

      {/* Focused numbers */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Stat label="Bac water to add" value={`${row.bacMl} mL`} />
        <Stat label="Concentration" value={`${row.concentrationMgPerMl} mg/mL`} />
        <Stat label={`Units for a ${row.doseLabel} dose`} value={`${row.units} units`} />
        <Stat label="Doses per vial (typical)" value={`${dosesPerVial}`} />
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="brand">
          <Link href="/plan">
            Build a plan <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/peptides/${slug}`}>Full {short} guide</Link>
        </Button>
      </div>

      {/* About */}
      {content && (
        <section className="mt-14">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
            About {v.sizeMg} mg {short} vials
          </h2>
          <div className="mt-4 space-y-3 text-foreground/90 leading-relaxed">
            <p>{content.what}</p>
            <p className="text-muted-foreground">
              A {v.sizeMg} mg vial is one of the common strengths for {short}. The
              amount of bac water you add sets the concentration, and the numbers
              above put a typical dose at a clean syringe mark. {CATEGORY_CONTEXT[p.category]}
            </p>
          </div>
        </section>
      )}

      {/* Steps */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          How to reconstitute {v.sizeMg} mg {short}
        </h2>
        <ol className="mt-5 space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="step-number step-number--filled text-[11px] shrink-0">{i + 1}</span>
              <div>
                <div className="font-medium">{s.name}</div>
                <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          {v.sizeMg} mg {short} FAQ
        </h2>
        <Accordion type="single" collapsible className="mt-4">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Other sizes */}
      {otherSizes.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-serif font-medium tracking-tight">
            Other {short} vial sizes
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {otherSizes.map((r) => {
              const other = findVialSizePage(slug, `${r.vialMg}mg`);
              const href = other ? `/peptides/${slug}/${r.vialMg}mg` : `/peptides/${slug}`;
              return (
                <Link
                  key={r.vialMg}
                  href={href}
                  className="group flex items-center justify-between border border-border p-4 hover:bg-surface transition-colors"
                >
                  <span className="font-medium">{r.vialMg} mg {short}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <ResearchDisclaimer className="mt-10" />

      <References references={CORE_BACWATER_REFERENCES} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-card p-5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
