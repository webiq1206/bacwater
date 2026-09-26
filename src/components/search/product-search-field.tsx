"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import type { DirectoryMatch } from "@/lib/partners/product-directory";
import { RESEARCH_ONLY_NOTICE, type DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
import { ProductArtwork } from "@/components/partners/product-artwork";
import { ProductQuickView } from "@/components/partners/product-quick-view";
import styles from "./product-search.module.css";

type Props = {
  query: string;
  onChange: (value: string) => void;
  match: DirectoryMatch<DisplaySupplierProduct>;
  inputId?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  onBrowse?: () => void;
  showInitial?: boolean;
  suggestions?: boolean;
  previewCount?: number;
  hideField?: boolean;
  activeProductId?: string | null;
  onActiveProductChange?: (id: string | null) => void;
};

/** Shared, entirely local product search. The result list is directly below the field. */
export function ProductSearchField({ query, onChange, match, inputId, inputRef, onBrowse, showInitial = false, suggestions = true, previewCount = 4, hideField = false, activeProductId, onActiveProductChange }: Props) {
  const uid = useId(), fallbackInput = useRef<HTMLInputElement>(null), root = useRef<HTMLDivElement>(null);
  const input = inputRef || fallbackInput, id = inputId || `${uid}-product-search`;
  const [limit, setLimit] = useState(previewCount);
  useEffect(() => {
    setLimit(previewCount);
    const results = root.current?.querySelector<HTMLElement>("[data-product-search-matches]");
    if (results) results.scrollTop = 0;
  }, [query, previewCount]);
  const showResults = suggestions && (showInitial || Boolean(query.trim()));
  const visible = match.products.slice(0, limit);
  function firstResult() { return root.current?.querySelector<HTMLButtonElement>("[data-product-match] > button"); }
  function clear() { onChange(""); input.current?.focus(); }
  return <div ref={root} className={styles.finder} data-live-product-search>
    {!hideField && <form role="search" aria-label="Find research products" onSubmit={event => {
      event.preventDefault();
      if (onBrowse) onBrowse(); else firstResult()?.click();
    }}>
      <label htmlFor={id} className={styles.label}>Find a product</label>
      <div className={styles.field}>
        <Search size={21} aria-hidden="true" />
        <input ref={input} id={id} type="search" value={query} onChange={event => onChange(event.target.value)} maxLength={160}
          placeholder="Search products…" autoComplete="off" spellCheck={false} enterKeyHint="search"
          aria-describedby={`${uid}-help`} aria-controls={showResults ? `${uid}-matches` : undefined} data-clarity-mask="true"
          onKeyDown={event => { if (event.key === "ArrowDown" && firstResult()) { event.preventDefault(); firstResult()?.focus(); } }} />
        {query && <button type="button" aria-label="Clear product search" onClick={clear}><X size={19} aria-hidden="true" /></button>}
      </div>
      <p id={`${uid}-help`} className={styles.help}>Search by name or format. Results appear as you type.</p>
    </form>}
    {showResults && <div id={`${uid}-matches`} className={styles.matches} data-product-search-matches data-live-search-scope={match.scope}>
      <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">{match.products.length ? `${match.products.length} ${match.products.length === 1 ? "product" : "products"}${match.products.length > visible.length ? ` · Showing ${visible.length}` : ""}` : match.scope === "restricted" ? "Search by product name or format only." : "No matching products."}</p>
      {visible.length ? <ul aria-label="Matching products" onKeyDown={event => {
        if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-product-match] > button"));
        const current = buttons.indexOf(event.target as HTMLButtonElement);
        if (current < 0) return;
        event.preventDefault();
        if (event.key === "ArrowUp" && current === 0) input.current?.focus();
        else buttons[Math.max(0, Math.min(buttons.length - 1, current + (event.key === "ArrowDown" ? 1 : -1)))]?.focus();
      }}>{visible.map(product => <li key={product.id} data-product-match={product.id}>
        <ProductQuickView product={product} className={styles.match}
          open={onActiveProductChange ? activeProductId === product.id : undefined}
          onOpenChange={open => onActiveProductChange?.(open ? product.id : null)}>
          <span className={styles.thumbnail}><ProductArtwork product={product} compact /></span>
          <span className={styles.matchText}><strong>{product.name}</strong><span>{product.label}</span><small>Research details</small></span>
          <ArrowRight size={18} aria-hidden="true" />
        </ProductQuickView>
      </li>)}</ul> : <div className={styles.empty}><p>{match.message}</p>{query && <button type="button" onClick={clear}>Clear search</button>}</div>}
      {match.products.length > visible.length && <button type="button" className={styles.more} onClick={() => onBrowse ? onBrowse() : setLimit(value => value + 12)}>{onBrowse ? `See all ${match.products.length} matching products` : "Show more products"}<ArrowRight size={16} aria-hidden="true" /></button>}
    </div>}
    <p className={styles.researchNotice}>{RESEARCH_ONLY_NOTICE}</p>
  </div>;
}
