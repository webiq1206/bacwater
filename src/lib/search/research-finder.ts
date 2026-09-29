import { SUPPLIER_PRODUCTS, type ProductKind } from "../partners/supplier-catalog";
import { PRODUCT_GUIDES } from "../partners/product-guides";
import { PRODUCT_RESEARCH } from "../partners/product-content";

/** Closed, source-backed conversational retrieval. No generated claims or arbitrary URLs. */
interface ResearchTopic { id:string; label:string; words:RegExp; question:string; products:readonly string[]; }
export const RESEARCH_TOPICS:readonly ResearchTopic[]=[
 {id:"movement",label:"How cells move",words:/\b(mov(e|ement|ing)|migrat\w*|tendon|ligament|actin|fak|paxillin|cell grip)\b/i,question:"how cells grip a surface and move",products:["bpc-157","tb-500","wolverine-stack","glow","klow","bpc-spray","bpc-tb-spray"]},
 {id:"support",label:"The support around cells",words:/\b(copper|collagen|matrix|support around cells|ghk|ahk|follicle\w*)\b/i,question:"the material that supports cells, and copper-related research",products:["ghk-cu","ahk-cu","glow","klow","ghkcu-spray"]},
 {id:"fuel",label:"How cells use fuel",words:/\b(fuel|metaboli\w*|nad|mitochondri\w*|ampk|aicar|nnmt|nicotinamide|electron\w*)\b/i,question:"how cells use fuel and reuse the chemicals that help",products:["mots-c","nad-plus","5-amino-1mq","nad-plus-spray"]},
 {id:"sugar",label:"Sugar-related cell messages",words:/\b(glucose|sugar|insulin|glp|gip|glucagon|amylin|calcitonin)\b/i,question:"cell messages related to sugar and food",products:["glp-1","glp-2","glp-3","cagrilintide"]},
 {id:"nerve",label:"Messages between nerve cells",words:/\b(nerve\w*|neuron\w*|brain|gaba|bdnf|trkb|enkephalin|snap|synap\w*)\b/i,question:"how nerve cells pass, release or respond to messages",products:["semax","selank","dsip","snap-8","semax-spray","selank-spray","dsip-spray","adalank-spray","adamax-spray"]},
 {id:"gland",label:"How glands release messages",words:/\b(pituitary|gland\w*|ghrelin|ghrh|growth hormone|hormone release)\b/i,question:"how a small gland releases chemical messages called hormones",products:["ipamorelin","tesamorlin","sermorelin","cjc-ipa-no-dac"]},
 {id:"immune",label:"How cells detect threats",words:/\b(immune|inflamm\w*|alarm|dendritic|pept1|toll|il 12|detect threats)\b/i,question:"how cells detect a trigger and send alarm messages",products:["kpv","thymosin-alpha-1","klow"]},
 {id:"barrier",label:"The thin barrier around a cell",words:/\b(membrane\w*|barrier\w*|bacteri\w*|microb\w*|antimicrobial)\b/i,question:"how a peptide changes a cell’s thin outer barrier",products:["ll-37"]},
 {id:"stress",label:"Chemical stress inside cells",words:/\b(oxid\w*|peroxide|free radical\w*|reactive|redox|cell stress|chemical stress|erk|epo|cd131)\b/i,question:"how cells respond to chemicals that can damage their parts",products:["glutathione","pinealon","ara-290"]},
 {id:"instructions",label:"How cells read their instructions",words:/\b(dna|gene\w*|telomere\w*|telomerase|chromosome\w*|cell instructions)\b/i,question:"how cells read their built-in instructions or maintain the ends of DNA",products:["cartalax","epithalon"]},
 {id:"growth",label:"Cell growth in lab tests",words:/\b(cell growth|cells grow|igf|binding protein\w*)\b/i,question:"how a growth message reaches cells in lab tests",products:["igf-1-lr3"]},
 {id:"pigment",label:"Pigment and related cell messages",words:/\b(pigment|melanocortin|mc1|mc3|mc4|alpha msh)\b/i,question:"cell messages in the melanocortin family, including pigment-cell signals",products:["melanotan-i","melanotan-ii","pt-141","melanotan-ii-spray","pt-141-spray"]},
 {id:"chain",label:"A chain of hormone messages",words:/\b(gnrh|kiss1r|lh|fsh|chain of hormone)\b/i,question:"a chain of messages between nerve cells and a gland",products:["kisspeptin"]},
 {id:"fluid",label:"Salt and fluid in cell tests",words:/\b(salt|fluid|vpac1|vpac2|intestinal|gut cells)\b/i,question:"cell messages linked to salt and fluid movement",products:["vip"]},
 {id:"fatcells",label:"Fat-cell chemistry in experiments",words:/\b(fat cell\w*|fat tissue|beta 3|lipolysis|lipid)\b/i,question:"chemical changes in fat cells in experiments",products:["aod-9604"]},
 {id:"water",label:"Water as a lab supply",words:/\b(water|dissolv\w*|solvent|benzyl|preservative|diluent)\b/i,question:"water and preservatives as lab supplies",products:["amino-h2o"]},
];
export interface FinderContext { topic?:string; productIds?:string[]; format?:ProductKind; offset?:number; blocked?:boolean; }
export interface FinderMatch { id:string; why:string; finding:string; model:string; source:string; limit:string; evidence:string; }
export interface FinderReply { text:string; options:string[]; matches:FinderMatch[]; context:FinderContext; scope:"results"|"clarify"|"restricted"|"unknown"; }
export const FINDER_STARTERS=["How do cells move?","How do cells use fuel?","How do nerve cells pass messages?","Water as a lab supply"];
const normalize=(s:string)=>s.normalize("NFKC").toLowerCase().replace(/[\u200b-\u200f\ufeff]/g,"").replace(/[^a-z0-9+]+/g," ").trim();
const catalogIds=new Set(SUPPLIER_PRODUCTS.map(p=>p.id));
const reply=(text:string,options:string[]=FINDER_STARTERS,context:FinderContext={},scope:FinderReply["scope"]="clarify"):FinderReply=>({text,options,matches:[],context,scope});
const formats:readonly [ProductKind,RegExp][]=[["spray",/\b(spray\w*|ready made liquid\w*|prepared liquid\w*)\b/],["blend",/\b(blend\w*|mixture\w*|stack\w*)\b/],["single",/\b(single\w*|one compound|individual compound\w*)\b/],["water",/\b(water only)\b/]];

