"use client";

import { useState } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { updatePlanNameAction } from "@/lib/plan-actions";

/**
 * Inline editable plan title. Shows the plan's name with a rename control;
 * saving calls the server action (authorized against the owner) and updates in
 * place. Falls back to the current name if the field is cleared.
 */
export function PlanNameEditor({
  publicId,
  initialName,
}: {
  publicId: string;
  initialName: string;
}) {
  const [name, setName] = useState(initialName);
  const [draft, setDraft] = useState(initialName);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    const next = draft.trim() || name;
    setSaving(true);
    const res = await updatePlanNameAction(publicId, next);
    setSaving(false);
    if (res.ok) {
      setName(next);
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 mt-1">
        <input
          value={draft}
          autoFocus
          maxLength={120}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setDraft(name);
              setEditing(false);
            }
          }}
          className="min-w-0 flex-1 bg-transparent border-b border-border outline-none focus:border-foreground text-3xl sm:text-4xl font-serif tracking-tight"
          aria-label="Plan name"
        />
        <button
          type="button"
          onClick={save}
          disabled={saving}
          aria-label="Save name"
          className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(name);
            setEditing(false);
          }}
          aria-label="Cancel"
          className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight min-w-0 break-words">
        {name}
      </h1>
      <button
        type="button"
        onClick={() => {
          setDraft(name);
          setEditing(true);
        }}
        aria-label="Rename plan"
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  );
}
