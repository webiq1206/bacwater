import { urlsetXml, xmlResponse, STATIC_PAGES } from "@/lib/seo/sitemap";
import { SUPPLIER_PRODUCTS, productDetailPath } from "@/lib/partners/supplier-catalog";
export const dynamic="force-dynamic";
export function GET(){return xmlResponse(urlsetXml([...STATIC_PAGES,{path:"/recommendations"},{path:"/products"},...SUPPLIER_PRODUCTS.map(product=>({path:productDetailPath(product.id)}))]))}
