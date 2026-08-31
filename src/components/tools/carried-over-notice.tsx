"use client";

import { History, X } from "lucide-react";

/**
 * Tells the visitor, in plain words, that the peptide and vial figures on
 * screen came from their last calculation on another tool rather than from
 * nowhere — and gives them one click to clear it.
 *
 * Carrying values silently would be the worse failure: someone returning a
 * week later would work from stale numbers without noticing.
 */
export function CarriedOverNotice({
  onClear,
  visible,
}: {
  onClear: () => void;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs">
      <History className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1 text-muted-foreground">
        Carried over from your last calculation. Change anything you need to.
      </span>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex shrink-0 items-center gap-1 font-medium text-foreground hover:underline"
      >
        <X className="h-3 w-3" /> Start fresh
      </button>
    </div>
  );
}
