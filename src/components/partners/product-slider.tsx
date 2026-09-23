"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { DisplayAminoProduct } from "@/lib/partners/amino-club";
import styles from "./recommendations.module.css";
/** Every card is in server HTML. Native scrolling works without scripts or a drag. */
export function ProductSlider({products}:{products:readonly DisplayAminoProduct[]}) {
  const id=useId(),track=useRef<HTMLDivElement>(null);
  const [range,setRange]=useState({first:1,last:products.length,start:true,end:false});
  useEffect(()=>{
    const el=track.current;if(!el)return;
    const update=()=>{const rect=el.getBoundingClientRect(),cards=Array.from(el.children);const visible=cards.map((c,i)=>({i,r:c.getBoundingClientRect()})).filter(c=>c.r.right>rect.left+12&&c.r.left<rect.right-12);setRange({first:(visible[0]?.i??0)+1,last:(visible.at(-1)?.i??0)+1,start:el.scrollLeft<3,end:el.scrollLeft+el.clientWidth>=el.scrollWidth-3});};
    update();el.addEventListener("scroll",update,{passive:true});const observer=new ResizeObserver(update);observer.observe(el);
    return()=>{el.removeEventListener("scroll",update);observer.disconnect();};
  },[products.length]);
  function move(direction:number){const el=track.current;if(!el)return;const card=el.firstElementChild as HTMLElement|null;el.scrollBy({left:direction*((card?.offsetWidth||260)+20),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}
  function key(e:KeyboardEvent<HTMLDivElement>){if(e.target!==e.currentTarget)return;if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();move(e.key==="ArrowRight"?1:-1);}if(e.key==="Home"||e.key==="End"){e.preventDefault();track.current?.scrollTo({left:e.key==="Home"?0:track.current.scrollWidth,behavior:"auto"});}}
  return <div className={styles.slider} role="region" aria-roledescription="carousel" aria-label="AminoClub research products">
    <div className={styles.sliderTools}><p id={`${id}-help`}>Swipe the cards, or use the arrows.</p><div><button type="button" aria-label="Previous supplier products" aria-controls={`${id}-track`} disabled={range.start} onClick={()=>move(-1)}><ArrowLeft size={20} aria-hidden="true"/></button><button type="button" aria-label="Next supplier products" aria-controls={`${id}-track`} disabled={range.end} onClick={()=>move(1)}><ArrowRight size={20} aria-hidden="true"/></button></div></div>
    <div id={`${id}-track`} ref={track} className={styles.track} tabIndex={0} aria-label="Scrollable product cards" aria-describedby={`${id}-help`} onKeyDown={key}>
      {products.map((product,index)=><article className={styles.card} key={product.id} data-product={product.id} role="group" aria-roledescription="slide" aria-label={`${index+1} of ${products.length}: ${product.name}`}>
        <div className={styles.identity} aria-hidden="true"><div className={styles.identityMeta}><span>AMINOCLUB / {String(index+1).padStart(2,"0")}</span><ArrowUpRight size={15}/></div><span className={styles.mark}>{product.mark}</span><span className={styles.identityFoot}>{product.supplierName}</span></div>
        <div className={styles.cardBody}><p className={styles.label}>{product.label}</p><h3>{product.name}</h3><p className={styles.summary}>{product.summary}</p><p className={styles.notice}>Lab research only.<br/>Not for people or animals.</p><p className={styles.disclosure}>{product.paid?"Paid link. We may earn a fee.":"Supplier link. No referral fee is active."}</p><a className={styles.action} href={product.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label={`View ${product.name} at AminoClub, opens a new tab`}>View product <ArrowUpRight size={17} aria-hidden="true"/></a></div>
      </article>)}
    </div><p className={styles.range} role="status" aria-live="polite">Showing {range.first} to {range.last} of {products.length}</p>
  </div>;
}
