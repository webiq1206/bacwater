import { createHash } from "node:crypto";
import { prisma } from "@/lib/db";
/** Transactional global and per-account ceilings across autoscaled workers. */
export async function takeTopicBudget(userId:string, now=Date.now()):Promise<boolean>{
 const minute=Math.floor(now/60000);const expiresAt=new Date(now+120000);
 const account=createHash("sha256").update(userId).digest("hex").slice(0,24);
 try {await prisma.$transaction(async tx=>{
  for(const [id,limit]of [[`ai-global:${minute}`,20],[`ai-account:${account}:${minute}`,3]] as const){
   const row=await tx.requestBudget.upsert({where:{id},create:{id,count:1,expiresAt},update:{count:{increment:1}}});
   if(row.count>limit)throw new Error("budget");
  }
  // Counts contain no message contents. Cleanup is tied to a request, not an assumed background scheduler.
  await tx.requestBudget.deleteMany({where:{expiresAt:{lt:new Date(now)}}});
 });return true;}catch{return false;}
}
