"use client";
import { createContext, useContext, type ReactNode } from "react";
import { ArrowUpRight, Droplets } from "lucide-react";
import { AMINO_PRODUCTS, type DisplayAminoProduct } from "@/lib/partners/amino-club";
const fallback = { ...AMINO_PRODUCTS[0], href: AMINO_PRODUCTS[0].sourceUrl, paid: false };
const WaterContext = createContext<DisplayAminoProduct>(fallback);
export function SupplierProvider({water, children}:{water:DisplayAminoProduct;children:ReactNode}) {
  return <WaterContext.Provider value={water}>{children}</WaterContext.Provider>;
}
export function AminoWaterLink({compact=false}:{compact?:boolean}) {
  const water=useContext(WaterContext);
  return <div className={compact ? "bac-water-link compact" : "bac-water-link"} data-bac-water-link>
    <a href={water.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label="View BAC water (Amino H2O) at AminoClub, opens a new tab">
      <Droplets size={18} aria-hidden="true"/><span>BAC water at AminoClub</span><ArrowUpRight size={17} aria-hidden="true"/>
    </a><p>{water.paid?"Paid link. We may earn a fee.":"Supplier link. No paid referral is active."} {!compact&&"Amino H2O is for lab research only, not for people or animals."}</p>
  </div>;
}
