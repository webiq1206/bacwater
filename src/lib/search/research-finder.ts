import { SUPPLIER_PRODUCTS, type ProductKind } from "../partners/supplier-catalog";
import { PRODUCT_GUIDES } from "../partners/product-guides";
import { PRODUCT_RESEARCH } from "../partners/product-content";

/** Closed, source-backed conversational retrieval. No generated claims or arbitrary URLs. */
interface ResearchTopic { id:string; label:string; words:RegExp; question:string; products:readonly string[]; }
export const RESEARCH_TOPICS:readonly ResearchTopic[]=[
 {id:"weight",label:"Weight-loss research",words:/\b(weight ?loss|weight management|obes\w*|appetite|satiety|lose weight|losing weight|burn\w* fat|fat loss)\b/i,question:"weight change and the messages linked to hunger",products:["glp-1","glp-2","glp-3","cagrilintide"]},
 {id:"movement",label:"How cells move",words:/\b(mov(e|ement|ing)|migrat\w*|tendon|ligament|actin|fak|paxillin|cell grip|repair|healing|recovery|injur\w*|wound\w*)\b/i,question:"how cells grip a surface and move",products:["bpc-157","tb-500","wolverine-stack","glow","klow","bpc-spray","bpc-tb-spray"]},
 {id:"support",label:"The support around cells",words:/\b(copper|collagen|matrix|support around cells|ghk|ahk|follicle\w*|skin|hair|wrinkle\w*)\b/i,question:"the material that supports cells, and copper-related research",products:["ghk-cu","ahk-cu","glow","klow","ghkcu-spray"]},
 {id:"fuel",label:"How cells use fuel",words:/\b(fuel|metaboli\w*|nad|mitochondri\w*|ampk|aicar|nnmt|nicotinamide|electron\w*|energy|longevity)\b/i,question:"how cells use fuel and reuse the chemicals that help",products:["mots-c","nad-plus","5-amino-1mq","nad-plus-spray"]},
 {id:"sugar",label:"Sugar-related cell messages",words:/\b(glucose|sugar|insulin|glp|gip|glucagon|amylin|calcitonin)\b/i,question:"cell messages related to sugar and food",products:["glp-1","glp-2","glp-3","cagrilintide"]},
 {id:"nerve",label:"Messages between nerve cells",words:/\b(nerve\w*|neuron\w*|brain|gaba|bdnf|trkb|enkephalin|snap|synap\w*|memory|focus|anxiety)\b/i,question:"how nerve cells pass, release or respond to messages",products:["semax","selank","dsip","snap-8","semax-spray","selank-spray","dsip-spray","adalank-spray","adamax-spray"]},
 {id:"sleep",label:"Sleep research",words:/\b(sleep|insomnia)\b/i,question:"sleep in early DSIP studies",products:["dsip","dsip-spray"]},
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
export interface FinderReply { text:string; options:string[]; matches:FinderMatch[]; context:FinderContext; scope:"results"|"clarify"|"restricted"|"unknown"|"tools"; links?:FinderLink[]; detail?:"study"|"how"; }
export interface FinderLink {label:string;href:string;}
export const FINDER_SUGGESTIONS=[
 {label:"Weight-loss research",question:"What products are studied for weight loss?"},
 {label:"Skin and hair",question:"What products are studied for skin and hair?"},
 {label:"Tissue repair",question:"What products are studied for tissue repair?"},
 {label:"Sleep research",question:"What products are studied for sleep?"},
 {label:"Cell energy",question:"What products are studied for cell energy?"},
 {label:"Immune system",question:"What products are studied for the immune system?"},
] as const;
export const FINDER_STARTERS=FINDER_SUGGESTIONS.map(s=>s.question);
const normalize=(s:string)=>s.normalize("NFKC").toLowerCase().replace(/[\u200b-\u200f\ufeff]/g,"").replace(/[^a-z0-9+]+/g," ").trim();
const catalogIds=new Set(SUPPLIER_PRODUCTS.map(p=>p.id));
const reply=(text:string,options:string[]=FINDER_STARTERS,context:FinderContext={},scope:FinderReply["scope"]="clarify"):FinderReply=>({text,options,matches:[],context,scope});
const formats:readonly [ProductKind,RegExp][]=[["spray",/\b(spray\w*|ready made liquid\w*|prepared liquid\w*)\b/],["blend",/\b(blend\w*|mixture\w*|stack\w*)\b/],["single",/\b(single\w*|one compound|individual compound\w*)\b/],["water",/\b(water only)\b/]];

/** A health topic alone is not personal-use intent. Never produce instructions for use. */
export function restrictedResearchRequest(raw:string):boolean {
 const s=normalize(raw);
 // Asking to use a website tool is not a request to use a compound.
 if(/\b(how (do|can) i use|can i use|help me (use|find|open)) (the |your |this )?(calculator|tool|website|site|converter)\b/.test(s)&&!/\b(inject\w*|take|my (body|weight|pain)|dose for)\b/.test(s))return false;
 return /\b(should i|can i (take|use|inject|mix|combine)|what (should|can) (i|we) (take|use)|recommend (me|for me)|for (me|myself|my (dog|cat|pet|child|patient|wife|husband)))\b/.test(s)
  || /\b(my|our) (body|health|symptoms|sleep|skin|hair|weight|pain|injury|dog|cat|pet|child|wife|husband|patient)\b/.test(s)
  || /\b(i|we) (feel|take|am taking|m taking|am pregnant|m pregnant)\b/.test(s)
  || /\b(i|we) have (diabet\w*|cancer|pain|anxiety|depression|an injury|insomnia|a condition)\b/.test(s)
  || /\b(i|we) (want|need|would like|d like|am trying|m trying) to (lose|gain|burn|heal|treat|cure|improve|boost|recover|sleep)\b/.test(s)
  || /\bhelp me (lose|gain|burn|heal|treat|cure|recover|sleep|boost|improve)\b/.test(s)
  || /\b(i|we) (want|need) (more energy|better sleep|weight loss|bigger muscles)\b/.test(s)
  || /\b(dosage|dosing|dose|titration|regimen|inject\w*|administer\w*|subcutaneous|intranasal|oral use)\b/.test(s) && !/\b(stud(y|ies)|trial|paper|research findings|what does .+ mean)\b/.test(s)
  || /\b(how (much|often).{0,45}(take|use|inject|mix)|how to (take|use|mix|inject)|safe to (take|use|inject)|personal use|treat (my|a patient)|use in (my|a dog|a cat))\b/.test(s);
}
const TOOL_LINKS:FinderLink[]=[{label:"Product-first calculator",href:"/peptide-calculator"},{label:"mg ↔ mcg",href:"/tools/mg-to-mcg"},{label:"U-100 ↔ mL",href:"/tools/syringe-units"}];
const EDUCATION_LINKS:FinderLink[]=[{label:"What a calculator cannot decide",href:"/learn/what-you-cannot-know"},{label:"How to read the evidence",href:"/methodology"}];
function toolReply(text:string,links:FinderLink[]=TOOL_LINKS):FinderReply{return {...reply(text,["Weight-loss research","How do cells move?"],{},"tools"),links};}

/** Primary trial records reviewed September 29, 2026. The catalog mapping is in PRODUCT_GUIDES.
 * These are studies of study medicines, not supplier products. No doses or use instructions.
 */
export const WEIGHT_RESEARCH:Record<string,Pick<FinderMatch,"why"|"finding"|"model"|"source"|"limit"|"evidence">>={
 "glp-1":{why:"Linked to semaglutide research on body weight and food-related messages.",finding:"In STEP 1, adults assigned to semaglutide lost more weight on average than those given a placebo, which had no active drug. Both groups received lifestyle support. Nausea and diarrhea were common, and some people stopped because of stomach or bowel problems.",model:"STEP 1, 2021: 1,961 adults, 68 weeks",source:"https://pubmed.ncbi.nlm.nih.gov/33567185/",limit:"This trial tested a study medicine, not the supplier’s GLP-1 vial. It does not establish safety or results for that vial.",evidence:"Human trial of a study medicine"},
 "glp-2":{why:"Linked to tirzepatide research on body weight and two food-related messages.",finding:"In SURMOUNT-1, adults assigned to tirzepatide lost more weight on average than the placebo group. A placebo has no active drug. Stomach and bowel problems were the most common side effects. The groups also received lifestyle support.",model:"SURMOUNT-1, 2022: 2,539 adults, 72 weeks",source:"https://pubmed.ncbi.nlm.nih.gov/35658024/",limit:"GLP-2 is this catalog’s name for its tirzepatide entry, not the natural GLP-2 hormone. The trial did not test this supplier’s vial.",evidence:"Human trial of a study medicine"},
 "glp-3":{why:"Linked to retatrutide research on body weight and three hormone messages.",finding:"In this trial, retatrutide groups lost more weight on average than the placebo group. A placebo has no active drug. Stomach and bowel problems were common. Heart rate also rose with increasing study amounts. This was a mid-stage trial, not a test of a catalog product.",model:"Phase 2 trial, 2023: 338 adults, 48 weeks",source:"https://pubmed.ncbi.nlm.nih.gov/37366315/",limit:"These findings concern the study medicine. They do not show that the supplier’s GLP-3 vial is safe or suitable for use in people.",evidence:"Human trial of a study medicine"},
 "cagrilintide":{why:"Studied for weight change because it copies amylin, a message linked to feeling full.",finding:"Across the study groups, cagrilintide led to greater average weight loss than placebo, which had no active drug. Nausea, constipation, diarrhea and reactions where the study medicine was given were reported. The study followed selected adults under clinical supervision.",model:"Phase 2 trial, 2021: 706 adults, 26 weeks",source:"https://pubmed.ncbi.nlm.nih.gov/34798060/",limit:"The study did not test this supplier’s product. Results from separate trials cannot tell us which catalog product is best.",evidence:"Human trial of a study medicine"}
};
/** Bes et al. (1992), primary abstract reviewed September 29, 2026. */
export const SLEEP_RESEARCH:Omit<FinderMatch,"id">={why:"DSIP has been studied for sleep. The small study linked here found limited effects.",finding:"A 1992 study followed 16 people with long-term trouble sleeping. Some measured sleep changes favored DSIP, but the effects were weak. People did not report better sleep quality. The authors concluded that short-term DSIP was unlikely to offer much benefit.",model:"Small human study, 1992: 16 people, five nights in a lab",source:"https://pubmed.ncbi.nlm.nih.gov/1299794/",limit:"This small, short study did not test the supplier’s vial or spray. It does not establish safety or a sleep benefit for either product.",evidence:"Small human study of DSIP, not a catalog product"};
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
 if(restrictedResearchRequest(input))return {...reply("I can explain research, but I can’t choose a product, dose or treatment for you or an animal. Please ask a licensed health professional about personal use. You can still ask about a study or how our tools work.",["What can you help with?","Find a calculator"],{blocked:true},"restricted"),links:EDUCATION_LINKS};
 if(previous.blocked&&/^(for research( only)?|which one|which is best|what about it|just tell me|only (sprays|blends)|how much)$/.test(s))return {...reply("I can explain a study or a tool, but adding ‘for research’ does not make personal-use advice appropriate. What research question would you like to explore?",FINDER_STARTERS,previous,"restricted"),links:EDUCATION_LINKS};
 if(s==="start a new research question")return reply("What would you like to explore? Ask about a topic, product or calculator.");
 if(/^(what can you (do|help with)|how does this work|how do you work|are you ai)$/.test(s))return toolReply("I can find catalog products linked to a research topic, explain study findings and help you use this website’s calculators. My answers come from reviewed notes, not a live search of every paper. I can’t give personal treatment or dosing advice.",[...TOOL_LINKS,{label:"Browse all products",href:"/recommendations"}]);
 if(/\b(calculat\w*|convert\w*|unit help|what (are|is|does).{0,20}(mg|mcg|ml|u 100)|how (many|much).{0,20}(mg|mcg|ml|units)|\d+([ .]\d+)? (mg|mcg|ml|iu|units))\b/.test(s))return toolReply("Choose a product first for the right calculator. Copy amounts from your label and research instructions. You can switch mg and mcg, or convert U-100 scale units and mL. These tools check math; they do not choose a dose or tell you how to prepare a product.");
 if(/^(browse( the)?( product)?( directory| catalog)?|product directory|all products|catalog|categories)$/.test(s))return toolReply("Browse the catalog by research topic or product name. Quick look gives a short overview; each full page has the study links and limits.",[{label:"Browse product directory",href:"/recommendations"}]);
 if(/\b(affiliate|commission|disclaimer|privacy)\b/.test(s))return toolReply("BACwater.ai is an Amino Club affiliate. We may earn a commission through supplier links. Matches are based on research topics, not commission amounts. Chat text stays in this tab’s memory until you reset or reload.",[{label:"Full disclaimer",href:"/disclaimer"},{label:"Privacy policy",href:"/privacy"}]);
 const names=exactProducts(s);
 let topics=RESEARCH_TOPICS.filter(t=>t.words.test(s)||normalize(t.label)===s);
 if(topics.some(t=>t.id==="weight"))topics=topics.filter(t=>t.id!=="sugar");
 const chosenFormat=formats.find(([,re])=>re.test(s))?.[0];
 const allFormats=/\b(all (formats|types)|any format)\b/.test(s);
 const followup=/^(more|show more|next|show more matches|studies|study results|sources|evidence|results|what did (the )?studies find|how (does it|do they) work|how it works|tell me more|explain (it|that)|why (these|this)|all formats|any format|all types|only (sprays|blends|singles))$/.test(s)||!!chosenFormat&&s.split(" ").length<=4
  ||!!previous.productIds?.length&&/\b(studies|papers|sources|evidence|findings|explain|results)\b/.test(s)&&s.split(" ").length<12;
 if(!names.length&&!topics.length&&!followup){
  if(/\b(cell\w*|peptide\w*|research|study|studies|signal\w*|hormone\w*|protein\w*)\b/.test(s))return reply("That covers several kinds of research. Which question is closest to yours?",RESEARCH_TOPICS.map(t=>t.label));
  return reply("I do not have a clear, checked match for that question. Try a product name or a lab process, such as cell movement or how cells use fuel. I will not guess a product.",FINDER_STARTERS,{},"unknown");
 }
 if(!names.length&&topics.length>1)return reply("Your question includes more than one topic. Which should we explore first?",topics.map(t=>t.label));
 const weightTopic=topics.find(t=>t.id==="weight");
 const topic=names.length?weightTopic:(topics[0]||(followup?RESEARCH_TOPICS.find(t=>t.id===previous.topic):undefined));
 let ids=names.length?names:topic?[...topic.products]:followup?(previous.productIds||[]).filter(id=>catalogIds.has(id)):[];
 if(!ids.length)return reply("Which topic or product should I narrow down? Choose a question, then ask for a product type or the study results.",FINDER_STARTERS);
 const format=allFormats?undefined:chosenFormat??(followup?previous.format:undefined);
 const unfiltered=ids;
 if(format)ids=ids.filter(id=>SUPPLIER_PRODUCTS.find(p=>p.id===id)?.kind===format);
 const context:FinderContext={topic:topic?.id,productIds:unfiltered,format,offset:0};
 if(!ids.length)return reply("I found no checked match in that product type for this topic. A different form is not a proven substitute. You can view all formats or start another question.",["All formats","New question"],context,"unknown");
 const more=/^(more|show more|next|show more matches)$/.test(s);
 const offset=more?Math.min((previous.offset||0)+3,Math.max(0,ids.length-1)):0;
 context.offset=offset;
 const matches=ids.slice(offset,offset+3).map(id=>{
  const g=PRODUCT_GUIDES[id];
  if(topic?.id==="weight"&&WEIGHT_RESEARCH[id])return {id,...WEIGHT_RESEARCH[id]};
  if(topic?.id==="sleep")return {id,...SLEEP_RESEARCH};
  return {id,why:g.study,finding:g.finding,model:g.model,source:g.paper,limit:g.caution,evidence:evidenceLabel(id)};
 });
 const options:string[]=["Study results","How it works"];
 if(offset+3<ids.length)options.push("Show more matches");
 if(!format&&unfiltered.some(id=>SUPPLIER_PRODUCTS.find(p=>p.id===id)?.kind==="spray"))options.push("Only sprays");
 if(!format&&unfiltered.some(id=>SUPPLIER_PRODUCTS.find(p=>p.id===id)?.kind==="blend"))options.push("Only blends");
 if(format)options.push("All formats");
 options.push("New question");
 const subject=topic?`These entries relate to ${topic.question}.`:`Here is the reviewed information for ${matches.map(m=>PRODUCT_RESEARCH[m.id].name).join(", ")}.`;
 const detail=/\b(how.*works?|explain (it|that))\b/.test(s)?"how":/\b(studies|study results|sources|evidence|findings|results|side effects?|safety|benefits?)\b/.test(s)?"study":undefined;
 return {text:topic?.id==="weight"?"These catalog entries relate to compounds studied for weight change. The linked trials tested study medicines, not the supplier’s products. Open a card to see the findings and limits.":`${subject} These are research links, not proven benefits of the supplier’s products.`,options,matches,context,scope:"results",detail};
}
