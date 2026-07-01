import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/plans", "/plan/*/edit", "/plan/*/pdf", "/plan/*/label", "/cart", "/checkout", "/signin", "/signup"] },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
