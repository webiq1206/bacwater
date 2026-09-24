import Link from "next/link";
import { ArrowUpRight, FileCheck2 } from "lucide-react";
import { SUPPLIER_SOURCES, getSupplierCatalog, type DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
import { ProductSlider } from "./product-slider";
import { SupplierWaterLink } from "./supplier-context";
import styles from "./recommendations.module.css";
export function ResearchSupplierSection({products=getSupplierCatalog()}:{products?:readonly DisplaySupplierProduct[]}) {
  return <section className={styles.section} data-supplier-shelf aria-label="Research supplier listings">
    <div className={styles.intro}><div><p className={styles.eyebrow}>RESEARCH SUPPLIES</p><h2>The research <em>shelf.</em></h2></div><SupplierWaterLink compact/></div>
    <p className={styles.lead}>Looking for lab supplies? Start with the label. These links open the supplier’s site.</p>
    <p className={styles.policy}>For lab research only, not for people or animals. This list is not advice about what to take or mix. We have not tested these products. Use the search to find a product. Calculator entries do not rank this list.</p>
    <p className={styles.policy}>{products.length} product listings. {products.some(product=>product.paid)&&"We may earn a commission if you buy through these links."} <Link href="/products" className="underline">Explore the full product directory</Link>.</p>
    <ProductSlider products={products}/>
    <div className={styles.bottom}><a href={SUPPLIER_SOURCES.coa} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer"><FileCheck2 size={17} aria-hidden="true"/>Check the supplier’s lab reports</a><Link href="/recommendations">How we choose these links <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
  </section>;
}
export function SupplierRecommendations(){return <ResearchSupplierSection/>;}
export function RecommendationsNavLink(){return <Link href="/products" className="underline">Research products</Link>;}
