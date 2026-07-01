"use client";

import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePlanAction, duplicatePlanAction, togglePlanArchivedAction } from "@/lib/plan-actions";
import { toast } from "@/components/ui/toaster";

export function PlansRowActions({ publicId, archived }: { publicId: string; archived: boolean }) {
  const router = useRouter();
  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          const res = await duplicatePlanAction(publicId);
          if (res.ok) {
            toast({ title: "Plan duplicated", variant: "success" });
            router.push(`/plan/${res.publicId}`);
          }
        }}
      >
        <Copy className="h-4 w-4" /> Duplicate
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          const res = await togglePlanArchivedAction(publicId);
          if (res.ok) {
            toast({
              title: res.archived ? "Archived" : "Restored",
              variant: "success",
            });
            router.refresh();
          }
        }}
      >
        {archived ? (
          <>
            <ArchiveRestore className="h-4 w-4" /> Restore
          </>
        ) : (
          <>
            <Archive className="h-4 w-4" /> Archive
          </>
        )}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={async () => {
          if (!confirm("Delete this plan? This can't be undone.")) return;
          await deletePlanAction(publicId);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
}
