import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProductDirectory } from "@/components/partners/product-directory";
import { getSupplierCatalog, RESEARCH_ONLY_NOTICE, SUPPLIER_SOURCES } from "@/lib/partners/supplier-catalog";
import styles from "@/components/partners/product-directory.module.css";

export const metadata={title:"Research Product Directory: BAC Water and Compounds",description:"Browse research compound, blend, solution and BAC water listings. Search by name or format and review product details. Laboratory research only, not for human use.",alternates:{canonical:"/recommendations"},openGraph:{title:"Research Product Directory",description:"Find a research listing by name or format. Read labels, batch-document guidance and affiliate disclosures.",url:"/recommendations"}};
export default function RecommendationsPage(){
  const products=getSupplierCatalog(),paid=products.some(p=>p.paid);
  return <div className={styles.page}>
    <Breadcrumbs items={[{label:"Home",href:"/"},{label:"Research supplies",href:"/recommendations"}]}/>
    <header className={styles.hero}>
      <p className={styles.eyebrow}>THE RESEARCH DIRECTORY</p>
      <h1>Research products.<br/><em>Clearly organized.</em></h1>
      <p className={styles.lead}>Browse {products.length} listings, narrow by format, or describe the product you need. Open research details without losing your place.</p>
      <div className={styles.notice}><strong>{RESEARCH_ONLY_NOTICE}</strong><p>{paid?"We are an independent affiliate and may earn a commission from purchases through supplier links.":"These are supplier links. No paid referral is active."} We do not represent the supplier, endorse suitability or provide medical advice.</p></div>
    </header>
    <ProductDirectory products={products}/>
    <section className={styles.policies} aria-label="Directory and affiliate information">
      <details><summary>What the product details explain</summary><p>Each detail panel identifies the listing, explains distinctions between similarly named entries and formats, and points to supplier labels and batch reports. It does not claim health, recovery, weight, performance or cosmetic benefits. We have not independently tested these products.</p></details>
      <details><summary>How search and sorting work</summary><p>Search matches public product names and formats in your browser. It does not send your text to an AI service or the supplier. No product is recommended for a health goal, a person, an animal or a particular study. Sort order is alphabetical, not based on commission, personal information, calculator entries or saved plans. Unknown requests produce no guessed alternatives.</p></details>
      <details><summary>How affiliate links work</summary><p>{paid?"Supplier product links contain our referral attribution. We may earn a commission on qualifying purchases.":"Paid referral attribution is currently inactive."} Links open the exact supplier product listing in a new tab. We do not add your search, account information, notes or calculator values. The supplier handles ordering, pricing, availability, delivery and returns. No price, discount or commission payout is guaranteed. Our artwork is original directory artwork, not supplier packaging.</p></details>
      <details><summary>What to check before following a product link</summary><p>Confirm the current product identity, full composition, package amount and batch. Match its certificate of analysis to the exact batch and consult the supplier's research-use restrictions. This directory is not a live inventory feed, and listings can change. Read the <a href={SUPPLIER_SOURCES.coa} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">supplier's batch reports</a> and <a href={SUPPLIER_SOURCES.researchUse} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">research-use rules</a>.</p></details>
    </section>
    <nav className={styles.pageLinks} aria-label="Related information"><Link href="/peptide-calculator">Back to the calculator</Link><Link href="/privacy">Privacy</Link><Link href="/editorial-policy">Editorial policy</Link></nav>
  </div>;
}
