import { urlsetXml, xmlResponse, STATIC_PAGES } from "@/lib/seo/sitemap";

export const revalidate = 3600;

// Static pages have no per-page update timestamp; omit lastmod so crawlers
// don't see a spuriously changing date on every hourly revalidation.
export function GET() {
  return xmlResponse(urlsetXml(STATIC_PAGES));
}
