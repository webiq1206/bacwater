import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ProductArtwork } from "@/components/partners/product-artwork";
import { AffiliateDisclosure } from "@/components/partners/affiliate-disclosure";
import { getSupplierCatalog, SUPPLIER_PRODUCTS, SUPPLIER_SOURCES, productDetailPath } from "@/lib/partners/supplier-catalog";
import { getProductResearch, PRODUCT_TYPE_LABELS } from "@/lib/partners/product-research";
import { RESEARCH_ONLY_NOTICE } from "@/lib/partners/affiliate";
import styles from "@/components/partners/product-directory.module.css";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return SUPPLIER_PRODUCTS.map(product => ({ slug: product.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params, product = SUPPLIER_PRODUCTS.find(item => item.id === slug);
  if (!product) return { title: "Product not found", robots: { index: false, follow: false } };
  const description = `${product.name}: research identity, product format and documentation checklist. For in-vitro laboratory research only, not for human or animal use.`;
  return { title: `${product.name} | Research Product Details`, description, alternates: { canonical: productDetailPath(slug) }, openGraph: { title: `${product.name} | BACwater.ai`, description, url: productDetailPath(slug), type: "website" } };
}
export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params, product = getSupplierCatalog().find(item => item.id === slug);
  if (!product) notFound();
  const research = getProductResearch(product);
  return <div className={styles.page} data-product-page={product.id}>
    <WebPageJsonLd name={`${product.name}: research product details`} description={research.identity} url={productDetailPath(product.id)}/>
    <Breadcrumbs items={[{label:"Home",href:"/"},{label:"Research products",href:"/products"},{label:product.name,href:productDetailPath(product.id)}]}/>
    <Link className={styles.backLink} href="/products"><ArrowLeft size={16} aria-hidden="true"/>All research products</Link>
    <div className={styles.detailHero}>
      <div className={styles.detailArt}><ProductArtwork product={product}/><p>Original catalog artwork, not a product photograph or a representation of supplier packaging.</p></div>
      <div className={styles.detailCopy}><p className={styles.eyebrow}>{product.label} / Research profile</p><h1>{product.name}</h1><p className={styles.identity}>{research.identity}</p>
        <dl className={styles.facts}><div><dt>Product format</dt><dd>{PRODUCT_TYPE_LABELS[product.kind]}</dd></div><div><dt>Research context</dt><dd>{research.topic}</dd></div></dl>
        <div className={styles.purchase}><p>{RESEARCH_ONLY_NOTICE}</p><AffiliateDisclosure paid={product.paid} research={false}/><a className={styles.primary} href={product.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label={`View ${product.name} at the supplier, opens a new tab`}>View supplier listing<ArrowUpRight size={18} aria-hidden="true"/></a><p>Opens the individual listing in a new tab. Confirm current specifications, price and availability there. No purchase is made on BACwater.ai.</p><Link className={styles.secondaryLink} href="/recommendations">Our independent affiliate disclosure</Link></div>
      </div>
    </div>
    <div className={styles.articleSections}>
      <div><section><p className={styles.eyebrow}>01 / Read the identity</p><h2>What the research context means</h2><p>{research.context}</p></section><section><p className={styles.eyebrow}>02 / Check the documentation</p><h2>Three things to verify</h2><ol className={styles.checklist}>{research.checks.map(check => <li key={check}>{check}</li>)}</ol></section><section><p className={styles.eyebrow}>03 / Know the limits</p><h2>What this page does not claim</h2><p>We have not independently tested this product or authenticated its batch report with the laboratory. A listing, research paper or certificate does not establish a health benefit, human-use suitability, chemical compatibility or a safe amount to administer. We provide no dosing, cycling or administration instructions.</p></section></div>
      <aside><section className={styles.documentation}><h2>Go to the source</h2><a href={product.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer">Product identity and current label<ArrowUpRight size={16} aria-hidden="true"/></a><AffiliateDisclosure paid={product.paid} research={false}/><a href={SUPPLIER_SOURCES.coa} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Supplier certificate library<ArrowUpRight size={16} aria-hidden="true"/></a><a href={SUPPLIER_SOURCES.researchUse} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Research-use restrictions<ArrowUpRight size={16} aria-hidden="true"/></a><p>The product listing is the source for the supplier name and format. Our notes help distinguish entries, not verify a batch or endorse a result. Use the exact lot identifier to find the relevant report.</p></section><section><h2>Looking for something else?</h2><p><Link className={styles.backLink} href="/products">Return to the product directory<ArrowUpRight size={16} aria-hidden="true"/></Link></p><p className={styles.small}>Compare by identity and format. Similar names do not make products interchangeable.</p></section></aside>
    </div>
  </div>;
}