/** Topics are not a loophole for personal use. Restricted requests produce no product cards. */
export function restrictedResearchRequest(raw:string):boolean {
 const s=normalize(raw);
 return /\b(dos(e|es|ing|age)|inject\w*|administer\w*|titration|protocol|cycle|regimen|subcutaneous|intranasal|oral use|side effect\w*|contraindication\w*|pregnan\w*|breastfeed\w*|medication\w*|safe|safety|safest|effective|effectiveness|benefits?)\b/.test(s)
  || /\b(treat\w*|cur(e|es|ing)|pain|injur\w*|wound\w*|heal\w*|recover\w*|anxiety|depress\w*|diabet\w*|cancer|insomnia|adhd|libido|fertility|erect\w*|tan|tanning|wrinkle\w*|anti aging|antiaging|detox|supplement\w*)\b/.test(s)
  || /\b(weight|fat) (loss|lose|reduc\w*|burn\w*)\b|\b(lose|losing|burn\w*|shed\w*|drop\w*) (\w+ ){0,3}(weight|fat|pounds|lbs|kilos)\b/.test(s)
  || /\b(boost|improv\w*|increas\w*|better|enhanc\w*|help|want|need)\b.{0,35}\b(memory|focus|sleep|energy|muscle|strength|skin|hair|fitness|performance|longevity)\b/.test(s)
  || /\b(human|personal|veterinary) use\b|\bfor (me|myself|a patient|my patient|people|a person|humans|animals|a dog|a cat|pets)\b/.test(s)
  || /\bhelp me (?!understand\b|learn\b|study\b|research\b|explore\b|compare\b|find (?:studies|papers|sources)\b)/.test(s)
  || /\b(i|we) (have|feel|take|use|should)\b|\b(my|our) (body|health|symptoms|sleep|skin|hair|weight|pain|dog|cat|pet|child|wife|husband|patient)\b/.test(s)
  || /\b(i|we) (am|are) (?!studying\b|researching\b|comparing\b|exploring\b|learning\b|interested in (?:studying|researching|understanding)\b)/.test(s)
  || /\b(i|we) (want|need) (?!to (?:study|understand|learn|research|compare|explore|find studies)\b)/.test(s)
  || /\b(should i|how (much|often)|how to (take|use|mix)|safe to|safest|best peptide|best product)\b|\bcan i (?!learn\b|read\b|find\b|explore\b|compare\b)/.test(s)
  || /\b\d+(\.\d+)?\s*(mg|mcg|ml|iu|units|milligrams?|micrograms?|milliliters?)\b/.test(s);
}
function exactProducts(s:string):string[]{
 const exact=SUPPLIER_PRODUCTS.filter(p=>[p.name,p.id,...(p.aliases||[])].some(n=>normalize(n)===s));
 if(exact.length)return exact.map(p=>p.id);
 const hits=SUPPLIER_PRODUCTS.flatMap(p=>{
  const names=[p.name,p.id,...(p.aliases||[])].map(normalize).filter(n=>n.length>=4);
  const longest=Math.max(0,...names.filter(n=>` ${s} `.includes(` ${n} `)).map(n=>n.length));
  return longest?[{id:p.id,length:longest}]:[];
 });
 // A full spray or blend name should not also select its shorter component alias.
 if(hits.some(h=>SUPPLIER_PRODUCTS.find(p=>p.id===h.id)?.kind==="spray")&&!/\b(compare|versus|vs|and)\b/.test(s))return hits.filter(h=>h.length===Math.max(...hits.map(x=>x.length))).map(h=>h.id);
 return hits.map(h=>h.id);
}
function evidenceLabel(id:string){
 const p=SUPPLIER_PRODUCTS.find(p=>p.id===id)!;
 if(id==="dihexa")return "Evidence warning: key paper withdrawn";
 if(p.kind==="water")return "Supplier description, not an experiment";
 if(["adalank-spray","adamax-spray","snap-8","sermorelin","tb-500"].includes(id))return "Related research only";
 if(p.kind==="blend"||p.kind==="spray")return "Ingredient research, not a finished-product test";
 return "Study of the molecule, not the supplier’s product";
}
export function researchReply(input:string,previous:FinderContext={}):FinderReply {
 if(input.length>800)return reply("Please shorten your question to 800 characters or fewer. Leave out names, health details and lab secrets.");
 const s=normalize(input);
 if(!s||/^(hi|hello|help|start|new question|start over)$/.test(s))return reply("What would you like to understand? Tell me about a lab topic, or choose a question below.");
 if(restrictedResearchRequest(input))return reply("I can help explain lab research. I cannot choose a product for personal use, a health goal or an animal, or give amounts or instructions for use. For a medical question, speak with a licensed health professional. Start a new research question to explore a separate lab topic.",["Start a new research question"],{blocked:true},"restricted");
 if(previous.blocked&&s!=="start a new research question")return reply("Please start a new research question. Adding ‘for research’ does not change a request for personal use.",["Start a new research question"],previous,"restricted");
 if(s==="start a new research question")return reply("What lab process do you want to understand? Choose a question or describe it in your own words.");
 if(/^(what can you do|how does this work|how do you work|are you ai)$/.test(s))return reply("I match your words to reviewed research notes and real catalog entries. I can explain a topic, show the linked studies and help you narrow a search. I do not search new papers live or create study plans.");
 const names=exactProducts(s);
 let topics=RESEARCH_TOPICS.filter(t=>t.words.test(s)||normalize(t.label)===s);
 const chosenFormat=formats.find(([,re])=>re.test(s))?.[0];
 const allFormats=/\b(all (formats|types)|any format)\b/.test(s);
 const followup=/^(more|show more|next|show more matches|studies|sources|evidence|results|what did (the )?studies find|how (does it|do they) work|tell me more|explain (it|that)|why (these|this)|all formats|any format|all types|only (sprays|blends|singles))$/.test(s)||!!chosenFormat&&s.split(" ").length<=4
  ||!!previous.productIds?.length&&/\b(studies|papers|sources|evidence|findings|explain|results)\b/.test(s)&&s.split(" ").length<12;
 if(!names.length&&!topics.length&&!followup){
  if(/\b(cell\w*|peptide\w*|research|study|studies|signal\w*|hormone\w*|protein\w*)\b/.test(s))return reply("That covers several kinds of research. Which question is closest to yours?",RESEARCH_TOPICS.map(t=>t.label));
  return reply("I do not have a clear, checked match for that question. Try a product name or a lab process, such as cell movement or how cells use fuel. I will not guess a product.",FINDER_STARTERS,{},"unknown");
 }
 if(!names.length&&topics.length>1)return reply("Your question includes more than one topic. Which should we explore first?",topics.map(t=>t.label));
 const topic=names.length?undefined:(topics[0]||(followup?RESEARCH_TOPICS.find(t=>t.id===previous.topic):undefined));
 let ids=names.length?names:topic?[...topic.products]:followup?(previous.productIds||[]).filter(id=>catalogIds.has(id)):[];
 if(!ids.length)return reply("Which topic or product should I narrow down? Choose a question, then ask for a product type or the study results.",FINDER_STARTERS);
 const format=allFormats?undefined:chosenFormat??(followup?previous.format:undefined);
 const unfiltered=ids;
 if(format)ids=ids.filter(id=>SUPPLIER_PRODUCTS.find(p=>p.id===id)?.kind===format);
 const context:FinderContext={topic:topic?.id,productIds:unfiltered,format,offset:0};
 if(!ids.length)return reply("I found no checked match in that product type for this topic. A different form is not a proven substitute. You can view all formats or start another question.",["All formats","New question"],context,"unknown");
 const more=/^(more|show more|next|show more matches)$/.test(s);
 const offset=more?Math.min((previous.offset||0)+4,Math.max(0,ids.length-1)):0;
 context.offset=offset;
 const matches=ids.slice(offset,offset+4).map(id=>{
  const g=PRODUCT_GUIDES[id];
  return {id,why:g.study,finding:g.finding,model:g.model,source:g.paper,limit:g.caution,evidence:evidenceLabel(id)};
 });
 const options:string[]=[];
 if(offset+4<ids.length)options.push("Show more matches");
 if(!format&&unfiltered.some(id=>SUPPLIER_PRODUCTS.find(p=>p.id===id)?.kind==="spray"))options.push("Only sprays");
 if(!format&&unfiltered.some(id=>SUPPLIER_PRODUCTS.find(p=>p.id===id)?.kind==="blend"))options.push("Only blends");
 if(format)options.push("All formats");
 options.push("New question");
 const subject=topic?`These entries relate to ${topic.question}.`:`Here is the reviewed information for ${matches.map(m=>PRODUCT_RESEARCH[m.id].name).join(", ")}.`;
 return {text:`${subject} Each card explains the link, what a source found and what it does not prove. These are reading suggestions, not a choice of product for your experiment.`,options,matches,context,scope:"results"};
}
