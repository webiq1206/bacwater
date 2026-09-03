import type { NextConfig } from "next";

/**
 * The canonical host, taken from the same variable the sitemaps and canonical
 * tags use so the three can never disagree. A leading "www." is stripped so a
 * misconfigured value can't produce a www -> www redirect loop.
 */
const APEX_HOST = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai"
).host.replace(/^www\./, "");

/** Escaped for the regex `has` matcher, so the dots are literal. */
const WWW_HOST_PATTERN = `www\\.${APEX_HOST.replace(/\./g, "\\.")}`;

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  serverExternalPackages: ["@prisma/client", "bcryptjs", "@react-pdf/renderer", "qrcode"],
  async redirects() {
    return [
      // Host consolidation. Google indexed https://www.bacwater.ai/tools/
      // syringe-units and set ITS OWN canonical to the www URL, overriding the
      // non-www canonical the page declares, while the apex URL we submit in
      // the sitemap sat at "Discovered - currently not indexed". Google also
      // holds a www crawl graph (www/tools/bac-water, www/privacy,
      // www/learn/how-peptide-reconstitution-works appear as referring URLs),
      // so the www host has been serving crawlable pages rather than
      // redirecting. Two hosts serving the same site splits crawl budget and
      // makes canonical tags advisory; a 308 makes the apex the only address.
      // See seo-audit/2026-09-gsc-query-and-index-audit.md (F2).
      //
      // First in the list so www lands on the apex in ONE hop; the path
      // redirects below then apply on the canonical host.
      {
        source: "/:path*",
        has: [{ type: "host", value: WWW_HOST_PATTERN }],
        destination: `https://${APEX_HOST}/:path*`,
        permanent: true,
      },
      {
        // Consolidated into the dedicated comparison page to avoid duplicate
        // content across two near-identical URLs.
        source: "/learn/bac-water-vs-sterile-water",
        destination: "/learn/vs/sterile-water",
        permanent: true,
      },
      {
        // DB guide duplicated the static shelf-life editorial at
        // /learn/bac-water-shelf-life. Redirect consolidates link equity and
        // prevents keyword cannibalization on storage/shelf-life searches.
        source: "/learn/how-long-bac-water-lasts",
        destination: "/learn/bac-water-shelf-life",
        permanent: true,
      },
      // Legacy/compat paths: permanent (308) redirects so link equity
      // consolidates and crawlers see a clean redirect (not a render-time 307).
      { source: "/plan/advanced", destination: "/plan", permanent: true },
      {
        source: "/tools/ml-to-units",
        destination: "/tools/syringe-units",
        permanent: true,
      },
      // The all-in-one calculator was promoted to the keyword-exact flagship
      // /peptide-calculator (targets the "peptide calculator" head term). Done
      // pre-indexation, so no equity is lost. 301 the old path to consolidate.
      {
        source: "/tools/reconstitution",
        destination: "/peptide-calculator",
        permanent: true,
      },
      // Store removed (PRD v3 §5/§14.1). 301 the commerce URLs to the closest
      // reference or calculator rather than 404ing them.
      { source: "/shop", destination: "/tools", permanent: true },
      { source: "/shop/:path*", destination: "/tools", permanent: true },
      { source: "/buy", destination: "/tools/bac-water", permanent: true },
      { source: "/cart", destination: "/plan", permanent: true },
      { source: "/checkout", destination: "/plan", permanent: true },
      { source: "/checkout/:path*", destination: "/plan", permanent: true },
      { source: "/shipping-returns", destination: "/", permanent: true },
      // NOTE: /learn/where-to-buy-bacteriostatic-water is deliberately NOT
      // redirected. It was 301'd here on 2026-07-15 when the store was removed,
      // which also threw away the site's second-strongest page (235 impressions
      // in 21 days at ~position 35) and the whole buy-intent cluster behind it
      // ("near me", "at Walgreens", "over the counter"). The store is still
      // gone; the page is back as an editorial sourcing guide that names no
      // vendor. See src/app/learn/where-to-buy-bacteriostatic-water/page.tsx.
      // Per-vial-size pages (e.g. /peptides/bpc-157/5mg) were keyword-swapped
      // doorway variants that also asserted a "typical dose" (PRD §9.1.5).
      // Consolidate them into the compound page and redirect (PRD §9.11). The
      // param is constrained to size-like slugs (e.g. "5mg", "2.5mg") so it does
      // not swallow sibling routes like /peptides/:slug/chart.svg.
      {
        source: "/peptides/:slug/:size([\\d.]+mg)",
        destination: "/peptides/:slug",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://pagead2.googlesyndication.com https://*.googlesyndication.com https://adservice.google.com https://*.googleadservices.com https://partner.googleadservices.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net; frame-ancestors 'none'" },
        ],
      },
    ];
  },
};

export default nextConfig;
