"use client";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import { type DisplaySupplierProduct, type ProductKind, productDetailPath } from "@/lib/partners/supplier-catalog";
import { getProductResearch, PRODUCT_TYPE_LABELS } from "@/lib/partners/product-research";
import { CATALOG_SEARCH_LIMIT, RESEARCH_SEARCH_BOUNDARY, searchProductCatalog } from "@/lib/partners/catalog-search";
import { AffiliateDisclosure } from "./affiliate-disclosure";
import { ProductArtwork } from "./product-artwork";
import styles from "./product-directory.module.css";
const PAGE_SIZE = 12;
const examples = ["Copper compounds, no sprays", "BPC-157 blends", "Lab water"];
export function ProductDirectory({ products }: { products: readonly DisplaySupplierProduct[] }) {
  const [query, setQuery] = useState(""), [kind, setKind] = useState<ProductKind | "all">("all");
  const [sort, setSort] = useState<"catalog" | "az" | "za">("catalog"), [limit, setLimit] = useState(PAGE_SIZE);
  const input = useRef<HTMLInputElement>(null), grid = useRef<HTMLDivElement>(null);
  const result = useMemo(() => searchProductCatalog(products, query, kind, sort), [products, query, kind, sort]);
  const visible = result.products.slice(0, limit);
  function changeQuery(value: string) { setQuery(value); setLimit(PAGE_SIZE); }
  function reset() { setQuery(""); setKind("all"); setSort("catalog"); setLimit(PAGE_SIZE); input.current?.focus(); }
  function more() {
    const firstNew = visible.length; setLimit(limit + PAGE_SIZE);
    requestAnimationFrame(() => grid.current?.querySelectorAll<HTMLAnchorElement>("[data-product-detail]")[firstNew]?.focus({ preventScroll: true }));
  }
  return <div className={styles.directory} data-product-directory>
    <form role="search" className={styles.searchPanel} onSubmit={event => event.preventDefault()}>
      <label htmlFor="research-catalog-search">What are you looking for?</label>
      <div className={styles.searchField}><Search size={21} aria-hidden="true"/><input id="research-catalog-search" ref={input} type="search" value={query} maxLength={CATALOG_SEARCH_LIMIT} onChange={event => changeQuery(event.target.value)} placeholder="A compound name, format, or laboratory topic" aria-describedby="research-search-help" autoComplete="off" data-clarity-mask="true" spellCheck={false}/>{query && <button type="button" aria-label="Clear product search" onClick={() => { changeQuery(""); input.current?.focus(); }}><X size={20} aria-hidden="true"/></button>}</div>
      <p id="research-search-help">Use your own words. We match catalog information, not symptoms or personal goals. Your search stays in this browser.</p>
      <div className={styles.examples} aria-label="Example research searches"><span>Try</span>{examples.map(example => <button type="button" key={example} onClick={() => { changeQuery(example); setKind("all"); }}>{example}<ArrowUpRight size={13} aria-hidden="true"/></button>)}</div>
    </form>
    <div className={styles.controls}>
      <div className={styles.types} role="group" aria-label="Filter products by type">
        {([["all", "All products"], ...Object.entries(PRODUCT_TYPE_LABELS)] as [ProductKind | "all", string][]).map(([value, label]) => <button type="button" key={value} aria-pressed={kind === value} onClick={() => { setKind(value); setLimit(PAGE_SIZE); }}>{label}<span>{value === "all" ? products.length : products.filter(product => product.kind === value).length}</span></button>)}
      </div>
      <label className={styles.sort}>Sort<select aria-label="Sort products" value={sort} onChange={event => { setSort(event.target.value as typeof sort); setLimit(PAGE_SIZE); }}><option value="catalog">Catalog order</option><option value="az">Name: A to Z</option><option value="za">Name: Z to A</option></select></label>
    </div>
    <div className={styles.resultBar}><p role="status" aria-live="polite">{result.blocked ? "Research-only search" : `${result.products.length} ${result.products.length === 1 ? "product" : "products"}${query || kind !== "all" ? " matched" : " to explore"}`}{result.interpreted.length > 0 && <span> · {result.interpreted.join(" · ")}</span>}</p>{(query || kind !== "all" || sort !== "catalog") && <button type="button" onClick={reset}>Reset filters</button>}</div>
    {result.blocked ? <section className={styles.empty} data-research-boundary><p className={styles.eyebrow}>A clear boundary</p><h2>Research materials.<br/>Not personal recommendations.</h2><p>{RESEARCH_SEARCH_BOUNDARY}</p><button type="button" className={styles.primary} onClick={reset}>Clear search and browse</button></section> : visible.length ? <>
      <div className={styles.grid} ref={grid}>
        {visible.map(product => { const research = getProductResearch(product); return <article className={styles.card} key={product.id} data-catalog-product={product.id}>
          <Link href={productDetailPath(product.id)} className={styles.artworkLink} aria-label={`Explore ${product.name}`} tabIndex={-1} aria-hidden="true"><ProductArtwork product={product}/></Link>
          <div className={styles.cardBody}><div className={styles.cardMeta}><span>{product.label}</span><span>Research only</span></div><h2><Link data-product-detail href={productDetailPath(product.id)}>{product.name}</Link></h2><p className={styles.cardTopic}>{research.topic}</p>
            <Link className={styles.detailsLink} href={productDetailPath(product.id)}>Explore product<ArrowRight size={17} aria-hidden="true"/></Link>
            <div className={styles.cardPurchase}><p>Not for human consumption or animal use.</p><AffiliateDisclosure paid={product.paid} research={false}/><a href={product.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label={`View ${product.name} at the supplier, opens a new tab`}>View supplier listing<ArrowUpRight size={16} aria-hidden="true"/></a></div>
          </div>
        </article>; })}
      </div>
      <div className={styles.pagination}><p>Showing {visible.length} of {result.products.length} products</p>{visible.length < result.products.length && <button className={styles.primary} type="button" onClick={more}>Show {Math.min(PAGE_SIZE, result.products.length - visible.length)} more<ArrowRight size={18} aria-hidden="true"/></button>}</div>
    </> : <section className={styles.empty}><p className={styles.eyebrow}>Nothing matches yet</p><h2>Try a simpler search.</h2><p>Use the name on the label, choose another product type, or start again. We will not substitute a different compound.</p><button type="button" className={styles.primary} onClick={reset}>Show all products</button></section>}
  </div>;
}
