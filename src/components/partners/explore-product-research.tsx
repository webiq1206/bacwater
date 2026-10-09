"use client";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { SUPPLIER_PRODUCTS } from "@/lib/partners/supplier-catalog";
import { useCalculationSession } from "@/lib/session/calculation-session";

/** Opens supporting reading without changing a single calculator value. */
export function ExploreProductResearch({selectedId}:{selectedId?:string|null}) {
  const session=useCalculationSession();
  const product=SUPPLIER_PRODUCTS.find(p=>p.id===(selectedId??session.productId));
  if(!product)return null;
  return <a href={`/products/${product.id}#research`} target="_blank" rel="noopener noreferrer" data-explore-product-research={product.id}
    aria-label={`Explore the research for ${product.name}, opens a new tab`}
    style={{display:"inline-flex",alignItems:"center",gap:8,minHeight:44,fontSize:13,textDecoration:"underline",textUnderlineOffset:3}}>
    <BookOpen size={16} aria-hidden="true"/>Explore the research<ArrowUpRight size={14} aria-hidden="true"/>
  </a>;
}
