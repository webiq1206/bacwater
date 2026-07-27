"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getDevicePlans, forgetDevicePlan } from "@/lib/saved-plans";
import { claimDevicePlansAction } from "@/lib/plan-actions";
import { toast } from "@/components/ui/toaster";

/**
 * Rendered on My Plans for signed-in users. Silently attaches any plans that
 * were saved on this device while signed out to the account, then refreshes so
 * they appear in the account list. Renders nothing.
 */
export function ClaimDevicePlans() {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    // Only plans this device saved (it holds the claim token) can be claimed;
    // plans merely viewed via shared links have no token and stay put.
    const claimable = getDevicePlans().filter((p) => p.claimToken);
    if (claimable.length === 0) return;

    claimDevicePlansAction(
      claimable.map((p) => ({ publicId: p.publicId, claimToken: p.claimToken! }))
    )
      .then((res) => {
        if (!res.ok || res.claimed.length === 0) return;
        // Claimed plans now live in the account; drop the device-local copies
        // so they aren't double-listed if the user signs out later.
        for (const publicId of res.claimed) forgetDevicePlan(publicId);
        toast({
          title:
            res.claimed.length === 1
              ? "1 plan added to your account"
              : `${res.claimed.length} plans added to your account`,
          variant: "success",
        });
        router.refresh();
      })
      .catch(() => {
        /* non-fatal; plans stay device-local */
      });
  }, [router]);

  return null;
}
