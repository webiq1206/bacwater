"use client";
import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, ArrowUpRight, ChevronDown, Droplets } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SelectItem } from "@/components/ui/select";
import { SUPPLIER_PRODUCTS, productCalculatorPath } from "@/lib/partners/supplier-catalog";
import { PEPTIDES } from "@/lib/calc/peptides";
import { useSupplierCatalog } from "./supplier-context";
import { AFFILIATE_DISCLOSURE } from "@/lib/partners/affiliate";
import { restrictedProductQuery, RESEARCH_SEARCH_BOUNDARY } from "@/lib/partners/catalog-search";
import { ProductArtwork } from "./product-artwork";
import styles from "./calculator-products.module.css";
const ignoreSelection = (_id: string | null) => {};
export const ProductSelectionContext = createContext<(id:string|null)=>void>(ignoreSelection);
export function useCalculatorProductSelection(){return useContext(ProductSelectionContext);}
/** Existing known compounds keep their normal fields. Additional forms have their own tools. */
export function AdditionalProductOptions(){
 return <>{SUPPLIER_PRODUCTS.filter(p=>!p.reference||!PEPTIDES.some(ref=>ref.slug===p.reference)).map(p=><SelectItem key={p.id} value={`product:${p.id}`}>{p.name}{p.kind==="blend"?" (blend)":""}{p.kind==="water"?" (supply)":""}</SelectItem>)}</>;
}
export function CalculatorProductTools({selectedId}:{selectedId:string|null}) {
 const catalog=useSupplierCatalog(),product=catalog.find(p=>p.id===selectedId),water=catalog[0];
 const [open,setOpen]=useState(false),[query,setQuery]=useState(""),[kind,setKind]=useState("all");
 const path=usePathname();useEffect(()=>{setOpen(false);},[path]);
 const blocked=restrictedProductQuery(query);
 const filtered=catalog.filter(p=>!blocked&&(kind==="all"||p.kind===kind)&&`${p.name} ${p.id} ${p.reference}`.toLowerCase().includes(query.trim().toLowerCase()));
 return <div className={styles.tools} data-calculator-products>
  <div className={styles.toolbar}>
   <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><button className={styles.choose} type="button"><Search size={16} aria-hidden="true"/>{product?"Change product":"Choose product"}<ChevronDown size={15} aria-hidden="true"/></button></DialogTrigger>
    <DialogContent className={styles.dialog}>
     <DialogTitle className={styles.title}>Choose a product</DialogTitle>
     <DialogDescription>Pick the exact product. Your current calculation stays saved on this device. No amounts are filled in for you.</DialogDescription>
     <label className={styles.search}>Find a product<input type="search" maxLength={240} data-clarity-mask="true" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name" autoComplete="off" /></label>
     <label className={styles.search}>Product type<select aria-label="Product type" value={kind} onChange={e=>setKind(e.target.value)}><option value="all">All products</option><option value="single">Single compounds</option><option value="blend">Blends</option><option value="spray">Sprays and solutions</option><option value="water">Lab water</option></select></label>
     <p className={styles.count} role="status">{filtered.length} of {catalog.length} products</p>
     <div className={styles.list} role="region" aria-label="Product choices" tabIndex={0}>
      {filtered.length?<ul>{filtered.map(p=><li key={p.id}>
       <Link className={styles.option} href={productCalculatorPath(p.id)} onClick={()=>setOpen(false)} data-product-choice={p.id}>
        <span className={styles.thumb}><ProductArtwork product={p} compact/></span>
        <span><strong>{p.name}</strong><small>{p.label}</small></span><ChevronDown size={15} aria-hidden="true" style={{transform:"rotate(-90deg)"}}/>
       </Link>
      </li>)}</ul>:<p>{blocked?RESEARCH_SEARCH_BOUNDARY:"No matches. Try another name or choose All products."}</p>}
     </div>
     <p className={styles.count}>Our own artwork, not product packaging. Lab research only, not for people or animals.</p>
    </DialogContent>
   </Dialog>
   {water&&<a className={styles.water} href={water.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label="View BAC water, opens a new tab"><Droplets size={16} aria-hidden="true"/>BAC water<ArrowUpRight size={14} aria-hidden="true"/></a>}
  </div>
  {product&&<div className={styles.selected} data-selected-product={product.id}>
   <span className={styles.selectedArt}><ProductArtwork product={product} compact/></span>
   <div className={styles.selectedText}><strong>{product.name}</strong><span>{product.label}</span><a href={product.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" data-selected-product-link aria-label={`View ${product.name}, opens a new tab`}>View product<ArrowUpRight size={14} aria-hidden="true"/></a></div>
  </div>}
  {(product||water)&&<p className={styles.count} data-affiliate-disclosure>{(product?.paid||water?.paid)&&AFFILIATE_DISCLOSURE} For laboratory research only. Not for human consumption or animal use.</p>}
 </div>;
}
