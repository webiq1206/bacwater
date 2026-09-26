import { productDisplayName } from "@/lib/partners/supplier-catalog";
import { withSocialMetadata } from "@/lib/seo/social-metadata";
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
import { ArticleJsonLd } from "@/components/common/article-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { References } from "@/components/common/references";
import { ReviewedBy } from "@/components/common/reviewed-by";
import { sourceReference, topicReferences } from "@/lib/content/references";
import { SITE_URL } from "@/lib/seo/schema";
import { LAST_REVIEWED_ISO } from "@/lib/content-meta";

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
  if (!c) return withSocialMetadata({});
  const dims = comparisonDims(c);
  return withSocialMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `/learn/vs/${c.slug}` },
    openGraph: {
      title: `${c.metaTitle} · BACwater.ai`,
      description: c.metaDescription,
      url: `/learn/vs/${c.slug}`,
      type: "website",
      siteName: "BACwater.ai",
      images: [
        {
          url: `/learn/vs/${c.slug}/infographic.svg`,
          width: dims.width,
          height: dims.height,
          alt: `${c.title} infographic`,
        },
      ],
    },
  });
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
  const refs = c.sources.map(sourceReference);

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
        citations={refs}
        reviewed
      />
      <ArticleJsonLd
        title={c.title}
        body={[c.verdict, ...c.body.map((s) => `${s.h2}\n\n${s.p}`)].join("\n\n")}
        url={`${SITE_URL}/learn/vs/${c.slug}`}
        updatedAt={new Date("2026-09-21")}
        citations={refs}
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
      <ReviewedBy className="mt-2" />

      {/* Comparison table */}
      <div className="mt-8 overflow-x-auto border border-border" role="region" aria-label="Scrollable data table" tabIndex={0}>
        <table className="w-full text-sm responsive-comparison">
          <thead>
            <tr className="bg-surface text-left">
              <th scope="col" className="px-4 py-3 font-medium">Label detail</th>
              <th scope="col" className="px-4 py-3 font-medium">Bac water</th>
              <th scope="col" className="px-4 py-3 font-medium">{c.otherName}</th>
            </tr>
          </thead>
          <tbody>
            {c.table.map((row) => (
              <tr key={row.dimension} className="border-t border-border">
                <th scope="row" className="px-4 py-3 font-medium text-muted-foreground text-left">{row.dimension}</th>
                <td data-label="BAC water" className="px-4 py-3">{row.bac}</td>
                <td data-label={c.otherName} className="px-4 py-3">{row.other}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm"><a className="inline-flex min-h-11 items-center underline" href={`/learn/vs/${c.slug}/infographic.svg`} target="_blank" rel="noopener noreferrer">Open the printable comparison graphic</a></p>
      {c.slug === "saline" && <p className="mt-4"><Link className="underline" href="/learn/vs/sodium-chloride">Compare BAC water with bacteriostatic sodium chloride specifically</Link></p>}
      {["acetic-acid","reconstitution-solution"].includes(c.slug) && <aside className="mt-6 rounded-xl border bg-muted p-5"><h2 className="font-semibold">What the label must identify</h2><ul className="mt-3 list-disc space-y-2 pl-5"><li>The exact ingredients and their concentrations</li><li>The complete product name and intended use</li><li>Preservative status, container instructions and storage</li></ul><Link className="mt-3 inline-block underline" href="/learn/glossary#diluent">Look up diluent and formulation terms</Link></aside>}

      {/* Body sections */}
      <div className="mt-12 space-y-10">
        {c.body.map((s) => (
          <section key={s.h2}>
            <h2 className="text-2xl font-serif font-medium tracking-tight">
              {s.h2}
            </h2>
            <p className="mt-3 text-foreground/90 leading-relaxed">{s.p.replace("The earlier statement on this site that BAC water can always replace sterile water was incorrect.", "")}</p>
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
              className="group flex items-center justify-between border border-border p-4 hover:bg-muted transition-colors"
            >
              <span className="font-medium">{o.title}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10"><h2 className="text-xl font-serif">Read the next useful guide</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{[["/learn/bac-water-for-peptides","Compatibility and product instructions"],["/learn/bac-water-shelf-life","Storage and container dates"],["/learn/how-to-read-a-peptide-vial","Read amounts and concentrations"],["/learn/what-you-cannot-know","What calculations cannot verify"]].map(([href,label])=><Link className="rounded-xl border p-4" key={href} href={href}>{label}</Link>)}</div></section>

      {c.slug === "sterile-water" && <aside className="mt-8 rounded-xl border p-4 text-sm"><h2 className="font-semibold">Correction note</h2><p className="mt-2">The earlier statement on this site that BAC water can always replace sterile water was incorrect. The exact product instructions determine the vehicle.</p></aside>}
      <References references={refs} />

      {/* CTA */}
      <section className="mt-12 section-dark rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="font-medium text-foreground">
            Have the product instructions?
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Use the numbers from your instructions to check the math.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0"><Button asChild variant="brand"><Link href="/tools/bac-water">Calculate concentration <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </section>
    </div>
  );
}
