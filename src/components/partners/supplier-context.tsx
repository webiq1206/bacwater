"use client";
import { createContext, useContext, type ReactNode } from "react";
import { ArrowUpRight, Droplets } from "lucide-react";
import { SUPPLIER_PRODUCTS, type DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
const fallback = { ...SUPPLIER_PRODUCTS[0], href: SUPPLIER_PRODUCTS[0].sourceUrl, paid: false };
const CatalogContext = createContext<readonly DisplaySupplierProduct[]>(SUPPLIER_PRODUCTS.map(p=>({...p,href:p.sourceUrl,paid:false})));
export function useSupplierCatalog(){return useContext(CatalogContext);}
const WaterContext = createContext<DisplaySupplierProduct>(fallback);
export function SupplierProvider({water, products, children}:{water:DisplaySupplierProduct;products?:readonly DisplaySupplierProduct[];children:ReactNode}) {
  return <CatalogContext.Provider value={products||SUPPLIER_PRODUCTS.map(p=>({...p,href:p.sourceUrl,paid:false}))}><WaterContext.Provider value={water}>{children}</WaterContext.Provider></CatalogContext.Provider>;
}
export function SupplierWaterLink({compact=false}:{compact?:boolean}) {
  const water=useContext(WaterContext);
  return <div className={compact ? "bac-water-link compact" : "bac-water-link"} data-bac-water-link>
    <a href={water.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label="View BAC water, opens a new tab">
      <Droplets size={18} aria-hidden="true"/><span>View BAC water</span><ArrowUpRight size={17} aria-hidden="true"/>
    </a><p>{water.paid?"Paid link. We may earn a fee.":"Supplier link. No paid referral is active."} {!compact&&"This water is for lab research only, not for people or animals."}</p>
  </div>;
}
