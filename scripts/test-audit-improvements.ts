import assert from "node:assert/strict";
import { learnLanding } from "../src/lib/learn/landing";
import { CONTENT_TYPES, TOPICS } from "../src/lib/learn/taxonomy";
import { STATIC_PAGES, urlsetXml } from "../src/lib/seo/sitemap";
import { buildLlmsGuide } from "../src/lib/seo/llms";
import { signupSchema } from "../src/lib/security/registration";
let checks=0;
function check(name:string,fn:()=>void){fn();checks++;console.log(`PASS audit improvements: ${name}`);}
check("colliding safety type is an alternate of its topic",()=>{const page=learnLanding({type:"safety"},20);assert.equal(page.indexable,false);assert.equal(page.canonical,"/learn?topic=safety");assert.equal(page.title,learnLanding({topic:"safety"},20).title);});
check("only sufficiently populated single facets index",()=>{for(const count of [0,1,2])assert.equal(learnLanding({topic:"storage"},count).indexable,false);assert.equal(learnLanding({topic:"storage"},3).indexable,true);for(const f of [{topic:"storage",type:"guide"},{q:"private words"},{topic:"storage",q:"search"}]){assert.equal(learnLanding(f,30).indexable,false);assert.equal(learnLanding(f,30).canonical,"/learn");}});
check("every indexable facet has specific copy",()=>{const titles=new Set<string>();for(const f of [...CONTENT_TYPES.map(x=>({type:x.key})),...TOPICS.map(x=>({topic:x.key}))]){const page=learnLanding(f,20);if(!page.indexable)continue;assert.ok(page.description.length>70);assert.doesNotMatch(page.title,/Guide guides|filtered to/);assert.equal(titles.has(page.title),false);titles.add(page.title);}});
check("canonical public discovery includes the directory once and omits the alternate builder",()=>{const xml=urlsetXml(STATIC_PAGES);assert.equal(xml.split('/recommendations</loc>').length-1,1);assert.equal(xml.includes('/plan/new</loc>'),false);assert.ok(xml.includes('/plan</loc>'));});
check("llms guide supplies identity, affiliate context, grouped links and no private IDs",()=>{const text=buildLlmsGuide([]);assert.ok(text.startsWith('# BACwater.ai\n\n>'));assert.ok(text.includes('affiliate'));assert.ok(text.includes('/recommendations)'));assert.ok(text.includes('## Optional'));assert.doesNotMatch(text,/\/admin|\/plan\/[^)\s]+|Public information or calculation tool/);});
check("registration normalizes identity, accepts passphrases and rejects weak or truncated inputs",()=>{const input={name:'  Research user  ',email:'USER@example.test ',password:'A unique phrase for this site'};const parsed=signupSchema.parse(input);assert.equal(parsed.name,'Research user');assert.equal(parsed.email,'user@example.test');for(const password of ['short','a'.repeat(73),'😀'.repeat(19)])assert.equal(signupSchema.safeParse({...input,password}).success,false);assert.equal(signupSchema.safeParse({...input,name:' '}).success,false);assert.equal(signupSchema.safeParse({...input,email:'a'.repeat(250)+'@example.test'}).success,false);});
console.log(`${checks} targeted regression checks passed.`);
