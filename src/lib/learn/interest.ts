/**
 * Client-side "interest" signal. The site defaults to generic content and only
 * personalizes once the user has shown interest in a specific peptide
 * (selecting one in the calculator, opening a peptide page, or reading a
 * peptide-tagged article). A plain page visit with no selection is not a
 * signal and does not set anything here.
 */

const KEY = "bw_interest_peptide";

export function setInterestPeptide(slug: string | null | undefined): void {
  if (typeof window === "undefined") return;
  try {
    if (slug) window.localStorage.setItem(KEY, slug);
  } catch {
    // Ignore storage errors (private mode, disabled storage).
  }
}

export function getInterestPeptide(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
