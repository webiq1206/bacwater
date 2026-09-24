import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/learn/catalog";
import { BASE_SEARCH_ITEMS, type SearchItem } from "@/lib/search/public-index";
export const dynamic="force-dynamic";
/** No query parameter is read: search terms and calculation values stay in the browser. */
export async function GET() {
 const items:SearchItem[]=[...BASE_SEARCH_ITEMS];let partial=false;
 try {
  const catalog=await getCatalog(true),seen=new Set(items.map(i=>i.href));
  for(const entry of catalog){
   if(seen.has(entry.url)||!entry.url.startsWith("/learn/")||entry.source==="peptide")continue;
   seen.add(entry.url);items.push({id:`guide:${entry.id}`,href:entry.url,title:entry.title,description:entry.excerpt,kind:"guide",keywords:[...entry.peptideTags,...entry.topicTags].join(" "),reference:entry.peptideTags[0]});
  }
 } catch {partial=true;}
 return NextResponse.json({items,partial},{headers:{"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"}});
}
