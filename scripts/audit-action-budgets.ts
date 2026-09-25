import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import { takeActionBudget } from "../src/lib/security/action-budget";
const connection=new URL(process.env.DATABASE_URL||"postgresql://invalid/invalid");
assert.equal(connection.hostname,"127.0.0.1");assert.equal(connection.pathname,"/bacwater_audit");
async function main(){
 const now=1700000000000;
 await prisma.requestBudget.deleteMany({where:{id:{startsWith:"action:"}}});
 const attempts=await Promise.all(Array.from({length:8},()=>takeActionBudget("contact","Fixture@EXAMPLE.test",now)));
 assert.equal(attempts.filter(Boolean).length,3);
 assert.equal(await takeActionBudget("contact"," fixture@example.test ",now),false);
 assert.equal(await takeActionBudget("contact","different@example.test",now),true);
 assert.equal(await takeActionBudget("contact","fixture@example.test",now+300000),true);
 const records=await prisma.requestBudget.findMany({where:{id:{startsWith:"action:"}}});
 assert.equal(JSON.stringify(records).includes("example.test"),false);
 await prisma.requestBudget.deleteMany({where:{id:{startsWith:"action:"}}});
 const global=[];for(let i=0;i<12;i++)global.push(await takeActionBudget("signup",`fixture-${i}@example.test`,now));
 assert.equal(global.filter(Boolean).length,10);
 const secret=process.env.AUTH_SECRET;const old=process.env.NEXTAUTH_SECRET;
 try{delete process.env.AUTH_SECRET;delete process.env.NEXTAUTH_SECRET;assert.equal(await takeActionBudget("contact","fixture@example.test",now),false);}finally{process.env.AUTH_SECRET=secret;if(old!==undefined)process.env.NEXTAUTH_SECRET=old;}
 console.log("PASS action budgets: concurrent cap, normalized identity, isolation, window recovery, no raw identity, global ceiling, missing-secret failure.");
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await prisma.requestBudget.deleteMany({where:{id:{startsWith:"action:"}}});await prisma.$disconnect();});
