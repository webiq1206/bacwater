import { cookies } from "next/headers";
import { ownsPlan, planCookieName, type PlanOwnership } from "@/lib/security/authorization";
export async function hasPlanAccess(plan: PlanOwnership, userId?: string | null): Promise<boolean> {
  const key = planCookieName(plan.publicId);
  return ownsPlan(plan, userId, key ? (await cookies()).get(key)?.value : undefined);
}
export async function rememberPlanAccess(publicId: string, token: string | null): Promise<void> {
  const key = planCookieName(publicId);
  if (!key || !token) return;
  (await cookies()).set(key, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
  });
}
