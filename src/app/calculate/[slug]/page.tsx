import type { Metadata } from "next";
import { productForReference, productCalculatorPath } from "@/lib/partners/supplier-catalog";
import { notFound, redirect } from "next/navigation";
import { PEPTIDES } from "@/lib/calc/peptides";
import { shortName } from "@/lib/peptides/page-data";
import { ProductCalculator } from "@/components/partners/product-calculator";
import { PeptideCalc } from "@/components/peptides/peptide-calc";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params,p=PEPTIDES.find(item=>item.slug===slug);
 return {title:p?`${shortName(p.name)} calculator`:"Calculator not found",robots:{index:false,follow:true},...(p?{alternates:{canonical:`/peptides/${p.slug}`}}:{})};
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,p=PEPTIDES.find(item=>item.slug===slug);if(!p)notFound();
 const listing=productForReference(slug);if(listing&&listing.kind!=="single")redirect(productCalculatorPath(listing.id));
 if(listing?.kind === "single")return <ProductCalculator key={listing.id} product={listing}/>;
 return <PeptideCalc key={p.slug} standalone peptideName={shortName(p.name)} peptideSlug={p.slug} commonVialStrengthsMg={p.commonVialStrengthsMg} suggestedDoseMcg={p.suggestedDoseMcg}/>;
}
