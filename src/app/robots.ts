import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/plans", "/plan/*/edit", "/plan/*/pdf", "/plan/*/label", "/cart", "/checkout", "/signin", "/signup"] },
      // AI answer-engine crawlers (GEO): explicitly allowed so the site is
      // eligible for citation in ChatGPT, Claude, Perplexity, Google AI
      // Overviews, and Apple Intelligence.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
