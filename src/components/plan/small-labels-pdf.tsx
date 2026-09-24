import { Document, Page, Text, View, pdf } from "@react-pdf/renderer";
import { formatLabelDate, labelLayout, labelTypography, mmToPt, type LabelPaper, type LabelPrintData, type LabelSize } from "@/lib/labels/layout";
export async function downloadSmallLabels(labels: LabelPrintData[], size: LabelSize, paper: LabelPaper) {
  if (!labels.length || labels.length > 480) throw new Error("Choose between 1 and 480 labels.");
  const layout=labelLayout(size,paper), font=labelTypography(size), pages=Array.from({length:Math.ceil(labels.length/layout.perPage)},(_,i)=>labels.slice(i*layout.perPage,(i+1)*layout.perPage));
  const doc=<Document title="Small vial labels" author="BACwater.ai">{pages.map((items,page)=><Page key={page} size={[mmToPt(layout.pageWidth),mmToPt(layout.pageHeight)]} style={{padding:0,fontFamily:"Helvetica",color:"#101810"}}>
   {items.map((label,index)=><View key={index} wrap={false} style={{position:"absolute",left:mmToPt(layout.margin+(index%layout.columns)*(size.width+layout.gap)),top:mmToPt(layout.margin+Math.floor(index/layout.columns)*(size.height+layout.gap)),width:mmToPt(size.width),height:mmToPt(size.height),padding:mmToPt(font.padding),border:paper==="label"?0:.4,borderColor:"#88907f"}}>
    <Text style={{fontFamily:"Helvetica-Bold",fontSize:font.title,lineHeight:1.1,marginBottom:mmToPt(.3)}}>{label.name}</Text>
    <Text style={{fontSize:font.body,lineHeight:1.12,marginBottom:mmToPt(.3)}}>{label.concentration}</Text>
    <Text style={{fontSize:font.date,lineHeight:1.2}}>Mixed: {formatLabelDate(label.mixDate)}</Text>
    <Text style={{fontFamily:"Helvetica-Bold",fontSize:font.date,lineHeight:1.2}}>Use by: {label.useBy?formatLabelDate(label.useBy):"NOT SET"}</Text>
   </View>)}
  </Page>)}</Document>;
  const blob=await pdf(doc).toBlob(),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`BACwater-labels-${size.width}x${size.height}mm-${paper}.pdf`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
