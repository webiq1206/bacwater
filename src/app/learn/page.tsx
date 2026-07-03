import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Lightbulb, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { getCatalogCached, type LearnEntry } from "@/lib/learn/catalog";
import {
  CONTENT_TYPES,
  TOPICS,
  CONTENT_TYPE_LABEL,
  TOPIC_LABEL,
  isContentType,
  isTopic,
} from "@/lib/learn/taxonomy";
import { PEPTIDES } from "@/lib/calc/peptides";
import { shortName } from "@/lib/peptides/page-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";

type SP = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim() ? s.trim() : undefined;
}

interface ActiveFilters {
  type?: string;
  topic?: string;
  peptide?: string;
  q?: string;
}

function parseFilters(sp: SP): ActiveFilters {
  const type = one(sp.type);
  const topic = one(sp.topic);
  const peptide = one(sp.peptide);
  const q = one(sp.q);
  return {
    type: type && isContentType(type) ? type : undefined,
    topic: topic && isTopic(topic) ? topic : undefined,
    peptide: peptide && PEPTIDES.some((p) => p.slug === peptide) ? peptide : undefined,
    q,
  };
}

function hrefWith(active: ActiveFilters, changes: Partial<ActiveFilters>): string {
  const merged = { ...active, ...changes };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
  const qs = params.toString();
  return qs ? `/learn?${qs}` : "/learn";
}

