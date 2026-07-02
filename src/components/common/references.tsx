import type { Reference } from "@/lib/content/references";

/**
 * Visible "References" block for guide, comparison, and peptide pages. Pairs
 * with the `citation` JSON-LD emitted by the page's schema. Links open in a new
 * tab and are followed (these point at authoritative primary sources, so the
 * outbound association is intentional).
 */
export function References({
  references,
  title = "References",
}: {
  references: Reference[] | undefined;
  title?: string;
}) {
  if (!references || references.length === 0) return null;
  return (
    <section className="mt-14 border-t border-border pt-8 max-w-3xl">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Primary sources for the facts on this page. We cite regulatory and
        peer-reviewed authorities rather than secondary blogs.
      </p>
      <ol className="mt-4 space-y-3 text-sm list-decimal pl-5">
        {references.map((r) => (
          <li key={r.url} className="leading-relaxed">
            <a
              href={r.url}
              target="_blank"
              rel="noopener"
              className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground transition-colors"
            >
              {r.title}
            </a>
            <span className="text-muted-foreground">{" "}&middot; {r.source}</span>
            {r.note ? (
              <span className="block text-muted-foreground mt-0.5">{r.note}</span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
