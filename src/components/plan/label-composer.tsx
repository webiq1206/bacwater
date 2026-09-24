"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Printer, Download, RotateCcw } from "lucide-react";
import { VialLabel, LABEL_SHEET_STYLES, type VialLabelData } from "./vial-label";
import { DEFAULT_LABEL_SIZE, LABEL_SIZES, formatLabelDate, labelLayout, labelUseBy, validLabelSize, validMixDate, type LabelPaper, type LabelPrintData } from "@/lib/labels/layout";
export interface LabelPlan extends VialLabelData { planName?: string; }
interface Settings { dates: string[]; days: string; printedExpiry: string; }
const fingerprint=(p:LabelPlan)=>`${p.peptideName}|${p.vialStrengthMg}|${p.bacWaterMl}`;
export function LabelComposer({plans}:{plans:LabelPlan[]}) {
 const batch=plans.length>1,initialCount=batch?2:6;
 const [settings,setSettings]=useState<Record<string,Settings>>(()=>Object.fromEntries(plans.map(p=>[p.publicId,{dates:Array(initialCount).fill(validMixDate(p.defaultMixDate||"")?p.defaultMixDate:""),days:"",printedExpiry:""}])));
 const [preset,setPreset]=useState("small"),[width,setWidth]=useState("30"),[height,setHeight]=useState("15"),[paper,setPaper]=useState<LabelPaper>("letter");
 const [ready,setReady]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[overflow,setOverflow]=useState(false),[scale,setScale]=useState(2);
 const root=useRef<HTMLDivElement>(null);const size={width:Number(width),height:Number(height)},sizeOkay=validLabelSize(size),safeSize=sizeOkay?size:DEFAULT_LABEL_SIZE;
 const layout=labelLayout(safeSize,paper);
 useEffect(()=>{
  const restored:Record<string,Settings>={};
  for(const p of plans)try{
   const raw=sessionStorage.getItem(`bacwater.labelSettings.v1:${p.publicId}`);if(!raw||raw.length>10000)continue;const parsed=JSON.parse(raw),s=parsed.settings;
   if(parsed.fingerprint!==fingerprint(p)||!s||!Array.isArray(s.dates)||s.dates.length>30||!s.dates.every((d:unknown)=>typeof d==="string"&&(d===""||validMixDate(d)))||typeof s.days!=="string"||s.days.length>4||typeof s.printedExpiry!=="string"||!(s.printedExpiry===""||validMixDate(s.printedExpiry)))continue;
   restored[p.publicId]={dates:s.dates,days:s.days,printedExpiry:s.printedExpiry};
  }catch{}
  setSettings(s=>({...s,...restored}));setReady(true);
 },[plans]);
 useEffect(()=>{if(!ready)return;for(const p of plans)try{sessionStorage.setItem(`bacwater.labelSettings.v1:${p.publicId}`,JSON.stringify({fingerprint:fingerprint(p),settings:settings[p.publicId]}));}catch{}},[ready,plans,settings]);
 const labels=plans.flatMap(p=>(settings[p.publicId]?.dates||[]).map((mix,index)=>{
  const rule=settings[p.publicId],expiry=labelUseBy(mix,rule.days,rule.printedExpiry);
  const data:LabelPrintData={name:p.peptideName||"Product",concentration:p.concentration||`${p.vialStrengthMg} mg in ${p.bacWaterMl} mL`,mixDate:mix,useBy:expiry.date};
  return {data,id:p.publicId,index,expiry};
 }));
 useEffect(()=>{
  const el=root.current;if(!el)return;let frame=0;
  const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   setScale(Math.max(.6,Math.min(2,(el.clientWidth-8)/(safeSize.width*96/25.4))));
   setOverflow([...el.querySelectorAll<HTMLElement>('[data-vial-label]')].some(label=>label.scrollWidth>label.clientWidth+1||label.scrollHeight>label.clientHeight+1));
  });};
  const observer=new ResizeObserver(update);observer.observe(el);el.querySelectorAll('[data-vial-label]').forEach(label=>observer.observe(label));update();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();};
 },[settings,width,height,scale,safeSize.width]);
 function change(id:string,patch:Partial<Settings>){setSettings(s=>({...s,[id]:{...s[id],...patch}}));setMessage("");}
 function count(id:string,n:number){const length=Math.max(batch?0:1,Math.min(batch?20:30,Number.isFinite(n)?Math.floor(n):1));const old=settings[id].dates,dates=old.slice(0,length);while(dates.length<length)dates.push(old[0]||"");change(id,{dates});}
 function choosePreset(id:string){setPreset(id);const found=LABEL_SIZES.find(p=>p.id===id);if(found){setWidth(String(found.width));setHeight(String(found.height));}}
 const error=labels.some(l=>l.expiry.kind==="error"),canPrint=sizeOkay&&labels.length>0&&!error&&!overflow;
 async function download(){if(!canPrint)return;setBusy(true);setMessage("");try{const {downloadSmallLabels}=await import("./small-labels-pdf");await downloadSmallLabels(labels.map(l=>l.data),safeSize,paper);setMessage("PDF created at the selected label dimensions. Print it at Actual size or 100%.");}catch{setMessage("The PDF could not be created. Try again, or use Print labels.");}finally{setBusy(false);}}
 return <div ref={root} className="label-composer" data-label-composer style={{"--label-width":`${safeSize.width}mm`,"--label-height":`${safeSize.height}mm`} as CSSProperties}>
  <style>{LABEL_SHEET_STYLES+`\n@media print{@page{size:${paper==="label"?`${safeSize.width}mm ${safeSize.height}mm`:paper==="a4"?"A4":"letter"};margin:${layout.margin}mm;}}`}</style>
  <div className="label-controls no-print"><h1>Small vial labels</h1><p>Choose a label size, add the mix date, and print. Use the PDF for a fixed-size file you can print or share with your label printer.</p>
   <div className="label-settings">
    <label>Label size<select aria-label="Label size" value={preset} onChange={e=>choosePreset(e.target.value)}>{LABEL_SIZES.map(s=><option key={s.id} value={s.id}>{s.name}: {s.width} × {s.height} mm</option>)}<option value="custom">Custom size</option></select></label>
    {preset==="custom"&&<><label>Width (mm)<input type="number" min={22} max={80} step={.5} value={width} onChange={e=>setWidth(e.target.value)}/></label><label>Height (mm)<input type="number" min={12} max={40} step={.5} value={height} onChange={e=>setHeight(e.target.value)}/></label></>}
    <label>Print on<select aria-label="Print on" value={paper} onChange={e=>setPaper(e.target.value as LabelPaper)}><option value="letter">Letter paper, cut out labels</option><option value="a4">A4 paper, cut out labels</option><option value="label">Label printer, one label per page</option></select></label>
   </div>
   <p>Measure the flat label area on your vial. The default is <strong>30 × 15 mm</strong>, about <strong>1.18 × 0.59 inches</strong>. The preview is enlarged; printed dimensions stay fixed. Small labels keep the name, concentration and dates. The full plan and QR code stay on the plan PDF.</p>
   {plans.map(p=>{const s=settings[p.publicId],expiry=labelUseBy(s.dates[0]||"",s.days,s.printedExpiry);return <section className="label-plan-block" key={p.publicId} aria-label={`Label settings for ${p.peptideName}`}><h2>{p.peptideName||"Product"}</h2><div className="label-plan-settings">
    <label>Number of labels<input type="number" min={batch?0:1} max={batch?20:30} value={s.dates.length} onChange={e=>count(p.publicId,Number(e.target.value))}/></label>
    <label>Mix date (all copies)<input type="date" value={s.dates[0]||""} onChange={e=>change(p.publicId,{dates:s.dates.map(()=>e.target.value)})}/></label>
    <label>Use within this many days<input type="text" inputMode="numeric" maxLength={4} placeholder="From this product's instructions" value={s.days} onChange={e=>change(p.publicId,{days:e.target.value})}/></label>
    <label>Original printed expiry (optional)<input type="date" value={s.printedExpiry} onChange={e=>change(p.publicId,{printedExpiry:e.target.value})}/></label>
    <label>Use-by date (automatic)<input type="text" readOnly value={expiry.date?formatLabelDate(expiry.date):"Not set"} aria-live="polite"/></label>
   </div><p className={`label-message ${expiry.kind==="error"?"label-error":""}`} role={expiry.kind==="error"?"alert":"status"}>{expiry.note}</p><p className="label-message">Copy the day count from the exact product's instructions. We do not choose a storage period. For instructions given in hours, follow the exact deadline instead. Changing a label's mix date below updates its use-by date.</p></section>;})}
   {!sizeOkay&&<p role="alert" className="label-error">Choose a width from 22 to 80 mm and a height from 12 to 40 mm.</p>}
   {overflow&&<p role="alert" className="label-error">Some text will not fit on this size. Choose More space or increase the custom dimensions before printing. We will not cut off the product name or dates.</p>}
   <div className="label-tools"><button type="button" className="label-primary" disabled={!canPrint||busy} onClick={download}><Download size={16} aria-hidden="true"/> {busy?"Creating PDF…":"Download label PDF"}</button><button type="button" disabled={!canPrint} onClick={()=>window.print()}><Printer size={16} aria-hidden="true"/> Print labels</button><button type="button" onClick={()=>{setSettings(s=>Object.fromEntries(Object.entries(s).map(([id,v])=>[id,{...v,dates:v.dates.map(()=>""),days:"",printedExpiry:""}])));setMessage("");}}><RotateCcw size={16} aria-hidden="true"/> Clear dates</button></div>
   <p className="label-message" role="status">{message||`${labels.length} label${labels.length===1?"":"s"}. Choose Actual size or 100% when printing. Turn off Fit to page and browser headers/footers.`}</p>
   <p className="label-message">For label printers, choose matching {safeSize.width} × {safeSize.height} mm stock. For paper, cut along the borders and tape the labels on. Do not cover the original product name, lot number or instructions. Unknown use-by dates print as NOT SET.</p>
  </div>
  <div className="label-sheet" data-paper={paper} style={{"--preview-scale":scale} as CSSProperties}>{labels.map(l=><div className="label-tile" key={`${l.id}-${l.index}`}><VialLabel data={l.data} size={safeSize}/><label className="no-print">Mix date for this label<input type="date" aria-label={`Mix date for ${l.data.name} label ${l.index+1}`} value={l.data.mixDate} onChange={e=>change(l.id,{dates:settings[l.id].dates.map((date,index)=>index===l.index?e.target.value:date)})}/></label></div>)}</div>
  {paper!=="label"&&<div className="label-calibration" aria-label="20 millimeter print scale">20 mm</div>}
 </div>;
}
