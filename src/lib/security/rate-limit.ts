import { createHmac, randomBytes } from "node:crypto";
import { isIP } from "node:net";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/db";

export class RateLimitError extends Error {
  constructor(public retryAfterSeconds: number) { super("Too many attempts. Please try again later."); }
}
export function privateLimitKey(scope: string, subject: string, window: number): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Request protection is unavailable.");
  return createHmac("sha256", secret).update(`${scope}\0${subject}\0${window}`).digest("hex");
}
let lastCleanup = 0;
/** Atomic shared-store counter, including across concurrent autoscale instances. */
export async function consumeLimit(scope: string, subject: string, limit: number, windowMs: number, now = Date.now()) {
  if (!Number.isInteger(limit) || limit < 1 || !Number.isFinite(windowMs) || windowMs < 1000) throw new Error("Invalid request limit.");
  const window = Math.floor(now / windowMs), end = (window + 1) * windowMs;
  const key = privateLimitKey(scope, subject, window);
  const row = await prisma.rateLimitBucket.upsert({ where: { key }, update: { hits: { increment: 1 } }, create: { key, expiresAt: new Date(end + windowMs) } });
  if (now - lastCleanup > 60000) {
    lastCleanup = now;
    await prisma.$executeRaw`DELETE FROM "RateLimitBucket" WHERE "key" IN (SELECT "key" FROM "RateLimitBucket" WHERE "expiresAt" < ${new Date(now)} LIMIT 100)`;
  }
  return { allowed: row.hits <= limit, retryAfterSeconds: Math.max(1, Math.ceil((end - now) / 1000)) };
}
export async function enforceLimit(scope: string, subject: string, limit: number, windowMs: number) {
  const result = await consumeLimit(scope, subject, limit, windowMs);
  if (!result.allowed) throw new RateLimitError(result.retryAfterSeconds);
}
export async function requestIdentity(): Promise<string> {
  // Enable only after verifying the hosting provider overwrites the chosen header.
  const headerName = process.env.TRUSTED_CLIENT_IP_HEADER?.toLowerCase();
  if (headerName && ["x-real-ip", "cf-connecting-ip", "x-forwarded-for"].includes(headerName)) {
    const value = (await headers()).get(headerName)?.split(",")[0].trim();
    if (value && isIP(value)) return `ip:${value}`;
  }
  const jar = await cookies(), key = "bacwater-request-device";
  let id = jar.get(key)?.value;
  if (!id || !/^[a-f0-9]{48}$/.test(id)) {
    id = randomBytes(24).toString("hex");
    jar.set(key, id, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 86400 });
  }
  // Secondary abuse signal, not authentication. Per-account limits are separate.
  return `device:${id}`;
}
