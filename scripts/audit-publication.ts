import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import { prisma as sharedPrisma } from "../src/lib/db";
import { savePublication, deletePublication } from "../src/lib/content/publication-store";
import { SEARCH_CONTENT_WHERE, isPublicNotificationPath, validateCanonicalPath } from "../src/lib/seo/publication-policy";
import { flushIndexNow, queueIndexNow, INDEXNOW_KEY, notificationOutcome } from "../src/lib/seo/indexnow";

async function main() {
  const db = new URL(process.env.DATABASE_URL || "postgresql://invalid/invalid");
  assert.equal(db.hostname, "127.0.0.1"); assert.equal(db.pathname, "/bacwater_audit");
  assert.equal(process.env.AUDIT_ORIGIN, "http://127.0.0.1:3000");
  for (const key of ["RESEND_API_KEY", "ANTHROPIC_API_KEY", "STRIPE_SECRET_KEY"]) assert.ok(!process.env[key]);
  const client = new PrismaClient();
  const prefix = `publication-fixture-${Date.now()}`;
  const results: Array<{ name: string; status: string; error?: string }> = [];
  const out = "audit-evidence/publication"; await fs.mkdir(out, { recursive: true });
  const step = async (name: string, test: () => Promise<void> | void) => {
    try { await test(); results.push({ name, status: "passed" }); }
    catch (e) { results.push({ name, status: "failed", error: String(e) }); throw e; }
  };
  const input = { slug: prefix, title: "Controlled publication fixture", kind: "guide" as const, body: "A controlled non-medical fixture for publication testing.", published: false };
  let current: Awaited<ReturnType<typeof savePublication>>["block"];
  let dependentId: string | undefined;
  async function update(changes: Record<string, unknown>) {
    const result = await savePublication({ ...current, ...changes, expectedUpdatedAt: current.updatedAt.toISOString() }, client);
    current = result.block; return result;
  }
  async function resetQueue() { await client.indexNowEvent.deleteMany(); }
  const path = `/learn/${prefix}-notification`;
  const enqueue = (paths = [path]) => client.$transaction(tx => queueIndexNow(tx, paths));
  const transport = (status: number, post?: (init?: RequestInit) => Promise<void>, keyText = INDEXNOW_KEY): typeof fetch =>
    (async (url: string | URL | Request, init?: RequestInit) => {
      if (String(url).endsWith(`/${INDEXNOW_KEY}.txt`)) return new Response(keyText, { status: 200 });
      assert.equal(String(url), "https://api.indexnow.org/indexnow");
      assert.equal(init?.method, "POST"); await post?.(init);
      return new Response("", { status, headers: status === 429 ? { "Retry-After": "120" } : undefined });
    }) as typeof fetch;
  const flush = (fetcher: typeof fetch) => flushIndexNow({ client, transport: fetcher, origin: "https://bacwater.ai" });
  try {
    await resetQueue();
    await step("Draft creation does not disclose its URL to discovery", async () => {
      current = (await savePublication(input, client)).block;
      assert.equal(current.noindex, false); assert.equal(current.canonicalPath, null);
      assert.equal(await client.indexNowEvent.count(), 0);
      assert.equal(await client.contentBlock.count({ where: { id: current.id, ...SEARCH_CONTENT_WHERE } }), 0);
    });
    await step("Reserved routes, private canonicals and malformed slugs are rejected", async () => {
      await assert.rejects(savePublication({ ...input, slug: "bac-water-shelf-life" }, client));
      for (const slug of ["../admin", "unsafe/path", "MixedCase", "spaces here"]) await assert.rejects(savePublication({ ...input, slug }, client));
      for (const canonicalPath of ["/admin", "/plans", "https://elsewhere.test/page", "//elsewhere.test", "/learn/private?secret=value", "/learn/missing-target"]) await assert.rejects(update({ canonicalPath }));
      assert.equal(validateCanonicalPath("/tools/mg-to-mcg"), true);
      assert.equal(isPublicNotificationPath("/plan/private-secret"), false);
      assert.equal(isPublicNotificationPath("/learn/test?email=x"), false);
    });
    await step("Publishing records searchable content and a durable notification", async () => {
      const result = await update({ published: true, seoTitle: "Fixture search title", metaDescription: "Fixture search description" });
      assert.ok(result.paths.includes(`/learn/${prefix}`));
      assert.equal(await client.contentBlock.count({ where: { id: current.id, ...SEARCH_CONTENT_WHERE } }), 1);
      assert.equal((await client.indexNowEvent.findUniqueOrThrow({ where: { path: `/learn/${prefix}` } })).status, "pending");
    });
    await step("Noindex and canonical duplicates stay public but leave discovery", async () => {
      await update({ noindex: true }); assert.equal(current.published, true);
      assert.equal(await client.contentBlock.count({ where: { id: current.id, ...SEARCH_CONTENT_WHERE } }), 0);
      await assert.rejects(update({ canonicalPath: "/tools/mg-to-mcg", noindex: true }));
      await update({ noindex: false, canonicalPath: "/tools/mg-to-mcg" });
      assert.equal(await client.contentBlock.count({ where: { id: current.id, ...SEARCH_CONTENT_WHERE } }), 0);
      await update({ canonicalPath: null });
      assert.equal(await client.contentBlock.count({ where: { id: current.id, ...SEARCH_CONTENT_WHERE } }), 1);
    });
    await step("Canonical targets cannot be unpublished before dependents are corrected", async () => {
      const dependent = await savePublication({ ...input, slug: `${prefix}-dependent`, published: true, canonicalPath: `/learn/${current.slug}` }, client);
      dependentId = dependent.block.id;
      await assert.rejects(update({ published: false }));
      await assert.rejects(deletePublication(current.id, client));
    });
    await step("Renames preserve aliases without chains and update canonical dependents", async () => {
      await update({ slug: `${prefix}-renamed` });
      assert.equal((await client.contentRedirect.findUniqueOrThrow({ where: { slug: prefix }, include: { content: true } })).content.slug, current.slug);
      assert.equal((await client.contentBlock.findUniqueOrThrow({ where: { id: dependentId } })).canonicalPath, `/learn/${current.slug}`);
      await update({ slug: `${prefix}-final` });
      const aliases = await client.contentRedirect.findMany({ where: { contentId: current.id }, include: { content: true } });
      assert.equal(aliases.length, 2); assert.ok(aliases.every(a => a.content.slug === current.slug));
      await assert.rejects(savePublication({ ...input, slug: `${prefix}-renamed` }, client));
      await update({ slug: prefix });
      assert.equal(await client.contentRedirect.count({ where: { slug: prefix } }), 0);
    });
    await step("Concurrent stale edit is rejected without changing saved content", async () => {
      await assert.rejects(savePublication({ ...current, title: "STALE OVERWRITE", expectedUpdatedAt: "2000-01-01T00:00:00.000Z" }, client));
      assert.notEqual((await client.contentBlock.findUniqueOrThrow({ where: { id: current.id } })).title, "STALE OVERWRITE");
    });
    await step("Unpublish hides content and delete removes all aliases", async () => {
      if (dependentId) await deletePublication(dependentId, client);
      await update({ published: false });
      assert.equal(await client.contentBlock.count({ where: { id: current.id, published: true } }), 0);
      assert.ok((await client.contentRedirect.findMany({ where: { contentId: current.id }, include: { content: true } })).every(a => !a.content.published));
      await deletePublication(current.id, client);
      assert.equal(await client.contentRedirect.count({ where: { contentId: current.id } }), 0);
    });
    await step("Outbox deduplicates safe paths and never accepts private URLs", async () => {
      await resetQueue(); await enqueue([path, path, "/admin", "/plan/private-secret", "/learn/a?secret=x"]);
      assert.equal(await client.indexNowEvent.count(), 1);
      await enqueue(); assert.equal((await client.indexNowEvent.findUniqueOrThrow({ where: { path } })).revision, 2);
    });
    await step("Accepted notifications carry exact public URLs, not user data", async () => {
      const response = await flush(transport(202, async init => {
        const body = JSON.parse(String(init?.body));
        assert.deepEqual(body.urlList, [`https://bacwater.ai${path}`]); assert.equal(body.key, INDEXNOW_KEY);
      }));
      assert.equal(response.accepted, 1); assert.equal((await client.indexNowEvent.findUniqueOrThrow({ where: { path } })).status, "accepted");
    });
    await step("Retry-After and bounded retries survive a provider failure", async () => {
      await resetQueue(); await enqueue(); await flush(transport(429));
      let event = await client.indexNowEvent.findUniqueOrThrow({ where: { path } });
      assert.equal(event.status, "pending"); assert.equal(event.attempts, 1);
      assert.ok(event.nextAttemptAt.getTime() > Date.now() + 110000);
      for (let i = 0; i < 5; i++) {
        await client.indexNowEvent.update({ where: { path }, data: { nextAttemptAt: new Date(0) } });
        await flush(transport(500));
      }
      event = await client.indexNowEvent.findUniqueOrThrow({ where: { path } });
      assert.equal(event.status, "failed"); assert.equal(event.attempts, 6);
    });
    await step("Ownership mismatch prevents submitting any URLs", async () => {
      await resetQueue(); await enqueue(); let posted = false;
      await flush(transport(200, async () => { posted = true; }, "wrong-key"));
      assert.equal(posted, false); assert.equal((await client.indexNowEvent.findUniqueOrThrow({ where: { path } })).status, "blocked");
    });
    await step("An older response cannot acknowledge a newer content revision", async () => {
      await resetQueue(); await enqueue();
      await flush(transport(200, async () => { await enqueue(); }));
      const event = await client.indexNowEvent.findUniqueOrThrow({ where: { path } });
      assert.equal(event.revision, 2); assert.equal(event.status, "pending"); assert.equal(event.attempts, 0);
    });
    await step("Expired processing leases are recoverable and local delivery is disabled", async () => {
      await resetQueue(); await enqueue();
      await client.indexNowEvent.update({ where: { path }, data: { status: "processing", nextAttemptAt: new Date(0) } });
      await flush(transport(200)); assert.equal((await client.indexNowEvent.findUniqueOrThrow({ where: { path } })).status, "submitted");
      const result = await flushIndexNow({ client, origin: "http://127.0.0.1:3000", transport: (() => { throw new Error("Must not contact a provider"); }) as typeof fetch });
      assert.equal(result.enabled, false);
      assert.equal(notificationOutcome(202, 1), "accepted"); assert.equal(notificationOutcome(422, 1), "rejected");
    });
  } finally {
    await fs.writeFile(`${out}/transaction-results.json`, JSON.stringify({ date: new Date().toISOString(), environment: "disposable PostgreSQL; all provider requests mocked", results }, null, 2));
    await client.contentBlock.deleteMany({ where: { slug: { startsWith: prefix } } });
    await resetQueue(); await client.$disconnect(); await sharedPrisma.$disconnect();
  }
  console.log(`${results.length} publication transaction and notification tests passed.`);
}
main().catch(e => { console.error(e); process.exitCode = 1; });
