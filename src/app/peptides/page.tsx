import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PEPTIDES } from "@/lib/calc/peptides";
import type { PeptideCategory } from "@/lib/calc/peptides";
import { PEPTIDE_CONTENT } from "@/lib/peptides/content";
import { shortName } from "@/lib/peptides/page-data";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Peptide BAC Water Calculators & Reconstitution Guides",
  description:
    "Per-peptide bac water calculators and reconstitution guides. Exact water amounts, syringe units, storage, and shelf life for every peptide we carry.",
  alternates: { canonical: "/peptides" },
  openGraph: {
    title: "Peptide BAC Water Calculators & Reconstitution Guides",
    description:
      "Per-peptide bac water calculators and reconstitution guides. Exact water amounts, syringe units, storage, and shelf life for every peptide we carry.",
    url: "/peptides",
    type: "website",
    siteName: "BACwater.ai",
  },
};

const CATEGORY_ORDER: { key: PeptideCategory; label: string }[] = [
  { key: "metabolic", label: "Metabolic & GLP-1" },
  { key: "healing", label: "Healing & recovery" },
  { key: "growth", label: "Growth hormone secretagogues" },
  { key: "cosmetic", label: "Cosmetic & skin" },
  { key: "cognitive", label: "Cognitive" },
  { key: "reproductive", label: "Reproductive" },
  { key: "longevity", label: "Longevity" },
  { key: "other", label: "Any other peptide" },
];

export default function PeptidesHubPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Peptide BAC Water Calculators & Reconstitution Guides"
        description="Per-peptide bac water calculators and reconstitution guides for every peptide we carry."
        url="/peptides"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Peptides", url: "/peptides" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Peptide BAC Water Calculators & Reconstitution Guides",
            url: `${siteUrl}/peptides`,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: PEPTIDES.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${siteUrl}/peptides/${p.slug}`,
                name: shortName(p.name),
              })),
            },
          }),
        }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Peptides", href: "/peptides" },
        ]}
      />
      <div className="max-w-3xl">
        <div className="eyebrow">Peptide guides</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          Bac water calculators for every peptide
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Pick your peptide for an exact bac water amount, the syringe units for
          a typical dose, storage guidance, and shelf life. Every calculator
          uses the same deterministic, tested math as our{" "}
          <Link href="/plan" className="text-foreground font-medium underline">
            Plan Builder
          </Link>
          .
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {CATEGORY_ORDER.map(({ key, label }) => {
          const items = PEPTIDES.filter((p) => p.category === key);
          if (items.length === 0) return null;
          return (
            <section key={key}>
              <h2 className="text-sm uppercase tracking-wide text-muted-foreground font-medium">
                {label}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {items.map((p) => {
                  const short = shortName(p.name);
                  const blurb = PEPTIDE_CONTENT[p.slug]?.what ?? "";
                  return (
                    <Link
                      key={p.slug}
                      href={`/peptides/${p.slug}`}
                      className="group block border border-border p-5 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{short}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      {blurb && (
                        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                          {blurb}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-14 border border-border bg-surface p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="font-medium text-foreground">
            Not sure which peptide you have?
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            The Plan Builder walks you through it and does all the math for you.
          </p>
        </div>
        <Button asChild variant="brand" className="shrink-0">
          <Link href="/plan">
            Build my plan <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
