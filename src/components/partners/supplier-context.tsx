"use client";
import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Droplets } from "lucide-react";
import type { DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
import { AFFILIATE_DISCLOSURE, supplierPromotionAllowed } from "@/lib/partners/affiliate";
// No untracked or client-generated fallback: server configuration owns every link.
const CatalogContext = createContext<readonly DisplaySupplierProduct[]>([]);
export function useSupplierCatalog(){return useContext(CatalogContext);}
const WaterContext = createContext<DisplaySupplierProduct | null>(null);
export function SupplierProvider({water, products, children}:{water:DisplaySupplierProduct;products:readonly DisplaySupplierProduct[];children:ReactNode}) {
  return <CatalogContext.Provider value={products}><WaterContext.Provider value={water}>{children}</WaterContext.Provider></CatalogContext.Provider>;
}
export function SupplierWaterLink({compact=false}:{compact?:boolean}) {
  const water=useContext(WaterContext),path=usePathname()||"/";
  if(!water||!supplierPromotionAllowed(path))return null;
  return <div className={compact ? "bac-water-link compact" : "bac-water-link"} data-bac-water-link>
    <a href={water.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label="View BAC water, opens a new tab">
      <Droplets size={18} aria-hidden="true"/><span>View BAC water</span><ArrowUpRight size={17} aria-hidden="true"/>
    </a><p data-affiliate-disclosure>{water.paid?AFFILIATE_DISCLOSURE:"Supplier link. No paid referral is active."} For laboratory research only. Not for human consumption or animal use.</p>
  </div>;
}
