import { ResearchFinderPageView } from "@/components/search/research-finder";
import { withSocialMetadata } from "@/lib/seo/social-metadata";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
const description="Ask about research in plain language. Find related catalog products, linked studies, clear explanations and useful calculators.";
export const metadata=withSocialMetadata({title:"Research Assistant: Products, Studies and Calculators",description,alternates:{canonical:"/research-finder"}});
export default function ResearchFinderPage(){return <><WebPageJsonLd name="Research assistant" description={description} url="/research-finder"/><ResearchFinderPageView/></>;}
