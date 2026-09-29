"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useSearchViewport } from "./use-search-viewport";
import styles from "./search.module.css";

const SearchContext = createContext<((opener?: HTMLElement) => void) | null>(null);
// Keep the search interface out of the initial sitewide bundle. The standalone
// search page still imports and renders it directly for a working fallback URL.
const SiteSearchResults = dynamic(() => import("./site-search-results").then(m => m.SiteSearchResults), {
  loading: () => <p role="status" className="p-5">Opening search…</p>,
});

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
