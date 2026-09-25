/** Shared public route inventory for segmented sitemaps and discovery exports. */
export const SITE_URL=process.env.NEXT_PUBLIC_SITE_URL||"https://bacwater.ai";
export type ChangeFreq="always"|"hourly"|"daily"|"weekly"|"monthly"|"yearly"|"never";
export interface SitemapUrl{path:string;lastModified?:Date;changeFrequency?:ChangeFreq;priority?:number}
function escapeXml(s:string){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");}
export function urlsetXml(urls:SitemapUrl[]){const body=[...new Map(urls.map(u=>[u.path||"/",u])).values()].map(u=>`<url><loc>${escapeXml(SITE_URL+(u.path||"/"))}</loc>${u.lastModified?`<lastmod>${u.lastModified.toISOString()}</lastmod>`:""}${u.changeFrequency?`<changefreq>${u.changeFrequency}</changefreq>`:""}${u.priority!=null?`<priority>${u.priority.toFixed(1)}</priority>`:""}</url>`).join("");return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;}
export function sitemapIndexXml(paths:string[]){return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<sitemap><loc>${escapeXml(SITE_URL+p)}</loc></sitemap>`).join("")}</sitemapindex>`;}
export function xmlResponse(xml:string){return new Response(xml,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=0, s-maxage=0, must-revalidate"}});}
export const STATIC_PAGES:SitemapUrl[]=[
 {path:"/recommendations",changeFrequency:"weekly",priority:0.7},
 {path:"/methodology",priority:0.6},{path:"/compare-calculators",priority:0.6},
 {path:"",lastModified:new Date("2026-09-25T00:00:00Z"),changeFrequency:"weekly",priority:1},{path:"/peptide-calculator",changeFrequency:"weekly",priority:1},
 {path:"/plan",changeFrequency:"weekly",priority:0.9},
 {path:"/peptides",changeFrequency:"weekly",priority:0.9},{path:"/peptides/compare",changeFrequency:"weekly",priority:0.7},
 {path:"/learn",changeFrequency:"weekly",priority:0.8},{path:"/faq",changeFrequency:"weekly",priority:0.7},{path:"/sitemap",changeFrequency:"weekly",priority:0.5},
 {path:"/tools",changeFrequency:"weekly",priority:0.9},{path:"/tools/bac-water",lastModified:new Date("2026-09-25T00:00:00Z"),changeFrequency:"weekly",priority:0.9},{path:"/tools/dose",changeFrequency:"weekly",priority:0.9},
 {path:"/tools/syringe-units",lastModified:new Date("2026-09-25T00:00:00Z"),changeFrequency:"weekly",priority:0.9},{path:"/tools/mg-to-mcg",lastModified:new Date("2026-09-25T00:00:00Z"),changeFrequency:"weekly",priority:0.9},{path:"/tools/supplies",changeFrequency:"weekly",priority:0.9},
 {path:"/tools/reverse-bac",changeFrequency:"weekly",priority:0.9},{path:"/tools/vial-labels",changeFrequency:"monthly",priority:0.7},
 {path:"/learn/glossary",changeFrequency:"monthly",priority:0.6},{path:"/learn/bac-water-shelf-life",changeFrequency:"monthly",priority:0.7},
 {path:"/learn/where-to-buy-bacteriostatic-water",changeFrequency:"monthly",priority:0.8},{path:"/learn/bac-water-for-peptides",changeFrequency:"monthly",priority:0.8},
 {path:"/learn/what-you-cannot-know",changeFrequency:"monthly",priority:0.8},{path:"/about",changeFrequency:"monthly",priority:0.7},{path:"/contact",changeFrequency:"monthly",priority:0.7},
 {path:"/editorial-policy",changeFrequency:"monthly",priority:0.5},{path:"/preferred-source",changeFrequency:"monthly",priority:0.5},{path:"/terms",changeFrequency:"yearly",priority:0.3},
 {path:"/privacy",changeFrequency:"yearly",priority:0.3},{path:"/disclaimer",changeFrequency:"yearly",priority:0.3}
];
export const SITEMAP_SEGMENTS=["/sitemap-pages.xml","/sitemap-peptides.xml","/sitemap-learn.xml"];
export const STATIC_LEARN_SLUGS=new Set(STATIC_PAGES.map(p=>p.path).filter(p=>p.startsWith("/learn/")).map(p=>p.slice("/learn/".length)));
