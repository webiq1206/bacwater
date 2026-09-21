import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  // The wildcard applies equally to legitimate search, retrieval and training agents.
  // Private routes require actual authorization. Public noindex pages remain fetchable.
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/plan/*/pdf"] }, sitemap: `${base}/sitemap.xml` };
}
