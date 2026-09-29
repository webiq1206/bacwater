"use client";
import { useEffect, useRef } from "react";
import type { DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
import { ProductBuyLink, PurchaseDisclosure } from "./product-purchase";
import styles from "./product-purchase.module.css";

/** Reserve the actual dock height, including large text and the device safe area. */
export function ProductPurchaseDock({ product }: { product: DisplaySupplierProduct }) {
  const dock = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = dock.current;
    if (!el) return;
    const update = () => document.documentElement.style.setProperty("--product-purchase-height", `${Math.ceil(el.getBoundingClientRect().height)}px`);
    const observer = new ResizeObserver(update);
    observer.observe(el); update();
    return () => { observer.disconnect(); document.documentElement.style.removeProperty("--product-purchase-height"); };
  }, []);
  return <div ref={dock} className={styles.dock} data-product-purchase-dock={product.id} role="region" aria-label={`Purchase ${product.name} from our partner`}>
    <div className={styles.dockInner}>
      <div className={styles.dockIdentity}><strong title={product.name}>{product.name}</strong><span>Research products only</span></div>
      <ProductBuyLink product={product}/>
      <PurchaseDisclosure product={product}/>
    </div>
  </div>;
}
