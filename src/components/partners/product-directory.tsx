"use client";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import { AFFILIATE_DISCLOSURE, RESEARCH_ONLY_NOTICE, type DisplaySupplierProduct, type ProductKind } from "@/lib/partners/supplier-catalog";
import { DIRECTORY_KINDS, matchDirectory } from "@/lib/partners/product-directory";
import { ProductArtwork } from "./product-artwork";
import { ProductQuickView } from "./product-quick-view";
import styles from "./product-directory.module.css";

const PAGE_SIZE=12;
export function ProductDirectory({products}:{products:readonly DisplaySupplierProduct[]}) {
  const [query,setQuery]=useState(""),[kind,setKind]=useState<ProductKind|"all">("all"),[sort,setSort]=useState("az"),[page,setPage]=useState(1);
  const input=useRef<HTMLInputElement>(null),results=useRef<HTMLHeadingElement>(null);
  const match=useMemo(()=>matchDirectory(products,query,kind),[products,query,kind]);
  const filtered=useMemo(()=>[...match.products].sort((a,b)=>sort==="za"?b.name.localeCompare(a.name):a.name.localeCompare(b.name)),[match.products,sort]);
  const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE)),current=Math.min(page,pages),start=(current-1)*PAGE_SIZE;
  function search(value:string){setQuery(value);setPage(1);}
  function reset(){setQuery("");setKind("all");setPage(1);input.current?.focus();}
  function turn(value:number){setPage(value);results.current?.focus({preventScroll:true});results.current?.scrollIntoView({block:"start",behavior:"auto"});}
  return <section className={styles.directory} data-product-directory aria-label="Research product directory">
    <div className={styles.searchPanel}>
      <form role="search" onSubmit={e=>{e.preventDefault();input.current?.blur();results.current?.focus();}}>
        <label htmlFor="research-product-search" className={styles.searchLabel}>Find a product</label>
        <div className={styles.searchField}><Search size={21} aria-hidden="true"/><input ref={input} id="research-product-search" type="search" value={query} onChange={e=>search(e.target.value)} maxLength={160} placeholder="Try a name, or ‘show me lab water’" autoComplete="off" spellCheck={false} aria-describedby="product-search-help" data-clarity-mask="true"/>{query&&<button type="button" aria-label="Clear product search" onClick={()=>{search("");input.current?.focus();}}><X size={19} aria-hidden="true"/></button>}</div>
        <p id="product-search-help" className={styles.help}>Use a product name or describe a format. Search stays in your browser. No health goals, dosing or personal-use recommendations.</p>
      </form>
      <div className={styles.controls}>
        <label>Product type<select aria-label="Product type" value={kind} onChange={e=>{setKind(e.target.value as ProductKind|"all");setPage(1);}}>{DIRECTORY_KINDS.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
        <label>Sort by<select aria-label="Sort products" value={sort} onChange={e=>{setSort(e.target.value);setPage(1);}}><option value="az">Name: A to Z</option><option value="za">Name: Z to A</option></select></label>
      </div>
      <div className={styles.examples} aria-label="Example product searches"><span>Try:</span>{["Show me lab water","Find BPC-157","Show me sprays"].map(value=><button key={value} type="button" onClick={()=>{setKind("all");search(value);}}>{value}</button>)}</div>
    </div>
    <div className={styles.resultsHeader}>
      <div><h2 ref={results} tabIndex={-1} className={styles.resultsTitle}>Browse the directory</h2><p role="status" aria-live="polite" aria-atomic="true">{filtered.length?`${filtered.length} ${filtered.length===1?"product":"products"}. Showing ${start+1} to ${Math.min(start+PAGE_SIZE,filtered.length)}.`:match.message}</p></div>
      {(query||kind!=="all")&&<button type="button" className={styles.reset} onClick={reset}>Clear filters <X size={15} aria-hidden="true"/></button>}
    </div>
    {!filtered.length?<div className={styles.empty} data-search-scope={match.scope}><h3>{match.scope==="restricted"?"Research products, not personal-use advice.":"No matching products."}</h3><p>{match.message}</p><button type="button" onClick={reset}>Browse all products</button></div>:<>
      <div className={styles.grid}>
        {/* Avoid native hidden: the CSS reset gives it layered !important priority over the no-script fallback. */}
        {filtered.map((product,index)=><article className={styles.card} key={product.id} data-product={product.id} data-page-hidden={index<start||index>=start+PAGE_SIZE?"true":undefined} style={index<start||index>=start+PAGE_SIZE?{display:"none"}:undefined}>
          <div className={styles.art}><ProductArtwork product={product}/></div>
          <div className={styles.cardBody}><p className={styles.eyebrow}>{product.label}</p><h3>{product.name}</h3><p className={styles.summary}>{product.summary}</p><p className={styles.researchNote}>{RESEARCH_ONLY_NOTICE}</p><ProductQuickView product={product}/><p className={styles.disclosure}>{product.paid?AFFILIATE_DISCLOSURE:"Supplier link. No paid referral is active."}</p><a className={styles.cardSupplier} href={product.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label={`View ${product.name} from the supplier, opens a new tab`}>View product <ArrowUpRight size={17} aria-hidden="true"/></a></div>
        </article>)}
      </div>
      {pages>1&&<nav className={styles.pagination} aria-label="Product pages"><button type="button" disabled={current===1} onClick={()=>turn(current-1)}><ArrowLeft size={18} aria-hidden="true"/>Previous</button><span>Page {current} of {pages}</span><button type="button" disabled={current===pages} onClick={()=>turn(current+1)}>Next<ArrowRight size={18} aria-hidden="true"/></button></nav>}
    </>}
    <p className={styles.matchNote}>{match.scope==="catalog"?match.message:"No search text is sent to the supplier or added to affiliate links."}</p>
    <noscript><style>{'[data-product-directory] [data-page-hidden="true"]{display:flex!important}[data-product-directory] nav[aria-label="Product pages"], [data-product-directory] .directory-interactive-only{display:none!important}'}</style><p>All products are shown when JavaScript is unavailable. Product links still open the supplier website; interactive search and detail panels require JavaScript.</p></noscript>
  </section>;
}
