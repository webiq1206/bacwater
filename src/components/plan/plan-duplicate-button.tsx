"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { duplicatePlanAction } from "@/lib/plan-actions";
import { rememberDevicePlan } from "@/lib/saved-plans";
import { toast } from "@/components/ui/toaster";

/**
 * Take your own copy of a plan you can't edit.
 *
 * Editing a plan now writes to it, so the Edit button is only offered to
 * whoever owns it. This is what someone opening a shared plan link gets
 * instead: a copy of their own, which they can then change freely without
 * touching the original.
 */
export function PlanDuplicateButton({
  publicId,
  variant = "brand",
  label = "Make a copy",
  className,
}: {
  publicId: string;
  variant?: "brand" | "outline";
  /** Wording differs by where it sits: taking a copy of someone else's plan
   *  vs. branching off your own rather than changing it. */
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      variant={variant}
      className={className}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const res = await duplicatePlanAction(publicId);
          if (res.ok) {
            // Keep the copy findable for a visitor who isn't signed in, and
            // hold the claim token so they can attach it to an account later.
            rememberDevicePlan({
              publicId: res.publicId,
              name: res.name || "Untitled plan",
              savedAt: new Date().toISOString(),
              claimToken: res.claimToken ?? undefined,
            });
            toast({ title: "Copied to your plans", variant: "success" });
            router.push(`/plan/${res.publicId}/edit`);
          } else {
            toast({ title: "Could not copy this plan", variant: "destructive" });
          }
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
