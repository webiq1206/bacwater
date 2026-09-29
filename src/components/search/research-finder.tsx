"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp, BookOpen, Plus, Search } from "lucide-react";
import { researchReply, FINDER_STARTERS, type FinderContext, type FinderReply } from "@/lib/search/research-finder";
import { useSupplierCatalog } from "@/components/partners/supplier-context";
import { ProductQuickView } from "@/components/partners/product-quick-view";
import { ProductArtwork } from "@/components/partners/product-artwork";
import { PRODUCT_GUIDES } from "@/lib/partners/product-guides";
import styles from "./research-finder.module.css";

type Turn={id:number;question:string;answer:FinderReply};
export function ResearchFinder(){
 const products=useSupplierCatalog();
 const [question,setQuestion]=useState(""),[turns,setTurns]=useState<Turn[]>([]),[context,setContext]=useState<FinderContext>({});
 const input=useRef<HTMLTextAreaElement>(null),lastAnswer=useRef<HTMLHeadingElement>(null),sequence=useRef(0);
 const last=turns.at(-1);
 useEffect(()=>{if(last)lastAnswer.current?.focus({preventScroll:false});},[last]);
 function submit(text:string){
  if(!text.trim())return;
  const answer=researchReply(text,context);
  setContext(answer.context);setQuestion("");
  setTurns(old=>[...old,{id:++sequence.current,question:text.trim(),answer}].slice(-12));
 }
 function reset(){setTurns([]);setContext({});setQuestion("");input.current?.focus();}
 return <div className={styles.finder} data-research-finder>
  <div className={styles.toolbar}><span><BookOpen size={18} aria-hidden="true"/> Research finder</span><button type="button" onClick={reset}><Plus size={17} aria-hidden="true"/> New question</button></div>
  {!last&&<section className={styles.welcome}><span className={styles.icon}><Search size={28} aria-hidden="true"/></span><h2>What would you like to understand?</h2><p>Describe a lab question in your own words. We’ll help you find relevant catalog entries and explain the research behind them.</p><div className={styles.starters}>{FINDER_STARTERS.map(s=><button key={s} onClick={()=>submit(s)} type="button">{s}<ArrowRight size={17} aria-hidden="true"/></button>)}</div></section>}
  <div className={styles.conversation} data-clarity-mask="true" aria-label="Research conversation">
   {turns.map(turn=><section key={turn.id} className={styles.turn} aria-labelledby={`finder-answer-${turn.id}`}>
    <div className={styles.user}><span>Your question</span><p>{turn.question}</p></div>
    <div className={styles.answer}>
     <h2 id={`finder-answer-${turn.id}`} ref={turn===last?lastAnswer:undefined} tabIndex={-1}>Research finder</h2><p className={styles.reply}>{turn.answer.text}</p>
     {turn.answer.matches.length>0&&<div className={styles.cards}>{turn.answer.matches.map(match=>{
      const product=products.find(p=>p.id===match.id);if(!product)return null;
      return <article key={match.id} className={styles.card} data-research-match={match.id}>
       <div className={styles.product}><div className={styles.art}><ProductArtwork product={product} compact/></div><div><span className={styles.tag}>{match.evidence}</span><h3><Link href={`/products/${product.id}`}>{product.name}</Link></h3></div></div>
       <div className={styles.cardBody}><h4>Why it relates</h4><p>{match.why}</p>
        <details><summary>How it works, in plain words</summary><p>{PRODUCT_GUIDES[match.id].how}</p></details>
        <h4>What the source found</h4><span className={styles.model}>{match.model}</span><p>{match.finding}</p>
        {match.source?<a className={styles.source} href={match.source} target="_blank" rel="noopener noreferrer">{match.id==="dihexa"?"Read the withdrawal notice":"Read the linked study"}<span className={styles.srOnly}> (opens a new tab)</span><span aria-hidden="true">↗</span></a>:<span className={styles.model}>Based on the partner’s description. See sources in the full guide.</span>}
        <div className={styles.limit}><strong>What this does not prove</strong><p>{match.limit}</p></div>
       </div>
       <div className={styles.actions}><ProductQuickView product={product} className={styles.quick}/><Link href={`/products/${product.id}`}>Full details <ArrowRight size={16} aria-hidden="true"/></Link></div>
      </article>;
     })}</div>}
     {turn===last&&<div className={styles.options} aria-label="Continue this research question">{turn.answer.options.map(option=><button key={option} type="button" onClick={()=>option==="New question"?reset():submit(option)}>{option}<ArrowRight size={15} aria-hidden="true"/></button>)}</div>}
    </div>
   </section>)}
  </div>
  <form className={styles.composer} onSubmit={e=>{e.preventDefault();submit(question);}} aria-label="Ask a research question">
   <label htmlFor="research-question">Your lab question</label>
   <div><textarea id="research-question" ref={input} value={question} maxLength={800} rows={2} onChange={e=>setQuestion(e.target.value)} placeholder="For example: Which studies look at how cells move?" data-clarity-mask="true" autoComplete="off" aria-describedby="finder-privacy" onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();submit(question);}}}/><button type="submit" disabled={!question.trim()} aria-label="Send research question"><ArrowUp size={23} aria-hidden="true"/></button></div>
   <p id="finder-privacy">Keep personal details and lab secrets out. Text stays in this page and clears when you leave or reload. {question.length}/800</p>
  </form>
  <p className={styles.note}>Guided search from reviewed notes, not a live search of every study. It cannot choose a product for your experiment, give a dose or advise personal use. <Link href="/disclaimer#finder">How it works and its limits</Link>.</p>
  <p className={styles.note}>BACwater.ai is an independent Amino Club affiliate. We may earn a commission through links in product guides. Research products are not for people or animals.</p>
 </div>;
}
