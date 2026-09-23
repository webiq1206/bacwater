import Link from "next/link";
import { ArrowUpRight, FileCheck2 } from "lucide-react";
import { AMINO_SOURCES, getAminoCatalog, type DisplayAminoProduct } from "@/lib/partners/amino-club";
import { ProductSlider } from "./product-slider";
import { AminoWaterLink } from "./supplier-context";
import styles from "./recommendations.module.css";
export function ResearchSupplierSection({products=getAminoCatalog()}:{products?:readonly DisplayAminoProduct[]}) {
  return <section className={styles.section} data-supplier-shelf aria-label="Research supplier listings">
    <div className={styles.intro}><div><p className={styles.eyebrow}>AMINOCLUB / RESEARCH SUPPLIES</p><h2>The research <em>shelf.</em></h2></div><AminoWaterLink compact/></div>
    <p className={styles.lead}>Looking for lab supplies? Start with the label. These links open AminoClub’s site.</p>
    <p className={styles.policy}>For lab research only, not for people or animals. This list is not advice about what to take or mix. We have not tested these products. Your entries do not change this list.</p>
    <ProductSlider products={products}/>
    <div className={styles.bottom}><a href={AMINO_SOURCES.coa} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer"><FileCheck2 size={17} aria-hidden="true"/>Check the supplier’s lab reports</a><Link href="/recommendations">How we choose these links <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
  </section>;
}
export function AminoRecommendations(){return <ResearchSupplierSection/>;}
export function RecommendationsNavLink(){return <Link href="/recommendations" className="underline">Research supplies</Link>;}
