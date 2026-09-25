"use client";
import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, FlaskConical, Info, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AFFILIATE_DISCLOSURE, RESEARCH_ONLY_NOTICE, SUPPLIER_SOURCES, productCalculatorPath, type DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
import { PRODUCT_RESEARCH } from "@/lib/partners/product-content";
import { PRODUCT_FORMATS } from "@/lib/partners/product-directory";
import { ProductArtwork } from "./product-artwork";
import cards from "./product-directory.module.css";
import styles from "./product-quick-view.module.css";

/** Radix retains focus trapping, Escape, scroll locking and return-to-trigger focus. */
export function ProductQuickView({product,className}:{product:DisplaySupplierProduct;className?:string}) {
  const title=useRef<HTMLHeadingElement>(null),sources=useRef<HTMLDetailsElement>(null),uid=useId();
  const [sourcesOpen,setSourcesOpen]=useState(false);
  const detail=PRODUCT_RESEARCH[product.id];
  if(!detail)return null;
  function showSources(){setSourcesOpen(true);requestAnimationFrame(()=>sources.current?.scrollIntoView({block:"nearest",behavior:"auto"}));}
  return <Dialog onOpenChange={open=>{if(!open)setSourcesOpen(false);}}>
    <DialogTrigger asChild><button type="button" className={className||cards.detailsButton} aria-label={`Read research details for ${product.name}`}>Research details <ArrowUpRight size={15} aria-hidden="true"/></button></DialogTrigger>
    <DialogContent className={styles.dialog} data-product-detail={product.id} onOpenAutoFocus={e=>{e.preventDefault();title.current?.focus();}}>
      <header className={styles.header}>
        <div className={styles.eyebrow}><FlaskConical size={14} aria-hidden="true"/>RESEARCH DETAILS<span>{PRODUCT_FORMATS[product.kind]}</span></div>
        <DialogTitle ref={title} tabIndex={-1} className={styles.title}>{product.name}</DialogTitle>
        <DialogDescription className={styles.notice}>{RESEARCH_ONLY_NOTICE}</DialogDescription>
      </header>
      <div className={styles.scroll} data-product-detail-scroll>
        <div className={styles.layout}>
          <aside className={styles.visual} aria-label="Product overview">
            <ProductArtwork product={product}/>
            <p className={styles.artNote}>Illustration, not product packaging.</p>
            <p className={styles.summary}>{detail.summary}</p>
            <button className={styles.sourceButton} type="button" onClick={showSources} aria-controls={`${uid}-sources`}><BookOpen size={16} aria-hidden="true"/>Read the sources <ChevronDown size={15} aria-hidden="true"/></button>
          </aside>
          <div className={styles.copy}>
            <section className={styles.section} aria-labelledby={`${uid}-what`}><span className={styles.number} aria-hidden="true">01</span><div><h3 id={`${uid}-what`}>What it is</h3><p>{detail.what}</p></div></section>
            <section className={styles.section} aria-labelledby={`${uid}-study`}><span className={styles.number} aria-hidden="true">02</span><div><h3 id={`${uid}-study`}>What researchers study</h3><p>{detail.study}</p></div></section>
            <section className={styles.section} aria-labelledby={`${uid}-how`}><span className={styles.number} aria-hidden="true">03</span><div><h3 id={`${uid}-how`}>How it works</h3><p>{detail.how}</p></div></section>
            <div className={styles.limit}><Info size={18} aria-hidden="true"/><div><h3>What this does not prove</h3><p>{detail.limit}</p></div></div>
          </div>
        </div>
        <details ref={sources} id={`${uid}-sources`} className={styles.sources} open={sourcesOpen} onToggle={e=>setSourcesOpen(e.currentTarget.open)}>
          <summary><BookOpen size={17} aria-hidden="true"/>Sources &amp; product checks<ChevronDown size={17} aria-hidden="true"/></summary>
          <div className={styles.sourceBody}>
            <p>The explanations above describe the compound, not results from testing this supplier’s product. We have not independently tested these products.</p>
            <ol>{detail.sources.map(source=><li key={source.url}><a href={source.type==="product"?product.href:source.url} target="_blank" rel={source.type==="product"?"sponsored nofollow noopener noreferrer":"noopener noreferrer"} referrerPolicy="no-referrer">{source.label}<ArrowUpRight size={14} aria-hidden="true"/></a><span>{source.type==="product"?"Name, ingredients and product format. Affiliate link.":"Published compound research, not a test of this product."}</span></li>)}</ol>
            <p>Before following a product link, match its name, ingredients and amounts to the label. A certificate of analysis is a batch test report; check that its batch number matches.</p>
            <div className={styles.resources}><a href={SUPPLIER_SOURCES.coa} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Supplier batch reports <ArrowUpRight size={14} aria-hidden="true"/></a><a href={SUPPLIER_SOURCES.researchUse} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Research-use restrictions <ArrowUpRight size={14} aria-hidden="true"/></a></div>
          </div>
        </details>
        <div className={styles.math}><Link href={productCalculatorPath(product.id)}>Open the blank laboratory calculator</Link><span>Use your own label values. No dose or mixing advice.</span></div>
      </div>
      <footer className={styles.footer}>
        <div><p className={styles.disclosure}>{product.paid?AFFILIATE_DISCLOSURE:"Supplier link. No paid referral is active."}</p><span className={styles.externalNote}>Sizes, pricing and ordering are on the partner’s website.</span></div>
        <a href={product.href} className={styles.action} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label={`View ${product.name} on the supplier website, opens a new tab`}>View product <ArrowUpRight size={19} aria-hidden="true"/></a>
      </footer>
    </DialogContent>
  </Dialog>;
}
