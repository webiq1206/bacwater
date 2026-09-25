"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, PackageSearch } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupplierCatalog } from "@/components/partners/supplier-context";
import { matchDirectory } from "@/lib/partners/product-directory";
import { ProductSearchField } from "./product-search-field";
import { useSearchViewport } from "./use-search-viewport";
import searchStyles from "./search.module.css";
import styles from "./product-search.module.css";

/** Available in desktop navigation, expanded mobile navigation and calculator workspaces. */
export function ProductSearchButton({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false), [query, setQuery] = useState("");
  const dialog = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null);
  const products = useSupplierCatalog(), pathname = usePathname();
  useSearchViewport(open, dialog);
  useEffect(() => { setOpen(false); }, [pathname]);
  const match = useMemo(() => {
    const result = matchDirectory(products, query);
    return { ...result, products: [...result.products].sort((a, b) => a.name.localeCompare(b.name)) };
  }, [products, query]);
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><button type="button" className={`${styles.navTrigger} ${compact ? styles.compactTrigger : ""}`} aria-label="Search products" data-product-search-trigger>
      <PackageSearch size={19} aria-hidden="true" /><span>Search products</span>
    </button></DialogTrigger>
    <DialogContent ref={dialog} className={`${searchStyles.dialog} ${styles.productDialog}`} data-product-search-dialog onOpenAutoFocus={event => { event.preventDefault(); input.current?.focus(); }}>
      <DialogTitle>Search products</DialogTitle>
      <DialogDescription>Find a product by name or format. Open research details without leaving this page.</DialogDescription>
      <ProductSearchField query={query} onChange={setQuery} match={match} inputRef={input} showInitial previewCount={6} />
      <div className={styles.dialogFooter}><Link href="/recommendations" onClick={() => setOpen(false)}>Browse the full directory <ArrowRight size={16} aria-hidden="true" /></Link><p>Search stays in your browser. Images are original directory illustrations, not product packaging.</p></div>
    </DialogContent>
  </Dialog>;
}
