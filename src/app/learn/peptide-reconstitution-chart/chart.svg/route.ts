import { svgDoc, svgResponse } from "@/lib/infographics/svg";
export function GET() {
 const rows = [["6 mg","2 mL","3 mg/mL"],["10 mg","2 mL","5 mg/mL"],["12 mg","4 mL","3 mg/mL"]];
 const text=(t:string,x:number,y:number,size=22)=>`<text x="${x}" y="${y}" font-size="${size}" fill="#18382d">${t}</text>`;
 return svgResponse(svgDoc({width:900,height:540,title:"Concentration arithmetic worksheet",desc:"Concentration equals total mass divided by final liquid volume. Examples: 6 mg in 2 mL is 3 mg/mL; 10 mg in 2 mL is 5 mg/mL; 12 mg in 4 mL is 3 mg/mL. These are not mixing instructions.",inner:text("Concentration arithmetic worksheet",40,55,30)+text("Total mass ÷ final liquid volume = concentration",40,100,23)+text("Mass",40,170)+text("Final volume",320,170)+text("Concentration",590,170)+rows.map((row,i)=>`<rect x="28" y="${194+i*65}" width="844" height="60" rx="8" fill="#f3f6ec"/>`+row.map((cell,j)=>text(cell,40+j*280,233+i*65)).join("")).join("")+text("Illustrative numbers, not product preparation or dose instructions.",40,440,19)+text("Choose your product and use your own label values at BACwater.ai",40,475,19)+text("bacwater.ai/methodology",40,510,17)}));
}
