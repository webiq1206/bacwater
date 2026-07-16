"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDevicePlans, forgetDevicePlan, type DeviceSavedPlan } from "@/lib/saved-plans";

/**
 * The saved-plans view for visitors who aren't signed in. Reads the plans this
 * device has made/opened from localStorage so they're never lost, and nudges
 * (never forces) sign-in to sync across devices.
 */
export function DevicePlansList() {
  const [plans, setPlans] = useState<DeviceSavedPlan[] | null>(null);

  useEffect(() => {
    setPlans(getDevicePlans());
  }, []);

  function remove(publicId: string) {
    forgetDevicePlan(publicId);
    setPlans((p) => (p ? p.filter((x) => x.publicId !== publicId) : p));
  }

  // Avoid a hydration flash: render nothing until we've read localStorage.
  if (plans === null) return <div className="mt-8 h-24" />;

  return (
    <div className="mt-8">
      <div className="section-dark rounded-2xl p-4 sm:p-5 flex items-start gap-3 mb-6">
        <Sparkles className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--color-accent-guide)" }} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          These are the plans saved on <span className="text-foreground font-medium">this device</span>.{" "}
          <Link href="/signin?next=/plans" className="text-foreground underline underline-offset-2">
            Sign in
          </Link>{" "}
          to keep them in your account and see them on any device.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center">
          <div className="text-sm text-muted-foreground">
            No saved plans on this device yet.
          </div>
          <Button asChild variant="brand" className="mt-4">
            <Link href="/plan">
              <Plus className="h-4 w-4" /> Build a plan
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {plans.map((p) => (
            <li key={p.publicId}>
              <div className="border border-border bg-card p-5 rounded-2xl flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/plan/${p.publicId}`}
                    className="font-semibold text-lg tracking-tight hover:underline break-words"
                  >
                    {p.name || "Untitled plan"}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Saved {new Date(p.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <Link
                    href={`/plan/${p.publicId}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium"
                    style={{ color: "var(--color-accent-guide)" }}
                  >
                    Open <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => remove(p.publicId)}
                  aria-label="Remove from this device"
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
