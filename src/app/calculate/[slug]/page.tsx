import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PEPTIDES } from "@/lib/calc/peptides";
import { shortName } from "@/lib/peptides/page-data";
import { PeptideCalc } from "@/components/peptides/peptide-calc";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params,p=PEPTIDES.find(item=>item.slug===slug);
 return {title:p?`${shortName(p.name)} calculator`:"Calculator not found",robots:{index:false,follow:true},...(p?{alternates:{canonical:`/peptides/${p.slug}`}}:{})};
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,p=PEPTIDES.find(item=>item.slug===slug);if(!p)notFound();
 return <PeptideCalc standalone peptideName={shortName(p.name)} peptideSlug={p.slug} commonVialStrengthsMg={p.commonVialStrengthsMg} suggestedDoseMcg={p.suggestedDoseMcg}/>;
}
