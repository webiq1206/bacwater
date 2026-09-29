import { ArrowUpRight } from "lucide-react";
import type { DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
import styles from "./product-purchase.module.css";

type PurchaseProduct = Pick<DisplaySupplierProduct, "id" | "name" | "href" | "paid">;

/** One exact, approved destination everywhere. Never add visitor or calculator data. */
export function ProductBuyLink({ product, className = "", selected = false, showProductName = false }: { product: PurchaseProduct; className?: string; selected?: boolean; showProductName?: boolean }) {
  return <a className={`${styles.buy} ${className}`} href={product.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer"
    data-product-buy={product.id} data-selected-product-link={selected || undefined}
    aria-label={`Buy ${product.name} from our partner, opens a new tab`}>
    <span>{showProductName?<>Buy {product.name}<small>from our partner</small></>:"Buy from our partner"}</span><ArrowUpRight size={18} aria-hidden="true"/>
  </a>;
}

export function PurchaseDisclosure({ product, className = "" }: { product: PurchaseProduct; className?: string }) {
  return <p className={`${styles.disclosure} ${className}`} data-purchase-disclosure>
    {product.paid ? "Affiliate link. We may earn a commission." : "Supplier link. No paid referral is active."}
  </p>;
}

export function ProductCardPurchase({ product }: { product: PurchaseProduct }) {
  return <div className={styles.cardPurchase} data-product-card-purchase={product.id}>
    <PurchaseDisclosure product={product}/><ProductBuyLink product={product} showProductName/>
  </div>;
}
