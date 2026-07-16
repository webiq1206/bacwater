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
