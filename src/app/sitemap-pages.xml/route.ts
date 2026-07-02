import { urlsetXml, xmlResponse, STATIC_PAGES } from "@/lib/seo/sitemap";

export const revalidate = 3600;

export function GET() {
  const now = new Date();
  return xmlResponse(
    urlsetXml(STATIC_PAGES.map((p) => ({ ...p, lastModified: now })))
  );
}
