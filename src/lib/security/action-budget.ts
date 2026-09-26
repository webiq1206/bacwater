import { createHmac } from "node:crypto";
import { prisma } from "@/lib/db";

type Scope = "signin" | "signup" | "contact" | "password-request" | "password-reset";
const LIMITS = {
  "password-request": { global: 20, account: 3, window: 15 * 60_000 },
  "password-reset": { global: 30, account: 5, window: 15 * 60_000 },
  signin: { global: 120, account: 10, window: 15 * 60_000 },
  signup: { global: 10, account: 3, window: 60 * 60_000 },
  contact: { global: 30, account: 3, window: 5 * 60_000 },
} as const;

/** Shared across workers. No request body, raw address, IP or password is stored. */
export async function takeActionBudget(scope: Scope, identity: string, now = Date.now()): Promise<boolean> {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) return false;
  const limits = LIMITS[scope];
  const key = createHmac("sha256", secret).update(`${scope}:${identity.trim().toLowerCase()}`).digest("hex");
  const minute = Math.floor(now / 60_000);
  const window = Math.floor(now / limits.window);
  try {
    await prisma.$transaction(async tx => {
      const counters = [
        { id: `action:${scope}:global:${minute}`, limit: limits.global, end: (minute + 1) * 60_000 },
        { id: `action:${scope}:${key}:${window}`, limit: limits.account, end: (window + 1) * limits.window },
      ];
      for (const counter of counters) {
        const row = await tx.requestBudget.upsert({ where: { id: counter.id }, create: { id: counter.id, count: 1, expiresAt: new Date(counter.end) }, update: { count: { increment: 1 } } });
        if (row.count > counter.limit) throw new Error("Action rate limit");
      }
      await tx.requestBudget.deleteMany({ where: { expiresAt: { lt: new Date(now) } } });
    });
    return true;
  } catch { return false; }
}
