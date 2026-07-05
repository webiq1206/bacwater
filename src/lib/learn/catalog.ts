/**
 * Unified Learn content catalog.
 *
 * Merges three sources into one normalized, tagged list:
 *   1. Database content blocks (guides + FAQs), tagged via DB_TAGS below.
 *   2. Derived per-peptide guide entries (the /peptides/[slug] cluster).
 *   3. Derived comparison entries (the /learn/vs/[topic] cluster).
 *
 * This single catalog powers the filterable /learn index, the /api/related
 * recommendation endpoint, and every contextual "related reading" panel, so
 * relevance is driven by the tag system rather than hardcoded per page.
 */

import { cache } from "react";
import { prisma } from "@/lib/db";
import { PEPTIDES } from "@/lib/calc/peptides";
import { PEPTIDE_CONTENT } from "@/lib/peptides/content";
import { shortName } from "@/lib/peptides/page-data";
import { COMPARISONS } from "@/lib/comparisons/content";
import type { ContentType, Topic } from "@/lib/learn/taxonomy";

export interface LearnEntry {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  contentType: ContentType;
  peptideTags: string[];
  topicTags: Topic[];
  source: "db" | "peptide" | "comparison" | "page";
}

interface Tagging {
  contentType: ContentType;
  peptideTags?: string[];
  topicTags: Topic[];
}

/** Structured tags for the seeded DB content, keyed by slug. */
const DB_TAGS: Record<string, Tagging> = {
  "what-is-bac-water": {
    contentType: "guide",
    topicTags: ["ingredients", "reconstitution-method"],
  },
  "how-peptide-reconstitution-works": {
    contentType: "guide",
    topicTags: ["reconstitution-method"],
  },
  "how-to-read-a-peptide-vial": {
    contentType: "guide",
    topicTags: ["reconstitution-method", "dosage"],
  },
  "how-to-use-an-insulin-syringe": {
    contentType: "guide",
    topicTags: ["injection-supplies", "reconstitution-method"],
  },
  "what-syringe-units-mean": {
    contentType: "guide",
    topicTags: ["injection-supplies", "dosage"],
  },
  "how-to-store-reconstituted-peptides": {
    contentType: "safety",
    topicTags: ["storage", "safety"],
  },
  "how-long-bac-water-lasts": {
    contentType: "guide",
    topicTags: ["storage"],
  },
  "common-mistakes-to-avoid": {
    contentType: "safety",
    topicTags: ["safety", "reconstitution-method"],
  },
  "how-to-reconstitute-bpc-157": {
    contentType: "peptide-guide",
    peptideTags: ["bpc-157"],
    topicTags: ["reconstitution-method", "dosage"],
  },
  "how-to-reconstitute-tirzepatide": {
    contentType: "peptide-guide",
    peptideTags: ["tirzepatide"],
    topicTags: ["reconstitution-method", "dosage"],
  },
  "how-to-reconstitute-semaglutide": {
    contentType: "peptide-guide",
    peptideTags: ["semaglutide"],
    topicTags: ["reconstitution-method", "dosage"],
  },
  "how-to-read-an-insulin-syringe": {
    contentType: "guide",
    topicTags: ["injection-supplies"],
  },
  "insulin-syringe-sizes": {
    contentType: "guide",
    topicTags: ["injection-supplies"],
  },
  "too-much-bac-water": {
    contentType: "safety",
    topicTags: ["dosage", "safety", "reconstitution-method"],
  },
  "peptide-reconstitution-chart": {
    contentType: "guide",
    topicTags: ["dosage", "reconstitution-method"],
  },
  "faq-general": { contentType: "faq", topicTags: ["reconstitution-method"] },
  "faq-bac-water-amount": {
    contentType: "faq",
    topicTags: ["dosage", "reconstitution-method"],
  },
  "faq-can-you-reuse-bac-water": {
    contentType: "faq",
    topicTags: ["storage"],
  },
  "faq-peptide-storage-temperature": {
    contentType: "faq",
    topicTags: ["storage"],
  },
  "faq-syringe-size-choice": {
    contentType: "faq",
    topicTags: ["injection-supplies"],
  },
  "faq-peptide-cloudy-solution": {
    contentType: "faq",
    topicTags: ["safety", "reconstitution-method"],
  },
  "faq-bac-water-allergy": {
    contentType: "faq",
    topicTags: ["ingredients", "safety"],
  },
  "faq-mixing-multiple-peptides": {
    contentType: "faq",
    topicTags: ["reconstitution-method", "dosage"],
  },
  "faq-drawing-air-bubbles": {
    contentType: "faq",
    topicTags: ["injection-supplies", "reconstitution-method"],
  },
  "faq-reconstituted-peptide-travel": {
    contentType: "faq",
    topicTags: ["storage"],
  },
  "faq-expiration-after-reconstitution": {
    contentType: "faq",
    topicTags: ["storage"],
  },
};

