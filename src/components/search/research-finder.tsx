"use client";
import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { trackUsage } from "@/lib/analytics";
import { ArrowRight, ArrowUp, BookOpen, Plus } from "lucide-react";
import { researchReply, FINDER_SUGGESTIONS } from "@/lib/search/research-finder";
import { useSupplierCatalog } from "@/components/partners/supplier-context";
import { ProductQuickView } from "@/components/partners/product-quick-view";
import { PRODUCT_GUIDES } from "@/lib/partners/product-guides";
import { emptyResearchSession, useResearchAssistant } from "./research-assistant-provider";
import { useSearchViewport } from "./use-search-viewport";
import { ProductBuyLink, PurchaseDisclosure } from "@/components/partners/product-purchase";
import styles from "./research-finder.module.css";

export function ResearchFinder(){
 const products=useSupplierCatalog(),{session,setSession,closeAssistant,activeQuickView,selectQuickView}=useResearchAssistant();
 const {question,turns}=session,last=turns.at(-1),uid=useId();
 const input=useRef<HTMLTextAreaElement>(null),conversation=useRef<HTMLDivElement>(null),lastTurn=useRef<HTMLElement>(null);
 // Scroll only the conversation. Keep focus in the composer, and never scroll the page.
 useEffect(()=>{const area=conversation.current,turn=lastTurn.current;if(area&&turn)area.scrollTo({top:area.scrollTop+turn.getBoundingClientRect().top-area.getBoundingClientRect().top-12,behavior:"instant"});},[last?.id]);
 function submit(text:string){
  if(!text.trim())return;
  trackUsage("research_question_submitted");
  setSession(old=>{const answer=researchReply(text,old.context),id=old.sequence+1;return {question:"",context:answer.context,sequence:id,turns:[...old.turns,{id,question:text.trim(),answer}].slice(-12)};});
 }
 function reset(){selectQuickView(null);setSession(emptyResearchSession());input.current?.focus({preventScroll:true});}
 return <div className={styles.finder} data-research-finder>
  <div className={styles.toolbar}><Link href="/recommendations" onClick={closeAssistant}><BookOpen size={15} aria-hidden="true"/>Browse products</Link><button type="button" onClick={reset}><Plus size={16} aria-hidden="true"/>New chat</button></div>
  <div ref={conversation} className={styles.conversation} data-clarity-mask="true" tabIndex={0} role="region" aria-label="Research conversation">
   {!last&&<section className={styles.welcome}><h2>What would you like to explore?</h2><p>Ask about a research topic, a product or a calculator. Start with everyday words.</p><div className={styles.starters}>{FINDER_SUGGESTIONS.map(s=><button key={s.label} onClick={()=>submit(s.question)} aria-label={s.question} title={s.question} type="button">{s.question}<ArrowRight size={15} aria-hidden="true"/></button>)}</div><p className={styles.welcomeNote}>Answers use reviewed sources. No personal treatment or dosing advice.</p></section>}
   {turns.map(turn=><section key={turn.id} ref={turn===last?lastTurn:undefined} className={styles.turn} aria-labelledby={`${uid}-answer-${turn.id}`}>
    <div className={styles.user}><span className={styles.srOnly}>Your question: </span><p>{turn.question}</p></div>
    <div className={styles.answer}>
     <h2 id={`${uid}-answer-${turn.id}`}>Research assistant</h2><p className={styles.reply}>{turn.answer.text}</p>
     {turn.answer.links&&<div className={styles.links}>{turn.answer.links.map(link=><Link key={link.href} href={link.href} onClick={closeAssistant}>{link.label}<ArrowRight size={14} aria-hidden="true"/></Link>)}</div>}
     {turn.answer.matches.length>0&&<div className={styles.cards}>{turn.answer.matches.map(match=>{
      const product=products.find(p=>p.id===match.id);if(!product)return null;
      return <article key={match.id} className={styles.card} data-research-match={match.id}>
       <h3><Link href={`/products/${product.id}`} onClick={closeAssistant}>{product.name}</Link></h3><p className={styles.tag}>{match.evidence}</p>
       <p className={styles.why}>{match.why}</p>
       <details className={styles.study} open={turn.answer.detail!==undefined}><summary>{turn.answer.detail==="how"?"How it works":"Study and limits"}</summary>
        {turn.answer.detail==="how"&&<><h4>How it works</h4><p>{PRODUCT_GUIDES[match.id].how}</p></>}
        <h4>What researchers found</h4><p className={styles.model}>{match.model}</p><p>{match.finding}</p>
        {match.source?<a className={styles.source} href={match.source} target="_blank" rel="noopener noreferrer">{match.id==="dihexa"?"Read withdrawal notice":"Read the study"}<span className={styles.srOnly}> (opens a new tab)</span><span aria-hidden="true">↗</span></a>:<p className={styles.model}>Supplier description. See the full guide for sources.</p>}
        <p className={styles.limit}><strong>Limit: </strong>{match.limit}</p>
       </details>
       <div className={styles.actions}><ProductQuickView product={product} className={styles.quick} open={activeQuickView===`${turn.id}:${product.id}`} onOpenChange={open=>selectQuickView(open?`${turn.id}:${product.id}`:null)}/><Link href={`/products/${product.id}`} onClick={closeAssistant}>Full details <ArrowRight size={14} aria-hidden="true"/></Link></div>
       <div className={styles.purchase}><PurchaseDisclosure product={product}/><ProductBuyLink product={product} showProductName/></div>
      </article>;
     })}</div>}
     {turn.answer.matches.length>0&&<p className={styles.researchNotice}>Research products only. Not for use in people or animals. A study result is not a promise about a supplier’s product.</p>}
     {turn===last&&<div className={styles.options} aria-label="Continue this research question">{turn.answer.options.map(option=><button key={option} type="button" onClick={()=>option==="New question"?reset():submit(option)}>{option}</button>)}</div>}
    </div>
   </section>)}
  </div>
  <div className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{last?`${last.answer.text} ${last.answer.matches.length?`${last.answer.matches.length} product matches available in the conversation.`:""}`:"Ready for your question."}</div>
  <form className={styles.composer} onSubmit={e=>{e.preventDefault();submit(question);}} aria-label="Ask a research question">
   <label className={styles.srOnly} htmlFor={`${uid}-research-question`}>Your research question</label>
   <div><textarea id={`${uid}-research-question`} ref={input} value={question} maxLength={800} rows={1} onChange={e=>setSession(old=>({...old,question:e.target.value}))} placeholder="Ask about research or a tool…" data-clarity-mask="true" autoComplete="off" aria-describedby={`${uid}-privacy`} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();submit(question);}}}/><button type="submit" disabled={!question.trim()} aria-label="Send research question"><ArrowUp size={21} aria-hidden="true"/></button></div>
   <p id={`${uid}-privacy`}>Keep personal details out. Clears on reset or reload. <span>{question.length}/800</span></p>
  </form>
  <p className={styles.note}>Research only · Reviewed notes, not a live web search. <Link href="/disclaimer#finder" onClick={closeAssistant}>Limits & affiliate notice</Link></p>
 </div>;
}

/** The direct page uses the same session and controls as the sitewide panel. */
export function ResearchFinderPageView(){
 const frame=useRef<HTMLDivElement>(null);
 useSearchViewport(true,frame);
 useEffect(()=>{const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=previous;};},[]);
 return <div ref={frame} className={styles.page} data-research-page><div className={styles.pageFrame}><header className={styles.pageHeader}><h1>Research assistant</h1><p>Explore products, studies and tools.</p></header><ResearchFinder/></div></div>;
}
