"use client";
import { createContext, useContext, type ReactNode } from "react";
import { ArrowUpRight, Droplets } from "lucide-react";
import { AFFILIATE_DISCLOSURE, RESEARCH_ONLY_NOTICE, getApprovedSupplierCatalog, type DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
const approved = getApprovedSupplierCatalog();
const CatalogContext = createContext<readonly DisplaySupplierProduct[]>(approved);
export function useSupplierCatalog(){return useContext(CatalogContext);}
const WaterContext = createContext<DisplaySupplierProduct>(approved[0]);
export function SupplierProvider({water, products, children}:{water:DisplaySupplierProduct;products?:readonly DisplaySupplierProduct[];children:ReactNode}) {
  return <CatalogContext.Provider value={products||approved}><WaterContext.Provider value={water}>{children}</WaterContext.Provider></CatalogContext.Provider>;
}
export function SupplierWaterLink({compact=false}:{compact?:boolean}) {
  const water=useContext(WaterContext);
  return <div className={compact ? "bac-water-link compact" : "bac-water-link"} data-bac-water-link>
    <a href={water.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label="View BAC water, opens a new tab">
      <Droplets size={18} aria-hidden="true"/><span>View BAC water</span><ArrowUpRight size={17} aria-hidden="true"/>
    </a><p style={{fontSize:13,lineHeight:1.6}}>{water.paid?AFFILIATE_DISCLOSURE:"Supplier link. No paid referral is active."} {RESEARCH_ONLY_NOTICE}</p>
  </div>;
}
