"use client";
import { useEffect } from "react";
/** Content is visible without JavaScript. Only nonessential sections animate once. */
export function SectionReveals(){useEffect(()=>{
 const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
 if(motion.matches||!("IntersectionObserver" in window)||!Element.prototype.animate)return;
 const animations:Animation[]=[];
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;observer.unobserve(entry.target);if(!motion.matches)animations.push(entry.target.animate([{opacity:0.7,transform:"translateY(6px)"},{opacity:1,transform:"translateY(0)"}],{duration:220,easing:"ease-out"}));}),{threshold:0.08});
 document.querySelectorAll("[data-reveal]").forEach(element=>observer.observe(element));
 const stop=()=>{if(motion.matches){observer.disconnect();animations.forEach(a=>a.cancel());}};motion.addEventListener("change",stop);
 return()=>{observer.disconnect();animations.forEach(a=>a.cancel());motion.removeEventListener("change",stop);};
 },[]);return null;}
