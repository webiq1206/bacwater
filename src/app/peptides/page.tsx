import { productDisplayName } from "@/lib/partners/supplier-catalog";
import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import { PEPTIDES } from "@/lib/calc/peptides";
import { PEPTIDE_CONTENT } from "@/lib/peptides/content";
import { shortName } from "@/lib/peptides/page-data";
import { safeJson } from "@/lib/seo/safe-json";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
export const metadata=withSocialMetadata({title:"Peptide Calculators and Compound References",description:"Find a compound calculator with identity context, linked research and calculation limits. Enter your own label values; no recommended dose, diluent or expiry.",alternates:{canonical:"/peptides"}});
const groups=[['metabolic','Metabolic signaling research'],['healing','Tissue and repair research'],['growth','Growth hormone signaling research'],['cosmetic','Dermatology and pigmentation research'],['cognitive','Neurological research'],['reproductive','Reproductive signaling research'],['longevity','Mitochondrial and aging research'],['other','Other compound names']];
export default function PeptidesHubPage(){const origin=process.env.NEXT_PUBLIC_SITE_URL||'https://bacwater.ai';return <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 sm:pt-12 pb-24">
 <WebPageJsonLd name="Peptide calculators and compound references" description="Compound identity context and arithmetic tools, not treatment recommendations." url="/peptides"/>
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJson({'@context':'https://schema.org','@type':'CollectionPage',name:'Peptide calculators and compound references',url:origin+'/peptides',mainEntity:{'@type':'ItemList',itemListElement:PEPTIDES.map((p,i)=>({'@type':'ListItem',position:i+1,url:origin+'/peptides/'+p.slug,name:productDisplayName(p.slug, shortName(p.name))}))}})}}/>
 <Breadcrumbs items={[{label:'Home',href:'/'},{label:'Compounds',href:'/peptides'}]}/><p className="eyebrow">Compound directory</p><h1 className="mt-2 text-3xl sm:text-5xl font-serif">Peptide calculators and compound references</h1><p className="mt-4 max-w-3xl leading-relaxed">Choose the name on your label to find identity context, selected research and a calculator. Enter the amount and final liquid volume from your existing instructions. A compound name cannot establish a suitable dilution, dose or shelf life.</p>
 <p className="mt-4 text-sm"><Link href="/peptides/compare" className="underline">Compare two compound references</Link> · <Link href="/methodology" className="underline">Check calculation formulas</Link> · <Link href="/plan" className="underline">Use the guided builder</Link></p>
 <p className="mt-5 rounded-xl border p-4 text-sm">The groups below organize research topics. They do not claim a benefit, establish approval, or recommend using a compound. hCG activity is entered in IU, not mg; device scale units are separate.</p>
 <div className="mt-8 space-y-8">{groups.map(([key,label])=>{const items=PEPTIDES.filter(p=>p.category===key);return items.length?<section key={key}><h2 className="text-xl font-serif">{label}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{items.map(p=><Link key={p.slug} href={'/peptides/'+p.slug} className="rounded-xl border bg-card p-5 transition-colors hover:bg-muted"><h3 className="font-semibold">{productDisplayName(p.slug, shortName(p.name))}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{PEPTIDE_CONTENT[p.slug]?.what||'Enter the identity and numbers from your actual label. No substance is inferred from an unknown name.'}</p></Link>)}</div></section>:null;})}</div>
 <p className="mt-9 text-sm"><Link className="underline" href="/learn/what-you-cannot-know">What the website cannot verify about a vial</Link> · <Link className="underline" href="/editorial-policy">Source and review policy</Link></p>
 </div>;}
