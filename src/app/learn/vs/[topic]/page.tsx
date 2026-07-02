import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { COMPARISONS, findComparison } from "@/lib/comparisons/content";
import {
  comparisonSvg,
  comparisonAlt,
  comparisonDims,
} from "@/lib/infographics/comparison";
import { Infographic } from "@/components/common/infographic";
import { ImageJsonLd } from "@/components/common/image-json-ld";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LAST_REVIEWED } from "@/lib/content-meta";

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ topic: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const c = findComparison(topic);
  if (!c) return {};
  const dims = comparisonDims(c);
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `/learn/vs/${c.slug}` },
    openGraph: {
      title: `${c.metaTitle} · BACwater.ai`,
      description: c.metaDescription,
      images: [
        {
          url: `/learn/vs/${c.slug}/infographic.svg`,
          width: dims.width,
          height: dims.height,
          alt: `${c.title} infographic`,
        },
      ],
    },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const c = findComparison(topic);
  if (!c) notFound();

  const others = COMPARISONS.filter((x) => x.slug !== c.slug);
  const dims = comparisonDims(c);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-14 pb-24 sm:pb-32">
      <WebPageJsonLd
        name={c.title}
        description={c.verdict}
        url={`/learn/vs/${c.slug}`}
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Learning Center", url: "/learn" },
          { name: c.title, url: `/learn/vs/${c.slug}` },
        ]}
      />
      <FaqJsonLd items={c.faqs} />
      <ImageJsonLd
        url={`/learn/vs/${c.slug}/infographic.svg`}
        caption={comparisonAlt(c)}
        width={dims.width}
        height={dims.height}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learning Center", href: "/learn" },
          { label: c.title, href: `/learn/vs/${c.slug}` },
        ]}
      />

      <div className="eyebrow">Comparison</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        {c.title}
      </h1>

      {/* Direct verdict */}
      <p className="mt-5 text-lg leading-relaxed text-foreground/90">
        {c.verdict}
      </p>
      <div className="mt-2 text-xs text-muted-foreground">
        Last reviewed {LAST_REVIEWED}
      </div>

      {/* Comparison table */}
      <div className="mt-8 overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface text-left">
              <th className="px-4 py-3 font-medium"></th>
              <th className="px-4 py-3 font-medium">Bac water</th>
              <th className="px-4 py-3 font-medium">{c.otherName}</th>
            </tr>
          </thead>
          <tbody>
            {c.table.map((row) => (
              <tr key={row.dimension} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-muted-foreground">
                  {row.dimension}
                </td>
                <td className="px-4 py-3">{row.bac}</td>
                <td className="px-4 py-3">{row.other}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparison infographic */}
      <div className="mt-6">
        <Infographic
          svg={comparisonSvg(c)}
          caption={`${c.title}: the key differences at a glance.`}
        />
      </div>

      {/* Body sections */}
      <div className="mt-12 space-y-10">
        {c.body.map((s) => (
          <section key={s.h2}>
            <h2 className="text-2xl font-serif font-medium tracking-tight">
              {s.h2}
            </h2>
            <p className="mt-3 text-foreground/90 leading-relaxed">{s.p}</p>
          </section>
        ))}
      </div>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-2xl font-serif font-medium tracking-tight">
          {c.title}: common questions
        </h2>
        <Accordion type="single" collapsible className="mt-4">
          {c.faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Other comparisons */}
      <section className="mt-12">
        <h2 className="text-xl font-serif font-medium tracking-tight">
          More bac water comparisons
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/learn/vs/${o.slug}`}
              className="group flex items-center justify-between border border-border p-4 hover:bg-surface transition-colors"
            >
              <span className="font-medium">{o.title}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 border border-border bg-surface p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="font-medium text-foreground">
            Ready to reconstitute?
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Build a step-by-step plan or shop sealed, research-grade bac water.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Button asChild variant="brand">
            <Link href="/plan">
              Build a plan <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/buy">Buy bac water</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
