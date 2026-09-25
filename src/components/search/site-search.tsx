"use client";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { BASE_SEARCH_ITEMS, SEARCH_KIND_LABEL, searchItems, type SearchItem, type SearchKind } from "@/lib/search/public-index";
import { useSearchViewport } from "./use-search-viewport";
import { useSupplierCatalog } from "@/components/partners/supplier-context";
import { ProductQuickView } from "@/components/partners/product-quick-view";
import { ProductSearchField } from "./product-search-field";
import { matchDirectory } from "@/lib/partners/product-directory";
import { AFFILIATE_DISCLOSURE, RESEARCH_ONLY_NOTICE } from "@/lib/partners/supplier-catalog";
import { SearchThumbnail } from "./search-thumbnail";
import styles from "./search.module.css";

const SearchContext = createContext<((opener?: HTMLElement) => void) | null>(null);
const categories: [SearchKind | "all", string][] = [["all", "All"], ["product", "Products"], ["calculator", "Calculators"], ["guide", "Guides"], ["reference", "References"]];
function Highlight({ text, query }: { text: string; query: string }) {
  const start = query.trim() ? text.toLowerCase().indexOf(query.trim().toLowerCase()) : -1;
  return start < 0 ? <>{text}</> : <>{text.slice(0, start)}<mark>{text.slice(start, start + query.trim().length)}</mark>{text.slice(start + query.trim().length)}</>;
}

