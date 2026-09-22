/** Narrow, repeatable repair. Dry-run unless explicitly applied. Never seed production. */
import { PrismaClient } from "@prisma/client";
import { applyEditorialRevisions } from "../src/lib/content/apply-revisions";
import { EDITORIAL_REVISION } from "../src/lib/content/editorial-revisions";
const prisma=new PrismaClient();
async function main(){
try {
 const apply=process.argv.includes("--apply");
 const results=await applyEditorialRevisions(prisma,apply);
 console.log(JSON.stringify({revision:EDITORIAL_REVISION,apply,results},null,2));
} catch {
 console.error("Editorial repair stopped. No seed, deletion or global overwrite was attempted.");process.exitCode=1;
} finally {await prisma.$disconnect();}

}
void main();
