/**
 * Reusable HowTo schema for sequential-step content (reconstitution / mixing
 * guides). Steps are plain strings; supplies and tools are optional name lists.
 */
export function HowToJsonLd({
  name,
  description,
  steps,
  supplies,
  tools,
  totalTime,
}: {
  name: string;
  description?: string;
  steps: { name?: string; text: string }[];
  supplies?: string[];
  tools?: string[];
  /** ISO 8601 duration, e.g. "PT5M". */
  totalTime?: string;
}) {
  if (!steps.length) return null;
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name ?? `Step ${i + 1}`,
      text: s.text,
    })),
  };
  if (description) jsonLd.description = description;
  if (totalTime) jsonLd.totalTime = totalTime;
  if (supplies?.length)
    jsonLd.supply = supplies.map((s) => ({ "@type": "HowToSupply", name: s }));
  if (tools?.length)
    jsonLd.tool = tools.map((t) => ({ "@type": "HowToTool", name: t }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
