import { GLOSS } from "@/lib/content/glossary-terms";

/**
 * Wraps a jargon word on its first use so a beginner can get the plain meaning
 * on hover or tap, while keeping the searchable term on the page. Pure CSS
 * tooltip (no JS), shown on hover and on keyboard focus. If no gloss exists for
 * the id, the word renders normally.
 *
 * Usage: <Term id="reconstitute">reconstitute</Term>
 */
export function Term({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const gloss = GLOSS[id];
  if (!gloss) return <>{children}</>;
  return (
    <span
      className="group relative inline cursor-help border-b border-dotted border-foreground/40 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      tabIndex={0}
    >
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-30 mt-1.5 hidden w-64 max-w-[16rem] border border-border bg-card p-2.5 text-xs font-normal normal-case leading-snug tracking-normal text-muted-foreground shadow-lg group-hover:block group-focus:block"
      >
        {gloss}
      </span>
    </span>
  );
}
