/** Local matching: user search text is never sent to a provider or query endpoint. */
export function normalizeSearch(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/tirzepetide/g, "tirzepatide").replace(/bacwater/g, "bac water")
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}
export function searchScore(query: string, title: string, extra = ""): number {
  const q = normalizeSearch(query), t = normalizeSearch(title), hay = `${t} ${normalizeSearch(extra)}`;
  if (!q) return 1;
  const compact = (s: string) => s.replaceAll(" ", "");
  if (t === q || compact(t) === compact(q)) return 120;
  if (t.startsWith(q) || compact(t).startsWith(compact(q))) return 90;
  if (t.includes(q)) return 75;
  if (hay.includes(q) || compact(hay).includes(compact(q))) return 50;
  const stop = new Set(["a","an","the","i","my","do","does","how","what","is","are","to","for","of","in","can","you","me","please","need","much","where","find","mean","means"]);
  const words = q.split(" ").filter(word=>!stop.has(word));
  if(!words.length)return 0;
  return words.every(word => hay.includes(word)) ? 25 + words.filter(word => t.includes(word)).length * 5 : 0;
}
