import type { SupplierProduct } from "@/lib/partners/supplier-catalog";
const tones = [["#e4eccb","#405c32"],["#e9dfd2","#665033"],["#dde5ec","#3c546b"],["#e4dff0","#604d78"],["#e8e0cb","#6e5b2c"],["#d8e9e3","#376458"],["#e8ddd9","#74564b"]];
/** Original BACwater monogram artwork, never supplier photography or packaging. */
export function ProductArtwork({product,compact=false}:{product:SupplierProduct;compact?:boolean}) {
  const [fill,ink]=tones[product.artworkTone%tones.length];
  return <svg data-product-artwork={product.id} viewBox={compact?"0 0 160 120":"0 0 320 180"} width={compact?160:320} height={compact?120:180} role="img" aria-label={`${product.name}: original BACwater artwork, not product packaging`} style={{display:"block",width:"100%",height:"auto",borderRadius:"inherit",background:fill,color:ink}}>
    <rect width="100%" height="100%" fill={fill}/><circle cx={compact?150:295} cy={compact?95:115} r={compact?60:85} fill="none" stroke={ink} opacity=".16"/><circle cx={compact?150:295} cy={compact?95:115} r={compact?80:105} fill="none" stroke={ink} opacity=".08"/>
    {!compact&&<text x="20" y="28" fill={ink} fontSize="10" letterSpacing="1.5" fontFamily="sans-serif">BACWATER / RESEARCH</text>}
    <text x={compact?12:20} y={compact?66:110} fill={ink} fontSize={compact?(product.mark.length>6?25:31):(product.mark.length>6?37:46)} fontWeight="500" letterSpacing="-1.2" fontFamily="sans-serif">{product.mark}</text>
    <text x={compact?12:20} y={compact?99:157} fill={ink} fontSize={compact?10:11} letterSpacing="1" fontFamily="sans-serif">{product.kind==="spray"?"SOLUTION":product.kind==="blend"?"BLEND":product.kind==="water"?"LAB WATER":"COMPOUND"}</text>
  </svg>;
}
