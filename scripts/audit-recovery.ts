import assert from "node:assert/strict";
import fs from "node:fs/promises";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";
import { createResetToken, consumeResetToken, resetDigest, resetIdentifier, RESET_LIFETIME_MS, recoveryOrigin } from "../src/lib/security/password-recovery";
import { consumeLimit, privateLimitKey } from "../src/lib/security/rate-limit";
async function main() {
  const url = new URL(process.env.DATABASE_URL || "postgresql://invalid/invalid");
  assert.equal(url.hostname, "127.0.0.1"); assert.equal(url.pathname, "/bacwater_audit"); assert.equal(process.env.AUDIT_ORIGIN, "http://127.0.0.1:3000");
  for (const key of ["RESEND_API_KEY", "ANTHROPIC_API_KEY"]) assert.ok(!process.env[key]);
  const prefix = `recovery-fixture-${Date.now()}`, email = `${prefix}@example.test`;
  const password = "new controlled passphrase 392";
  const results: { name: string; status: string; error?: string }[] = [];
  const user = await prisma.user.create({ data: { email, name: "Recovery fixture", hashedPassword: await bcrypt.hash("initial controlled password", 12) } });
  const step = async(name: string, fn: () => Promise<void>) => { try { await fn(); results.push({ name, status: "passed" }); } catch(error) { results.push({ name, status: "failed", error: String(error) }); throw error; } };
  const scope = `fixture-${prefix}`, now = Date.now(), windowMs = 60000;
  try {
    await step("Only a hash is stored; link uses the configured origin and a fragment", async () => {
      const reset = await createResetToken(email); assert.ok(reset);
      const token = await prisma.verificationToken.findUniqueOrThrow({ where: { token: resetDigest(reset.token) } });
      assert.notEqual(token.token, reset.token); assert.equal(token.identifier, resetIdentifier(user.id)); assert.equal(new URL(reset.url).search, "");
      assert.equal(new URL(reset.url).origin, "http://127.0.0.1:3000"); assert.ok(new URL(reset.url).hash.includes(reset.token));
      assert.ok(token.expires.getTime() > Date.now() + RESET_LIFETIME_MS - 10000);
    });
    await step("A replacement link invalidates the earlier link", async () => {
      const old = await createResetToken(email), current = await createResetToken(email); assert.ok(old && current);
      assert.equal(await consumeResetToken(old.token, password), null); assert.ok(await consumeResetToken(current.token, password));
      assert.equal(await consumeResetToken(current.token, password), null);
      const updated = await prisma.user.findUniqueOrThrow({ where: { id: user.id } }); assert.equal(updated.authVersion, 1); assert.ok(await bcrypt.compare(password, updated.hashedPassword!));
    });
    await step("Concurrent reset replay has exactly one winner", async () => {
      const reset = await createResetToken(email); assert.ok(reset);
      const outcomes = await Promise.all([consumeResetToken(reset.token, password), consumeResetToken(reset.token, password)]);
      assert.equal(outcomes.filter(Boolean).length, 1);
      assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: user.id } })).authVersion, 2);
    });
    await step("Expired, malformed and OAuth-only requests cannot change a password", async () => {
      const expired = await createResetToken(email, new Date(Date.now() - RESET_LIFETIME_MS - 1000)); assert.ok(expired);
      assert.equal(await consumeResetToken(expired.token, password), null); assert.equal(await consumeResetToken("invalid", password), null);
      assert.equal(await createResetToken(`absent-${email}`), null);
      await prisma.user.update({ where: { id: user.id }, data: { hashedPassword: null } }); assert.equal(await createResetToken(email), null);
    });
    await step("Shared-store rate limits remain atomic under concurrent requests", async () => {
      const outcomes = await Promise.all(Array.from({ length: 12 }, () => consumeLimit(scope, email, 5, windowMs, now)));
      assert.equal(outcomes.filter(r => r.allowed).length, 5); assert.ok(outcomes.every(r => r.retryAfterSeconds > 0));
      const key = privateLimitKey(scope, email, Math.floor(now / windowMs)); assert.equal(key.includes(email), false); assert.equal(key.length, 64);
      assert.equal((await prisma.rateLimitBucket.findUniqueOrThrow({ where: { key } })).hits, 12);
      assert.equal((await consumeLimit(scope, email, 5, windowMs, now + windowMs)).allowed, true);
    });
    await step("Unsafe recovery origins are rejected", async () => {
      const previous = process.env.NEXT_PUBLIC_SITE_URL;
      try { for (const origin of ["http://example.test", "https://example.test/evil", "https://name:password@example.test", "https://example.test/?token=x"]) { process.env.NEXT_PUBLIC_SITE_URL = origin; assert.throws(recoveryOrigin); } }
      finally { process.env.NEXT_PUBLIC_SITE_URL = previous; }
    });
  } finally {
    await fs.mkdir("audit-evidence/recovery", { recursive: true });
    await fs.writeFile("audit-evidence/recovery/transactions.json", JSON.stringify({ environment: "disposable PostgreSQL; no provider calls", results }, null, 2));
    await prisma.verificationToken.deleteMany({ where: { identifier: resetIdentifier(user.id) } });
    await prisma.user.deleteMany({ where: { id: user.id } });
    for (const t of [now, now + windowMs]) await prisma.rateLimitBucket.deleteMany({ where: { key: privateLimitKey(scope, email, Math.floor(t/windowMs)) } });
    await prisma.$disconnect();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
