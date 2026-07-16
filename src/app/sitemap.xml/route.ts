import { sitemapIndexXml, xmlResponse, SITEMAP_SEGMENTS } from "@/lib/seo/sitemap";

export const revalidate = 3600;

// Omit lastmod from the index, each segment's child URLs carry their own
// real timestamps (or none), so a wall-clock date here would be misleading.
export function GET() {
  return xmlResponse(sitemapIndexXml(SITEMAP_SEGMENTS));
}
