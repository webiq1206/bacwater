"use client";
import { RESEARCH_CATEGORIES, researchCategory, type ResearchCategory } from "@/lib/partners/research-categories";
import styles from "./research-category-filter.module.css";
export function ResearchCategoryFilter({value,onChange,products}:{value:ResearchCategory|"all";onChange:(value:ResearchCategory|"all")=>void;products:readonly {id:string}[]}) {
  return <label className={styles.filter}>Research category
    <select value={value} onChange={e=>onChange(e.target.value as ResearchCategory|"all")}>
      <option value="all">All categories ({products.length})</option>
      {RESEARCH_CATEGORIES.map(category=>{
        const count=products.filter(p=>researchCategory(p.id).id===category.id).length;
        return count>0?<option key={category.id} value={category.id}>{category.label} ({count})</option>:null;
      })}
    </select>
    <span className={styles.note}>Browse research topics. Categories do not establish a product’s effects or suitability.</span>
  </label>;
}
