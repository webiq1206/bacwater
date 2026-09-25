"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AFFILIATE_DISCLOSURE, RESEARCH_ONLY_NOTICE, productCalculatorPath, type DisplaySupplierProduct } from "@/lib/partners/supplier-catalog";
import Link from "next/link";
import { ProductArtwork } from "./product-artwork";
import { ProductQuickView } from "./product-quick-view";
import styles from "./recommendations.module.css";
/** Every card is in server HTML. Native scrolling works without scripts or a drag. */
export function ProductSlider({products}:{products:readonly DisplaySupplierProduct[]}) {
  const [query,setQuery]=useState(""),[kind,setKind]=useState("all");
  const filtered=products.filter(p=>(kind==="all"||p.kind===kind)&&`${p.name} ${p.id} ${p.mark} ${p.reference} ${(p.aliases||[]).join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));
  const id=useId(),track=useRef<HTMLDivElement>(null);
  const [range,setRange]=useState({first:1,last:products.length,start:true,end:false});
  useEffect(()=>{
    const el=track.current;if(!el)return;
    const update=()=>{const rect=el.getBoundingClientRect(),cards=Array.from(el.children);const visible=cards.map((c,i)=>({i,r:c.getBoundingClientRect()})).filter(c=>c.r.right>rect.left+12&&c.r.left<rect.right-12);setRange({first:(visible[0]?.i??0)+1,last:(visible.at(-1)?.i??0)+1,start:el.scrollLeft<3,end:el.scrollLeft+el.clientWidth>=el.scrollWidth-3});};
    update();el.addEventListener("scroll",update,{passive:true});const observer=new ResizeObserver(update);observer.observe(el);
    return()=>{el.removeEventListener("scroll",update);observer.disconnect();};
  },[filtered.length,query,kind]);
  useEffect(()=>{track.current?.scrollTo({left:0,behavior:"auto"});},[query,kind]);
  function move(direction:number){const el=track.current;if(!el)return;const card=el.firstElementChild as HTMLElement|null;el.scrollBy({left:direction*((card?.offsetWidth||260)+parseFloat(getComputedStyle(el).columnGap||"20")),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}
  function key(e:KeyboardEvent<HTMLDivElement>){if(e.target!==e.currentTarget)return;if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();move(e.key==="ArrowRight"?1:-1);}if(e.key==="Home"||e.key==="End"){e.preventDefault();track.current?.scrollTo({left:e.key==="Home"?0:track.current.scrollWidth,behavior:"auto"});}}
  return <div className={styles.slider} role="region" aria-roledescription="carousel" aria-label="Research products">
    <div className={styles.filters}><label>Find a product<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search all products" /></label><label>Product type<select aria-label="Product type" value={kind} onChange={e=>setKind(e.target.value)}><option value="all">All products</option><option value="single">Single compounds</option><option value="blend">Blends</option><option value="spray">Sprays and solutions</option><option value="water">Lab water</option></select></label></div>
    <div className={styles.sliderTools}><p id={`${id}-help`}>Swipe the cards, or use the arrows.</p><div><button type="button" aria-label="Previous supplier products" aria-controls={`${id}-track`} disabled={!filtered.length||range.start} onClick={()=>move(-1)}><ArrowLeft size={20} aria-hidden="true"/></button><button type="button" aria-label="Next supplier products" aria-controls={`${id}-track`} disabled={!filtered.length||range.end} onClick={()=>move(1)}><ArrowRight size={20} aria-hidden="true"/></button></div></div>
    <div id={`${id}-track`} ref={track} className={styles.track} role="group" tabIndex={0} aria-label="Scrollable product cards" aria-describedby={`${id}-help`} onKeyDown={key}>
      {filtered.map((product,index)=><article className={styles.card} key={product.id} data-product={product.id} role="group" aria-roledescription="slide" aria-label={`${index+1} of ${filtered.length}: ${product.name}`}>
        <div className={styles.art}><ProductArtwork product={product}/></div>
        <div className={styles.cardBody}><p className={styles.label}>{product.label}</p><h3>{product.name}</h3><p className={styles.summary}>{product.summary}</p><ProductQuickView product={product} className={styles.calculate}/><p className={styles.notice}>{RESEARCH_ONLY_NOTICE}</p><p className={styles.disclosure} style={{fontSize:13,lineHeight:1.6}}>{product.paid?AFFILIATE_DISCLOSURE:"Supplier link. No referral fee is active."}</p><a className={styles.action} href={product.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label={`View ${product.name} from the supplier, opens a new tab`}>View product <ArrowUpRight size={17} aria-hidden="true"/></a><Link className={styles.calculate} href={productCalculatorPath(product.id)}>Use in calculator</Link></div>
      </article>)}
    </div><p className={styles.range} role="status" aria-live="polite">{filtered.length?`Showing ${range.first} to ${range.last} of ${filtered.length}`:"No products match. Try another name or product type."}</p>
  </div>;
}
