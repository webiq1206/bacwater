import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const origin = process.env.AUDIT_ORIGIN;
const database = new URL(process.env.DATABASE_URL || 'postgresql://invalid/invalid');
assert.equal(origin, 'http://127.0.0.1:3000');
assert.equal(database.hostname, '127.0.0.1'); assert.equal(database.pathname, '/bacwater_audit');
for (const key of ['RESEND_API_KEY', 'ANTHROPIC_API_KEY', 'STRIPE_SECRET_KEY']) assert.ok(!process.env[key]);
const prisma = new PrismaClient(); const browser = await chromium.launch();
const prefix = `cms-fixture-${Date.now()}`, email = `${prefix}@example.test`, password = 'DisposableFixture!2837';
const results = [], errors = []; const out = 'audit-evidence/publication'; await fs.mkdir(out, { recursive: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
await context.route('**/*', r => new URL(r.request().url()).origin === origin ? r.continue() : r.abort());
await context.addCookies([{ name: 'bacwater_age_ok', value: '1', url: origin }]);
const page = await context.newPage(); page.on('pageerror', e => errors.push(String(e)));
const publicContext = await browser.newContext();
await publicContext.route('**/*', r => new URL(r.request().url()).origin === origin ? r.continue() : r.abort());
const reader = await publicContext.newPage();
let userId, contentId, slug = prefix;
const step = async (name, fn) => { try { await fn(); results.push({ name, status: 'passed' }); } catch (e) { results.push({ name, status: 'failed', error: String(e) }); throw e; } };
const record = () => prisma.contentBlock.findUniqueOrThrow({ where: { id: contentId } });
const saveButton = () => page.getByRole('button', { name: /^Save\s+⌘S$/ });
async function saveAndObserve(check) {
  await saveButton().click(); await expect.poll(async () => check(await record()), { timeout: 15000 }).toBe(true);
  await expect(saveButton()).toBeDisabled();
}
async function discovery(included, path = `/learn/${slug}`) {
  for (const endpoint of ['/sitemap-learn.xml', '/llms.txt', '/sitemap', '/learn']) {
    const response = await publicContext.request.get(`${origin}${endpoint}`); assert.equal(response.status(), 200);
    const body = await response.text();
    const exactPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const appears = new RegExp(exactPath + '(?=[<\"\\s)#?])').test(body);
    assert.equal(appears, included, `${endpoint}: ${included ? 'missing' : 'leaked'} ${path}`);
  }
}
try {
  await step('Untrusted IndexNow requests cannot submit or obtain admin data', async () => {
    for (const method of ['get', 'post']) {
      const r = await publicContext.request[method](`${origin}/api/admin/indexnow?secret=ci-placeholder-not-a-real-secret`);
      assert.equal(r.status(), 401);
    }
  });
  await step('Administrator signs in and opens the actual content editor', async () => {
    const user = await prisma.user.create({ data: { email, name: 'Disposable CMS fixture', hashedPassword: await bcrypt.hash(password, 10), role: 'admin' } }); userId = user.id;
    await page.goto(`${origin}/signin?next=/admin/content?new=1`);
    await page.getByLabel('Email', { exact: true }).fill(email); await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.getByLabel('Content title', { exact: true })).toBeVisible();
  });
  await step('A saved draft stays absent from public pages and exports', async () => {
    await page.getByLabel('Content title', { exact: true }).fill('Publication lifecycle test');
    await page.getByLabel('Content body', { exact: true }).fill('Controlled fixture, not medical guidance.\n\n## Test details\n\nThis article exists only in the disposable test database.');
    await page.getByLabel('Content slug', { exact: true }).fill(slug);
    await page.getByLabel('Search title', { exact: true }).fill('Distinct fixture search title');
    await page.getByLabel('Search description', { exact: true }).fill('Distinct fixture description for metadata verification.');
    await saveButton().click();
    await expect.poll(() => prisma.contentBlock.findUnique({ where: { slug } }), { timeout: 15000 }).not.toBeNull();
    contentId = (await prisma.contentBlock.findUniqueOrThrow({ where: { slug } })).id;
    assert.equal((await record()).published, false);
    assert.equal((await publicContext.request.get(`${origin}/learn/${slug}`)).status(), 404);
    await discovery(false);
  });
  await step('Publishing changes the public HTML, metadata and all discovery endpoints', async () => {
    await page.getByRole('button', { name: 'Published', exact: true }).click();
    await expect.poll(async () => (await record()).published).toBe(true);
    const response = await reader.goto(`${origin}/learn/${slug}`); assert.equal(response.status(), 200);
    await expect(reader).toHaveTitle(/Distinct fixture search title/);
    assert.equal(await reader.locator('meta[name="description"]').getAttribute('content'), 'Distinct fixture description for metadata verification.');
    await expect(reader.getByRole('heading', { level: 1 })).toHaveText('Publication lifecycle test');
    await discovery(true);
  });
  await step('Meaningful edits invalidate rendered and discovery content', async () => {
    await page.getByLabel('Content body', { exact: true }).fill('Changed publication text.\n\n## Updated details\n\nUNIQUE_UPDATED_CONTENT_TOKEN');
    await saveAndObserve(row => row.body.includes('UNIQUE_UPDATED_CONTENT_TOKEN'));
    await reader.reload(); assert.ok((await reader.content()).includes('UNIQUE_UPDATED_CONTENT_TOKEN'));
  });
  await step('Renamed published URLs redirect directly and drop old sitemap membership', async () => {
    const old = slug; slug = `${prefix}-renamed`;
    await page.getByLabel('Content slug', { exact: true }).fill(slug); await saveAndObserve(row => row.slug === slug);
    let response = await publicContext.request.get(`${origin}/learn/${old}`, { maxRedirects: 0 });
    assert.equal(response.status(), 308); assert.equal(response.headers().location, `${origin}/learn/${slug}`);
    await discovery(false, `/learn/${old}`);
    await discovery(true);
    const firstRename = slug; slug = `${prefix}-final`;
    await page.getByLabel('Content slug', { exact: true }).fill(slug); await saveAndObserve(row => row.slug === slug);
    for (const alias of [old, firstRename]) {
      response = await publicContext.request.get(`${origin}/learn/${alias}`, { maxRedirects: 0 });
      assert.equal(response.status(), 308); assert.equal(response.headers().location, `${origin}/learn/${slug}`);
    }
  });
  await step('Noindex retains public access but removes discoverable membership', async () => {
    await page.getByLabel('Exclude this page from search', { exact: true }).check(); await saveAndObserve(row => row.noindex === true);
    assert.equal((await reader.goto(`${origin}/learn/${slug}`)).status(), 200);
    assert.match(await reader.locator('meta[name="robots"]').first().getAttribute('content'), /noindex/);
    await discovery(false);
  });
  await step('Canonical duplicate emits the correct target without entering discovery', async () => {
    await page.getByLabel('Exclude this page from search', { exact: true }).uncheck();
    await page.getByLabel('Canonical path', { exact: true }).fill('/tools/mg-to-mcg');
    await saveAndObserve(row => row.canonicalPath === '/tools/mg-to-mcg' && !row.noindex);
    await reader.reload(); assert.equal(await reader.locator('link[rel="canonical"]').getAttribute('href'), `${origin}/tools/mg-to-mcg`);
    await discovery(false);
    await page.getByLabel('Canonical path', { exact: true }).fill(''); await saveAndObserve(row => row.canonicalPath === null);
    await discovery(true);
  });
  await step('Unpublishing immediately removes the article and all old aliases', async () => {
    await page.getByRole('button', { name: 'Published', exact: true }).click(); await expect.poll(async () => (await record()).published).toBe(false);
    for (const url of [slug, prefix, `${prefix}-renamed`]) assert.equal((await publicContext.request.get(`${origin}/learn/${url}`)).status(), 404);
    await discovery(false);
  });
  await step('Deletion clears the record and aliases while leaving durable discovery events', async () => {
    page.once('dialog', d => d.accept()); await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect.poll(() => prisma.contentBlock.count({ where: { id: contentId } })).toBe(0);
    assert.equal(await prisma.contentRedirect.count({ where: { contentId } }), 0);
    assert.ok(await prisma.indexNowEvent.count({ where: { path: { contains: prefix } } }));
  });
  await step('Publishing dashboard explains local disabled delivery and has no horizontal overflow', async () => {
    await page.goto(`${origin}/admin/publication`); await expect(page.getByRole('heading', { name: 'Publishing status' })).toBeVisible();
    await expect(page.getByText('Delivery: disabled in this environment')).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    await page.screenshot({ path: `${out}/notification-dashboard-mobile.png`, fullPage: true });
  });
  await step('Public build identity and CMS browser execution are valid', async () => {
    const version = await publicContext.request.get(`${origin}/version.json`); assert.equal(version.status(), 200);
    assert.match((await version.json()).commit, /^[a-f0-9]{40}$/);
    assert.deepEqual(errors, []);
  });
} catch (e) {
  await page.screenshot({ path: `${out}/browser-failure.png`, fullPage: true }).catch(() => {});
  await fs.writeFile(`${out}/browser-failure.html`, await page.content().catch(() => ''));
  console.error(e); process.exitCode = 1;
} finally {
  await fs.writeFile(`${out}/browser-results.json`, JSON.stringify({ date: new Date().toISOString(), environment: 'disposable PostgreSQL with Chromium; no external delivery', results, errors }, null, 2));
  await prisma.contentBlock.deleteMany({ where: { slug: { startsWith: prefix } } });
  await prisma.indexNowEvent.deleteMany();
  if (userId) await prisma.user.deleteMany({ where: { id: userId } });
  await prisma.$disconnect(); await browser.close();
}
console.log(JSON.stringify(results));
