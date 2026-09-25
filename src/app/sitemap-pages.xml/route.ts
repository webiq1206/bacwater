import { urlsetXml, xmlResponse, STATIC_PAGES } from "@/lib/seo/sitemap";
export const dynamic="force-dynamic";
export function GET(){return xmlResponse(urlsetXml(STATIC_PAGES))}