/** DB slugs that now redirect elsewhere and must not appear in the catalog. */
const REDIRECTED = new Set(["bac-water-vs-sterile-water", "how-long-bac-water-lasts"]);

function inferTagging(slug: string, kind: string): Tagging {
  // Fallback for content added later without an explicit mapping.
  const peptide = PEPTIDES.find(
    (p) => p.slug !== "custom" && slug.includes(p.slug)
  );
  const topicTags: Topic[] = [];
  if (/storage|expire|shelf|fridge|refriger/i.test(slug)) topicTags.push("storage");
  if (/dose|dosage|amount|mg|mcg/i.test(slug)) topicTags.push("dosage");
  if (/syringe|needle|unit/i.test(slug)) topicTags.push("injection-supplies");
  if (/buy|shop|order|shipping/i.test(slug)) topicTags.push("where-to-buy");
  if (topicTags.length === 0) topicTags.push("reconstitution-method");
  return {
    contentType: kind === "faq" ? "faq" : peptide ? "peptide-guide" : "guide",
    peptideTags: peptide ? [peptide.slug] : [],
    topicTags,
  };
}

function excerptFrom(body: string): string {
  return body
    .replace(/[*_#`|>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

/** Static (non-DB) pages that belong in the catalog for surfacing. */
const STATIC_ENTRIES: LearnEntry[] = [
  {
    id: "page-buy",
    url: "/buy",
    title: "Where to buy bacteriostatic water",
    excerpt:
      "Buy sealed, research-grade bac water and reconstitution supplies with fast US shipping.",
    contentType: "buying-guide",
    peptideTags: [],
    topicTags: ["where-to-buy", "injection-supplies"],
    source: "page",
  },
  {
    id: "page-where-to-buy",
    url: "/learn/where-to-buy-bacteriostatic-water",
    title: "Where to buy bacteriostatic water (2026 buyer's guide)",
    excerpt:
      "What to check before you buy bac water: sealed, sterile, preservative stated, US shipping, and clear returns.",
    contentType: "buying-guide",
    peptideTags: [],
    topicTags: ["where-to-buy"],
    source: "page",
  },
  {
    id: "page-shelf-life",
    url: "/learn/bac-water-shelf-life",
    title: "BAC water and peptide shelf life",
    excerpt:
      "How long reconstituted peptides and opened bac water last, why refrigeration and clean technique both matter, and when to discard a vial.",
    contentType: "safety",
    peptideTags: [],
    topicTags: ["storage", "safety"],
    source: "page",
  },
  {
    id: "page-glossary",
    url: "/learn/glossary",
    title: "Peptide reconstitution glossary",
    excerpt:
      "Plain-English definitions of BAC water, benzyl alcohol, reconstitution, lyophilization, U-100, and more.",
    contentType: "guide",
    peptideTags: [],
    topicTags: ["ingredients", "reconstitution-method"],
    source: "page",
  },
  {
    id: "page-vial-labels",
    url: "/tools/vial-labels",
    title: "Free printable peptide vial labels",
    excerpt:
      "Generate printable vial labels with a QR code showing strength, concentration, dose, mix date, and discard date.",
    contentType: "guide",
    peptideTags: [],
    topicTags: ["injection-supplies", "reconstitution-method"],
    source: "page",
  },
];

export async function getCatalog(): Promise<LearnEntry[]> {
  // Exclude FAQ content blocks from the catalog: their canonical URL is /faq,
  // not /learn/faq-*, so surfacing them here would create duplicate-indexation
  // signals. They remain accessible at /learn/[slug] with noindex for deep links.
  const blocks = await prisma.contentBlock
    .findMany({
      where: { published: true, kind: "guide" },
      select: { id: true, slug: true, kind: true, title: true, body: true },
    })
    .catch(
      () =>
        [] as {
          id: string;
          slug: string;
          kind: string;
          title: string;
          body: string;
        }[]
    );

  const dbEntries: LearnEntry[] = blocks
    .filter((b) => !REDIRECTED.has(b.slug))
    .map((b) => {
      const t = DB_TAGS[b.slug] ?? inferTagging(b.slug, b.kind);
      return {
        id: `db-${b.slug}`,
        url: `/learn/${b.slug}`,
        title: b.title,
        excerpt: excerptFrom(b.body),
        contentType: t.contentType,
        peptideTags: t.peptideTags ?? [],
        topicTags: t.topicTags,
        source: "db" as const,
      };
    });

  const peptideEntries: LearnEntry[] = PEPTIDES.map((p) => {
    const short = shortName(p.name);
    const isCustom = p.slug === "custom";
    return {
      id: `peptide-${p.slug}`,
      url: `/peptides/${p.slug}`,
      title: `${short} bac water calculator & guide`,
      excerpt: PEPTIDE_CONTENT[p.slug]?.what ?? "",
      contentType: "peptide-guide" as const,
      peptideTags: isCustom ? [] : [p.slug],
      topicTags: isCustom
        ? (["reconstitution-method"] as Topic[])
        : (["dosage", "reconstitution-method", "storage"] as Topic[]),
      source: "peptide" as const,
    };
  });

  const comparisonEntries: LearnEntry[] = COMPARISONS.map((c) => ({
    id: `vs-${c.slug}`,
    url: `/learn/vs/${c.slug}`,
    title: c.title,
    excerpt: c.metaDescription,
    contentType: "comparison" as const,
    peptideTags: [],
    topicTags: ["ingredients", "reconstitution-method"] as Topic[],
    source: "comparison" as const,
  }));

  return [
    ...peptideEntries,
    ...comparisonEntries,
    ...dbEntries,
    ...STATIC_ENTRIES,
  ];
}

/** Request-memoized catalog so a page and its generateMetadata share one query. */
export const getCatalogCached = cache(getCatalog);

export interface RelatedQuery {
  peptide?: string;
  topics?: Topic[];
  types?: ContentType[];
  excludeUrl?: string;
  limit?: number;
}

/** Fixed generic fallback used whenever there is no usable signal. */
function genericFallback(entries: LearnEntry[], limit: number): LearnEntry[] {
  const preferred = [
    "/learn/what-is-bac-water",
    "/learn/how-peptide-reconstitution-works",
    "/learn/how-to-store-reconstituted-peptides",
    "/learn/vs/sterile-water",
    "/tools/bac-water",
  ];
  const picks = preferred
    .map((u) => entries.find((e) => e.url === u))
    .filter((e): e is LearnEntry => Boolean(e));
  if (picks.length >= limit) return picks.slice(0, limit);
  const rest = entries.filter((e) => !picks.includes(e));
  return [...picks, ...rest].slice(0, limit);
}

/**
 * Score catalog entries against the user's current signal and return the top
 * matches. Falls back to a fixed generic set when there is no signal.
 */
export function relatedContent(
  entries: LearnEntry[],
  { peptide, topics = [], types = [], excludeUrl, limit = 4 }: RelatedQuery
): LearnEntry[] {
  const hasSignal = Boolean(peptide) || topics.length > 0 || types.length > 0;
  const pool = entries.filter((e) => e.url !== excludeUrl);

  if (!hasSignal) return genericFallback(pool, limit);

  const scored = pool
    .map((e) => {
      let score = 0;
      if (peptide && e.peptideTags.includes(peptide)) score += 5;
      for (const t of topics) if (e.topicTags.includes(t)) score += 2;
      for (const ty of types) if (e.contentType === ty) score += 3;
      // Small nudge so peptide-tagged content ranks above generic when a
      // peptide signal is present.
      if (peptide && e.peptideTags.length > 0) score += 1;
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, limit).map((x) => x.e);
  if (top.length >= limit) return top;
  // Top up with generic fallback without duplicates.
  const extra = genericFallback(pool, limit).filter(
    (e) => !top.some((t) => t.url === e.url)
  );
  return [...top, ...extra].slice(0, limit);
}
