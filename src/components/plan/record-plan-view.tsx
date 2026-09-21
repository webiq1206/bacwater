"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDevicePlans, rememberDevicePlan } from "@/lib/saved-plans";
import { restoreDevicePlanAccessAction } from "@/lib/plan-actions";
export function RecordPlanView({ publicId, name, canEdit = false }: { publicId: string; name: string; canEdit?: boolean }) {
  const router = useRouter();
  useEffect(() => {
    let active = true;
    const secret = getDevicePlans().find((p) => p.publicId === publicId)?.claimToken;
    rememberDevicePlan({ publicId, name, savedAt: new Date().toISOString() });
    if (!canEdit && secret) restoreDevicePlanAccessAction(publicId, secret).then((result) => {
      if (active && result.ok) router.refresh();
    }).catch(() => { /* Retry by refreshing; shared viewers never gain access. */ });
    return () => { active = false; };
  }, [publicId, name, canEdit, router]);
  return null;
}
