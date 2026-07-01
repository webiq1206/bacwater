"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updatePlanNotesAction } from "@/lib/plan-actions";
import { toast } from "@/components/ui/toaster";

export function PlanNotesForm({ publicId, initial }: { publicId: string; initial: string }) {
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  return (
    <div>
      <Textarea
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. Started at 2 mL BAC for cleaner math. Reorder pads next month."
      />
      <div className="mt-3 flex justify-end">
        <Button
          size="sm"
          onClick={async () => {
            setSaving(true);
            const res = await updatePlanNotesAction(publicId, value);
            setSaving(false);
            if (res.ok) toast({ title: "Notes saved", variant: "success" });
            else toast({ title: "Could not save notes", variant: "destructive" });
          }}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save notes
        </Button>
      </div>
    </div>
  );
}
