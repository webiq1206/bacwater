import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  return {
    rules: [
      // Only disallow truly private/functional paths. Pages that should stay
      // out of the index (cart, checkout, plans, auth, plan edit/label) carry a
      // `noindex` meta instead and must remain crawlable so Google can honor it.
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/plan/*/pdf"] },
      // AI answer-engine crawlers (GEO): explicitly allowed so the site is
      // eligible for citation in ChatGPT, Claude, Perplexity, Google AI
      // Overviews, and Apple Intelligence.
      { userAgent: "GPTBot", allow: "/", disallow: ["/admin", "/api", "/plan/*/pdf"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/admin", "/api", "/plan/*/pdf"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin", "/api", "/plan/*/pdf"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/admin", "/api", "/plan/*/pdf"] },
      { userAgent: "Google-Extended", allow: "/", disallow: ["/admin", "/api", "/plan/*/pdf"] },
      { userAgent: "Applebot-Extended", allow: "/", disallow: ["/admin", "/api", "/plan/*/pdf"] },
      { userAgent: "CCBot", allow: "/", disallow: ["/admin", "/api", "/plan/*/pdf"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
