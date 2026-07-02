/**
 * Learn taxonomy: the three structured dimensions every Learn entry is tagged
 * with. Kept in code (not loose category text) so it drives the filterable
 * index, the recommendation endpoint, and the contextual surfacing panels from
 * a single source of truth.
 */

export const CONTENT_TYPES = [
  { key: "guide", label: "Guide" },
  { key: "peptide-guide", label: "Peptide Guide" },
  { key: "comparison", label: "Comparison" },
  { key: "faq", label: "FAQ" },
  { key: "buying-guide", label: "Buying Guide" },
  { key: "safety", label: "Safety" },
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number]["key"];

export const TOPICS = [
  { key: "dosage", label: "Dosage" },
  { key: "storage", label: "Storage & Shelf Life" },
  { key: "safety", label: "Safety" },
  { key: "ingredients", label: "Ingredients" },
  { key: "where-to-buy", label: "Where to Buy" },
  { key: "injection-supplies", label: "Injection Supplies" },
  { key: "reconstitution-method", label: "Reconstitution Method" },
] as const;

export type Topic = (typeof TOPICS)[number]["key"];

export const CONTENT_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  CONTENT_TYPES.map((c) => [c.key, c.label])
);

export const TOPIC_LABEL: Record<string, string> = Object.fromEntries(
  TOPICS.map((t) => [t.key, t.label])
);

export function isContentType(v: string): v is ContentType {
  return CONTENT_TYPES.some((c) => c.key === v);
}

export function isTopic(v: string): v is Topic {
  return TOPICS.some((t) => t.key === v);
}
