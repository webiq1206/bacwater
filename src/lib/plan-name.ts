/**
 * A relevant default name for a saved plan, e.g. "Retatrutide · 40 mg · Jul 15".
 * Pure and dependency-free so it can run on the client (to pre-fill the editable
 * name field before saving) and on the server (as the fallback at save time).
 */
export function defaultPlanName(p: {
  peptideName?: string | null;
  vialStrengthMg?: number | null;
  dateMixed?: string | null;
}): string {
  const name = (p.peptideName && p.peptideName.trim()) || "Custom peptide";
  const parts = [name];
  if (p.vialStrengthMg && p.vialStrengthMg > 0) parts.push(`${p.vialStrengthMg} mg`);
  if (p.dateMixed) {
    const d = new Date(`${p.dateMixed}T12:00:00`);
    if (!Number.isNaN(d.getTime())) {
      parts.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    }
  }
  return parts.join(" · ").slice(0, 100);
}

/**
 * Whether a plan's stored name is one we generated rather than one someone
 * typed.
 *
 * A generated name is a restatement of the plan's own numbers, so it should
 * follow them when they change — a plan called "BPC-157 · 5 mg" whose vial is
 * corrected to 10 mg is otherwise labelled with the very number that was
 * wrong. A name someone chose is theirs and is never rewritten.
 *
 * `values` are the plan's values as they were when the name was stored, so the
 * comparison asks "is this still exactly what we would have produced?".
 * Anything else — including a name that merely looks similar — counts as
 * chosen, which is the safe direction to be wrong in.
 */
export function isGeneratedPlanName(
  name: string | null | undefined,
  values: {
    peptideName?: string | null;
    vialStrengthMg?: number | null;
    dateMixed?: string | null;
  }
): boolean {
  const trimmed = (name ?? "").trim();
  // An empty name was never chosen, so it is free to follow the numbers.
  if (!trimmed) return true;
  return trimmed === defaultPlanName(values);
}
