import type { DisplaySupplierProduct, ProductKind } from "./supplier-catalog";
import { getProductResearch } from "./product-research";
import { normalizeSearch } from "../search/matching";

export const CATALOG_SEARCH_LIMIT = 240;
export const RESEARCH_SEARCH_BOUNDARY = "This directory cannot recommend products for symptoms, health goals, personal use or use in animals. Search by a compound name, laboratory topic or product format instead.";
/** Deterministic filtering, not an LLM recommendation endpoint. No query leaves this module. */
export function restrictedProductQuery(input: string): boolean {
  const text = normalizeSearch(input.replace(/[\u200B-\u200D\uFEFF]/g, ""))
    .replace(/w[e3]ight/g, "weight").replace(/l[o0]ss/g, "loss");
  return /\b(weight|fat|obesity|obese|slim|cutting|bulking|muscles?|bodybuilding|fitness|performance|recovery|recover|heal|heals|healing|injur\w*|pain|sleep|insomnia|anxiety|depression|adhd|ptsd|diabet\w*|cancer|disease|symptoms?|treat\w*|cure\w*|therapy|therapeutic|medical|health\w*|hormon\w*|testosterone|antiaging|longevity|aging|ageing|wrinkles?|cosmetic|skin|hair|tanning|tan|libido|sexual|erect\w*|fertility|pregnan\w*|breastfeed\w*|dosing|dosage|dose|doses|inject\w*|ingest\w*|consum\w*|nasal|oral|sublingual|administ\w*|human\w*|people|patients?|veterinar\w*|animals?|pets?|dogs?|cats?|horses?|children|teens?|minors?|safe|safety|protocol|regimen|cycles?|titrati\w*|prescri\w*|benefits?)\b/.test(text)
    || /\b(anti age|lose \w+|blood sugar|blood pressure|growth hormone|for me|for my|should i|can i take|how much|how often|how long|take daily|ignore .*(?:rules|instructions|previous)|bypass|system prompt)\b/.test(text);
}
const FORM_PATTERNS: [ProductKind, RegExp][] = [
  ["spray", /\b(?:sprays?|solutions?|liquids?|ready made)\b/g],
  ["blend", /\b(?:blends?|mixtures?|multi ingredient)\b/g],
  ["water", /\b(?:lab water|laboratory water|bac water|bacteriostatic water|water|diluents?|solvents?)\b/g],
  ["single", /\b(?:single compounds?|single ingredients?|standalone)\b/g],
];
const STOP = new Set("a an the am i my me we our you your do does how what is are to for of in can please need looking look find show all products product listings listing material materials research laboratory lab vitro only with containing contain that which and or some any just about information describe compare on as named include including interested want would like something compound compounds peptide peptides format formats but not no without exclude except than rather".split(" "));
export interface CatalogQueryResult { products: DisplaySupplierProduct[]; blocked: boolean; interpreted: string[]; }
export function searchProductCatalog(products: readonly DisplaySupplierProduct[], raw: string, kind: ProductKind | "all" = "all", sort: "catalog" | "az" | "za" = "catalog"): CatalogQueryResult {
  if (raw.length > CATALOG_SEARCH_LIMIT || restrictedProductQuery(raw)) return { products: [], blocked: true, interpreted: [] };
  let query = normalizeSearch(raw), included = new Set<ProductKind>(), excluded = new Set<ProductKind>();
  // Read explicit format exclusions before positive terms, e.g. "copper, no sprays".
  query = query.replace(/\b(?:no|not|without|exclude|excluding|except)\s+(?:any\s+)?(sprays?|solutions?|liquids?|blends?|mixtures?|water|single compounds?)\b/g, (_, phrase: string) => {
    for (const [form, re] of FORM_PATTERNS) if (new RegExp(re.source).test(phrase)) excluded.add(form);
    return " ";
  });
  for (const [form, re] of FORM_PATTERNS) {
    if (new RegExp(re.source).test(query)) included.add(form);
    query = query.replace(new RegExp(re.source, "g"), " ");
  }
  // A product's own No DAC identity must not be treated as an excluded format.
  const words = query.split(/\s+/).filter(word => word && !STOP.has(word));
  const compact = (s: string) => s.replaceAll(" ", "");
  const scored = products.map((product, index) => {
    if ((kind !== "all" && product.kind !== kind) || excluded.has(product.kind) || (included.size && !included.has(product.kind))) return null;
    const research = getProductResearch(product);
    const name = normalizeSearch(`${product.name} ${product.id} ${product.reference} ${product.mark}`);
    const hay = `${name} ${normalizeSearch(`${research.aliases} ${research.topic}`)}`;
    const exact = compact(normalizeSearch(raw)) === compact(normalizeSearch(product.name)) || compact(normalizeSearch(raw)) === compact(normalizeSearch(product.id));
    const named = [product.name, product.id, product.reference, product.mark].some(value => compact(normalizeSearch(value)).startsWith(compact(words.join(" "))));
    const matches = !words.length || exact || named || words.every(word => hay.split(/\s+/).some(token => token.startsWith(word)));
    if (!matches || (raw.trim() && !words.length && !included.size && !excluded.size && !/^(?:all|all products|show all|show all products|products|research materials)$/i.test(raw.trim()))) return null;
    return { product, index, score: exact ? 100 : named && words.length ? 60 : 1 };
  }).filter((item): item is NonNullable<typeof item> => item !== null);
  scored.sort((a, b) => sort === "az" ? a.product.name.localeCompare(b.product.name) : sort === "za" ? b.product.name.localeCompare(a.product.name) : b.score - a.score || a.index - b.index);
  const labels: Record<ProductKind, string> = { single: "Single compounds", blend: "Blends", spray: "Solutions", water: "Lab water" };
  return { products: scored.map(item => item.product), blocked: false, interpreted: [...Array.from(included, x => labels[x]), ...Array.from(excluded, x => `Excluding ${labels[x].toLowerCase()}`)] };
}
