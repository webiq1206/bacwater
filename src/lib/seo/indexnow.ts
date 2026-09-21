import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo/sitemap";
import { isPublicNotificationPath } from "@/lib/seo/publication-policy";
export const INDEXNOW_KEY = "27a00f2a35ea4c5f9ccf890a624f8259";
const MAX_ATTEMPTS = 6;
export async function queueIndexNow(tx: Prisma.TransactionClient, paths: string[]) {
  for (const path of new Set(paths.filter(isPublicNotificationPath))) {
    await tx.indexNowEvent.upsert({ where: { path },
      create: { path },
      update: { revision: { increment: 1 }, status: "pending", attempts: 0, nextAttemptAt: new Date(), lastStatus: null },
    });
  }
}
export function indexNowEnabled(origin = SITE_URL): boolean {
  try { const u = new URL(origin); return process.env.INDEXNOW_ENABLED !== "false" && u.origin === "https://bacwater.ai"; } catch { return false; }
}
export function notificationOutcome(status: number, attempt: number): string {
  if (status === 200) return "submitted";
  if (status === 202) return "accepted";
  if (status === 403 || status === 404) return "blocked";
  if (status === 400 || status === 422) return "rejected";
  return attempt >= MAX_ATTEMPTS ? "failed" : "pending";
}
/** One bounded drain, not an unbounded worker or a claim of index inclusion. */
export async function flushIndexNow(options: { client?: PrismaClient; transport?: typeof fetch; origin?: string } = {}) {
  const client = options.client ?? prisma, transport = options.transport ?? fetch;
  const origin = options.origin ?? SITE_URL;
  if (!indexNowEnabled(origin)) return { enabled: false, attempted: 0, accepted: 0 };
  const now = new Date();
  await client.indexNowEvent.updateMany({ where: { status: "processing", nextAttemptAt: { lte: now } }, data: { status: "pending" } });
  const candidates = await client.indexNowEvent.findMany({ where: { status: "pending", attempts: { lt: MAX_ATTEMPTS }, nextAttemptAt: { lte: now } }, orderBy: { nextAttemptAt: "asc" }, take: 100 });
  const batch = [];
  for (const event of candidates) {
    if (!isPublicNotificationPath(event.path)) {
      await client.indexNowEvent.updateMany({ where: { path: event.path, revision: event.revision }, data: { status: "rejected" } });
      continue;
    }
    const lease = await client.indexNowEvent.updateMany({ where: { path: event.path, revision: event.revision, status: "pending" }, data: { status: "processing", attempts: { increment: 1 }, nextAttemptAt: new Date(now.getTime() + 60000) } });
    if (lease.count) batch.push(event);
  }
  if (!batch.length) return { enabled: true, attempted: 0, accepted: 0 };
  let status = 0, retryAfter = 0;
  try {
    const keyLocation = `${new URL(origin).origin}/${INDEXNOW_KEY}.txt`;
    const ownership = await transport(keyLocation, { redirect: "error", signal: AbortSignal.timeout(8000), cache: "no-store" });
    if (ownership.status !== 200 || (await ownership.text()).trim() !== INDEXNOW_KEY) status = 403;
    else {
      const response = await transport("https://api.indexnow.org/indexnow", { method: "POST", redirect: "error", signal: AbortSignal.timeout(12000), headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify({ host: "bacwater.ai", key: INDEXNOW_KEY, keyLocation, urlList: batch.map(e => `${new URL(origin).origin}${e.path}`) }) });
      status = response.status;
      const retry = response.headers.get("retry-after");
      if (retry) retryAfter = Math.max(0, Number.isFinite(Number(retry)) ? Number(retry) * 1000 : Date.parse(retry) - Date.now());
      await response.body?.cancel();
    }
  } catch { status = 0; }
  for (const event of batch) {
    const attempt = event.attempts + 1;
    const delay = Math.min(86400000, Math.max(60000 * 2 ** Math.min(attempt - 1, 8), retryAfter || 0));
    await client.indexNowEvent.updateMany({ where: { path: event.path, revision: event.revision, status: "processing" }, data: { status: notificationOutcome(status, attempt), nextAttemptAt: new Date(Date.now() + delay), lastStatus: status || null } });
  }
  return { enabled: true, attempted: batch.length, accepted: status === 200 || status === 202 ? batch.length : 0, httpStatus: status || null };
}
