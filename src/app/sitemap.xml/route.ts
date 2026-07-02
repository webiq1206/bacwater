import { sitemapIndexXml, xmlResponse, SITEMAP_SEGMENTS } from "@/lib/seo/sitemap";

export const revalidate = 3600;

export function GET() {
  return xmlResponse(sitemapIndexXml(SITEMAP_SEGMENTS, new Date()));
}
