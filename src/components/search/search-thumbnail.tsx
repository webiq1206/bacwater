import { BookOpen, Calculator, FileText, Search } from "lucide-react";
import { ProductArtwork } from "@/components/partners/product-artwork";
import { SUPPLIER_PRODUCTS } from "@/lib/partners/supplier-catalog";
import { referenceArtwork, type SearchItem } from "@/lib/search/public-index";
import styles from "./search.module.css";
export function SearchThumbnail({item}:{item:Pick<SearchItem,"productId"|"reference"|"kind">}){
 const product=SUPPLIER_PRODUCTS.find(p=>p.id===item.productId)||(item.reference?referenceArtwork(item.reference):undefined);
 const Icon=item.kind==="calculator"?Calculator:item.kind==="guide"?BookOpen:item.kind==="page"?FileText:Search;
 return <span className={styles.thumb} aria-hidden="true">{product?<ProductArtwork product={product} compact/>:<Icon size={26} strokeWidth={1.4}/>}</span>;
}
