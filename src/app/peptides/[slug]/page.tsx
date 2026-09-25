import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {PEPTIDES,evidenceOf} from "@/lib/calc/peptides";
import {PEPTIDE_CONTENT} from "@/lib/peptides/content";
import {dosageRows,directAnswer,reconstitutionSteps,buildFaqs,shortName} from "@/lib/peptides/page-data";
import {PeptideCalc} from "@/components/peptides/peptide-calc";
import {VialIdentityWarning} from "@/components/peptides/vial-identity-warning";
import {EvidenceBadge,WhatNobodyKnows} from "@/components/peptides/evidence";
import {PeptideRail} from "@/components/peptides/peptide-rail";
import {StudyTable} from "@/components/peptides/study-table";
import {studiesFor} from "@/lib/peptides/studies";
import {getCatalog,relatedContent} from "@/lib/learn/catalog";
import {RelatedReadingPanel} from "@/components/learn/related-reading";
import {peptideChartSvg,peptideChartAlt,peptideChartDims,hasChart} from "@/lib/infographics/peptide-chart";
import {Infographic} from "@/components/common/infographic";
import {AtAGlance} from "@/components/common/at-a-glance";
import {ImageJsonLd} from "@/components/common/image-json-ld";
import {WebPageJsonLd} from "@/components/common/webpage-json-ld";
import {FaqJsonLd} from "@/components/common/faq-json-ld";
import {HowToJsonLd} from "@/components/common/howto-json-ld";
import {Breadcrumbs} from "@/components/common/breadcrumbs";
import {Accordion,AccordionItem,AccordionTrigger,AccordionContent} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import {References} from "@/components/common/references";
import {ReviewedBy} from "@/components/common/reviewed-by";
import {AdSlot} from "@/components/common/ad-slot";
import {CORE_BACWATER_REFERENCES} from "@/lib/content/references";
import styles from "./reference.module.css";
const categories:Record<string,string>={metabolic:"Metabolic signaling research",healing:"Tissue and repair research",growth:"Growth hormone signaling research",cosmetic:"Dermatology and pigmentation research",cognitive:"Neurological research",reproductive:"Reproductive signaling research",longevity:"Mitochondrial and aging research",other:"Research compound"};
export function generateStaticParams(){return PEPTIDES.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params,p=PEPTIDES.find(x=>x.slug===slug);if(!p)return withSocialMetadata({});
 const short=shortName(p.name),title=p.slug==='custom'?'Reconstitution Calculator for a Stated Compound':`${short} Reconstitution Calculator and Reference`;
 const description=p.slug==='hcg'?"Check hCG IU concentration and measurement volume from your stated inputs. Product activity units are not milligrams or syringe units; no dose or dilution is selected.":`Check ${short} concentration and U-100 volume relationships from your stated inputs, with formulation limits and linked references. No dose or storage period is selected.`;
 const dims=hasChart(p)?peptideChartDims(p):null;
 return withSocialMetadata({title,description,alternates:{canonical:`/peptides/${p.slug}`},openGraph:{title,description,url:`/peptides/${p.slug}`,type:'website',siteName:'BACwater.ai',...(dims?{images:[{url:`/peptides/${p.slug}/chart.svg`,width:dims.width,height:dims.height,alt:peptideChartAlt(p)}]}:{})}});
}
export default async function PeptidePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,p=PEPTIDES.find(x=>x.slug===slug);if(!p)notFound();
 const short=shortName(p.name),content=PEPTIDE_CONTENT[p.slug],custom=p.slug==='custom',iu=p.slug==='hcg';
 const rows=custom||iu?[]:dosageRows(p),studies=custom?null:studiesFor(p.slug);
 const steps=iu?[
  {name:'Keep the product activity unit',text:'Use the stated total and entered amount in matching IU. Do not substitute mg or a syringe-scale reading for product activity.'},
  {name:'Check the stated final volume',text:'Product IU divided by the final liquid volume gives IU/mL. This relationship does not select the volume or diluent.'},
  {name:'Divide the entered amount by concentration',text:'Entered IU divided by IU/mL gives mL. Only convert that volume to a device scale when the actual scale is confirmed. U-100 markings are not hCG IU.'}
 ]:reconstitutionSteps(p);
 const faqs=iu?(content?.faqs??[]):buildFaqs(p,content?.faqs??[]);
 const refs=[...CORE_BACWATER_REFERENCES,...(content?.sources??[]).map(url=>({url,title:'Product identity or source reference',source:new URL(url).hostname,note:'Read the exact formulation and study limitations.'}))];
 const lead=iu?'Use the hCG calculator to check product IU per mL and the volume for an independently specified amount. Enter values from the exact product instructions. Product activity units cannot be converted to milligrams by a universal factor, and they are not the same as U-100 syringe markings.':directAnswer(p);
 const chart=hasChart(p)?peptideChartSvg(p):null,dims=hasChart(p)?peptideChartDims(p):null;
 const catalog=await getCatalog(),reading=relatedContent(catalog,{peptide:custom?undefined:p.slug,topics:['storage','dosage','safety'],types:['faq','comparison','safety','guide'],excludeUrl:`/peptides/${p.slug}`,limit:5});
 const related=PEPTIDES.filter(x=>x.category===p.category&&x.slug!==p.slug&&x.slug!=='custom').slice(0,4);
 const facts=[{label:'Category',value:categories[p.category]||'Reference'},{label:'Illustrative vial amounts',value:iu?'Use label IU, not mg':`${p.commonVialStrengthsMg.join(', ')} mg`},{label:'Shelf life',value:'Product-specific',sub:'not calculated'}];
 const sections=[...(content?[{id:'what-it-is',label:`What is ${short}?`}]:[]),...(rows.length?[{id:'reconstitution-chart',label:'Arithmetic examples'}]:[]),{id:'how-to',label:'Check the calculation'},{id:'storage',label:'Storage and shelf life'},...(faqs.length?[{id:'faq',label:'FAQ'}]:[])];
 return <div className={`${styles.reference} mx-auto max-w-4xl px-4 sm:px-6 pt-8 sm:pt-12 pb-24 xl:max-w-6xl xl:grid xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-start xl:gap-10`}>
 <div className="min-w-0">
 <WebPageJsonLd name={`${short} concentration calculator and reference`} description={lead} url={`/peptides/${p.slug}`} breadcrumb={[{name:'Home',url:'/'},{name:'Compounds',url:'/peptides'},{name:short,url:`/peptides/${p.slug}`}]} citations={refs}/>
 {steps.length>0&&<HowToJsonLd name={`How to check a ${short} concentration calculation`} description="Check the unit relationships, not a treatment or preparation method." steps={steps}/>}
 <FaqJsonLd items={faqs}/>{dims&&<ImageJsonLd url={`/peptides/${p.slug}/chart.svg`} caption={peptideChartAlt(p)} width={dims.width} height={dims.height}/>}
 <Breadcrumbs items={[{label:'Home',href:'/'},{label:'Compounds',href:'/peptides'},{label:short,href:`/peptides/${p.slug}`}]}/>
 <p className="eyebrow">{categories[p.category]}</p><h1 className="mt-2 text-3xl sm:text-5xl font-serif font-medium tracking-tight">{short} reconstitution calculator and reference</h1>
 {!custom&&<div className="mt-3"><EvidenceBadge evidence={evidenceOf(p)}/></div>}{content?.aka&&<p className="mt-3 text-sm text-muted-foreground">{content.aka}</p>}
 {!custom&&<AtAGlance items={facts} columns={3} className="mt-5"/>}
 <p className="mt-5 text-lg leading-relaxed">{lead}</p>
 {!custom&&<WhatNobodyKnows compound={short} evidence={evidenceOf(p)}/>}<ReviewedBy className="mt-2"/>
 <div className="mt-7"><PeptideCalc peptideName={short} peptideSlug={p.slug} commonVialStrengthsMg={p.commonVialStrengthsMg} suggestedDoseMcg={p.suggestedDoseMcg}/></div>
 <VialIdentityWarning compound={short}/>
 {content&&<section id="what-it-is" className="mt-10 scroll-mt-24"><h2 className="text-2xl sm:text-3xl font-serif">What is {short}?</h2><div className="mt-4 space-y-3 leading-relaxed"><p>{content.what}</p><p>{content.uses}</p><p className="text-muted-foreground">This category groups references; it does not establish an approved use or a standard preparation.</p></div></section>}
 {studies&&<StudyTable data={studies}/>}
 {rows.length>0&&<section id="reconstitution-chart" className="mt-10 scroll-mt-24"><h2 className="text-2xl sm:text-3xl font-serif">Illustrative {short} concentration math</h2><p className="mt-3 leading-relaxed">These inputs demonstrate arithmetic, not a {short} mixing recipe or dose table. Product-specific instructions establish appropriate inputs.</p><div className="mt-5 overflow-x-auto rounded-xl border" role="region" aria-label="Illustrative concentration table" tabIndex={0}><table className="w-full text-sm text-left"><caption className="sr-only">Mass and final-volume arithmetic examples</caption><thead><tr>{['Vial amount','Illustrative final volume','Concentration','Illustrative mass','U-100 units'].map(h=><th scope="col" className="px-4 py-3" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(r=><tr id={`bac-water-${r.vialMg}mg`} key={r.vialMg} className="border-t scroll-mt-24"><th scope="row" className="px-4 py-3 font-medium">{r.vialMg} mg</th><td className="px-4 py-3">{r.bacMl} mL</td><td className="px-4 py-3">{r.concentrationMgPerMl} mg/mL</td><td className="px-4 py-3">{r.doseLabel}</td><td className="px-4 py-3">{r.units}</td></tr>)}</tbody></table></div><p className="mt-3 text-xs text-muted-foreground">Amounts are illustrative. U-100 conversion assumes a confirmed scale of 100 units per mL. Neither device capacity nor graduation spacing is inferred.</p>{chart&&<div className="mt-5"><Infographic svg={chart} caption={peptideChartAlt(p)}/></div>}</section>}
 <section id="how-to" className="mt-10 scroll-mt-24"><h2 className="text-2xl sm:text-3xl font-serif">Check the {short} calculation</h2><ol className="mt-5 list-decimal space-y-4 pl-5">{steps.map((s,i)=><li key={i} className="pl-1"><h3 className="font-medium">{s.name}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p></li>)}</ol></section>
 <section id="storage" className="mt-10 scroll-mt-24"><h2 className="text-2xl sm:text-3xl font-serif">Storage and shelf life</h2><div className="mt-4 rounded-xl border bg-card p-5"><h3 className="text-xl font-medium">Product-specific, not calculated</h3><p className="mt-3 text-sm leading-relaxed">Follow storage and discard instructions for the exact formulation. A compound name or concentration cannot establish stability or sterility. <Link className="underline" href="/learn/bac-water-shelf-life">Read the storage distinctions</Link>.</p></div></section>
 {faqs.length>0&&<section id="faq" className="mt-10 scroll-mt-24"><h2 className="text-2xl sm:text-3xl font-serif">{short} reconstitution FAQ</h2><Accordion type="single" collapsible className="mt-4">{faqs.map((f,i)=><AccordionItem key={i} value={`faq-${i}`}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent>{f.a}</AccordionContent></AccordionItem>)}</Accordion></section>}
 <AdSlot/>{reading.length>0&&<div className="mt-10"><RelatedReadingPanel title={`Keep reading about ${short}`} items={reading}/></div>}
 {related.length>0&&<section className="mt-10"><h2 className="text-xl font-serif">Related compound references</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{related.map(r=><Link key={r.slug} href={`/peptides/${r.slug}`} className="min-w-0 rounded-lg border p-4 font-medium hover:bg-muted">{shortName(r.name)}</Link>)}</div><Link href={`/peptides/compare?a=${p.slug}&b=${related[0].slug}`} className="mt-4 inline-block text-sm underline">Compare the label context of {short} and {shortName(related[0].name)}</Link></section>}
 <References references={refs}/>
 <section className="section-dark mt-10 rounded-2xl p-5 sm:p-7"><h2 className="text-xl font-serif">Keep arithmetic separate from product instructions.</h2><p className="mt-3 text-sm leading-relaxed">The planner can store entered mass calculations and print a record. It is not a preparation prescription. For hCG, use the IU calculation above; the mass planner does not automatically carry over these values.</p><div className="mt-4 flex flex-wrap gap-3"><Button asChild variant="brand"><Link href={iu?'/methodology':'/plan'}>{iu?'Check IU and scale limits':'Build a saved calculation'}</Link></Button><Button asChild variant="outline"><Link href="/tools">All calculators</Link></Button></div><p className="mt-4 text-sm"><Link href="/methodology" className="underline">Methodology</Link> · <Link href="/faq" className="underline">Common questions</Link> · <Link href="/learn/what-you-cannot-know" className="underline">What cannot be verified</Link></p></section>
 </div>{!custom&&<PeptideRail facts={facts} sections={sections} compound={short}/>}
 </div>;
}
