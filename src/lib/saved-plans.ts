/**
 * Device-local record of saved/opened plans, so a visitor who never signs in can
 * still find the plans they made on this device. Plans are also associated with
 * an account when the user is signed in (server side); this is the fallback for
 * everyone else. Guarded for SSR, safe to import anywhere.
 */
export interface DeviceSavedPlan {
  publicId: string;
  name: string;
  savedAt: string; // ISO
  /**
   * Proof-of-possession secret issued when this device saved the plan while
   * signed out. Presented on sign-in to claim the plan into the account.
   * Absent for plans merely viewed (e.g. shared links) — those can't be claimed.
   */
  claimToken?: string;
}

const KEY = "bacwater.savedPlans";
const MAX = 100;

export function getDevicePlans(): DeviceSavedPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as DeviceSavedPlan[]) : [];
    return Array.isArray(list) ? list.filter((p) => p && p.publicId) : [];
  } catch {
    return [];
  }
}

/** Add or move-to-front a plan. Newest first; deduped by publicId. */
export function rememberDevicePlan(plan: DeviceSavedPlan) {
  if (typeof window === "undefined") return;
  try {
    const existing = getDevicePlans();
    const prior = existing.find((p) => p.publicId === plan.publicId);
    const list = existing.filter((p) => p.publicId !== plan.publicId);
    list.unshift({
      publicId: plan.publicId,
      name: plan.name || "Untitled plan",
      savedAt: plan.savedAt,
      // Keep a previously stored token if the new entry doesn't carry one
      // (e.g. re-opening the plan page after saving).
      claimToken: plan.claimToken ?? prior?.claimToken,
    });
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* storage full or blocked, non-fatal */
  }
}

export function forgetDevicePlan(publicId: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify(getDevicePlans().filter((p) => p.publicId !== publicId))
    );
  } catch {
    /* non-fatal */
  }
}
