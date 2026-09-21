import { timingSafeEqual } from "node:crypto";
export interface PlanOwnership {
  id: string; publicId: string; userId: string | null; claimToken: string | null;
}
export function storedRole(user: { role?: string } | null | undefined): "admin" | "user" {
  return user?.role === "admin" ? "admin" : "user";
}
export function planCookieName(publicId: string): string | null {
  return /^[A-Za-z0-9_-]{10,40}$/.test(publicId) ? `bacwater-plan-${publicId}` : null;
}
export function ownsPlan(plan: PlanOwnership, userId?: string | null, token?: string | null): boolean {
  if (plan.userId) return Boolean(userId && userId === plan.userId);
  if (!plan.claimToken || !token || !planCookieName(plan.publicId)) return false;
  const expected = Buffer.from(plan.claimToken), supplied = Buffer.from(token);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}
// Include the original ownership in the write to reject concurrent reassignment.
export function planWriteWhere(plan: PlanOwnership) {
  return { id: plan.id, userId: plan.userId, claimToken: plan.claimToken };
}
