import Link from "next/link";
import { ResearchFinder } from "@/components/search/research-finder";
import { withSocialMetadata } from "@/lib/seo/social-metadata";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
const description="Ask a lab research question in plain language. Explore real catalog entries, simple explanations, linked studies and the limits of the evidence.";
export const metadata=withSocialMetadata({title:"Research Finder: Ask a Question, Explore the Evidence",description,alternates:{canonical:"/research-finder"}});
export default function ResearchFinderPage(){return <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 pb-16">
 <WebPageJsonLd name="Research finder" description={description} url="/research-finder"/>
 <header className="mx-auto max-w-3xl text-center"><p className="eyebrow">A question is a good place to start</p><h1 className="mt-3 text-4xl sm:text-5xl font-serif tracking-tight">Explore the research.<br/><em>Understand the idea.</em></h1><p className="mt-5 leading-relaxed text-muted-foreground">Ask about a lab topic. Find the related products, see what researchers learned and know what is still unknown.</p><p className="mt-3 text-sm text-muted-foreground">Already know the name? <Link className="underline underline-offset-4" href="/recommendations">Browse the product directory</Link>.</p></header>
 <ResearchFinder/>
 </div>;}
