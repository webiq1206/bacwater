import type { CSSProperties } from "react";
import type { SupplierProduct } from "@/lib/partners/supplier-catalog";
import styles from "./product-artwork.module.css";
const tones = [["#e8efda","#3f5d3c"],["#f1e7db","#66503b"],["#e4edf2","#385c70"],["#ece6f5","#654c82"],["#efe9d4","#67552f"],["#dceee7","#305e4d"],["#f0e2dd","#745146"]];
/** Abstract BACwater illustration, not a molecular diagram or product packaging. */
export function ProductArtwork({product,compact=false}:{product:SupplierProduct;compact?:boolean}) {
  const [fill,ink]=tones[product.artworkTone%tones.length];
  return <div data-product-artwork={product.id} data-compact={compact} className={styles.artwork} role="img" aria-label={`${product.name}: original BACwater illustration, not product packaging`} style={{"--art-fill":fill,"--art-ink":ink} as CSSProperties}>
    <svg className={styles.motif} viewBox="0 0 320 200" aria-hidden="true" focusable="false">
      <circle cx="252" cy="88" r="100" fill="none" stroke="currentColor" opacity=".11"/>
      <circle cx="252" cy="88" r="72" fill="none" stroke="currentColor" opacity=".08"/>
      <path d="M175 25L236 60L236 130L296 165M236 60L296 25M236 130L175 165" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".22"/>
      {[ [175,25],[236,60],[236,130],[296,165],[296,25],[175,165] ].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={i===1?13:7} fill="currentColor" opacity={i===1?.15:.1}/>) }
      {product.kind==="water"&&<path d="M255 35C239 57 225 76 225 92a30 30 0 0 0 60 0c0-16-14-35-30-57Z" fill="none" stroke="currentColor" opacity=".16"/>}
    </svg>
    {!compact&&<span className={styles.signature}>BACWATER / RESEARCH</span>}
    {!compact&&<span className={styles.name} data-artwork-name>{product.name}</span>}
    <span className={styles.format}>{product.kind==="spray"?"RESEARCH SOLUTION":product.kind==="blend"?"RESEARCH BLEND":product.kind==="water"?"LAB WATER":"RESEARCH COMPOUND"}</span>
  </div>;
}
