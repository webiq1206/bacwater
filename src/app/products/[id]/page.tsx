import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { AFFILIATE_DISCLOSURE, RESEARCH_ONLY_NOTICE, SUPPLIER_PRODUCTS, SUPPLIER_SOURCES, getSupplierCatalog, productCalculatorPath } from "@/lib/partners/supplier-catalog";
import { PRODUCT_RESEARCH } from "@/lib/partners/product-content";
import { PRODUCT_GUIDES, SCIENCE_WORDS, productGuideDetails, productGuideFaq } from "@/lib/partners/product-guides";
import { researchCategory } from "@/lib/partners/research-categories";
import { ProductArtwork } from "@/components/partners/product-artwork";
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
 const {id}=await params,product=getSupplierCatalog().find(p=>p.id===id);
 if(!product)notFound();
 const detail=PRODUCT_RESEARCH[id],guide=PRODUCT_GUIDES[id],category=researchCategory(id);
 const papers=detail.sources.filter(s=>s.type!=="product");
 const related=category.id==="additional"?[]:SUPPLIER_PRODUCTS.filter(p=>p.id!==id&&researchCategory(p.id).id===category.id).slice(0,4);
 return <article className={styles.page} data-full-product={id}>
  <WebPageJsonLd name={`${product.name}: Research Explained Simply`} description={detail.what} url={`/products/${id}`}/>
  <Breadcrumbs items={[{label:"Home",href:"/"},{label:"Research products",href:"/recommendations"},{label:product.name,href:`/products/${id}`}]}/>
  <header className={styles.hero}>
   <div className={styles.heroCopy}><p className={styles.eyebrow}>{category.label} · Research guide</p><h1>{product.name}</h1><p className={styles.lead}>{detail.what}</p><p className={styles.notice}>{RESEARCH_ONLY_NOTICE}</p>
    <div className={styles.actions}><a href="#how-it-works" className={styles.primary}>How it works <ArrowRight size={18} aria-hidden="true"/></a><a href="#research" className={styles.textLink}><BookOpen size={18} aria-hidden="true"/>Explore the research</a></div>
   </div><figure className={styles.art}><ProductArtwork product={product}/><figcaption>Our illustration, not product packaging.</figcaption></figure>
  </header>
  <p className={styles.disclosure}>{product.paid?AFFILIATE_DISCLOSURE:"Supplier links. No paid referral is active."} BACwater is an independent site.</p>
  <nav className={styles.jump} aria-label="On this product page">{[["overview","At a glance"],["how-it-works","How it works"],["research","Research"],["details","Product details"],["questions","Questions"],["sources","Sources"]].map(([anchor,label])=><a key={anchor} href={`#${anchor}`}>{label}</a>)}</nav>
  <section id="overview" className={styles.section}><p className={styles.eyebrow}>Start here</p><h2>The main idea, <em>made simple.</em></h2><div className={styles.overview}>
   <div><span className={styles.number}>01</span><h3>What researchers study</h3><p>{guide.study}</p></div>
   <div><span className={styles.number}>02</span><h3>What kind of evidence?</h3><p>{guide.model}.</p><p>The research concerns the named molecule or topic. It is not a test of the product you may buy.</p></div>
   <div><span className={styles.number}>03</span><h3>What is still unknown?</h3><p>{guide.caution}</p></div>
  </div></section>
  <section id="how-it-works" className={styles.section} data-product-mechanism><p className={styles.eyebrow}>A closer look</p><h2>How it works</h2><p className={styles.bigIdea} data-product-plain>{guide.how}</p><div className={styles.explanation}>{guide.steps.map((paragraph,index)=><div key={index}><h3>{index===0?"The idea behind it":"Why the details matter"}</h3><p data-mechanism-paragraph>{paragraph}</p></div>)}</div><a href="#sources" className={styles.textLink}>See the sources behind this explanation <ArrowRight size={16} aria-hidden="true"/></a></section>
  <section id="research" className={styles.section}><p className={styles.eyebrow}>Evidence, with context</p><h2>What did the research find?</h2><p className={styles.sectionIntro}>A study can answer one small question without proving the whole story. Here is one useful starting point from the sources below.</p>
   <div className={styles.study} data-study-summary><p className={styles.tag}>{guide.model}</p><h3>{id==="dihexa"?"An important change to the evidence":id==="amino-h2o"?"What the partner reports":"The finding in plain language"}</h3><p>{guide.finding}</p><div className={styles.studyLimit}><strong>What this does not show</strong><p>{guide.caution}</p></div>
    {guide.paper?<a className={styles.textLink} href={guide.paper} target="_blank" rel="noopener noreferrer">{id==="dihexa"?"Read the retraction notice":"Read the linked research"} <ArrowUpRight size={16} aria-hidden="true"/><span className={styles.srOnly}> (opens a new tab)</span></a>:<a className={styles.textLink} href={product.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer">Read the partner’s product information <ArrowUpRight size={16} aria-hidden="true"/></a>}
   </div><p className={styles.smallNote}>Research on an ingredient, a related molecule or a study drug does not prove the quality, safety or effects of a supplier’s product. No source on this page establishes personal-use suitability.</p>
  </section>
  <section id="details" className={styles.section}><p className={styles.eyebrow}>Know what you are reading</p><h2>Product details <em>and checks.</em></h2><dl className={styles.specs}>{productGuideDetails(product).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className={styles.smallNote}>We do not copy a batch’s purity percentage onto every product or treat it as a safety claim. Current sizes and batch results are on the partner’s site.</p><a className={styles.textLink} href={SUPPLIER_SOURCES.coa} target="_blank" rel="noopener noreferrer">Find the supplier’s batch reports <ArrowUpRight size={16} aria-hidden="true"/></a></section>
  <section className={styles.section}><h2>Words made simple</h2><dl className={styles.words}>{SCIENCE_WORDS.map(([term,meaning])=><div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl></section>
  <section id="questions" className={styles.section}><h2>Common questions</h2><div className={styles.faqs}>{productGuideFaq(product).map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
  <section id="sources" className={styles.section} data-product-sources><p className={styles.eyebrow}>Follow the evidence</p><h2>Studies <em>and sources.</em></h2><p className={styles.sectionIntro}>Open a source for its exact methods and results. We label background papers and evidence gaps so they are not mistaken for tests of this product.</p><ol className={styles.sources}>{papers.map(source=><li key={source.url}><span className={styles.tag}>{/retraction/i.test(source.label)?"Retraction notice":source.type==="reference"?"Chemical reference":"Research paper"}</span><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<ArrowUpRight size={17} aria-hidden="true"/><span className={styles.srOnly}> (opens a new tab)</span></a><p>{source.note||"Research on the named compound or experimental system, not a test of this supplier’s product."}</p></li>)}</ol>{!papers.length&&<p>This page uses partner information for product identity. It does not claim that a study has tested this water with every compound.</p>}
   <div className={styles.partnerSource}><h3>Product identity and current label</h3><p>{product.paid?AFFILIATE_DISCLOSURE:"Supplier link. No paid referral is active."}</p><a className={styles.textLink} href={product.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer">Partner product information <ArrowUpRight size={17} aria-hidden="true"/></a></div>
  </section>
  <section className={styles.next}><div><p className={styles.eyebrow}>Keep exploring</p><h2>Check the label. <em>Then check the math.</em></h2><p>Our calculator uses your numbers. It does not choose an amount or tell you how to use a product.</p></div><Link href={productCalculatorPath(id)} className={styles.primary}>Open product calculator <ArrowRight size={18} aria-hidden="true"/></Link></section>
  {related.length>0&&<nav className={styles.related} aria-label="More in this research category"><h2>More in {category.label}</h2><p>Shared catalog group, not a recommendation to combine products.</p><div>{related.map(p=><Link key={p.id} href={`/products/${p.id}`}>{p.name}<ArrowRight size={16} aria-hidden="true"/></Link>)}</div></nav>}
  <Link className={styles.textLink} href="/recommendations">Browse all research products <ArrowRight size={16} aria-hidden="true"/></Link>
 </article>;
}
