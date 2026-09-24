"use client";
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AFFILIATE_DISCLOSURE, CATALOG_CHECKED_AT, RESEARCH_ONLY_NOTICE, SUPPLIER_SOURCES, productCalculatorPath, type DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
import { PRODUCT_FORMATS, productOverview } from "@/lib/partners/product-directory";
import { ProductArtwork } from "./product-artwork";
import styles from "./product-directory.module.css";

/** Radix supplies focus trapping, Escape, scroll locking and return-to-trigger focus. */
export function ProductQuickView({product,className}:{product:DisplaySupplierProduct;className?:string}) {
  const title=useRef<HTMLHeadingElement>(null);
  return <Dialog>
    <DialogTrigger asChild><button type="button" className={className||styles.detailsButton} aria-label={`Read research details for ${product.name}`}>Research details</button></DialogTrigger>
    <DialogContent className={styles.detailDialog} data-product-detail={product.id} onOpenAutoFocus={e=>{e.preventDefault();title.current?.focus();}}>
      <header className={styles.detailHeader}>
        <p className={styles.eyebrow}>PRODUCT REFERENCE</p>
        <DialogTitle ref={title} tabIndex={-1} className={styles.detailTitle}>{product.name}</DialogTitle>
        <DialogDescription className={styles.detailDescription}>{RESEARCH_ONLY_NOTICE}</DialogDescription>
      </header>
      <div className={styles.detailScroll}>
        <div className={styles.detailOverview}>
          <div className={styles.detailArt}><ProductArtwork product={product}/><p>Original directory artwork, not supplier packaging.</p></div>
          <section><h3>What this listing is</h3><p>{productOverview(product)}</p><p className={styles.formatPill}>{PRODUCT_FORMATS[product.kind]}</p></section>
        </div>
        <section className={styles.detailSection}>
          <h3>Read the label, then the batch report.</h3>
          <p>Confirm the exact identity, composition, package amount and batch number. Match the certificate of analysis to that batch. We have not independently tested these products; a listing or lab report is not a finding of safety or suitability.</p>
          <dl className={styles.specifications}><div><dt>Catalog identifier</dt><dd>{product.id}</dd></div><div><dt>Listing review</dt><dd><time dateTime={CATALOG_CHECKED_AT}>September 24, 2026</time></dd></div><div><dt>Price and availability</dt><dd>Check the current supplier listing</dd></div></dl>
          <p className={styles.resourceLinks}><a href={SUPPLIER_SOURCES.coa} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Supplier batch reports <span aria-hidden="true">↗</span></a><a href={SUPPLIER_SOURCES.researchUse} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Research-use restrictions <span aria-hidden="true">↗</span></a></p>
        </section>
        <details className={styles.explanation}><summary>Why there are no health-benefit claims</summary><p>These listings are for laboratory research, not personal use. We do not describe health, weight, recovery, performance, anti-aging or cosmetic benefits, and we do not recommend doses, administration methods or products for a health goal. A research-only disclaimer would not make those claims appropriate.</p></details>
        <p className={styles.toolLink}><Link href={productCalculatorPath(product.id)}>Open the blank laboratory calculator</Link><span>Arithmetic from your own label values only. No amounts or use instructions are recommended.</span></p>
      </div>
      <footer className={styles.detailFooter}>
        <p>{product.paid?AFFILIATE_DISCLOSURE:"Supplier link. No paid referral is active."}</p>
        <a href={product.href} className={styles.supplierButton} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label={`View ${product.name} on the supplier website, opens a new tab`}>View product on supplier website <ArrowUpRight size={18} aria-hidden="true"/></a>
      </footer>
    </DialogContent>
  </Dialog>;
}
