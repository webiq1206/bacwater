import type { Metadata } from "next";
import { SiteSearchResults } from "@/components/search/site-search";
import styles from "@/components/search/search.module.css";
export const metadata:Metadata={title:"Search calculators, products and guides",description:"Find a calculator, product or clear answer to your question.",robots:{index:false,follow:true},alternates:{canonical:"/search"}};
export default function SearchPage(){return <div className={styles.standalone}><h1>Find what you need</h1><p>Search a name, a tool, or a question. No need to know the technical words.</p><SiteSearchResults standalone/></div>;}
