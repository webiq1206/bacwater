from pathlib import Path

r = Path('.')
marker = r / 'src/lib/security/authorization.ts'
if marker.exists():
    raise SystemExit('Foundation already applied; no files changed.')

def put(path, text):
    p = r / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text)

def change(path, old, new, count=-1):
    p = r / path
    text = p.read_text()
    if old not in text:
        raise RuntimeError(f'Expected baseline not found: {path}: {old[:70]}')
    p.write_text(text.replace(old, new, count))

put('src/lib/security/authorization.ts', '''import { timingSafeEqual } from "node:crypto";
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
''')
put('src/lib/plan-access.ts', '''import { cookies } from "next/headers";
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
''')
p = r / 'src/lib/auth-actions.ts'
s = p.read_text(); a = s.index('const adminEmails'); b = s.index('const signupSchema'); s = s[:a] + s[b:]
s = s.replace('password: z.string().min(6),', 'password: z.string().min(6).refine((value) => Buffer.byteLength(value, "utf8") <= 72),')
s = s.replace('const role = adminEmails.includes(email.toLowerCase()) ? "admin" : "user";', '// An unverified registration email never grants administrator privileges.\n  const role = "user";')
p.write_text(s)
p = r / 'src/lib/auth.ts'; s = p.read_text()
s = s.replace('import { prisma } from "@/lib/db";', 'import { prisma } from "@/lib/db";\nimport { storedRole } from "@/lib/security/authorization";')
a = s.index('const adminEmails'); b = s.index('export const authConfig')
s = s[:a] + '/** JWT roles are checked against the stored user on every request. Keep AUTH_SECRET stable across deployments. Deleting a database Session row does not revoke a JWT. */\n' + s[b:]
a = s.index('    async jwt('); b = s.index('    async session(', a)
s = s[:a] + '''    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      const id = typeof token.id === "string" ? token.id : token.sub;
      token.role = "user";
      if (!id) { token.id = undefined; return token; }
      try {
        const stored = await prisma.user.findUnique({
          where: { id }, select: { id: true, role: true, name: true, image: true },
        });
        if (!stored) { token.id = undefined; return token; }
        token.id = stored.id; token.role = storedRole(stored);
        token.name = stored.name; token.picture = stored.image;
      } catch { token.id = undefined; }
      return token;
    },
''' + s[b:]
p.write_text(s)
p = r / 'src/lib/plan-actions.ts'; s = p.read_text()
s = s.replace('import { auth } from "@/lib/auth";', 'import { auth } from "@/lib/auth";\nimport { hasPlanAccess, rememberPlanAccess } from "@/lib/plan-access";\nimport { ownsPlan, planCookieName, planWriteWhere } from "@/lib/security/authorization";')
s = s.replace('peptideSlug: z.string().optional().nullable(),', 'peptideSlug: z.string().max(100).optional().nullable(),').replace('peptideName: z.string().optional().nullable(),', 'peptideName: z.string().max(160).optional().nullable(),').replace('z.number().min(1).max(28)', 'z.number().int().min(1).max(28)')
s = s.replace('if (plan.userId && plan.userId !== (session?.user as { id?: string } | undefined)?.id)', 'if (!(await hasPlanAccess(plan, (session?.user as { id?: string } | undefined)?.id)))')
s = s.replace('if (existing.userId && existing.userId !== (session?.user as { id?: string } | undefined)?.id)', 'if (!(await hasPlanAccess(existing, (session?.user as { id?: string } | undefined)?.id)))')
s = s.replace('if (plan.userId && plan.userId !== userId)', 'if (!(await hasPlanAccess(plan, userId)))')
s = s.replace('where: { id: plan.id }, data:', 'where: planWriteWhere(plan), data:').replace('where: { id: plan.id },\n    data:', 'where: planWriteWhere(plan),\n    data:').replace('delete({ where: { id: plan.id } })', 'delete({ where: planWriteWhere(plan) })').replace('where: { id: existing.id },', 'where: planWriteWhere(existing),')
s = s.replace('export async function savePlanAction(raw: unknown, notes?: string) {', 'export async function savePlanAction(raw: unknown, notes?: string) {\n  if (notes !== undefined && (typeof notes !== "string" || notes.length > 2000)) return { ok: false as const, error: "Notes must be 2,000 characters or fewer." };')
s = s.replace('export async function updatePlanNotesAction(publicId: string, notes: string) {', 'export async function updatePlanNotesAction(publicId: string, notes: string) {\n  if (typeof notes !== "string" || notes.length > 2000) return { ok: false as const, error: "Notes must be 2,000 characters or fewer." };')
s = s.replace('export async function updatePlanNameAction(publicId: string, name: string) {', 'export async function updatePlanNameAction(publicId: string, name: string) {\n  if (typeof name !== "string" || name.length > 120) return { ok: false as const, error: "Name must be 120 characters or fewer." };')
s = s.replace('  revalidatePath("/plans");\n  return {\n    ok: true as const,\n    publicId: plan.publicId,', '  await rememberPlanAccess(plan.publicId, claimToken);\n  revalidatePath("/plans");\n  return {\n    ok: true as const,\n    publicId: plan.publicId,', 1)
s = s.replace('  const newPublicId = nanoid(10);', '''  const newPublicId = nanoid(10);
  const mayCopyNotes = await hasPlanAccess(plan, userId);
  let snapshot: Record<string, unknown>;
  try { snapshot = JSON.parse(plan.data); } catch { return { ok: false as const }; }
  if (snapshot.input && typeof snapshot.input === "object") snapshot.input = { ...snapshot.input, dateMixed: null };
  if (snapshot.expiration && typeof snapshot.expiration === "object") snapshot.expiration = { ...snapshot.expiration, date: null };
''')
s = s.replace('name: plan.name ? `${plan.name} (copy)`.slice(0, 120) : null,', 'name: mayCopyNotes && plan.name ? `${plan.name} (copy)`.slice(0, 120) : `${plan.peptideName || "Calculation"} (copy)`,').replace('notes: plan.notes,\n      data: plan.data,', 'notes: mayCopyNotes ? plan.notes : null,\n      data: JSON.stringify(snapshot),')
s = s.replace('  revalidatePath("/plans");\n  return {\n    ok: true as const,\n    publicId: created.publicId,', '  await rememberPlanAccess(created.publicId, claimToken);\n  revalidatePath("/plans");\n  return {\n    ok: true as const,\n    publicId: created.publicId,', 1)
a = s.index('export async function updatePlanAction(')
s = s[:a] + s[a:].replace('  const parsed = inputSchema.safeParse(raw);', '  if (opts?.notes != null && (typeof opts.notes !== "string" || opts.notes.length > 2000)) return { ok: false as const, error: "Notes must be 2,000 characters or fewer." };\n  if (opts?.name != null && (typeof opts.name !== "string" || opts.name.length > 120)) return { ok: false as const, error: "Name must be 120 characters or fewer." };\n  const parsed = inputSchema.safeParse(raw);', 1)
s += '''
/** Restore creator access from a device's existing claim secret, never its share URL. */
export async function restoreDevicePlanAccessAction(publicId: string, claimToken: string) {
  if (typeof publicId !== "string" || !planCookieName(publicId) || typeof claimToken !== "string" || claimToken.length > 64) return { ok: false as const };
  const plan = await prisma.plan.findUnique({ where: { publicId } });
  if (!plan || !ownsPlan(plan, null, claimToken)) return { ok: false as const };
  await rememberPlanAccess(publicId, claimToken);
  return { ok: true as const };
}
'''
s = s.replace('while an unclaimed guest plan stays writable by\n * whoever holds the link (which is how guest plans work everywhere else).', 'while an unclaimed guest plan requires the creating device secret.\n * Shared links grant read access, not write access.')
p.write_text(s)
p = r / 'src/components/plan/plans-workspace.tsx'; s = p.read_text()
s = s.replace('  getPlanDetailAction,', '  getPlanDetailAction,\n  restoreDevicePlanAccessAction,')
s = s.replace('"use client";', '"use client";\nimport { getDevicePlans } from "@/lib/saved-plans";', 1)
s = s.replace('    getPlanDetailAction(selectedId)\n      .then', '''    (async () => {
      const secret = getDevicePlans().find((p) => p.publicId === selectedId)?.claimToken;
      if (secret) await restoreDevicePlanAccessAction(selectedId, secret);
      return getPlanDetailAction(selectedId);
    })()
      .then''')
