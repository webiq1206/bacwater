import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import type {Metadata} from "next";
import {PEPTIDES} from "@/lib/calc/peptides";
import {PEPTIDE_CONTENT} from "@/lib/peptides/content";
import {shortName} from "@/lib/peptides/page-data";
import {Breadcrumbs} from "@/components/common/breadcrumbs";
import {WebPageJsonLd} from "@/components/common/webpage-json-ld";
import {CompareSelector} from "@/components/peptides/compare-selector";
const options=PEPTIDES.filter(p=>p.slug!=="custom");
type Params=Record<string,string|string[]|undefined>;
function pick(v:string|string[]|undefined,fallback:string){return options.find(p=>p.slug===(Array.isArray(v)?v[0]:v))||options.find(p=>p.slug===fallback)!;}
export async function generateMetadata({searchParams}:{searchParams:Promise<Params>}):Promise<Metadata>{const sp=await searchParams,a=pick(sp.a,"bpc-157"),b=pick(sp.b,"tb-500");return withSocialMetadata({title:`${shortName(a.name)} vs ${shortName(b.name)}: Label and Evidence Context`,description:"Compare compound identity, supported label units and calculation limits. No ranking, dosing recommendation or inferred storage period.",alternates:{canonical:"/peptides/compare"},robots:sp.a||sp.b?{index:false,follow:true}:undefined});}
export default async function ComparePage({searchParams}:{searchParams:Promise<Params>}){
 const sp=await searchParams,a=pick(sp.a,"bpc-157"),b=pick(sp.b,"tb-500");
 const rows=[
 {label:"Identity context",values:[a,b].map(p=>PEPTIDE_CONTENT[p.slug]?.what||"Verify the exact product identity and formulation.")},
 {label:"Supported input units",values:[a,b].map(p=>p.slug==="hcg"?"hCG international units (IU), not milligrams. Product activity units are distinct from syringe scale units.":"mg or mcg for a stated mass. Do not substitute a product activity unit or an unverified strength.")},
 {label:"Known values needed",values:["Stated total amount, final liquid volume and separately specified amount to measure.","Stated total amount, final liquid volume and separately specified amount to measure."]},
 {label:"Evidence source",values:[a,b].map(p=><Link className="underline" href={`/peptides/${p.slug}`}>Read the linked sources and limitations</Link>)},
 {label:"Storage",values:["Product-specific instructions. No stability period is calculated.","Product-specific instructions. No stability period is calculated."]},
 {label:"Not established here",values:["Identity, purity, actual strength, compatibility, sterility or suitability for use.","Identity, purity, actual strength, compatibility, sterility or suitability for use."]}
 ];
 return <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 sm:pt-12 pb-24 [overflow-wrap:anywhere]">
 <WebPageJsonLd name={`${shortName(a.name)} vs ${shortName(b.name)}`} description="Compare label context and limits, not treatment choices." url="/peptides/compare"/>
 <Breadcrumbs items={[{label:"Home",href:"/"},{label:"Compounds",href:"/peptides"},{label:"Compare",href:"/peptides/compare"}]}/>
 <p className="eyebrow">Reference comparison</p><h1 className="mt-2 text-3xl sm:text-5xl font-serif">{shortName(a.name)} vs {shortName(b.name)}</h1>
 <p className="mt-4 max-w-3xl leading-relaxed">Compare identity context, input units and evidence limitations. This is not a ranking of effectiveness or a recommendation to use either compound. Research results cannot verify the contents of a different product.</p>
 <div className="mt-6"><CompareSelector options={options.map(p=>({slug:p.slug,name:shortName(p.name)}))} a={a.slug} b={b.slug}/></div>
 <div className="mt-7 overflow-x-auto rounded-xl border" role="region" aria-label="Compound reference comparison" tabIndex={0}><table className="w-full text-sm text-left"><caption className="sr-only">Label context and limits for the two selected compounds</caption><thead><tr><th scope="col" className="p-3">Reference question</th>{[a,b].map((p,i)=><th key={i} scope="col" className="p-3"><Link className="underline" href={`/peptides/${p.slug}`}>{shortName(p.name)}</Link></th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.label} className="border-t align-top"><th scope="row" className="p-3 font-medium">{row.label}</th>{row.values.map((value,i)=><td key={i} className="p-3 leading-relaxed">{value}</td>)}</tr>)}</tbody></table></div>
 <p className="mt-5 text-sm leading-relaxed">The earlier comparison used broad lookup ranges as though they were a verified research dose summary, and described every vial amount in mg. Those rows have been removed. Read the actual source and exact product instructions instead.</p>
 <div className="mt-6 grid gap-3 sm:grid-cols-2">{[a,b].map((p,i)=><Link key={i} className="rounded-xl border p-4 font-medium hover:bg-muted" href={`/peptides/${p.slug}`}>Open {shortName(p.name)} calculator and references</Link>)}</div>
 <p className="mt-6 text-sm"><Link href="/methodology" className="underline">Calculation formulas</Link> · <Link href="/learn/what-you-cannot-know" className="underline">What no calculation can verify</Link></p>
 </div>;
}
