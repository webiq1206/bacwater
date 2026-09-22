import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { applyEditorialRevisions } from "../src/lib/content/apply-revisions";
import { EDITORIAL_REVISIONS } from "../src/lib/content/editorial-revisions";
import { takeTopicBudget } from "../src/lib/ai/budget";
const connection=new URL(process.env.DATABASE_URL||"postgresql://invalid/invalid");
assert.equal(connection.hostname,"127.0.0.1");assert.equal(connection.pathname,"/bacwater_audit");
const prisma=new PrismaClient();
const legacy: {slug:string;kind:string;title:string;body:string}[]=JSON.parse(readFileSync("audit/2026-09-21/remaining/legacy-content-baseline.json","utf8"));
const selected=EDITORIAL_REVISIONS.filter(r=>["how-to-read-a-peptide-vial","faq-general","faq-bac-water-amount","what-is-bac-water"].includes(r.slug));
async function main(){
 let checks=0;const pass=(name:string)=>{checks++;console.log(`PASS ${name}`);};
 for(const revision of selected){const original=legacy.find(x=>x.slug===revision.slug)!;await prisma.contentBlock.upsert({where:{slug:revision.slug},create:{...original,published:true},update:{title:original.title,body:original.body,published:true,noindex:false,seoTitle:"Preserve custom SEO"}});}
 const sample=selected.find(x=>x.slug==="how-to-read-a-peptide-vial")!;
 assert.ok((await applyEditorialRevisions(prisma,false,selected)).every(x=>x.status==="eligible-dry-run"));
 assert.equal((await prisma.contentBlock.findUniqueOrThrow({where:{slug:sample.slug}})).title,sample.previousTitle);pass("dry run performs no write");
 await prisma.contentBlock.update({where:{slug:"faq-bac-water-amount"},data:{body:"Independent editor text",published:false}});
 await prisma.contentBlock.update({where:{slug:"what-is-bac-water"},data:{published:false,noindex:true,canonicalPath:"/learn/what-is-bac-water"}});
 const results=await applyEditorialRevisions(prisma,true,selected);
 assert.equal(results.find(x=>x.slug==="faq-bac-water-amount")?.status,"preserved-independent-edit");
 assert.equal((await prisma.contentBlock.findUniqueOrThrow({where:{slug:"faq-bac-water-amount"}})).body,"Independent editor text");pass("independent unpublished edits preserved");
 const changed=await prisma.contentBlock.findUniqueOrThrow({where:{slug:sample.slug}});assert.equal(changed.body,sample.body);assert.equal(changed.seoTitle,"Preserve custom SEO");pass("only matched default title and body updated");
 const draft=await prisma.contentBlock.findUniqueOrThrow({where:{slug:"what-is-bac-water"}});assert.equal(draft.noindex,true);assert.equal(draft.published,false);assert.equal(draft.canonicalPath,"/learn/what-is-bac-water");pass("draft/noindex/canonical flags preserved");
 assert.ok(await prisma.indexNowEvent.findUnique({where:{path:"/faq"}}));assert.ok(await prisma.indexNowEvent.findUnique({where:{path:`/learn/${sample.slug}`}}));pass("published changes queue durable URL notifications");
 const again=await applyEditorialRevisions(prisma,true,selected);assert.equal(again.filter(x=>x.status==="already-current").length,3);pass("repair is idempotent");
 const missing={...sample,slug:"fixture-not-present"};assert.deepEqual(await applyEditorialRevisions(prisma,true,[missing]),[{slug:missing.slug,status:"not-present"}]);pass("missing content is not invented or republished");
 // Fixed old minute isolates budget test records from any browser fixture.
 await prisma.requestBudget.deleteMany({});const now=1700000000000;
 const attempts=await Promise.all(Array.from({length:8},()=>takeTopicBudget("fixture-one",now)));
 assert.ok(attempts.filter(Boolean).length<=3);assert.ok(attempts.some(Boolean));pass("concurrent per-account limit cannot exceed three");
 await prisma.requestBudget.deleteMany({});const distinct=[];
 for(let i=0;i<25;i++)distinct.push(await takeTopicBudget(`fixture-${i}`,now));
 assert.equal(distinct.filter(Boolean).length,20);pass("global minute ceiling is twenty across accounts");
 assert.equal(await takeTopicBudget("fixture-future",now+180000),true);assert.equal(await prisma.requestBudget.count({where:{expiresAt:{lt:new Date(now+180000)}}}),0);pass("request-triggered cleanup removes expired counters");
 const budgets=await prisma.requestBudget.findMany();assert.equal(JSON.stringify(budgets).includes("fixture-future"),false);pass("budget records omit raw account identity and question text");
 // Restore the regular seed content without altering any other fixture records.
 for(const revision of selected)await prisma.contentBlock.update({where:{slug:revision.slug},data:{title:revision.title,body:revision.body,published:true,noindex:false,canonicalPath:null,seoTitle:null}});
 await prisma.requestBudget.deleteMany({});
 console.log(`${checks} editorial migration and external-topic budget cases passed in a disposable database.`);
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>prisma.$disconnect());
