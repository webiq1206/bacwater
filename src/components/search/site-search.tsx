"use client";
import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { BASE_SEARCH_ITEMS, SEARCH_KIND_LABEL, searchItems, type SearchItem, type SearchKind } from "@/lib/search/public-index";
import { useSearchViewport } from "./use-search-viewport";
import { useSupplierCatalog } from "@/components/partners/supplier-context";
import { SearchThumbnail } from "./search-thumbnail";
import styles from "./search.module.css";
const SearchContext=createContext<(()=>void)|null>(null);
const categories:[SearchKind|"all",string][]=[["all","All"],["calculator","Calculators"],["product","Products"],["guide","Guides"],["reference","References"]];
function Highlight({text,query}:{text:string;query:string}){
 const start=query.trim()?text.toLowerCase().indexOf(query.trim().toLowerCase()):-1;
 return start<0?<>{text}</>:<>{text.slice(0,start)}<mark>{text.slice(start,start+query.trim().length)}</mark>{text.slice(start+query.trim().length)}</>;
}
export function SiteSearchResults({onNavigate,standalone=false}:{onNavigate?:()=>void;standalone?:boolean}){
 const router=useRouter(),[query,setQuery]=useState(""),[kind,setKind]=useState<SearchKind|"all">("all"),[items,setItems]=useState<readonly SearchItem[]>(BASE_SEARCH_ITEMS),[loading,setLoading]=useState(true),[partial,setPartial]=useState(false),[limit,setLimit]=useState(14);
 const root=useRef<HTMLDivElement>(null),input=useRef<HTMLInputElement>(null),products=useSupplierCatalog();
 useEffect(()=>{
  const controller=new AbortController();
  fetch("/api/search-index",{cache:"no-store",signal:controller.signal}).then(async r=>{if(!r.ok)throw Error("unavailable");const data=await r.json();if(!Array.isArray(data.items))throw Error("invalid");const safe=data.items.filter((i:SearchItem)=>i&&typeof i.title==="string"&&typeof i.description==="string"&&typeof i.keywords==="string"&&typeof i.href==="string"&&/^\/(?:tools(?:\/|$)|peptide-calculator$|peptides(?:\/|$)|calculate\/product\/|learn(?:\/|$)|faq$|methodology$|recommendations$|contact$|privacy$|disclaimer$)/.test(i.href)&&!/[?#\\]/.test(i.href)&&Object.hasOwn(SEARCH_KIND_LABEL,i.kind));setItems(safe);setPartial(!!data.partial);}).catch(e=>{if(e.name!=="AbortError")setPartial(true);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return()=>controller.abort();
 },[]);
 const matched=useMemo(()=>searchItems(items,query,kind),[items,query,kind]);
 const visible=matched.slice(0,limit);
 function search(value:string){setQuery(value);setLimit(14);}
 return <div className={styles.searchBody} ref={root} data-site-search-results data-standalone={standalone}>
  <form role="search" onSubmit={e=>{e.preventDefault();if(visible[0]){onNavigate?.();router.push(visible[0].href);}}} className={styles.searchBox}>
   <label htmlFor={standalone?"page-site-search":"dialog-site-search"}>What are you looking for?</label><div><Search size={20} aria-hidden="true"/><input ref={input} id={standalone?"page-site-search":"dialog-site-search"} type="search" maxLength={80} value={query} onChange={e=>search(e.target.value)} placeholder="Try a product name, calculator, or question" autoComplete="off" spellCheck={false} onKeyDown={e=>{if(e.key==="ArrowDown"){e.preventDefault();root.current?.querySelector<HTMLAnchorElement>("[data-search-result]")?.focus();}}}/>{query&&<button type="button" onClick={()=>{search("");input.current?.focus();}} aria-label="Clear search"><X size={18} aria-hidden="true"/></button>}</div>
  </form>
  <div className={styles.filters} role="group" aria-label="Search categories">{categories.map(([key,label])=><button key={key} type="button" aria-pressed={key===kind} onClick={()=>{setKind(key);setLimit(14);}}>{label}</button>)}</div>
  <p className={styles.status} role="status">{query?`${matched.length} ${matched.length===1?"match":"matches"}`:kind==="all"?"Start with a calculator, or find your product.":`${matched.length} ${kind=== "reference"?"references":kind+"s"}`}{loading?" Loading guides…":partial?" Guide search is temporarily unavailable.":""}</p>
  <div className={styles.results} aria-label="Search results" tabIndex={0}>
   {visible.length?<ul>{visible.map(item=><li key={item.id}><Link href={item.href} className={styles.result} data-search-result={item.id} onClick={onNavigate} onKeyDown={e=>{if(!["ArrowDown","ArrowUp"].includes(e.key))return;const links=Array.from(root.current?.querySelectorAll<HTMLAnchorElement>("[data-search-result]")||[]),n=links.indexOf(e.currentTarget);e.preventDefault();if(e.key==="ArrowUp"&&n===0)input.current?.focus();else links[Math.max(0,Math.min(links.length-1,n+(e.key==="ArrowDown"?1:-1)))]?.focus();}}><SearchThumbnail item={item}/><span className={styles.resultText}><small>{SEARCH_KIND_LABEL[item.kind]}</small><strong><Highlight text={item.title} query={query}/></strong><span>{item.description}</span><b className={styles.openLabel}>{item.kind==="product"||item.kind==="calculator"?"Open calculator":item.kind==="reference"?"Read reference":"Open page"}</b></span><ArrowRight size={18} aria-hidden="true"/></Link>{item.kind==="product"&&products.find(p=>p.id===item.productId)&&<a className={styles.supplierAction} href={products.find(p=>p.id===item.productId)!.href} target="_blank" rel="sponsored nofollow noopener noreferrer" referrerPolicy="no-referrer" aria-label={`View ${item.title} product, opens a new tab`}>View product <span aria-hidden="true">↗</span></a>}</li>)}</ul>:<div className={styles.empty}><Search size={30} aria-hidden="true"/><h3>No matches yet</h3><p>Try a shorter name, different spelling, or the All filter.</p><Link href="/contact" onClick={onNavigate}>Ask us for help</Link></div>}
   {matched.length>limit&&<button className={styles.more} type="button" onClick={()=>setLimit(n=>n+20)}>Show more results</button>}
  </div>
  <p className={styles.footnote}>Results update as you type. Search looks at public pages, not private saved plans.</p>
 </div>;
}
export function SiteSearchProvider({children}:{children:ReactNode}){
 const [open,setOpen]=useState(false),previous=useRef<HTMLElement|null>(null),dialogRef=useRef<HTMLDivElement>(null),pathname=usePathname();
 useSearchViewport(open,dialogRef);
 function launch(){previous.current=document.activeElement instanceof HTMLElement?document.activeElement:null;setOpen(true);}
 useEffect(()=>{setOpen(false);},[pathname]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"&&!e.altKey){e.preventDefault();previous.current=document.activeElement instanceof HTMLElement?document.activeElement:null;setOpen(v=>!v);}};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key);},[]);
 return <SearchContext.Provider value={launch}>{children}<Dialog open={open} onOpenChange={setOpen}><DialogContent ref={dialogRef} className={styles.dialog} onCloseAutoFocus={e=>{e.preventDefault();previous.current?.isConnected&&previous.current.focus();}}><DialogTitle>Find what you need</DialogTitle><DialogDescription>Search calculators, products and simple guides.</DialogDescription><SiteSearchResults onNavigate={()=>setOpen(false)}/></DialogContent></Dialog></SearchContext.Provider>;
}
export function SiteSearchButton({compact=false}:{compact?:boolean}){
 const open=useContext(SearchContext);
 return <Link href="/search" className={styles.trigger} data-compact={compact} aria-label="Search site" onClick={e=>{if(open&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey){e.preventDefault();open();}}}><Search size={19} aria-hidden="true"/><span>Search</span></Link>;
}
