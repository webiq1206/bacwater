import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SUPPLIER_PRODUCTS } from "@/lib/partners/supplier-catalog";
import { ProductCalculator } from "@/components/partners/product-calculator";
export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{
 const {id}=await params,p=SUPPLIER_PRODUCTS.find(p=>p.id===id);
 return {title:p?`${p.name} calculator`:"Product not found",description:"Check label numbers with the right calculation for this product type. No dose or mixing instructions are selected.",robots:{index:false,follow:true},...(p?{alternates:{canonical:`/calculate/product/${p.id}`}}:{})};
}
export default async function Page({params}:{params:Promise<{id:string}>}){
 const {id}=await params,p=SUPPLIER_PRODUCTS.find(p=>p.id===id);if(!p)notFound();
 return <ProductCalculator key={p.id} product={p}/>;
}
