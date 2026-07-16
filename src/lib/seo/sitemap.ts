/**
 * Shared helpers for the segmented XML sitemaps.
 *
 * The site publishes a sitemap index at /sitemap.xml that points at
 * per-type segment files (/sitemap-pages.xml, /sitemap-peptides.xml,
 * /sitemap-learn.xml). Segmenting makes indexing problems in one content
 * type easy to spot in Search Console.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";

export type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapUrl {
  path: string;
  lastModified?: Date;
  changeFrequency?: ChangeFreq;
  priority?: number;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function urlsetXml(urls: SitemapUrl[]): string {
  const body = urls
    .map((u) => {
      const loc = escapeXml(`${SITE_URL}${u.path}`);
      const lm = u.lastModified
        ? `<lastmod>${u.lastModified.toISOString()}</lastmod>`
        : "";
      const cf = u.changeFrequency
        ? `<changefreq>${u.changeFrequency}</changefreq>`
        : "";
      const pr =
        u.priority != null ? `<priority>${u.priority.toFixed(1)}</priority>` : "";
      return `<url><loc>${loc}</loc>${lm}${cf}${pr}</url>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

export function sitemapIndexXml(paths: string[]): string {
  const body = paths
    .map(
      (p) =>
        `<sitemap><loc>${escapeXml(`${SITE_URL}${p}`)}</loc></sitemap>`
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

/** Static, hand-maintained pages (everything not driven by the database). */
export const STATIC_PAGES: SitemapUrl[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/peptide-calculator", changeFrequency: "weekly", priority: 1.0 },
  { path: "/plan", changeFrequency: "weekly", priority: 0.9 },
  { path: "/plan/new", changeFrequency: "weekly", priority: 0.9 },
  { path: "/peptides", changeFrequency: "weekly", priority: 0.9 },
  { path: "/learn", changeFrequency: "weekly", priority: 0.8 },
  { path: "/faq", changeFrequency: "weekly", priority: 0.7 },
  { path: "/tools", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/bac-water", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/dose", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/syringe-units", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/mg-to-mcg", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/supplies", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/reverse-bac", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/vial-labels", changeFrequency: "monthly", priority: 0.7 },
  { path: "/learn/glossary", changeFrequency: "monthly", priority: 0.6 },
  { path: "/learn/bac-water-shelf-life", changeFrequency: "monthly", priority: 0.7 },
  { path: "/learn/bac-water-for-peptides", changeFrequency: "monthly", priority: 0.8 },
  { path: "/learn/what-you-cannot-know", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/editorial-policy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
];

/** Segment files referenced by the sitemap index. */
export const SITEMAP_SEGMENTS = [
  "/sitemap-pages.xml",
  "/sitemap-peptides.xml",
  "/sitemap-learn.xml",
];
