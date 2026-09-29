"use client";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { RESEARCH_ONLY_NOTICE, type DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
import { PRODUCT_RESEARCH } from "@/lib/partners/product-content";
import { PRODUCT_GUIDES } from "@/lib/partners/product-guides";
import { PRODUCT_FORMATS } from "@/lib/partners/product-directory";
import { researchCategory } from "@/lib/partners/research-categories";
import { ProductArtwork } from "./product-artwork";
import { ProductBuyLink, PurchaseDisclosure } from "./product-purchase";
import { useSearchViewport } from "@/components/search/use-search-viewport";
import styles from "./product-quick-view.module.css";

/** Quick look only. Longer explanations and citations belong on the full page. */
export default function ProductDetailContent({product}:{product:DisplaySupplierProduct}) {
 const dialogRef=useRef<HTMLDivElement>(null);
 useSearchViewport(true,dialogRef);
 const title=useRef<HTMLHeadingElement>(null),detail=PRODUCT_RESEARCH[product.id],guide=PRODUCT_GUIDES[product.id];
 if(!detail||!guide)return null;
 return <DialogContent ref={dialogRef} className={styles.dialog} data-product-detail={product.id} onOpenAutoFocus={e=>{e.preventDefault();title.current?.focus();}}>
  <header className={styles.header}>
   <div className={styles.eyebrow}>QUICK LOOK<span>{researchCategory(product.id).label}</span></div>
   <DialogTitle ref={title} tabIndex={-1} className={styles.title}>{product.name}</DialogTitle>
   <DialogDescription className={styles.notice}>{RESEARCH_ONLY_NOTICE}</DialogDescription>
  </header>
  <div className={styles.scroll} data-product-detail-scroll>
   <div className={styles.quickIntro}><ProductArtwork product={product} compact/><div><h3>What it is</h3><p>{detail.what}</p></div></div>
   <section className={styles.quickSection}><h3>What researchers study</h3><p>{guide.study}</p></section>
   <section className={styles.quickSection} data-product-mechanism><h3>How it works</h3><p data-product-plain>{guide.how}</p></section>
   <dl className={styles.quickFacts}><div><dt>Product type</dt><dd>{PRODUCT_FORMATS[product.kind]}</dd></div><div><dt>Research behind this page</dt><dd>{guide.model}</dd></div></dl>
   <div className={styles.limit}><Info size={18} aria-hidden="true"/><div><h3>What is not established</h3><p>{guide.caution}</p></div></div>
  </div>
  <footer className={styles.quickFooter}>
   <PurchaseDisclosure product={product}/>
   <div className={styles.footerActions}>
    <DialogClose asChild><Link className={styles.detailsAction} href={`/products/${product.id}`}>View Full Details <ArrowRight size={16} aria-hidden="true"/></Link></DialogClose>
    <ProductBuyLink product={product}/>
   </div>
   <span className={styles.externalNote}>Purchase on Amino Club. Opens in a new tab.</span>
  </footer>
 </DialogContent>;
}
