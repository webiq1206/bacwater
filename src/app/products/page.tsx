import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProductDirectory } from "@/components/partners/product-directory";
import { getSupplierCatalog, CATALOG_CHECKED_AT } from "@/lib/partners/supplier-catalog";
import styles from "@/components/partners/product-directory.module.css";
export const metadata: Metadata = {
  title: "Research Product Directory | Compounds, Blends & BAC Water",
  description: "Browse research compound, blend, solution and BAC water listings. Filter by format, search in your own words and compare product identities. Not for human use.",
  alternates: { canonical: "/products" },
  openGraph: { title: "The research directory | BACwater.ai", description: "Clear product identities. Simple research-only search. Not for human or animal use.", url: "/products", type: "website" },
};
export default function ProductsPage() {
  const products = getSupplierCatalog(), paid = products.some(product => product.paid);
  return <div className={styles.page}>
    <Breadcrumbs items={[{label:"Home",href:"/"},{label:"Research products",href:"/products"}]}/>
    <header className={styles.hero}><div><p className={styles.eyebrow}>The research directory</p><h1>Find the material.<br/><em>Understand the listing.</em></h1></div><div className={styles.heroLead}><p>Explore compounds, blends, solutions and lab water. Search by name or describe the research material.</p><p className={styles.small}>{products.length} catalog listings. No health claims. No guesswork about what is in a bottle.</p></div></header>
    <aside className={styles.notice} aria-label="Research and affiliate disclosures"><p><strong>For laboratory research only.</strong>Not for human consumption, human use, or animal use.</p><p><strong>{paid ? "Affiliate disclosure" : "Independent catalog"}</strong>{paid ? "We may earn a commission when you buy through our links. " : "External supplier links are currently unpaid. "}<Link href="/recommendations">How our links work</Link></p></aside>
    <ProductDirectory products={products}/>
    <div className={styles.endnote}><section><h2>A directory, not a recommendation.</h2><p>Search matches names, laboratory topics and formats. It does not assess suitability, select a regimen or recommend products for people or animals. Product details explain identity and documentation, not consumer benefits.</p></section><section><h2>Check the current source.</h2><p>Catalog destinations last checked {CATALOG_CHECKED_AT}. This is not a live stock or price feed. Verify the label, amount, batch report and availability with the supplier. <Link href="/recommendations">Read our selection and affiliate policy</Link>.</p></section></div>
  </div>;
}
