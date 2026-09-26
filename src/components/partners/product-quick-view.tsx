"use client";
import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
import { trackUsage } from "@/lib/analytics";
import cards from "./product-directory.module.css";
const ProductDetailContent = dynamic(() => import("./product-detail-content"), { loading: () => <DialogContent><DialogTitle>Research details</DialogTitle><DialogDescription>Loading product information…</DialogDescription></DialogContent> });
/** The full research records and detail layout load only when a visitor opens them. */
export function ProductQuickView({product,className,children,open,onOpenChange,resultId}:{product:DisplaySupplierProduct;className?:string;children?:ReactNode;open?:boolean;onOpenChange?:(open:boolean)=>void;resultId?:string}) {
 const [localOpen,setLocalOpen] = useState(false); const isOpen = open ?? localOpen;
 return <Dialog open={isOpen} onOpenChange={next => { setLocalOpen(next); onOpenChange?.(next); if(next)trackUsage("product_details_opened"); }}>
 <DialogTrigger asChild><button type="button" data-search-result={resultId} className={className||cards.detailsButton} aria-label={`${children ? "Open product details for" : "Read research details for"} ${product.name}`}>{children||<>Research details <ArrowUpRight size={15} aria-hidden="true"/></>}</button></DialogTrigger>
 {isOpen && <ProductDetailContent product={product}/>}
 </Dialog>;
}
