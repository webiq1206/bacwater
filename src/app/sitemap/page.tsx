import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { STATIC_PAGES } from "@/lib/seo/sitemap";
import { PEPTIDES } from "@/lib/calc/peptides";
import { COMPARISONS } from "@/lib/comparisons/content";
import { getCatalog } from "@/lib/learn/catalog";
import { CONTENT_TYPES, TOPICS } from "@/lib/learn/taxonomy";

// Hourly, matching the XML sitemap segments, since this page is derived from
// the same code-defined and database-backed sources.
export const revalidate = 3600;

const TITLE = "Site Map: Every Calculator, Peptide and Guide";
const DESCRIPTION =
  "A complete, browsable map of BACwater.ai — every reconstitution calculator, peptide reference, comparison and learning guide, linked from one page.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/sitemap" },
  // Explicitly indexable: this is a real content page and a crawl hub, not a
  // funnel or private route.
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/sitemap",
    type: "website",
    siteName: "BACwater.ai",
  },
};

/**
 * Human-readable labels for the code-defined static routes. Anything not named
 * here falls back to a title-cased version of its slug, so a newly added static
 * page still renders a sensible link rather than being dropped.
 */
const LABELS: Record<string, string> = {
  "": "Home",
  "/peptide-calculator": "Peptide Calculator",
  "/plan": "Plan Builder",
  "/plan/new": "Guided Plan Builder",
  "/tools": "All calculators",
  "/tools/bac-water": "BAC Water Calculator",
  "/tools/reverse-bac": "Reverse BAC Water Calculator",
  "/tools/dose": "Peptide Dose Calculator",
  "/tools/syringe-units": "Syringe Units Converter",
  "/tools/mg-to-mcg": "mg to mcg Converter",
  "/tools/supplies": "Peptide Supply Calculator",
  "/tools/vial-labels": "Vial Labels",
  "/peptides": "Peptide reference (all compounds)",
  "/peptides/compare": "Compare peptides side by side",
  "/learn": "Learning Center",
  "/learn/glossary": "Glossary",
  "/learn/bac-water-shelf-life": "Shelf life & storage",
  "/learn/where-to-buy-bacteriostatic-water": "Where to buy bacteriostatic water",
  "/learn/bac-water-for-peptides": "BAC water for peptides",
  "/learn/what-you-cannot-know": "What you cannot know",
  "/faq": "FAQ",
  "/about": "About",
  "/contact": "Contact",
  "/editorial-policy": "Editorial & Sourcing Policy",
  "/terms": "Terms",
  "/privacy": "Privacy",
  "/disclaimer": "Disclaimer",
};

function labelFor(path: string): string {
  if (LABELS[path] !== undefined) return LABELS[path];
  return path
    .replace(/^\//, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

type SiteLink = { href: string; label: string };

/**
 * Sort every static page into exactly one bucket by path, with a catch-all so
 * nothing is ever silently dropped. Keeping this derived from STATIC_PAGES
 * (the same source the XML sitemap uses) is what stops the HTML and XML maps
 * from drifting apart.
 */
function bucketOf(path: string): "tools" | "learn" | "company" {
  if (
    path === "" ||
    path === "/peptide-calculator" ||
    path.startsWith("/plan") ||
    path.startsWith("/tools") ||
    path === "/peptides" ||
    path === "/peptides/compare"
  )
    return "tools";
  if (path.startsWith("/learn")) return "learn";
  return "company";
}

export default async function HtmlSitemapPage() {
  const staticByBucket = { tools: [] as SiteLink[], learn: [] as SiteLink[], company: [] as SiteLink[] };
  for (const p of STATIC_PAGES) {
    staticByBucket[bucketOf(p.path)].push({
      href: p.path === "" ? "/" : p.path,
      label: labelFor(p.path),
    });
  }

  const peptideLinks: SiteLink[] = PEPTIDES.map((p) => ({
    href: `/peptides/${p.slug}`,
    label: p.name,
  }));

  const comparisonLinks: SiteLink[] = COMPARISONS.map((c) => ({
    href: `/learn/vs/${c.slug}`,
    label: c.title,
  }));

  // Learn articles come from the same catalog the /learn index and the learn
  // XML sitemap use. Restrict to database-backed guides so per-peptide and
  // comparison entries (already linked in their own sections) are not repeated.
  const catalog = await getCatalog().catch(() => []);
  const guideLinks: SiteLink[] = catalog
    .filter((e) => e.source === "db")
    .map((e) => ({ href: e.url, label: e.title }));

  // Single-dimension /learn filter views that clear the indexability threshold
  // (>= 3 results) — the same rule the learn XML sitemap applies. Linking them
  // here gives each one a crawl path from a real page, not only the XML file.
  const filterLinks: SiteLink[] = [];
  for (const c of CONTENT_TYPES) {
    if (catalog.filter((e) => e.contentType === c.key).length >= 3)
      filterLinks.push({ href: `/learn?type=${c.key}`, label: `${c.label} articles` });
  }
  for (const t of TOPICS) {
    if (catalog.filter((e) => e.topicTags.includes(t.key)).length >= 3)
      filterLinks.push({ href: `/learn?topic=${t.key}`, label: t.label });
  }

  // Assemble sections in reading order, then dedupe hrefs across the whole page
  // so an overlap between sources can never produce two links to one URL.
  const sections: { heading: string; links: SiteLink[] }[] = [
    { heading: "Calculators & tools", links: staticByBucket.tools },
    { heading: "Peptide reference", links: peptideLinks },
    { heading: "Learning Center", links: [...staticByBucket.learn, ...guideLinks] },
    { heading: "Compare bacteriostatic water", links: comparisonLinks },
    { heading: "Browse Learn by topic", links: filterLinks },
    { heading: "Company & policies", links: staticByBucket.company },
  ];

  const seen = new Set<string>();
  const deduped = sections
    .map((s) => ({
      heading: s.heading,
      links: s.links.filter((l) => (seen.has(l.href) ? false : (seen.add(l.href), true))),
    }))
    .filter((s) => s.links.length > 0);

  const total = deduped.reduce((n, s) => n + s.links.length, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-14 pb-24 sm:pb-32">
      <WebPageJsonLd name={TITLE} description={DESCRIPTION} url="/sitemap" />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Site map", href: "/sitemap" },
        ]}
      />

      <div className="eyebrow">Site map</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        Everything on BACwater.ai
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Every calculator, peptide reference, comparison and guide on the site,
        linked from one page. Looking for the machine-readable version? It lives
        at{" "}
        <a
          href="/sitemap.xml"
          className="text-foreground font-medium underline"
        >
          /sitemap.xml
        </a>
        .
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{total} pages.</p>

      <div className="mt-12 space-y-12">
        {deduped.map((section) => (
          <section key={section.heading}>
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {section.heading}
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {section.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
