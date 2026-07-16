"use client";

import { useEffect } from "react";
import { rememberDevicePlan } from "@/lib/saved-plans";

/**
 * Records the plan on this device (localStorage) whenever its page is opened, so
 * it shows up under "My Plans" even for visitors who never sign in, including
 * plans that were shared to them. Renders nothing.
 */
export function RecordPlanView({ publicId, name }: { publicId: string; name: string }) {
  useEffect(() => {
    rememberDevicePlan({ publicId, name, savedAt: new Date().toISOString() });
  }, [publicId, name]);
  return null;
}
