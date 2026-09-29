import { z } from "zod";
import { calculate, type CalcResult } from "@/lib/calc";
export const BODY_LIMIT = 32768;
export const TOPICS = ["overview", "concentration", "volume", "units", "portions", "storage", "rounding", "inputs", "limits"] as const;
export type Topic = typeof TOPICS[number];
const input = z.object({vialStrengthMg:z.number().finite().positive(),doseMcg:z.number().finite().positive(),bacWaterMl:z.number().finite().positive(),injectionsPerWeek:z.number().int().min(1).max(28).optional(),syringeType:z.enum(["insulin-0.3ml","insulin-0.5ml","insulin-1ml","tuberculin-1ml","syringe-3ml"])});
const bodySchema = z.object({plan:z.object({input}),messages:z.array(z.object({role:z.enum(["user","assistant"]),content:z.string().min(1).max(1200)})).min(1).max(24),allowExternal:z.boolean().optional()});
/** Trust only bounded numerical inputs; never trust a client-supplied result, name or note. */
export function parseExplanation(raw:unknown) {
 const parsed=bodySchema.safeParse(raw);
 if(!parsed.success||parsed.data.messages.at(-1)?.role!=="user")return null;
 const result=calculate(parsed.data.plan.input);
 if(result.errors.length)return null;
 return {result,question:parsed.data.messages.at(-1)!.content,allowExternal:parsed.data.allowExternal===true};
}
export function topicFor(text:string):Topic|null {
 if(/shelf|expir|store|storage|fridge|freeze|good for|how long.*last/i.test(text))return "storage";
 if(/warning|round|tick|mark|precision/i.test(text))return "rounding";
 if(/how many|measurements|portions|vial give/i.test(text))return "portions";
 if(/unit|syringe/i.test(text))return "units";
 if(/concentr|mg\/mL|strong|weak/i.test(text))return "concentration";
 if(/water|volume|more liquid|less liquid/i.test(text))return "volume";
 if(/input|label|number.*enter/i.test(text))return "inputs";
 if(/plan|explain|plain english/i.test(text))return "overview";
 if(/verify|limit|identity|purity|compatib/i.test(text))return "limits";
 return null;
}
export function explanation(topic:Topic, r:CalcResult):string {
 const n=(x:number)=>x.toLocaleString("en-US",{maximumSignificantDigits:10});
 const concentration=`Your stated ${n(r.input.vialStrengthMg)} mg in ${n(r.usedBacMl)} mL gives ${n(r.finalConcentrationMgPerMl)} mg/mL. This assumes the material is spread evenly through that final amount of liquid.`;
 const amount=r.schedule?.dosePerInjectionMcg??r.input.doseMcg;
 const volume=`The entered amount per measurement is ${n(amount)} mcg. At that concentration, its calculated volume is ${n(r.doseVolumeMl)} mL.`;
 switch(topic){
 case "overview":return concentration+" "+volume+" These are input-based calculations, not a recommended amount or preparation.";
 case "concentration":return concentration+" With the same amount of material, more liquid means less material in each mL. Change a known number to check the math again.";
 case "volume":return `The calculation uses the final volume you entered: ${n(r.usedBacMl)} mL. It does not choose a liquid, how much to add or how much the vial can hold. `+volume;
 case "units":return r.syringeReadout.kind==="u100"?`On a U-100 scale, 100 units equal 1 mL. This calculation corresponds to ${n(r.syringeUnits)} U-100 units. That is a liquid amount. It does not choose an amount in mg or a device. Check the actual scale and the gap between its smallest marks.`:volume+" Your selected illustration uses an mL scale, not U-100 markings. Follow the actual device instructions.";
 case "portions":return `Before accounting for losses, the stated total contains ${n(r.dosesPerVial)} complete portions of the entered per-measurement amount. This count is not a treatment schedule or a guarantee that every portion can be recovered from a vial.`;
 case "storage":return "The math cannot tell you how long a product lasts or when to throw it away. Check the exact product instructions. A date or clear liquid cannot show whether germs are present or the material has changed.";
 case "rounding":return "The diagram is an example scale. Some numbers are rounded to fit the display. Check the smallest marks on the actual device. If the result falls between marks or exceeds the amount it holds, the tool cannot fix that mismatch. Read /methodology for the limits.";
 case "inputs":return "Keep the amount of material, the amount of liquid and the scale markings separate. Copy numbers from instructions you already have. A vial amount alone cannot tell you which liquid to use, how to use a product or how long it lasts. Ask the supplier or relevant professional about missing instructions.";
 default:return "This tool checks math. It cannot tell what is in a vial, whether it is clean, which products can be mixed or how to use them. Ask about the amount in each mL, liquid volume, scale markings, portion counts or rounded numbers.";
 }
}
export async function boundedJson(req:Request):Promise<unknown> {
 if(Number(req.headers.get("content-length")||0)>BODY_LIMIT)throw new RangeError("Request too large");
 if(!req.headers.get("content-type")?.toLowerCase().includes("application/json"))throw new TypeError("JSON required");
 const reader=req.body?.getReader();if(!reader)throw new TypeError("Body required");
 let bytes=0;const chunks:Uint8Array[]=[];
 try {for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>BODY_LIMIT){await reader.cancel();throw new RangeError("Request too large");}chunks.push(value);}}
 finally{reader.releaseLock();}
 const merged=new Uint8Array(bytes);let offset=0;for(const c of chunks){merged.set(c,offset);offset+=c.length;}
 return JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(merged));
}