export function SiteSearchResults({ onNavigate, standalone = false, activeProductId, onActiveProductChange }: {
  onNavigate?: () => void; standalone?: boolean;
  activeProductId?: string | null; onActiveProductChange?: (id: string | null) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(""), [kind, setKind] = useState<SearchKind | "all">("all");
  const [items, setItems] = useState<readonly SearchItem[]>(BASE_SEARCH_ITEMS), [loading, setLoading] = useState(true), [partial, setPartial] = useState(false), [limit, setLimit] = useState(14);
  const [localProduct, setLocalProduct] = useState<string | null>(null);
  const detailId = onActiveProductChange ? activeProductId : localProduct;
  const selectProduct = onActiveProductChange || setLocalProduct;
  const root = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null), resultList = useRef<HTMLDivElement>(null);
  const products = useSupplierCatalog();
  useEffect(() => {
    const controller = new AbortController();
    // Refresh only the public index. The visitor's search text never leaves this component.
    fetch("/api/search-index", { cache: "no-store", signal: controller.signal }).then(async response => {
      if (!response.ok) throw Error("unavailable");
      const data = await response.json();
      if (!Array.isArray(data.items)) throw Error("invalid");
      const safe = data.items.filter((i: SearchItem) => i && typeof i.title === "string" && typeof i.description === "string" && typeof i.keywords === "string" && typeof i.href === "string" && /^\/(?:tools(?:\/|$)|peptide-calculator$|peptides(?:\/|$)|calculate\/product\/|learn(?:\/|$)|faq$|methodology$|recommendations$|contact$|privacy$|disclaimer$)/.test(i.href) && !/[?#\\]/.test(i.href) && Object.hasOwn(SEARCH_KIND_LABEL, i.kind));
      setItems(safe); setPartial(!!data.partial);
    }).catch(error => { if (error.name !== "AbortError") setPartial(true); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  const productMatch = useMemo(() => {
    const match = matchDirectory(products, query);
    return { ...match, products: [...match.products].sort((a, b) => a.name.localeCompare(b.name)) };
  }, [products, query]);
  const matched = useMemo(() => searchItems(items, query, kind).filter(item => item.kind !== "product" || productMatch.scope !== "restricted"), [items, query, kind, productMatch.scope]);
  const visible = matched.slice(0, limit);
  function search(value: string) { setQuery(value); setLimit(14); if (resultList.current) resultList.current.scrollTop = 0; }
  function navigate() { selectProduct(null); onNavigate?.(); }
  function firstResult() { return root.current?.querySelector<HTMLElement>(kind === "product" ? "[data-product-match] > button" : "[data-search-result]"); }
  return <div className={styles.searchBody} ref={root} data-site-search-results data-standalone={standalone}>
    <form role="search" aria-label="Search products, calculators and guides" onSubmit={event => {
      event.preventDefault();
      if (kind === "product") firstResult()?.click();
      else if (visible[0]) { navigate(); router.push(visible[0].href); }
    }} className={styles.searchBox}>
      <label htmlFor={standalone ? "page-site-search" : "dialog-site-search"}>What are you looking for?</label>
      <div><Search size={20} aria-hidden="true" />
        <input ref={input} id={standalone ? "page-site-search" : "dialog-site-search"} type="search" maxLength={160} value={query} onChange={event => search(event.target.value)} placeholder="Search products, calculators or guides" autoComplete="off" spellCheck={false} data-clarity-mask="true" enterKeyHint="search"
          onKeyDown={event => { if (event.key === "ArrowDown" && firstResult()) { event.preventDefault(); firstResult()?.focus(); } }} />
        {query && <button type="button" onClick={() => { search(""); input.current?.focus(); }} aria-label="Clear search"><X size={18} aria-hidden="true" /></button>}
      </div>
    </form>
    <div className={styles.filters} role="group" aria-label="Search categories">{categories.map(([key, label]) => <button key={key} type="button" aria-pressed={key === kind} onClick={() => { setKind(key); setLimit(14); if (resultList.current) resultList.current.scrollTop = 0; }}>{label}</button>)}</div>
    {kind === "product" ? <div className={styles.productPane}>
      <ProductSearchField query={query} onChange={search} match={productMatch} inputRef={input} showInitial previewCount={6} hideField activeProductId={detailId} onActiveProductChange={selectProduct} />
    </div> : <>
      <p className={styles.status} role="status">{query ? `${matched.length} ${matched.length === 1 ? "match" : "matches"}` : kind === "all" ? "Search the site, or choose a category." : `${matched.length} ${kind === "reference" ? "references" : kind + "s"}`}{loading ? " Loading guides…" : partial ? " Guide search is temporarily unavailable." : ""}</p>
      <div ref={resultList} className={styles.results} aria-label="Search results" tabIndex={0}>
        {visible.length ? <ul>{visible.map(item => {
          const product = item.kind === "product" ? products.find(p => p.id === item.productId) : undefined;
          return <li key={item.id}>
            <Link href={item.href} className={styles.result} data-search-result={item.id} onClick={navigate} onKeyDown={event => {
              if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
              const links = Array.from(root.current?.querySelectorAll<HTMLAnchorElement>("[data-search-result]") || []), index = links.indexOf(event.currentTarget);
              event.preventDefault();
              if (event.key === "ArrowUp" && index === 0) input.current?.focus();
              else links[Math.max(0, Math.min(links.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)))]?.focus();
            }}><SearchThumbnail item={item} /><span className={styles.resultText}><small>{SEARCH_KIND_LABEL[item.kind]}</small><strong><Highlight text={item.title} query={query} /></strong><span>{item.description}</span><b className={styles.openLabel}>{item.kind === "product" || item.kind === "calculator" ? "Open calculator" : item.kind === "reference" ? "Read reference" : "Open page"}</b></span><ArrowRight size={18} aria-hidden="true" /></Link>
            {product && <div className={styles.productActions}>
              <ProductQuickView product={product} className={styles.quickDetails} open={detailId === product.id} onOpenChange={open => selectProduct(open ? product.id : null)} />
              <p>{product.paid ? AFFILIATE_DISCLOSURE : "Supplier link. No paid referral is active."} {RESEARCH_ONLY_NOTICE}</p>
              <a className={styles.supplierAction} href={product.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label={`View ${item.title} product, opens a new tab`}>View product <span aria-hidden="true">↗</span></a>
            </div>}
          </li>;
        })}</ul> : <div className={styles.empty}><Search size={30} aria-hidden="true" /><h3>No matches yet</h3><p>Try a shorter name, different spelling, or the All filter.</p><Link href="/contact" onClick={navigate}>Ask us for help</Link></div>}
        {matched.length > limit && <button className={styles.more} type="button" onClick={() => setLimit(n => n + 20)}>Show more results</button>}
      </div>
    </>}
    <div className={styles.searchFooter}><Link href="/recommendations" onClick={navigate}>Browse all products <ArrowRight size={16} aria-hidden="true" /></Link><p className={styles.footnote}>Results update as you type. Search stays in your browser and excludes private plans.</p></div>
  </div>;
}

export function SiteSearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false), [activeProductId, setActiveProductId] = useState<string | null>(null);
  const previous = useRef<HTMLElement | null>(null), dialogRef = useRef<HTMLDivElement>(null), activeProduct = useRef<string | null>(null), pathname = usePathname();
  const selectProduct = useCallback((id: string | null) => { activeProduct.current = id; setActiveProductId(id); }, []);
  useSearchViewport(open, dialogRef);
  function launch(opener?: HTMLElement) { previous.current = opener || (document.activeElement instanceof HTMLElement ? document.activeElement : null); setOpen(true); }
  useEffect(() => { setOpen(false); selectProduct(null); }, [pathname, selectProduct]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !event.altKey) {
        event.preventDefault();
        if (open) { selectProduct(null); setOpen(false); }
        else { previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setOpen(true); }
      }
    };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, [open, selectProduct]);
  return <SearchContext.Provider value={launch}>{children}<Dialog open={open} onOpenChange={next => { if (!next) selectProduct(null); setOpen(next); }}>
    <DialogContent ref={dialogRef} className={styles.dialog} data-unified-search-dialog
      onEscapeKeyDown={event => { if (activeProduct.current !== null) { event.preventDefault(); selectProduct(null); } }}
      onInteractOutside={event => { if (activeProduct.current !== null) event.preventDefault(); }}
      onCloseAutoFocus={event => { event.preventDefault(); if (previous.current?.isConnected) previous.current.focus({ preventScroll: true }); }}>
      <DialogTitle>Find what you need</DialogTitle><DialogDescription>Search products, calculators and simple guides.</DialogDescription>
      <SiteSearchResults onNavigate={() => { selectProduct(null); setOpen(false); }} activeProductId={activeProductId} onActiveProductChange={selectProduct} />
    </DialogContent>
  </Dialog></SearchContext.Provider>;
}
export function SiteSearchButton({ compact = false, onActivate }: { compact?: boolean; onActivate?: () => void }) {
  const open = useContext(SearchContext);
  return <Link href="/search" className={styles.trigger} data-compact={compact} aria-label="Search site" onClick={event => {
    if (open && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); open(event.currentTarget); onActivate?.(); }
  }}><Search size={19} aria-hidden="true" /><span>Search</span></Link>;
}
