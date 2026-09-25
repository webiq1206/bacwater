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

/** Keep reference pages focused; the homepage and directory retain all listings. */
export function ResearchDirectoryLink() {
  return <aside data-research-directory-link className="mx-auto mb-12 w-full max-w-5xl px-4 sm:px-6" aria-label="Research product directory">
    <div className="rounded-2xl border border-border bg-surface p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
      <div className="max-w-2xl">
        <h2 className="text-xl font-serif">Checking research supplies?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Compare listing details and product labels in the complete directory. Research use only. We have not independently tested the products and may earn a commission from linked purchases.</p>
      </div>
      <Link href="/recommendations" className="mt-4 inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-4 sm:mt-0">Browse research supplies <ArrowUpRight size={16} aria-hidden="true"/></Link>
    </div>
  </aside>;
}
