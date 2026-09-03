"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Download, Loader2, Pencil } from "lucide-react";
import { PlanShareButton } from "@/components/plan/plan-share-button";
import { duplicatePlanAction } from "@/lib/plan-actions";
import { rememberDevicePlan } from "@/lib/saved-plans";
import { toast } from "@/components/ui/toaster";

interface Props {
  publicId: string;
  peptideName?: string | null;
  /** False when this plan belongs to someone else; Edit becomes Copy. */
  canEdit?: boolean;
}

/**
 * Mobile sticky action bar. Pinned to the bottom of the viewport so the primary
 * actions (Edit / PDF / Share) are always one tap away without scrolling.
 * Hidden on large screens (the page shows inline actions there) and in print.
 */
export function PlanActionBar({ publicId, peptideName, canEdit = true }: Props) {
  const router = useRouter();
  const [copying, setCopying] = useState(false);
  const title = peptideName
    ? `${peptideName} reconstitution plan`
    : "My reconstitution plan";

  return (
    <div className="lg:hidden no-print fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1 px-3 py-2">
        {canEdit ? (
          <Link
            href={`/plan/${publicId}/edit`}
            className="flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Pencil className="h-5 w-5" />
            Edit
          </Link>
        ) : (
          <button
            type="button"
            disabled={copying}
            onClick={async () => {
              setCopying(true);
              try {
                const res = await duplicatePlanAction(publicId);
                if (res.ok) {
                  rememberDevicePlan({
                    publicId: res.publicId,
                    name: res.name || "Untitled plan",
                    savedAt: new Date().toISOString(),
                    claimToken: res.claimToken ?? undefined,
                  });
                  toast({ title: "Copied to your plans", variant: "success" });
                  router.push(`/plan/${res.publicId}/edit`);
                } else {
                  toast({
                    title: "Could not copy this plan",
                    variant: "destructive",
                  });
                }
              } finally {
                setCopying(false);
              }
            }}
            className="flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            {copying ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
            Copy
          </button>
        )}
        <Link
          href={`/plan/${publicId}/pdf`}
          className="flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Download className="h-5 w-5" />
          PDF
        </Link>
        <PlanShareButton
          url={`/plan/${publicId}`}
          title={title}
          text="Here's my peptide reconstitution plan from BACwater.ai"
          compact
          className="rounded-lg py-2 text-foreground hover:bg-muted"
        />
      </div>
    </div>
  );
}
