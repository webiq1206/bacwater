import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";
import { newResetToken, passwordStamp } from "../src/lib/security/password-reset";
import { resetPassword, requestPasswordReset } from "../src/lib/password-actions";
import { authConfig } from "../src/lib/auth";
const connection = new URL(process.env.DATABASE_URL || "postgresql://invalid/invalid");
assert.equal(connection.hostname,"127.0.0.1");
assert.equal(connection.pathname,"/bacwater_audit");
assert.ok(!process.env.RESEND_API_KEY, "Only isolated testing without live email credentials is allowed.");
const email=`reset-${Date.now()}@example.test`;
const original="original long fixture phrase", replacement="replacement long fixture phrase";
async function main(){
 const user=await prisma.user.create({data:{email,name:"Disposable recovery fixture",hashedPassword:await bcrypt.hash(original,10)}});
 const identifier=`password-reset:${user.id}`;
 try {
  const issue=async(expired=false)=>{const record=newResetToken();await prisma.verificationToken.create({data:{identifier,token:record.hash,expires:expired?new Date(Date.now()-1000):record.expires}});return record;};
  const form=(token:string,confirmation=replacement)=>{const f=new FormData();f.set("token",token);f.set("password",replacement);f.set("confirmation",confirmation);return f;};
  const expired=await issue(true);assert.equal((await resetPassword(form(expired.token))).ok,false);
  assert.equal((await resetPassword(form("a".repeat(64)))).ok,false);
  assert.equal(await bcrypt.compare(original,(await prisma.user.findUniqueOrThrow({where:{id:user.id}})).hashedPassword!),true);
  const valid=await issue(), other=await issue();
  assert.equal((await resetPassword(form(valid.token,"does not match"))).ok,false);
  assert.ok(await prisma.verificationToken.findUnique({where:{token:valid.hash}}));
  const oldStamp=passwordStamp(user.hashedPassword);
  const attempts=await Promise.all([resetPassword(form(valid.token)),resetPassword(form(valid.token))]);
  assert.equal(attempts.filter(r=>r.ok).length,1,"A reset token is consumed exactly once under concurrency.");
  const updated=await prisma.user.findUniqueOrThrow({where:{id:user.id}});
  assert.equal(await bcrypt.compare(replacement,updated.hashedPassword!),true);
  assert.notEqual(oldStamp,passwordStamp(updated.hashedPassword));
  assert.equal((await resetPassword(form(other.token))).ok,false,"All outstanding reset links are revoked.");
  assert.equal(await prisma.verificationToken.count({where:{identifier}}),0);
  assert.ok(await prisma.verificationToken.findUnique({where:{token:`password-session:${user.id}`}}));
  const jwt=authConfig.callbacks!.jwt! as (args:any)=>Promise<any>;
  assert.equal((await jwt({token:{sub:user.id,id:user.id,passwordStamp:oldStamp}})).id,undefined);
  assert.equal((await jwt({token:{sub:user.id,id:user.id}})).id,undefined,"Legacy sessions are revoked too.");
  assert.equal((await jwt({token:{sub:user.id},user:{id:user.id}})).id,user.id,"A fresh authenticated login remains possible.");
  const request=new FormData();request.set("email",email);
  const unavailable=await requestPasswordReset(request);assert.equal(unavailable.ok,false);
  console.log("PASS recovery database integration: expiry, unknown token, mismatch, concurrent one-time use, password hash, outstanding links, current/legacy session revocation and missing-provider handling.");
 } finally {
  await prisma.verificationToken.deleteMany({where:{identifier:{in:[identifier,`password-session:${user.id}`]}}});
  await prisma.user.delete({where:{id:user.id}});
 }
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>prisma.$disconnect());
