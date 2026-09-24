import Link from "next/link";
import { ArrowUpRight, FileCheck2 } from "lucide-react";
import { SUPPLIER_SOURCES, RESEARCH_ONLY_NOTICE, getSupplierCatalog, type DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
import { ProductSlider } from "./product-slider";
import { SupplierWaterLink } from "./supplier-context";
import styles from "./recommendations.module.css";
export function ResearchSupplierSection({products=getSupplierCatalog()}:{products?:readonly DisplaySupplierProduct[]}) {
  return <section className={styles.section} data-supplier-shelf aria-label="Research supplier listings">
    <div className={styles.intro}><div><p className={styles.eyebrow}>RESEARCH SUPPLIES</p><h2>The research <em>shelf.</em></h2></div><SupplierWaterLink compact/></div>
    <p className={styles.lead}>Looking for lab supplies? Start with the label. Open research details here, or view the supplier's listing.</p>
    <p className={styles.policy}>{RESEARCH_ONLY_NOTICE} We have not independently tested these products and do not recommend them for a health goal or a particular study.</p>
    <p className={styles.policy}>{products.some(p=>p.paid)?"We are an independent affiliate and may earn a commission from purchases through these links. ":""}{products.length} product listings. Check current sizes and stock on the supplier's website.</p>
    <ProductSlider products={products}/>
    <div className={styles.bottom}><a href={SUPPLIER_SOURCES.coa} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer"><FileCheck2 size={17} aria-hidden="true"/>Check the supplier's lab reports</a><Link href="/recommendations">Browse all research products <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
  </section>;
}
export function SupplierRecommendations(){return <ResearchSupplierSection/>;}
export function RecommendationsNavLink(){return <Link href="/recommendations" className="underline">Research supplies</Link>;}
