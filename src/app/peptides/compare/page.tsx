import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PEPTIDES, evidenceOf } from "@/lib/calc/peptides";
import type { PeptideRef } from "@/lib/calc/peptides";
import { PEPTIDE_CONTENT } from "@/lib/peptides/content";
import { shortName } from "@/lib/peptides/page-data";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { Callout } from "@/components/common/callout";
import { CompareSelector } from "@/components/peptides/compare-selector";

const REAL = PEPTIDES.filter((p) => p.slug !== "custom");
const DEFAULT_A = "bpc-157";
const DEFAULT_B = "tb-500";

const CATEGORY_WORD: Record<string, string> = {
  metabolic: "Metabolic",
  healing: "Healing and recovery",
  growth: "Growth hormone",
  cosmetic: "Cosmetic and skin",
  cognitive: "Cognitive",
  reproductive: "Reproductive",
  longevity: "Longevity",
  other: "Other",
};

/** Format a research-studied amount range, using mg once amounts get large. */
function fmtRange([lo, hi]: [number, number]): string {
  const fmt = (mcg: number) =>
    mcg >= 1000
      ? `${(mcg / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} mg`
      : `${mcg.toLocaleString()} mcg`;
  return `${fmt(lo)} to ${fmt(hi)}`;
}

function pick(slug: string | undefined, fallback: string): PeptideRef {
  return REAL.find((p) => p.slug === slug) ?? REAL.find((p) => p.slug === fallback)!;
}

type SP = Record<string, string | string[] | undefined>;
function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const a = pick(one(sp.a), DEFAULT_A);
  const b = pick(one(sp.b), DEFAULT_B);
  const title = `${shortName(a.name)} vs ${shortName(b.name)}: reconstitution and reference`;
  const description = `Compare ${shortName(a.name)} and ${shortName(b.name)} side by side: what each is, common vial sizes, refrigerated shelf life, amounts studied in research, and what is not known.`;
  return {
    title,
    description,
    alternates: { canonical: "/peptides/compare" },
    openGraph: { title, description, url: "/peptides/compare", type: "website", siteName: "BACwater.ai" },
  };
}

function whatNobodyKnows(p: PeptideRef): string {
  return evidenceOf(p) === "fda-approved"
    ? "Approved as a medicine, so its approved product has official labeling. An unapproved research powder sold under the same name carries no assurance of identity, purity, or strength."
    : "Whether it is safe in people, what it does over the long term, and what is actually in a given research vial: identity, purity, and strength.";
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const a = pick(one(sp.a), DEFAULT_A);
  const b = pick(one(sp.b), DEFAULT_B);
  const options = REAL.map((p) => ({ slug: p.slug, name: shortName(p.name) }));

  const rows: { label: string; a: React.ReactNode; b: React.ReactNode }[] = [
    {
      label: "What it is",
      a: PEPTIDE_CONTENT[a.slug]?.what ?? "A research compound.",
      b: PEPTIDE_CONTENT[b.slug]?.what ?? "A research compound.",
    },
    {
      label: "Category",
      a: CATEGORY_WORD[a.category] ?? a.category,
      b: CATEGORY_WORD[b.category] ?? b.category,
    },
    {
      label: "Evidence",
      a: evidenceOf(a) === "fda-approved" ? "FDA-approved molecule" : "Research use: limited or no human data",
      b: evidenceOf(b) === "fda-approved" ? "FDA-approved molecule" : "Research use: limited or no human data",
    },
    {
      label: "Common vial sizes",
      a: `${a.commonVialStrengthsMg.join(", ")} mg`,
      b: `${b.commonVialStrengthsMg.join(", ")} mg`,
    },
    {
      label: "Amounts studied in research",
      a: fmtRange(a.typicalDoseMcgRange),
      b: fmtRange(b.typicalDoseMcgRange),
    },
    {
      label: "Shelf life once mixed",
      a: `${a.refrigeratedShelfDays} days refrigerated`,
      b: `${b.refrigeratedShelfDays} days refrigerated`,
    },
    {
      label: "Storage note",
      a: a.storageNote,
      b: b.storageNote,
    },
    {
      label: "What nobody knows",
      a: whatNobodyKnows(a),
      b: whatNobodyKnows(b),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
      <WebPageJsonLd
        name={`${shortName(a.name)} vs ${shortName(b.name)}`}
        description={`Side-by-side comparison of ${shortName(a.name)} and ${shortName(b.name)} reconstitution and reference facts.`}
        url="/peptides/compare"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Peptides", url: "/peptides" },
          { name: "Compare", url: "/peptides/compare" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Peptides", href: "/peptides" },
          { label: "Compare", href: "/peptides/compare" },
        ]}
      />

      <div className="max-w-3xl">
        <div className="eyebrow">Compare</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          {shortName(a.name)} vs {shortName(b.name)}
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          The facts side by side: what each compound is, how it is stored, what
          amounts research used, and what no one can tell you. This compares
          reference facts, it does not recommend one over another.
        </p>
      </div>

      <div className="mt-8">
        <CompareSelector options={options} a={a.slug} b={b.slug} />
      </div>

      {/* Comparison table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-40 sm:w-48 border-b border-border p-3 text-left align-bottom text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Reference fact
              </th>
              {[a, b].map((p) => (
                <th key={p.slug} className="border-b border-border p-3 text-left align-bottom">
                  <Link
                    href={`/peptides/${p.slug}`}
                    className="font-serif text-lg tracking-tight hover:underline"
                  >
                    {shortName(p.name)}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="align-top">
                <th
                  scope="row"
                  className="border-b border-border p-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-medium"
                >
                  {row.label}
                </th>
                <td className="border-b border-border p-3 leading-relaxed text-foreground/90">
                  {row.a}
                </td>
                <td className="border-b border-border p-3 leading-relaxed text-foreground/90">
                  {row.b}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout variant="note" className="mt-6" title="Amounts studied are not recommendations">
        The &ldquo;amounts studied&rdquo; row reports the range that appears in
        research on each compound. It is context, not a suggested amount, and an
        amount studied in animals does not translate to a person.{" "}
        <Link href="/learn/what-you-cannot-know" className="font-medium underline underline-offset-4">
          What no calculation can verify.
        </Link>
      </Callout>

      {/* Build-a-plan CTAs for each side */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {[a, b].map((p) => (
          <Link
            key={p.slug}
            href={`/peptides/${p.slug}`}
            className="group flex items-center justify-between border border-border p-4 hover:bg-muted transition-colors"
          >
            <span className="font-medium">Open {shortName(p.name)} calculator</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}