function applyFilters(catalog: LearnEntry[], f: ActiveFilters): LearnEntry[] {
  const q = f.q?.toLowerCase();
  return catalog.filter((e) => {
    if (f.type && e.contentType !== f.type) return false;
    if (f.topic && !e.topicTags.includes(f.topic as never)) return false;
    if (f.peptide && !e.peptideTags.includes(f.peptide)) return false;
    if (q && !`${e.title} ${e.excerpt}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

function singleDimension(f: ActiveFilters): keyof ActiveFilters | null {
  const active = (["type", "topic", "peptide"] as const).filter((k) => f[k]);
  if (f.q) return null; // search is always a narrow, noindex view
  if (active.length === 1) return active[0];
  return null;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const f = parseFilters(await searchParams);
  const activeCount = [f.type, f.topic, f.peptide, f.q].filter(Boolean).length;

  // No filters: the canonical hub.
  if (activeCount === 0) {
    return {
      title: "Peptide Reconstitution Guides & BAC Water Learning Center",
      description:
        "Filter beginner guides, comparisons, and FAQs on bac water, reconstitution, syringes, storage, and dosing. Written for first-timers.",
      alternates: { canonical: "/learn" },
      openGraph: {
        title: "Peptide Reconstitution Guides & BAC Water Learning Center",
        description:
          "Filter beginner guides, comparisons, and FAQs on bac water, reconstitution, syringes, storage, and dosing. Written for first-timers.",
        url: "/learn",
        type: "website",
        siteName: "BACwater.ai",
      },
    };
  }

  const single = singleDimension(f);

  // A single-dimension filter with enough results stays indexable and
  // canonicalizes to itself. Everything else (multi-filter combos, search,
  // or thin single filters) is noindexed and canonicalizes back to /learn.
  if (single) {
    const catalog = await getCatalogCached();
    const count = applyFilters(catalog, f).length;
    if (count >= 3) {
      const label =
        single === "type"
          ? CONTENT_TYPE_LABEL[f.type!]
          : single === "topic"
            ? TOPIC_LABEL[f.topic!]
            : shortName(
                PEPTIDES.find((p) => p.slug === f.peptide)?.name ?? f.peptide!
              );
      const canonical = hrefWith({}, { [single]: f[single] } as ActiveFilters);
      return {
        title: `${label} guides · BAC Water Learning Center`,
        description: `Bac water and reconstitution content filtered to ${label}. Guides, comparisons, and FAQs written for beginners.`,
        alternates: { canonical },
        openGraph: {
          title: `${label} guides · BAC Water Learning Center`,
          description: `Bac water and reconstitution content filtered to ${label}. Guides, comparisons, and FAQs written for beginners.`,
          url: canonical,
          type: "website",
          siteName: "BACwater.ai",
        },
      };
    }
  }

  return {
    title: "BAC Water Learning Center",
    description:
      "Filter beginner guides, comparisons, and FAQs on bac water and peptide reconstitution.",
    robots: { index: false, follow: true },
    alternates: { canonical: "/learn" },
  };
}

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const f = parseFilters(await searchParams);
  const catalog = await getCatalogCached();
  const results = applyFilters(catalog, f);
  const activeCount = [f.type, f.topic, f.peptide, f.q].filter(Boolean).length;

  const peptideOptions = PEPTIDES.filter((p) => p.slug !== "custom");

  // Determine schema URL/name/description — mirror the generateMetadata logic so
  // indexable filtered pages declare the correct URL in their structured data.
  const single = singleDimension(f);
  const isIndexableFilter = !!(single && results.length >= 3);

  let schemaUrl = `${SITE_URL}/learn`;
  let schemaName = "BAC Water Learning Center";
  let schemaDescription =
    "Filter beginner guides, comparisons, and FAQs on bac water and peptide reconstitution.";

  if (isIndexableFilter) {
    const label =
      single === "type"
        ? CONTENT_TYPE_LABEL[f.type!]
        : single === "topic"
          ? TOPIC_LABEL[f.topic!]
          : shortName(
              PEPTIDES.find((p) => p.slug === f.peptide)?.name ?? f.peptide!
            );
    const canonical = hrefWith({}, { [single!]: f[single!] } as ActiveFilters);
    schemaUrl = `${SITE_URL}${canonical}`;
    schemaName = `${label} guides · BAC Water Learning Center`;
    schemaDescription = `Bac water and reconstitution content filtered to ${label}. Guides, comparisons, and FAQs written for beginners.`;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
      <WebPageJsonLd
        name={schemaName}
        description={schemaDescription}
        url={schemaUrl}
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Learning Center", url: "/learn" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: schemaName,
            url: schemaUrl,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: results.slice(0, 30).map((e, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITE_URL}${e.url}`,
                name: e.title,
              })),
            },
          }),
        }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learning Center", href: "/learn" },
        ]}
      />
      <div className="max-w-3xl">
        <div className="eyebrow">Learning Center</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          BAC Water &amp; Peptide Reconstitution Guides
        </h1>
        <p className="mt-3 text-muted-foreground">
          Filter our BAC water and peptide reconstitution guides, comparisons,
          and FAQs by topic, content type, or peptide. Short, honest, written
          for beginners.
        </p>
      </div>

      {activeCount === 0 && (
        <div className="mt-8 callout-panel">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 accent-check mt-0.5 shrink-0" />
            <div>
              <div className="font-medium text-foreground">
                Not sure where to start?
              </div>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                First time? Start with{" "}
                <Link
                  href="/learn/what-is-bac-water"
                  className="text-foreground font-medium underline"
                >
                  &ldquo;What is BAC Water?&rdquo;
                </Link>{" "}
                then{" "}
                <Link
                  href="/learn/how-peptide-reconstitution-works"
                  className="text-foreground font-medium underline"
                >
                  &ldquo;How Reconstitution Works.&rdquo;
                </Link>{" "}
                Looking for a specific peptide? Browse our{" "}
                <Link
                  href="/peptides"
                  className="text-foreground font-medium underline"
                >
                  per-peptide guides
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="mt-8 space-y-5 border border-border bg-surface p-5 sm:p-6">
        <FilterRow label="Type">
          {CONTENT_TYPES.map((c) => (
            <Chip
              key={c.key}
              href={hrefWith(f, { type: f.type === c.key ? undefined : c.key })}
              active={f.type === c.key}
            >
              {c.label}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label="Topic">
          {TOPICS.map((t) => (
            <Chip
              key={t.key}
              href={hrefWith(f, { topic: f.topic === t.key ? undefined : t.key })}
              active={f.topic === t.key}
            >
              {t.label}
            </Chip>
          ))}
        </FilterRow>

        {/* Peptide + search: a GET form so the resulting URLs are real. */}
        <form method="get" action="/learn" className="flex flex-col sm:flex-row gap-3 pt-1">
          {f.type && <input type="hidden" name="type" value={f.type} />}
          {f.topic && <input type="hidden" name="topic" value={f.topic} />}
          <select
            name="peptide"
            defaultValue={f.peptide ?? ""}
            className="h-11 border border-input bg-background px-3 text-sm sm:w-64"
            aria-label="Filter by peptide"
          >
            <option value="">All peptides</option>
            {peptideOptions.map((p) => (
              <option key={p.slug} value={p.slug}>
                {shortName(p.name)}
              </option>
            ))}
          </select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              name="q"
              defaultValue={f.q ?? ""}
              placeholder="Search guides and FAQs"
              className="h-11 w-full border border-input bg-background pl-9 pr-3 text-sm"
              aria-label="Search"
            />
          </div>
          <Button type="submit" variant="brand" className="h-11">
            Filter
          </Button>
        </form>

        {activeCount > 0 && (
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-muted-foreground">
              {results.length} result{results.length === 1 ? "" : "s"}
            </div>
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </Link>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {results.map((e) => (
            <li key={e.id}>
              <Link
                href={e.url}
                className="group block border border-border hover:bg-surface transition-colors p-6 h-full"
              >
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                  {CONTENT_TYPE_LABEL[e.contentType] ?? e.contentType}
                </div>
                <h2 className="mt-1 text-lg font-semibold tracking-tight group-hover:underline">
                  {e.title}
                </h2>
                {e.excerpt && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {e.excerpt}
                  </p>
                )}
                <div
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
                  style={{ color: "var(--color-accent-guide)" }}
                >
                  Read <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 border border-border bg-surface p-8 text-center">
          <div className="font-medium text-foreground">No matches</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Try fewer filters or a different search.{" "}
            <Link href="/learn" className="text-foreground font-medium underline">
              Clear filters
            </Link>
            .
          </p>
        </div>
      )}

      <div className="mt-12 border border-border bg-surface p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="font-medium text-foreground">Done reading?</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Put what you learned into practice. The Plan Builder does the math for you.
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

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium sm:w-16 shrink-0">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "px-3 py-1.5 text-sm border-2 font-medium"
          : "px-3 py-1.5 text-sm border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
      }
      style={
        active
          ? {
              borderColor: "var(--color-accent-guide)",
              background: "var(--color-accent-guide-soft)",
              color: "var(--color-accent-guide)",
            }
          : undefined
      }
    >
      {children}
    </Link>
  );
}
