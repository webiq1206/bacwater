import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Package, ShieldCheck } from "lucide-react";
import { PEPTIDES } from "@/lib/calc/peptides";
import { PEPTIDE_CONTENT, CATEGORY_CONTEXT } from "@/lib/peptides/content";
import {
  dosageRows,
  directAnswer,
  reconstitutionSteps,
  buildFaqs,
  shortName,
} from "@/lib/peptides/page-data";
import { PeptideCalc } from "@/components/peptides/peptide-calc";
import { VialIdentityWarning } from "@/components/peptides/vial-identity-warning";
import { EvidenceBadge, WhatNobodyKnows } from "@/components/peptides/evidence";
import { evidenceOf } from "@/lib/calc/peptides";
import { StudyTable } from "@/components/peptides/study-table";
import { studiesFor } from "@/lib/peptides/studies";
import { getCatalog, relatedContent } from "@/lib/learn/catalog";
import { RelatedReadingPanel } from "@/components/learn/related-reading";
import {
  peptideChartSvg,
  peptideChartAlt,
  peptideChartDims,
  hasChart,
} from "@/lib/infographics/peptide-chart";
import { Infographic } from "@/components/common/infographic";
import { AtAGlance } from "@/components/common/at-a-glance";
import { ImageJsonLd } from "@/components/common/image-json-ld";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { HowToJsonLd } from "@/components/common/howto-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { References } from "@/components/common/references";
import { AdSlot } from "@/components/common/ad-slot";
import { ReviewedBy } from "@/components/common/reviewed-by";
import { CORE_BACWATER_REFERENCES } from "@/lib/content/references";

const CATEGORY_LABEL: Record<string, string> = {
  metabolic: "Metabolic signaling research",
  healing: "Tissue and repair research",
  growth: "Growth hormone signaling research",
  cosmetic: "Dermatology and pigmentation research",
  cognitive: "Neurological research",
  reproductive: "Reproductive signaling research",
  longevity: "Mitochondrial and aging research",
  other: "Research compound",
};

