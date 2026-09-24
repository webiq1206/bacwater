"use client";
import { useEffect, type RefObject } from "react";
/** Follow the keyboard viewport without fighting pinch zoom or browser panning. */
export function useSearchViewport(active:boolean,ref:RefObject<HTMLElement|null>){
 useEffect(()=>{if(!active)return;const v=window.visualViewport;let frame=0;const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const el=ref.current;if(!el)return;if(v&&Math.abs(v.scale-1)<.02){el.style.setProperty("--search-height",`${v.height}px`);el.style.setProperty("--search-top",`${v.offsetTop}px`);}else{el.style.removeProperty("--search-height");el.style.removeProperty("--search-top");}});};update();v?.addEventListener("resize",update);v?.addEventListener("scroll",update);window.addEventListener("resize",update);return()=>{cancelAnimationFrame(frame);v?.removeEventListener("resize",update);v?.removeEventListener("scroll",update);window.removeEventListener("resize",update);};},[active,ref]);
}
