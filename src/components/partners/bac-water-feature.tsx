import Link from "next/link";
import { Droplets } from "lucide-react";
import type { DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
import { ProductBuyLink, PurchaseDisclosure } from "./product-purchase";
import styles from "./bac-water-feature.module.css";

/** A direct product destination, separate from the compound browsing carousel. */
export function BacWaterFeature({product}:{product:DisplaySupplierProduct}) {
  return <section className={styles.feature} data-bac-water-feature aria-label="BAC Water from our partner">
    <div className={styles.identity}>
      <span className={styles.icon}><Droplets size={32} aria-hidden="true"/></span>
      <div><h2>BAC Water</h2><p>View sizes, current prices and product details at our partner’s store.</p></div>
    </div>
    <div className={styles.actions}>
      <ProductBuyLink product={product} showProductName/>
      <Link className={styles.details} href={`/products/${product.id}`}>View product details</Link>
    </div>
    <div className={styles.notice}><PurchaseDisclosure product={product}/><p>Laboratory research only. Not for use in people or animals.</p></div>
  </section>;
}
