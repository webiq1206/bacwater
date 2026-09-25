"use client";
import { useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupplierCatalog } from "@/components/partners/supplier-context";
import { AFFILIATE_DISCLOSURE, RESEARCH_ONLY_NOTICE } from "@/lib/partners/supplier-catalog";
import { useSearchViewport } from "@/components/search/use-search-viewport";
import { ProductArtwork } from "@/components/partners/product-artwork";
import { productChoices } from "@/lib/search/public-index";
import { searchScore } from "@/lib/search/matching";
import styles from "./product-picker.module.css";
export function ProductPicker({value,onChange,label="Product",referencesOnly=false,excludeValue}:{value:string;onChange:(value:string)=>void;label?:string;referencesOnly?:boolean;excludeValue?:string}){
 const [open,setOpen]=useState(false),[query,setQuery]=useState(""),uid=useId(),input=useRef<HTMLInputElement>(null),list=useRef<HTMLDivElement>(null),dialogRef=useRef<HTMLDivElement>(null);
 useSearchViewport(open,dialogRef);
 const options=useMemo(()=>productChoices(referencesOnly).filter(p=>p.value!==excludeValue),[referencesOnly,excludeValue]),selected=options.find(p=>p.value===value);
 const catalog=useSupplierCatalog(),destination=catalog.find(p=>p.id===selected?.product?.id);
 const filtered=options.map((p,i)=>({p,i,score:searchScore(query,p.name,`${p.product?.id||""} ${p.product?.reference||""} ${(p.product?.aliases||[]).join(" ")} ${p.description}`)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.i-b.i).map(x=>x.p);
 return <><Dialog open={open} onOpenChange={v=>{setOpen(v);if(v)setQuery("");}}><DialogTrigger asChild><button type="button" role="combobox" aria-label={label} aria-haspopup="dialog" aria-expanded={open} aria-controls={`${uid}-picker`} className={styles.trigger} data-product-picker data-selected-product={selected?.product?.id}>
  <span className={styles.thumb} aria-hidden="true">{selected?.product?<ProductArtwork product={selected.product} compact/>:<Search size={25} strokeWidth={1.5}/>}</span><span className={styles.selection}><small>{selected?"SELECTED PRODUCT":"START HERE"}</small><strong>{selected?.name||"Choose your product"}</strong><span>{selected?"Tap to search or change it.":"Find the name on your label."}</span></span><ChevronDown size={19} aria-hidden="true"/>
 </button></DialogTrigger><DialogContent ref={dialogRef} id={`${uid}-picker`} className={styles.dialog} onOpenAutoFocus={e=>{e.preventDefault();input.current?.focus();}}><DialogTitle>Choose your product</DialogTitle><DialogDescription>Match the exact name on your label. Changing products means entering its numbers again. {RESEARCH_ONLY_NOTICE}</DialogDescription>
  <label className={styles.search}>Search products<div><Search size={19} aria-hidden="true"/><input ref={input} type="search" value={query} onChange={e=>setQuery(e.target.value)} maxLength={80} autoComplete="off" placeholder="Start typing a product name" onKeyDown={e=>{if(e.key==="ArrowDown"){e.preventDefault();list.current?.querySelector<HTMLButtonElement>("button")?.focus();}if(e.key==="Enter"&&filtered.length===1){e.preventDefault();onChange(filtered[0].value);setOpen(false);}}}/></div></label>
  <p className={styles.count} role="status">{filtered.length} {filtered.length===1?"choice":"choices"}</p>
  <div ref={list} className={styles.list} role="listbox" aria-label="Product choices" tabIndex={0}>{filtered.map((p,index)=><button key={p.value} type="button" role="option" aria-selected={p.value===value} aria-label={p.name} className={styles.option} onClick={()=>{onChange(p.value);setOpen(false);}} onKeyDown={e=>{const buttons=Array.from(list.current?.querySelectorAll<HTMLButtonElement>("button")||[]);const next=e.key==="ArrowDown"?Math.min(index+1,buttons.length-1):e.key==="ArrowUp"?Math.max(index-1,0):e.key==="Home"?0:e.key==="End"?buttons.length-1:null;if(next!==null){e.preventDefault();buttons[next]?.focus();}}}>
   <span className={styles.thumb} aria-hidden="true">{p.product?<ProductArtwork product={p.product} compact/>:<Search size={23}/>}</span><span className={styles.optionText}><strong>{p.name}</strong><span>{p.description}</span></span>{p.value===value?<Check size={20} aria-hidden="true"/>:<ChevronDown className={styles.chevron} size={18} aria-hidden="true"/>}
  </button>)}{!filtered.length&&<p className={styles.noResults}>No match. Try a shorter name, or clear the search and choose Other / Custom.</p>}</div>
  <p className={styles.footer} style={{fontSize:13,lineHeight:1.6}}>Our illustrations are not product packaging. {catalog.some(p=>p.paid)&&"We may earn a commission from supplier purchases."}</p>
 </DialogContent></Dialog>{destination&&<><p className={styles.footer} style={{fontSize:13,lineHeight:1.6}}>{destination.paid?AFFILIATE_DISCLOSURE:"Supplier link. No paid referral is active."} {RESEARCH_ONLY_NOTICE}</p><a className={styles.productLink} href={destination.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" data-selected-product-link>View product details<span aria-hidden="true"> ↗</span></a></>}</>;
}
