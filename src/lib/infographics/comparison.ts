import type { ComparisonTopic } from "@/lib/comparisons/content";
import { esc, svgDoc } from "@/lib/infographics/svg";
function lines(text:string, max=29) { const result:string[]=[]; let line=""; for(const word of text.split(/\s+/)){ if(line && (line+" "+word).length>max){result.push(line);line=word;}else line=(line+" "+word).trim(); } if(line)result.push(line);return result; }
function layout(c:ComparisonTopic){return c.table.map(r=>({r, h:Math.max(lines(r.dimension,19).length,lines(r.bac).length,lines(r.other).length)*21+32}));}
export function comparisonDims(c:ComparisonTopic){return {width:900,height:190+layout(c).reduce((n,r)=>n+r.h,0)+62};}
export function comparisonAlt(c:ComparisonTopic){return `${c.title}. `+c.table.map(r=>`${r.dimension}: BAC water: ${r.bac}; ${c.otherName}: ${r.other}.`).join(" ");}
function text(value:string,x:number,y:number,max:number,weight=400){return lines(value,max).map((s,i)=>`<text x="${x}" y="${y+i*21}" font-size="16" font-weight="${weight}" fill="#18382d">${esc(s)}</text>`).join("");}
export function comparisonSvg(c:ComparisonTopic){
 const {width,height}=comparisonDims(c); const title=`BAC water vs ${c.otherName}`; let y=190;
 const body=layout(c).map(({r,h})=>{const row=`<rect x="24" y="${y}" width="852" height="${h}" rx="8" fill="#f3f6ec"/>${text(r.dimension,40,y+27,19,600)}${text(r.bac,265,y+27,29)}${text(r.other,578,y+27,29)}`;y+=h;return row;}).join("");
 return svgDoc({width,height,title:c.title,desc:comparisonAlt(c),inner:`${text(title,32,42,60,700)}${text("Read the exact label. A name alone does not establish compatibility.",32,94,83)}${text("Label detail",40,162,19,700)}${text("BAC water",265,162,29,700)}${text(c.otherName,578,141,29,700)}${body}<text x="32" y="${height-24}" font-size="15" fill="#45604e">Research and educational reference · BACwater.ai</text>`});
}