s = s.replace('      .finally(() => {\n        if (!stale) setLoading(false);', '      .catch(() => { if (!stale) { setDetail(null); toast({ title: "Could not open plan", description: "Please retry. Your saved data has not changed.", variant: "destructive" }); } })\n      .finally(() => {\n        if (!stale) setLoading(false);', 1)
p.write_text(s)
put('src/components/plan/record-plan-view.tsx', '''"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDevicePlans, rememberDevicePlan } from "@/lib/saved-plans";
import { restoreDevicePlanAccessAction } from "@/lib/plan-actions";
export function RecordPlanView({ publicId, name, canEdit = false }: { publicId: string; name: string; canEdit?: boolean }) {
  const router = useRouter();
  useEffect(() => {
    let active = true;
    const secret = getDevicePlans().find((p) => p.publicId === publicId)?.claimToken;
    rememberDevicePlan({ publicId, name, savedAt: new Date().toISOString() });
    if (!canEdit && secret) restoreDevicePlanAccessAction(publicId, secret).then((result) => {
      if (active && result.ok) router.refresh();
    }).catch(() => { /* Retry by refreshing; shared viewers never gain access. */ });
    return () => { active = false; };
  }, [publicId, name, canEdit, router]);
  return null;
}
''')
p = r / 'src/app/plan/[id]/page.tsx'; s = p.read_text()
s = s.replace('import { auth } from "@/lib/auth";', 'import { auth } from "@/lib/auth";\nimport { hasPlanAccess } from "@/lib/plan-access";')
s = s.replace('const canEdit = !plan.userId || plan.userId === userId;', 'const canEdit = await hasPlanAccess(plan, userId);\n  const displayName = (canEdit ? plan.name : null) || plan.peptideName || "Shared calculation";')
s = s.replace('name={plan.name || plan.peptideName || "Reconstitution plan"} />', 'name={displayName} canEdit={canEdit} />').replace('{plan.name || plan.peptideName || "Reconstitution plan"}', '{displayName}')
s = s.replace('          <div className="mt-6 border border-border p-6 sm:p-8">', '          {canEdit && <div className="mt-6 border border-border p-6 sm:p-8">', 1)
s = s.replace('              <PlanNotesForm publicId={plan.publicId} initial={plan.notes || ""} />\n            </div>\n          </div>', '              <PlanNotesForm publicId={plan.publicId} initial={plan.notes || ""} />\n            </div>\n          </div>}', 1)
s = s.replace('Add anything you want to remember about this plan.', 'Notes are private to your account or the device that saved this plan.')
s = s.replace('            <PlanQr publicId={plan.publicId} />', '            <p className="mt-2 text-xs text-muted-foreground">Anyone with this link can read the calculation. They cannot change it or read your private notes.</p>\n            <PlanQr publicId={plan.publicId} />')
p.write_text(s)
p = r / 'src/app/plan/[id]/edit/page.tsx'; s = p.read_text().replace('import { auth } from "@/lib/auth";', 'import { auth } from "@/lib/auth";\nimport { hasPlanAccess } from "@/lib/plan-access";').replace('if (plan.userId && plan.userId !== userId) redirect', 'if (!(await hasPlanAccess(plan, userId))) redirect'); p.write_text(s)
p = r / 'src/app/plan/[id]/pdf/route.ts'; s = p.read_text()
s = s.replace('import { prisma } from "@/lib/db";', 'import { prisma } from "@/lib/db";\nimport { auth } from "@/lib/auth";\nimport { hasPlanAccess } from "@/lib/plan-access";')
s = s.replace('  const doc = React.createElement', '  const session = await auth();\n  const canReadNotes = await hasPlanAccess(plan, (session?.user as { id?: string } | undefined)?.id);\n  const doc = React.createElement')
s = s.replace('notes: plan.notes', 'notes: canReadNotes ? plan.notes : null').replace('"Content-Type": "application/pdf",', '"Content-Type": "application/pdf",\n      "Cache-Control": "private, no-store",\n      "X-Robots-Tag": "noindex, nofollow, noarchive",\n      "Referrer-Policy": "no-referrer",'); p.write_text(s)
p = r / 'src/lib/content/render.tsx'; s = p.read_text()
a = s.index('export function inlineMarkdown'); b = s.index('\nfunction renderBlock', a)
s = s[:a] + '''export function inlineMarkdown(text: string): string {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  return escaped
    .replace(/\\[([^\\]\\n]+)\\]\\(([^)\\s]+)\\)/g, (_match, label: string, href: string) => {
      const decoded = href.replace(/&amp;/g, "&");
      let allowed = /^\\/(?![\\/\\\\])/.test(decoded);
      try { allowed ||= new URL(decoded).protocol === "https:"; } catch { /* unsupported URL */ }
      return allowed ? `<a href="${href}" class="underline underline-offset-4">${label}</a>` : label;
    })
    .replace(/\\*\\*([^*]+)\\*\\*/g, "<strong>$1</strong>")
    .replace(/\\*([^*]+)\\*/g, "<em>$1</em>");
}
''' + s[b:]
s = s.replace('<div key={i} className="mt-4 overflow-x-auto">', '<div key={i} className="mt-4 overflow-x-auto" role="region" aria-label="Article table" tabIndex={0}>'); p.write_text(s)
p = r / 'src/lib/admin-actions.ts'; s = p.read_text().replace('await resend.emails.send({', 'const delivery = await resend.emails.send({').replace('      sent = true;', '      if (delivery.error || !delivery.data?.id) throw new Error("Email provider did not accept this message.");\n      sent = true;').replace('export async function setUserRole(userId: string, role: "user" | "admin") {', 'export async function setUserRole(userId: string, role: "user" | "admin") {\n  if (role !== "user" && role !== "admin") throw new Error("Invalid role.");'); p.write_text(s)
p = r / 'src/proxy.ts'; s = p.read_text().replace('    const url = req.nextUrl.clone();', '    const url = new URL("/signin", process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai");').replace('new URL("/", req.url)', 'new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai")'); p.write_text(s)
put('src/lib/__tests__/audit-security.test.ts', '''import assert from "node:assert/strict";
import { ownsPlan, storedRole, planWriteWhere, planCookieName } from "../security/authorization";
import { inlineMarkdown } from "../content/render";
const guest = { id: "db-id", publicId: "abcdefghij", userId: null, claimToken: "a".repeat(24) };
assert.equal(ownsPlan(guest, undefined, undefined), false);
assert.equal(ownsPlan(guest, "someone", "b".repeat(24)), false);
assert.equal(ownsPlan(guest, undefined, "a".repeat(24)), true);
assert.equal(ownsPlan({ ...guest, userId: "owner", claimToken: null }, "other", "a".repeat(24)), false);
assert.equal(ownsPlan({ ...guest, userId: "owner", claimToken: null }, "owner"), true);
assert.equal(ownsPlan({ ...guest, claimToken: null }, null, ""), false);
assert.equal(planCookieName("bad; Path=/"), null);
assert.deepEqual(planWriteWhere(guest), { id: "db-id", userId: null, claimToken: "a".repeat(24) });
assert.equal(storedRole(undefined), "user");
assert.equal(storedRole({ role: "admin" }), "admin");
assert.equal(storedRole({ role: "ADMIN" }), "user");
assert.equal(inlineMarkdown('<img src=x onerror="alert(1)">').includes("<img"), false);
assert.equal(inlineMarkdown('[bad](javascript:alert(1))').includes("href"), false);
assert.equal(inlineMarkdown('[bad](//evil.test)').includes("href"), false);
assert.ok(inlineMarkdown('[Read the guide](/learn/what-is-bac-water)').includes('href="/learn/what-is-bac-water"'));
assert.ok(inlineMarkdown('[Source](https://example.org/?a=1&b=2)').includes('a=1&amp;b=2'));
assert.equal(inlineMarkdown('**bold** and *italic*'), '<strong>bold</strong> and <em>italic</em>');
console.log("Audit authorization and safe-content fixtures passed.");
''')
change('package.json', 'tsx src/lib/__tests__/workspaces.test.ts"', 'tsx src/lib/__tests__/workspaces.test.ts && tsx src/lib/__tests__/audit-security.test.ts"')
(r / 'audit/2026-09-21/foundation.patch.b64').unlink(missing_ok=True)
print('Foundation changes applied to isolated checkout. No production data changed.')
