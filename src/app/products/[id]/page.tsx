import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, BookOpen, FlaskConical, Info, ListChecks, Calculator, FileText } from "lucide-react";
import { RESEARCH_ONLY_NOTICE, SUPPLIER_PRODUCTS, SUPPLIER_SOURCES, getSupplierCatalog, productCalculatorPath } from "@/lib/partners/supplier-catalog";
import { PRODUCT_RESEARCH } from "@/lib/partners/product-content";
import { PRODUCT_GUIDES, SCIENCE_WORDS, productGuideDetails, productGuideFaq } from "@/lib/partners/product-guides";
import { researchCategory } from "@/lib/partners/research-categories";
import { PRODUCT_FORMATS } from "@/lib/partners/product-directory";
import { ProductArtwork } from "@/components/partners/product-artwork";
import { ProductBuyLink, PurchaseDisclosure } from "@/components/partners/product-purchase";
import { ProductPurchaseDock } from "@/components/partners/product-purchase-dock";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { withSocialMetadata } from "@/lib/seo/social-metadata";
import styles from "./product-page.module.css";

export function generateStaticParams(){return SUPPLIER_PRODUCTS.map(p=>({id:p.id}));}
export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{
 const {id}=await params,p=SUPPLIER_PRODUCTS.find(p=>p.id===id);
 if(!p)return {title:"Product not found",robots:{index:false,follow:true}};
 return withSocialMetadata({title:`${p.name}: Research Explained Simply`,description:`What ${p.name} is, how researchers study it, and what is still unknown. Read simple explanations, study summaries, sources and product details.`,alternates:{canonical:`/products/${id}`},robots:{index:true,follow:true}});
}
export default async function ProductPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params,catalog=getSupplierCatalog(),product=catalog.find(p=>p.id===id);
 if(!product)notFound();
 const detail=PRODUCT_RESEARCH[id],guide=PRODUCT_GUIDES[id],category=researchCategory(id);
 const papers=detail.sources.filter(s=>s.type!=="product");
 const related=catalog.filter(p=>p.id!==id&&researchCategory(p.id).id===category.id).slice(0,3);
 return <article className={styles.page} data-full-product={id}>
  <WebPageJsonLd name={`${product.name}: Research Explained Simply`} description={detail.what} url={`/products/${id}`}/>
  <Breadcrumbs items={[{label:"Home",href:"/"},{label:"Products",href:"/recommendations"},{label:product.name,href:`/products/${id}`}]}/>
  <div className={styles.layout}>
   <div className={styles.content}>
    <header className={styles.hero}>
     <p className={styles.eyebrow}><FlaskConical size={14} aria-hidden="true"/>{category.label}</p>
     <div className={styles.heroIdentity}><h1>{product.name}</h1><div className={styles.mobileArt}><ProductArtwork product={product} compact/></div></div>
     <p className={styles.lead}>{detail.what}</p>
     <div className={styles.heroFacts}><span>{PRODUCT_FORMATS[product.kind]}</span><span><BookOpen size={14} aria-hidden="true"/>{guide.model}</span></div>
     <p className={styles.notice}>{RESEARCH_ONLY_NOTICE}</p>
    </header>
    <nav className={styles.jump} aria-label="On this product page">{[["overview","Overview"],["how-it-works","How it works"],["research","Research"],["details","Details"],["questions","Questions"],["sources","Sources"]].map(([anchor,label])=><a key={anchor} href={`#${anchor}`}>{label}</a>)}</nav>
    <section id="overview" className={styles.section}>
     <div className={styles.sectionHeading}><span className={styles.sectionNumber}>01</span><h2>At a glance</h2></div>
     <div className={styles.overview}>
      <div><FlaskConical size={22} aria-hidden="true"/><h3>What researchers study</h3><p>{guide.study}</p></div>
      <div><Info size={22} aria-hidden="true"/><h3>What is still unknown</h3><p>{guide.caution}</p></div>
     </div>
    </section>
    <section id="how-it-works" className={`${styles.section} ${styles.mechanism}`} data-product-mechanism>
     <div className={styles.sectionHeading}><span className={styles.sectionNumber}>02</span><h2>How it works, <em>in plain words.</em></h2></div>
     <p className={styles.bigIdea} data-product-plain>{guide.how}</p>
     <div className={styles.explanation}>{guide.steps.map((paragraph,index)=><div key={index}><span aria-hidden="true">{index+1}</span><div><h3>{index===0?"The idea behind it":"Why that matters"}</h3><p data-mechanism-paragraph>{paragraph}</p></div></div>)}</div>
     <details className={styles.wordHelp}><summary>What do the science words mean?</summary><dl className={styles.words}>{SCIENCE_WORDS.map(([term,meaning])=><div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl></details>
    </section>
    <section id="research" className={styles.section}>
     <div className={styles.sectionHeading}><span className={styles.sectionNumber}>03</span><h2>What the research says</h2></div>
     <p className={styles.sectionIntro}>Here is a starting point from the linked sources. A study about a compound is not a test of the supplier’s product.</p>
     <div className={styles.study} data-study-summary>
      <div className={styles.studyHeader}><BookOpen size={20} aria-hidden="true"/><div><span>Research snapshot</span><p>{guide.model}</p></div></div>
      <div className={styles.studyBody}><h3>{id==="dihexa"?"An important change to the evidence":id==="amino-h2o"?"What the partner reports":"What researchers found"}</h3><p>{guide.finding}</p>
       <div className={styles.studyLimit}><Info size={19} aria-hidden="true"/><div><h4>What this does not show</h4><p>{guide.caution}</p></div></div>
       {guide.paper?<a className={styles.textLink} href={guide.paper} target="_blank" rel="noopener noreferrer">{id==="dihexa"?"Read the retraction notice":"Read the study"}<ArrowUpRight size={16} aria-hidden="true"/><span className={styles.srOnly}> (opens a new tab)</span></a>:<p className={styles.smallNote}>This overview uses the partner’s product description. It does not claim that a study tested every possible use.</p>}
       <a className={styles.textLink} href="#sources">See all sources <ArrowRight size={16} aria-hidden="true"/></a>
      </div>
     </div>
    </section>
    <section id="details" className={styles.section}>
     <div className={styles.sectionHeading}><span className={styles.sectionNumber}>04</span><h2>Product details</h2></div>
     <dl className={styles.specs}>{productGuideDetails(product).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
     <div className={styles.batchNote}><ListChecks size={22} aria-hidden="true"/><div><h3>Check the batch, not just the name.</h3><p>A batch report describes a sample from one batch. Check that its lot number matches the product. A purity number does not prove safety or a health benefit.</p><a className={styles.textLink} href={SUPPLIER_SOURCES.coa} target="_blank" rel="noopener noreferrer">Find the partner’s batch reports <ArrowUpRight size={16} aria-hidden="true"/><span className={styles.srOnly}> (opens a new tab)</span></a></div></div>
    </section>
    <section id="questions" className={styles.section}>
     <div className={styles.sectionHeading}><span className={styles.sectionNumber}>05</span><h2>Common questions</h2></div>
     <div className={styles.faqs}>{productGuideFaq(product).map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </section>
    <section id="sources" className={styles.section} data-product-sources>
     <div className={styles.sectionHeading}><span className={styles.sectionNumber}>06</span><h2>Follow the sources</h2></div>
     <p className={styles.sectionIntro}>Open the papers for their exact methods and results. Background research and evidence gaps are labeled below.</p>
     <ol className={styles.sources}>{papers.map(source=><li key={source.url}><FileText size={19} aria-hidden="true"/><div><span className={styles.tag}>{/retraction/i.test(source.label)?"Retraction notice":source.type==="reference"?"Chemical reference":"Research paper"}</span><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<ArrowUpRight size={16} aria-hidden="true"/><span className={styles.srOnly}> (opens a new tab)</span></a><p>{source.note||"Research on the named compound or experimental system, not a test of this supplier’s product."}</p></div></li>)}</ol>
     {!papers.length&&<p className={styles.smallNote}>This page uses partner information for product identity. It does not claim that a study has tested this water with every compound.</p>}
     <div className={styles.partnerSource}><h3>Product label and purchasing</h3><p>Amino Club provides the current label, size options, price and availability.</p><PurchaseDisclosure product={product}/><ProductBuyLink product={product}/></div>
    </section>
    <section className={styles.calculator}><Calculator size={26} aria-hidden="true"/><div><h2>Have your label numbers?</h2><p>Check the math with the right calculator for this product. It does not choose a dose or tell you how to use it.</p><Link className={styles.textLink} href={productCalculatorPath(id)}>Open product calculator <ArrowRight size={17} aria-hidden="true"/></Link></div></section>
   </div>
   <aside className={styles.purchaseRail} aria-label={`Buy ${product.name} from our affiliate partner`}>
    <div className={styles.purchasePanel} data-product-purchase-panel>
     <figure className={styles.art}><ProductArtwork product={product}/><figcaption>Our illustration, not product packaging.</figcaption></figure>
     <div className={styles.purchaseBody}><p className={styles.eyebrow}>Available through our partner</p><h2>{product.name}</h2><p className={styles.purchaseHelp}>See current prices, sizes and availability on Amino Club.</p><p className={styles.purchaseNotice}>Research products only. Not for use in people or animals.</p></div>
     <div className={styles.purchaseActions}><PurchaseDisclosure product={product}/><ProductBuyLink product={product}/><Link href={productCalculatorPath(id)} className={styles.secondary}>Open product calculator <ArrowRight size={16} aria-hidden="true"/></Link><span>Opens Amino Club in a new tab. Checkout happens there.</span></div>
    </div>
   </aside>
  </div>
  {related.length>0&&<section className={styles.related} aria-label="More in this research category"><p className={styles.eyebrow}>Keep exploring</p><div className={styles.relatedHeading}><h2>More in {category.label}</h2><Link href="/recommendations" className={styles.textLink}>All products <ArrowRight size={16} aria-hidden="true"/></Link></div><p>Shared catalog group, not a recommendation to combine products.</p><div className={styles.relatedGrid}>{related.map(p=><article key={p.id} data-related-product={p.id}><Link className={styles.relatedIdentity} href={`/products/${p.id}`}><ProductArtwork product={p} compact/><span><strong>{p.name}</strong><small>{p.label}</small></span><ArrowRight size={17} aria-hidden="true"/></Link><PurchaseDisclosure product={p}/><ProductBuyLink product={p}/></article>)}</div></section>}
  <Link className={styles.textLink} href="/recommendations">Browse all research products <ArrowRight size={16} aria-hidden="true"/></Link>
  <ProductPurchaseDock product={product}/>
 </article>;
}
