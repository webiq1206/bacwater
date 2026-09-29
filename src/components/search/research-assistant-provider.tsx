"use client";
import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction, type ReactNode } from "react";
import dynamic from "next/dynamic";
import * as Dialog from "@radix-ui/react-dialog";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import type { FinderContext, FinderReply } from "@/lib/search/research-finder";
import { isCalculatorWorkspace } from "@/lib/calculator-routes";
import { useSearchViewport } from "./use-search-viewport";
import styles from "./research-finder.module.css";

export type ResearchTurn={id:number;question:string;answer:FinderReply};
export type ResearchSession={turns:ResearchTurn[];context:FinderContext;question:string;sequence:number};
export const emptyResearchSession=():ResearchSession=>({turns:[],context:{},question:"",sequence:0});
type AssistantContext={openAssistant:(trigger?:HTMLElement)=>void;closeAssistant:()=>void;session:ResearchSession;setSession:Dispatch<SetStateAction<ResearchSession>>};
const Context=createContext<AssistantContext|null>(null);
export function useResearchAssistant(){const value=useContext(Context);if(!value)throw new Error("Research assistant provider is missing");return value;}
const Finder=dynamic(()=>import("./research-finder").then(m=>m.ResearchFinder),{loading:()=> <p className={styles.loading} role="status">Opening research assistant…</p>});

/** Shared tab-memory state survives closing the panel and internal navigation. */
export function ResearchAssistantProvider({children}:{children:ReactNode}){
 const [open,setOpen]=useState(false),[session,setSession]=useState<ResearchSession>(emptyResearchSession);
 const panel=useRef<HTMLDivElement>(null),title=useRef<HTMLHeadingElement>(null),launcher=useRef<HTMLButtonElement>(null),trigger=useRef<HTMLElement|null>(null);
 const path=usePathname()||"/",previousPath=useRef(path);
 const hidden=path.startsWith("/admin")||path.startsWith("/embed")||/\/(pdf|print|labels)$/.test(path);
 const page=path==="/research-finder";
 useSearchViewport(open,panel);
 useEffect(()=>{if(previousPath.current!==path){setOpen(false);previousPath.current=path;}},[path]);
 function openAssistant(from?:HTMLElement){trigger.current=from||null;setOpen(true);}
 return <Context.Provider value={{openAssistant,closeAssistant:()=>setOpen(false),session,setSession}}>
  {children}
  {!hidden&&!page&&<button type="button" ref={launcher} className={styles.launcher} data-research-launcher data-raised={path!=="/"} data-workspace={isCalculatorWorkspace(path)} aria-label="Open research assistant" aria-haspopup="dialog" aria-expanded={open} onClick={e=>openAssistant(e.currentTarget)}><MessageCircle size={20} aria-hidden="true"/><span>Ask a question</span></button>}
  <Dialog.Root open={open&&!hidden} onOpenChange={setOpen}>
   <Dialog.Portal><Dialog.Overlay className={styles.overlay}/><Dialog.Content ref={panel} className={styles.chatPanel} data-research-panel onOpenAutoFocus={e=>{e.preventDefault();title.current?.focus({preventScroll:true});}} onCloseAutoFocus={e=>{e.preventDefault();const target=trigger.current?.isConnected?trigger.current:launcher.current;target?.focus({preventScroll:true});}}>
    <header className={styles.panelHeader}><div><Dialog.Title ref={title} tabIndex={-1}>Research assistant</Dialog.Title><Dialog.Description>Products, studies and calculators</Dialog.Description></div><Dialog.Close aria-label="Close research assistant"><X size={21} aria-hidden="true"/></Dialog.Close></header>
    <Finder/>
   </Dialog.Content></Dialog.Portal>
  </Dialog.Root>
 </Context.Provider>;
}