export function generateStaticParams() {
  return PEPTIDES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = PEPTIDES.find((x) => x.slug === slug);
  if (!p) return {};
  const short = shortName(p.name);
  const isCustom = p.slug === "custom";
  const strengths = p.commonVialStrengthsMg.join(", ");
  const title = isCustom
    ? "Reconstitution Calculator for Any Compound"
    : `${short} Reconstitution Calculator & Reference`;
  const description = isCustom
    ? "Work out how much bacteriostatic water to add to a vial and what your measurement is in syringe units. Enter your vial amount and how much you want to measure."
    : `Work out how much bacteriostatic water to add to a ${short} vial and what your measurement is in syringe units. What research looked at, and what nobody knows.`;
  const chart = hasChart(p) ? peptideChartDims(p) : null;
  return {
    title,
    description,
    alternates: { canonical: `/peptides/${p.slug}` },
    openGraph: {
      title: `${title} · BACwater.ai`,
      description,
      url: `/peptides/${p.slug}`,
      type: "website",
      siteName: "BACwater.ai",
      ...(chart
        ? {
            images: [
              {
                url: `/peptides/${p.slug}/chart.svg`,
                width: chart.width,
                height: chart.height,
                alt: `${short} concentration reference`,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function PeptidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = PEPTIDES.find((x) => x.slug === slug);
  if (!p) notFound();

  const short = shortName(p.name);
  const content = PEPTIDE_CONTENT[p.slug];
  const isCustom = p.slug === "custom";
  const rows = isCustom ? [] : dosageRows(p);
  const studies = isCustom ? null : studiesFor(p.slug);
  const steps = reconstitutionSteps(p);
  const faqs = buildFaqs(p, content?.faqs ?? []);
  const lead = directAnswer(p);
  const related = PEPTIDES.filter(
    (x) => x.category === p.category && x.slug !== p.slug && x.slug !== "custom"
  ).slice(0, 4);

  const chartSvg = hasChart(p) ? peptideChartSvg(p) : null;
  const chartDims = hasChart(p) ? peptideChartDims(p) : null;

  const catalog = await getCatalog();
  const relatedReading = relatedContent(catalog, {
    peptide: isCustom ? undefined : p.slug,
    topics: ["storage", "dosage", "safety"],
    types: ["faq", "comparison", "safety", "guide"],
    excludeUrl: `/peptides/${p.slug}`,
    limit: 5,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-14 pb-24 sm:pb-32">
      <WebPageJsonLd
        name={`${short} BAC Water Calculator & Reconstitution Guide`}
        description={lead}
        url={`/peptides/${p.slug}`}
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Peptides", url: "/peptides" },
          { name: short, url: `/peptides/${p.slug}` },
        ]}
        citations={CORE_BACWATER_REFERENCES}
        reviewed
      />
      {!isCustom && (
        <HowToJsonLd
          name={`How to reconstitute ${short}`}
          description={`Step-by-step reconstitution of ${short} with bacteriostatic water.`}
          steps={steps}
          supplies={[
            `${short} vial`,
            "Bacteriostatic water",
            "Insulin syringe",
            "Alcohol prep pads",
          ]}
          tools={["Insulin syringe"]}
          totalTime="PT5M"
        />
      )}
      <FaqJsonLd items={faqs} />
      {chartDims && (
        <ImageJsonLd
          url={`/peptides/${p.slug}/chart.svg`}
          caption={peptideChartAlt(p)}
          width={chartDims.width}
          height={chartDims.height}
        />
      )}

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Peptides", href: "/peptides" },
          { label: short, href: `/peptides/${p.slug}` },
        ]}
      />

      <div className="eyebrow">{CATEGORY_LABEL[p.category]}</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        {short} reconstitution calculator and reference
      </h1>
      {!isCustom && (
        <div className="mt-3">
          <EvidenceBadge evidence={evidenceOf(p)} />
        </div>
      )}
      {content?.aka && (
        <p className="mt-3 text-sm text-muted-foreground">{content.aka}</p>
      )}

      {/* At a glance: the handful of facts a reader wants before the calculator. */}
      {!isCustom && (
        <AtAGlance
          className="mt-5"
          columns={3}
          items={[
            {
              label: "Category",
              value: `${p.category.charAt(0).toUpperCase()}${p.category.slice(1)}`,
            },
            {
              label: "Common vial sizes",
              value: `${p.commonVialStrengthsMg.join(", ")} mg`,
            },
            {
              label: "Shelf life",
              value: `${p.refrigeratedShelfDays} days`,
              sub: "refrigerated, mixed",
            },
          ]}
        />
      )}

      {/* Labeled TL;DR: a tight, extractable one-liner for AI Overviews. */}
      {!isCustom && rows.length > 0 && (
        <div className="mt-5 border-l-2 border-foreground/30 bg-surface px-4 py-3">
          <p className="text-base leading-relaxed text-foreground/90">
            <strong>Short answer:</strong> add {rows[0].bacMl} mL of bac water to
            a {rows[0].vialMg} mg {short} vial. A {rows[0].doseLabel} amount then
            measures about {rows[0].units} units on a 1 mL (U-100) insulin
            syringe.
          </p>
        </div>
      )}

      {/* Direct answer */}
      <p className="mt-5 text-lg leading-relaxed text-foreground/90">{lead}</p>

      {!isCustom && <WhatNobodyKnows compound={short} evidence={evidenceOf(p)} />}

      <ReviewedBy className="mt-2" />

      {/* Embedded calculator */}
      <div className="mt-8">
        <PeptideCalc
          peptideName={short}
          peptideSlug={p.slug}
          commonVialStrengthsMg={p.commonVialStrengthsMg}
          suggestedDoseMcg={p.suggestedDoseMcg}
        />
      </div>

      <VialIdentityWarning compound={short} />

      {/* What it is */}
      {content && (
        <section className="mt-14">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
            What is {short}?
          </h2>
          <div className="mt-4 space-y-3 text-foreground/90 leading-relaxed">
            <p>{content.what}</p>
            <p>{content.uses}</p>
            <p className="text-muted-foreground">
              {CATEGORY_CONTEXT[p.category]}
            </p>
          </div>
        </section>
      )}

      {studies && <StudyTable data={studies} />}

      {/* Dosage table */}
      {!isCustom && rows.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
            How much bac water for {short}?
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            These examples put a {rows[0].doseLabel} measurement at a clean
            number on a 1 mL insulin syringe. Use the calculator above for your
            exact vial and the amount you want to measure.
          </p>
          <div className="mt-5 overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface text-left">
                  <th className="px-4 py-3 font-medium">Vial amount</th>
                  <th className="px-4 py-3 font-medium">Bac water to add</th>
                  <th className="px-4 py-3 font-medium">Concentration</th>
                  <th className="px-4 py-3 font-medium">Amount to measure</th>
                  <th className="px-4 py-3 font-medium">Syringe units</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  return (
                  <tr
                    key={r.vialMg}
                    id={`bac-water-${r.vialMg}mg`}
                    className="border-t border-border scroll-mt-24"
                  >
                    <td className="px-4 py-3 font-medium">{r.vialMg} mg</td>
                    <td className="px-4 py-3 tabular-nums">{r.bacMl} mL</td>
                    <td className="px-4 py-3 tabular-nums">
                      {r.concentrationMgPerMl} mg/mL
                    </td>
                    <td className="px-4 py-3 tabular-nums">{r.doseLabel}</td>
                    <td className="px-4 py-3 tabular-nums">{r.units} units</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            The amount in the &ldquo;Amount to measure&rdquo; column is an
            example chosen so the math is easy to follow. It is not a
            recommended amount, and this site does not recommend how much to use.
            Units assume a U-100 insulin syringe (100 units = 1 mL). Always
            confirm the amount printed on your own vial.
          </p>
          {chartSvg && (
            <div className="mt-6">
              <Infographic
                svg={chartSvg}
                caption={peptideChartAlt(p)}
              />
            </div>
          )}
        </section>
      )}

      {/* How to reconstitute */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          How to reconstitute {short}
        </h2>
        <ol className="mt-5 space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="step-number step-number--filled text-[11px] shrink-0">
                {i + 1}
              </span>
              <div>
                <div className="font-medium">{s.name}</div>
                <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Storage & shelf life */}
      <section className="mt-14">
        <div className="flex items-center gap-2.5">
          <ShieldCheck
            className="h-5 w-5"
            style={{ color: "var(--color-accent-guide)" }}
          />
          <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
            Storage and shelf life
          </h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center border border-border bg-card p-6">
          <div className="sm:border-r sm:border-border sm:pr-6">
            <div className="text-3xl font-semibold tabular-nums">
              {p.refrigeratedShelfDays} days
            </div>
            <div className="text-xs text-muted-foreground">refrigerated</div>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed sm:pl-6">
            {p.storageNote}
            {content?.caveat ? ` ${content.caveat}` : ""} Once you add bac water,
            the peptide slowly breaks down, so refrigerate the vial and discard
            it if the solution turns cloudy or develops particles.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          {short} reconstitution FAQ
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

      <AdSlot />

      {/* Related reading (tag-driven) */}
      {relatedReading.length > 0 && (
        <div className="mt-14">
          <RelatedReadingPanel
            title={`Keep reading about ${short}`}
            items={relatedReading}
          />
        </div>
      )}

      {/* Related peptides */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-serif font-medium tracking-tight">
            Related peptides
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/peptides/${r.slug}`}
                className="group flex items-center justify-between border border-border p-4 hover:bg-muted transition-colors"
              >
                <span className="font-medium">{shortName(r.name)}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <References references={CORE_BACWATER_REFERENCES} />

      {/* Keep learning / internal links */}
      <section className="section-dark mt-14 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Package className="h-5 w-5 accent-check mt-0.5 shrink-0" />
          <div>
            <div className="font-medium text-foreground">
              Ready to mix {short}?
            </div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              The{" "}
              <Link
                href="/plan"
                className="text-foreground font-medium underline"
              >
                Plan Builder
              </Link>{" "}
              turns these numbers into a printable, step-by-step plan. You can
              also read{" "}
              <Link
                href="/learn/how-peptide-reconstitution-works"
                className="text-foreground font-medium underline"
              >
                how reconstitution works
              </Link>
              , brush up on the{" "}
              <Link
                href="/tools/bac-water"
                className="text-foreground font-medium underline"
              >
                bac water calculator
              </Link>
              , or start from the{" "}
              <Link href="/" className="text-foreground font-medium underline">
                complete bac water guide
              </Link>
              .
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link href="/tools/bac-water" className="text-foreground font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">Bac water calculator</Link>
              <Link href="/faq" className="text-foreground font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">BAC water FAQ</Link>
              <Link href="/learn/vs/sterile-water" className="text-foreground font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">Bac water vs sterile water</Link>
              <Link href="/learn/bac-water-shelf-life" className="text-foreground font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">Shelf life and storage</Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild variant="brand">
                <Link href="/plan">
                  Build a plan for {short} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/peptides">All peptides</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
