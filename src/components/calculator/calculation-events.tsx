"use client";
import { useEffect } from "react";
import { trackUsage } from "@/lib/analytics";
export function CalculationEvents() {
 useEffect(() => { let started=false; const start=(e:Event)=>{if(!started && e.target instanceof HTMLInputElement && e.target.closest("[data-calculator-workspace]")){started=true;trackUsage("tool_started");}}; document.addEventListener("input",start); return ()=>document.removeEventListener("input",start); },[]);
 return null;
}
/** Counts a transition to a valid result without reading or transmitting its values. */
export function CalculationOutcome({ready}:{ready:boolean}) {
 useEffect(()=>{if(ready)trackUsage("calculation_completed");},[ready]);
 return null;
}
