import { cn } from "@/lib/utils";

export type Provenance = "user" | "calculated" | "research";

const LABELS: Record<Provenance, string> = {
  user: "You entered",
  calculated: "We calculated",
  research: "From research",
};

const TITLES: Record<Provenance, string> = {
  user: "This value is exactly what you typed in.",
  calculated: "This number was derived by the calculator from your inputs.",
  research: "This comes from the reference layer, not from you or the math.",
};

/**
 * ProvenanceChip: a small tag that says where a number came from, so a reader
 * can always tell their own input from a computed result from a research-sourced
 * default. Used beside values on the results view and in the printable plan.
 *
 * The three sources map to the .provenance--* tones in globals.css.
 */
export function ProvenanceChip({
  source,
  label,
  className,
}: {
  source: Provenance;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn("provenance", `provenance--${source}`, className)}
      title={TITLES[source]}
    >
      {label ?? LABELS[source]}
    </span>
  );
}
