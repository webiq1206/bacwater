import Link from "next/link";
import { Info } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { withSocialMetadata } from "@/lib/seo/social-metadata";
import { RESEARCH_DISCLAIMER, FDA_DISCLAIMER, AFFILIATE_DISCLAIMER } from "@/lib/disclaimer";

const description="The limits of our calculators, research finder, product guides and affiliate links. Research only, not medical advice.";
export const metadata=withSocialMetadata({title:"Research, FDA & Affiliate Disclaimer",description,alternates:{canonical:"/disclaimer"}});
const sections=[
 {id:"purpose",title:"What this site is for",paragraphs:[
  "BACwater.ai helps readers understand label numbers and published research. Our content is for learning and laboratory research. It is not medical, veterinary or personal health advice.",
  "We do not recommend products to diagnose, treat, cure or prevent disease. We do not recommend them for weight, fitness, appearance, recovery or other personal goals. A research description is not a promise of a benefit."
 ]},
 {id:"products",title:"Research products are not for people or animals",paragraphs:[
  "The products in our research directory are intended for laboratory work. They are not offered here for use in people or animals, or as food, medicine, cosmetics or household products.",
  "We describe animal and human studies when they help explain the evidence. Those studies do not give permission to use a supplier’s research product in people or animals.",
  "Check the current supplier label, batch report and terms. A batch report, also called a certificate of analysis or COA, describes tests on a sample. It does not prove that every container is safe, suitable for a study or free from all possible contaminants."
 ]},
 {id:"calculators",title:"What the calculators can and cannot tell you",paragraphs:[
  "Our calculators work with the numbers you enter. For example, 10 mg in a final volume of 2 mL gives 5 mg in each mL. This is a math example, not an amount to prepare or use.",
  "The tools do not choose a dose, mixing method, liquid, schedule or route of use. They cannot check what is really in a vial, whether a label is correct, or whether two materials can be mixed.",
  "Check the product, each ingredient, units and final liquid volume before relying on a result. U-100 markings describe volume on that specific scale: 100 units equals 1 mL. They are not the same as IU, a measure of biological activity.",
  "We test the math, but input mistakes, software errors and rounding can still affect results. Follow your lab’s approved procedures and check the calculation independently. Saved plans and printable labels do not approve a research procedure."
 ]},
 {id:"finder",title:"How the research finder works",paragraphs:[
  "The finder matches words and follow-up answers to reviewed topics and real entries in our catalog. Its replies come from prepared research notes. It is a guided search, not a scientist, a clinician or an open-ended AI chat.",
  "A match means that an entry relates to your question. It does not mean the product is best, safe or suitable for your study. The finder cannot design a study or recommend personal treatment, dosing or use.",
  "The finder uses the sources we have reviewed. It does not search every new paper as you type. It may miss a topic or misunderstand your words. Open the cited study and full guide to check the context."
 ]},
 {id:"evidence",title:"What research findings do and do not prove",paragraphs:[
  "A cell is a tiny living part of a plant or animal. A test on cells in a lab answers a narrower question than a test in a whole living thing. Animal findings may not carry over to people.",
  "Research on one ingredient does not prove how a finished blend or spray works. A study drug is also not the same tested item as a supplier’s research vial.",
  "We distinguish direct experiments, research on related molecules, proposed ideas and withdrawn papers. Withdrawn, or retracted, means the paper should not be relied on as proof of its claim.",
  "Our summaries leave out some details so they are easier to read. They are starting points, not a complete review of every study. Read the original methods, results and limits. We update content when we identify an error or a change in the evidence."
 ]},
 {id:"fda",title:"FDA language, explained clearly",paragraphs:[
  "FDA means the U.S. Food and Drug Administration. It reviews drugs before they can be marketed under an approved drug application.",
  FDA_DISCLAIMER,
  "An approved prescription drug and a separate research product are not interchangeable. Approval of one drug does not establish approval of a different supplier’s vial with a similar ingredient name.",
  "A research-only notice does not turn human-use claims into acceptable research claims. Nothing on this site should be read as FDA clearance, approval or endorsement of BACwater.ai."
 ]},
 {id:"affiliate",title:"Our affiliate relationship",paragraphs:[
  AFFILIATE_DISCLAIMER,
  "Our product supplier is responsible for its own products, order process, labels and policies. We do not speak for our supplier, the FDA or a research institution.",
  "We identify paid links near product information. The finder matches reviewed topics and catalog names; commission amounts are not used to order its results. A link is not an independent quality check or a promise of a result."
 ]},
 {id:"links",title:"External pages and changing information",paragraphs:[
  "Prices, stock, product details, supplier rules and research can change. Check the current source before relying on it. External pages follow their own terms and privacy policies.",
  "This notice explains our content and tools. It does not replace our Terms or Privacy page. For a personal medical question, speak with a licensed health professional."
 ]}
];
export default function DisclaimerPage(){
 return <article className="mx-auto max-w-4xl px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
  <WebPageJsonLd name="Research, FDA & Affiliate Disclaimer" description={description} url="/disclaimer"/>
  <Breadcrumbs items={[{label:"Home",href:"/"},{label:"Disclaimer",href:"/disclaimer"}]}/>
  <p className="eyebrow mt-6">Clear information. Clear limits.</p>
  <h1 className="mt-3 text-4xl sm:text-5xl font-serif font-medium tracking-tight">Research, FDA & affiliate disclaimer</h1>
  <p className="mt-4 text-sm text-muted-foreground">Last reviewed September 29, 2026</p>
  <aside className="mt-8 rounded-2xl border border-border bg-surface p-5 sm:p-7" aria-label="The main points">
   <h2 className="flex items-center gap-2 text-xl font-semibold"><Info size={21} aria-hidden="true"/> Please start here</h2>
   <p className="mt-3 leading-relaxed">{RESEARCH_DISCLAIMER}</p>
   <p className="mt-3 leading-relaxed">{AFFILIATE_DISCLAIMER}</p>
  </aside>
  <nav aria-label="In this disclaimer" className="my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">{sections.map(s=><a key={s.id} href={`#${s.id}`} className="inline-flex min-h-11 items-center underline underline-offset-4">{s.title}</a>)}</nav>
  <div className="space-y-10">{sections.map(s=><section key={s.id} id={s.id} className="scroll-mt-28 border-t border-border pt-7"><h2 className="text-2xl font-serif font-medium">{s.title}</h2><div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/90">{s.paragraphs.map(p=><p key={p}>{p}</p>)}</div></section>)}</div>
  <section className="mt-10 border-t border-border pt-7"><h2 className="text-2xl font-serif">Read the source information</h2><ul className="mt-4 space-y-3 list-disc pl-5 leading-relaxed">
   <li><a className="underline" href="https://www.fda.gov/drugs/enforcement-activities-fda/unapproved-drugs" target="_blank" rel="noopener noreferrer">FDA: Unapproved drugs (opens a new tab)</a></li>
   <li><a className="underline" href="https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss" target="_blank" rel="noopener noreferrer">FDA: Concerns about unapproved products, including false research-only labels (opens a new tab)</a></li>
   <li><a className="underline" href="https://www.aminoclub.com/us/disclaimer" target="_blank" rel="noopener noreferrer">Our partner’s disclaimer (opens a new tab)</a></li>
   <li><a className="underline" href="https://www.aminoclub.com/us/affiliate-terms" target="_blank" rel="noopener noreferrer">Our partner’s affiliate terms (opens a new tab)</a></li>
  </ul></section>
  <p className="mt-8 leading-relaxed">See a mistake? <Link className="underline" href="/contact">Tell us what needs fixing</Link>. You can also read our <Link className="underline" href="/terms">Terms</Link>, <Link className="underline" href="/privacy">Privacy page</Link> and <Link className="underline" href="/editorial-policy">content review policy</Link>.</p>
 </article>;
}
