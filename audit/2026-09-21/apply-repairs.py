from pathlib import Path
if Path("src/lib/analytics.ts").exists():
    raise SystemExit("Repairs already applied")
from pathlib import Path
import re
r=Path('.')
def edit(p, fn):
 f=r/p;s=f.read_text();t=fn(s);f.write_text(t)
def put(p,t):
 f=r/p;f.parent.mkdir(parents=True,exist_ok=True);f.write_text(t)
# Accessible names are explicit and specific at the call site.
labels={
'src/components/plan/plan-form.tsx':['Primary compound','Second compound in this vial','Syringe size and scale','Compound'],
'src/app/tools/bac-water/page.tsx':['Syringe size and scale'],
'src/app/tools/supplies/page.tsx':['Syringe size and scale'],
'src/app/tools/reverse-bac/page.tsx':['Syringe size and scale'],
}
for p,names in labels.items():
 s=(r/p).read_text(); i=iter(names)
 def label(m):
  if 'aria-label' in m.group():return m.group()
  return m.group().replace('<SelectTrigger',f'<SelectTrigger aria-label="{next(i)}"',1)
 s=re.sub(r'<SelectTrigger\b[^>]*>',label,s);(r/p).write_text(s)
# Every table overflow region remains keyboard reachable. Skip non-table rails.
for f in (r/'src').rglob('*.tsx'):
 s=f.read_text()
 pat=r'<div(?P<attrs>[^>]*className="[^"]*overflow-x-auto[^"]*"[^>]*)>(?P<gap>\s*)(?P<table><table\b)'
 def region(m):
  if 'tabIndex' in m['attrs']:return m.group()
  return '<div'+m['attrs']+' role="region" aria-label="Scrollable data table" tabIndex={0}>'+m['gap']+m['table']
 t=re.sub(pat,region,s)
 if t!=s:f.write_text(t)
# Respect actual available popover height, and improve each option's touch area.
edit('src/components/ui/select.tsx',lambda s:s.replace('max-h-96','max-h-[min(24rem,var(--radix-select-content-available-height))]').replace('h-[var(--radix-select-trigger-height)] w-full','max-h-[min(24rem,var(--radix-select-content-available-height))] overflow-y-auto w-full').replace('rounded-lg py-2 pl-8','min-h-11 rounded-lg py-2 pl-8'))
# Targeted contrast repair preserves the existing palette.
edit('src/app/globals.css',lambda s:s+'''\n/* Audit: readable muted text on the dark section, safe mobile navigation. */
.section-dark { --color-mist: #b8beb9; --color-accent: #b6c3a8; }
html { scroll-padding-top: 5rem; }
[id] { scroll-margin-top: 5rem; }
.bac-bottom-spacer { height: calc(3.5rem + env(safe-area-inset-bottom)); }
@media (max-width: 1023px) {
  body[data-bac-input-active="true"] .bac-bottom-nav,
  body:has([role="dialog"][data-state="open"]) .bac-bottom-nav { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
@media print { .bac-bottom-nav, .bac-bottom-spacer, .bac-privacy-preferences { display: none !important; } }
''')
# Precise route matching avoids simultaneous Build and Account active states.
edit('src/components/layout/mobile-bottom-nav.tsx',lambda s:s.replace('import { Home,','import { useEffect } from "react";\nimport { Home,').replace('p.startsWith("/plan")','(p === "/plan" || p.startsWith("/plan/"))').replace('  if (hidden) return null;', '''  useEffect(() => {
    const update = () => {
      const active = document.activeElement;
      document.body.dataset.bacInputActive = String(active instanceof HTMLElement && (active.matches("input,textarea,select") || active.isContentEditable));
    };
    document.addEventListener("focusin", update); document.addEventListener("focusout", update);
    return () => { document.removeEventListener("focusin", update); document.removeEventListener("focusout", update); delete document.body.dataset.bacInputActive; };
  }, []);
  if (hidden) return null;''').replace('className="h-14 lg:hidden"','className="bac-bottom-spacer lg:hidden"').replace('<nav className="lg:hidden','<nav aria-label="Mobile primary navigation" className="bac-bottom-nav lg:hidden').replace('flex flex-col items-center','flex min-h-14 flex-col items-center'))
# Disclosures, not application menus: focus return, Escape, blur, state, 44px.
edit('src/components/layout/site-header.tsx',lambda s:s.replace('import { useState }','import { useEffect, useRef, useState }').replace('py-2.5 text-sm','min-h-11 py-2.5 text-sm').replace('h-10 w-10','h-11 w-11').replace('  const [open, setOpen] = useState(false);\n  return (', '''  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (''',1).replace('<div className="relative">','''<div className="relative" onKeyDown={(e) => { if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); trigger.current?.focus(); } }} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false); }}>''',1).replace('aria-haspopup="menu"','aria-controls="account-options"\n        ref={trigger}').replace('role="menu"','id="account-options"').replace(' role="menuitem"','').replace('  if (pathname?.startsWith("/admin")) return null;', '''  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  if (pathname?.startsWith("/admin")) return null;''').replace('<header className=','<header onKeyDown={(e) => { if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); trigger.current?.focus(); } }} className=').replace('pathname?.startsWith(n.href)','pathname?.startsWith(`${n.href}/`)').replace('<nav className="hidden lg:flex','<nav aria-label="Primary navigation" className="hidden lg:flex').replace('aria-label="Menu"','aria-label={open ? "Close navigation" : "Open navigation"}\n            aria-expanded={open}\n            aria-controls="mobile-navigation"\n            ref={trigger}').replace('<div className="lg:hidden border-t border-border bg-white">','<div id="mobile-navigation" className="lg:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-white">').replace('<nav className="mx-auto','<nav aria-label="Expanded mobile navigation" className="mx-auto'))
# The age notice must not cover a calculator or compete with bottom navigation.
edit('src/components/common/age-gate.tsx',lambda s:s.replace('import { useState }','import { useEffect, useRef, useState }').replace('  if (verified) return null;', '''  const declinedButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!declined) return;
    const prior = document.activeElement as HTMLElement | null;
    const bodyChildren = [...document.body.children].filter((e) => e instanceof HTMLElement && !e.querySelector("#age-gate-title")) as HTMLElement[];
    const previous = bodyChildren.map((e) => e.inert);
    bodyChildren.forEach((e) => { e.inert = true; });
    declinedButton.current?.focus();
    return () => { bodyChildren.forEach((e, i) => { e.inert = previous[i]; }); prior?.focus(); };
  }, [declined]);
  if (verified) return null;''').replace('max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax','max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}').replace('role="dialog"\n        aria-modal','role="dialog"\n        data-state="open"\n        onKeyDown={(e) => { if (e.key === "Escape") setDeclined(false); if (e.key === "Tab") { e.preventDefault(); declinedButton.current?.focus(); } }}\n        aria-modal').replace('onClick={() => setDeclined(false)}','ref={declinedButton}\n            onClick={() => setDeclined(false)}').replace('className="fixed inset-x-0 bottom-0 z-[200] border-t border-border bg-card/95 backdrop-blur-sm shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"','className="no-print border-b border-border bg-card"').replace('Age check &mdash; are you 21 or older?','Age check: are you 21 or older?'))
# Safer arithmetic validation and no automatic medical schedule/stability claim.
def calc(s):
 s=s.replace('days: number;','days: number | null;',1)
 s=s.replace('  const vialStrengthMg = Math.max(0.0001, input.vialStrengthMg || 0);','''  if (input.bacWaterMl !== undefined && (!isFiniteNumber(input.bacWaterMl) || input.bacWaterMl <= 0)) errors.push("Water volume must be a finite number greater than 0 mL.");
  if (input.injectionsPerWeek != null && (!Number.isInteger(input.injectionsPerWeek) || input.injectionsPerWeek < 1 || input.injectionsPerWeek > 28)) errors.push("The number of equal measurements must be a whole number from 1 to 28.");
  if (!SYRINGES.some((s) => s.id === input.syringeType)) errors.push("Select a supported syringe scale.");
  if (input.dateMixed && Number.isNaN(new Date(input.dateMixed).getTime())) errors.push("Enter a valid mixing date.");
  if (input.secondary && (!isFiniteNumber(input.secondary.vialStrengthMg) || input.secondary.vialStrengthMg <= 0)) errors.push("The second vial amount must be greater than 0 mg.");
  // Invalid states stay finite for rendering, and are never allowed to save.
  const vialStrengthMg = isFiniteNumber(input.vialStrengthMg) && input.vialStrengthMg > 0 ? input.vialStrengthMg : 1;''')
 s=s.replace('Math.max(0.0001, input.doseMcg || 0)','isFiniteNumber(input.doseMcg) && input.doseMcg > 0 ? input.doseMcg : 1').replace(': peptideRef?.injectionsPerWeek ?? 1',': 1').replace('Math.max(0.1, input.bacWaterMl!)','input.bacWaterMl! > 0 ? input.bacWaterMl! : 1')
 s=s.replace('Use less BAC water, or switch to a 0.3 mL syringe.','More water increases the calculated volume for the same amount. Do not change a preparation without checking its instructions, capacity and actual syringe markings.').replace('Using less BAC water lands it at a larger, easier-to-read mark.','More water gives a larger calculated volume for the same amount. Confirm the product instructions and actual syringe markings before any change.')
 s=s.replace('Your syringe has a mark every','This calculation assumes a mark every').replace('The smallest mark on your syringe is','The assumed smallest mark is')
 a=s.index('  const days = peptideRef?.refrigeratedShelfDays');b=s.index('\n  assumptions.push(',a)
 s=s[:a]+'''  const days = null;
  const expDate = null;
  assumptions.push("No usable shelf life, discard date, storage condition or compatibility can be determined from this arithmetic. Follow the specific product label and qualified professional guidance.");
  assumptions.push("Syringe graduation spacing is an assumption. Verify the markings on the actual device; equal capacity does not guarantee equal graduations.");
'''+s[b:]
 a=s.index('    // Blend: expiration');b=s.index('    assumptions.push(',a)
 s=s[:a]+s[b:]
 a=s.index('      label:\n        input.injectionsPerWeek');b=s.index('\n    },\n    syringeReadout',a)
 s=s[:a]+'''      label: `${injectionsPerWeek} equal measurement${injectionsPerWeek === 1 ? "" : "s"} (your input, not a recommended schedule)`,
      halfLifeHours: null,'''+s[b:]
 s=s.replace('dateMixed: input.dateMixed\n        ?','dateMixed: input.dateMixed && !Number.isNaN(new Date(input.dateMixed).getTime())\n        ?').replace('note: peptideRef?.storageNote ?? "Keep in the fridge."','note: "Not determined. Follow the specific product instructions; a calculation cannot establish stability or a safe discard date."')
 a=s.index('  const drawLabel =');b=s.index('\n}\n\nexport function calculate',a)
 s=s[:a]+'''  return [
    "Check the product identity, labeled amount, units, and product-specific instructions. A calculator does not establish suitability for use.",
    `This example uses ${round(input.vialStrengthMg, 4)} mg and ${round(input.bacMl, 4)} mL. Confirm the volume means the final solution volume in your protocol.`,
    `Concentration = amount divided by volume: ${round(input.concentrationMgPerMl, 4)} mg/mL.`,
    `The entered amount of ${round(input.doseMcg, 4)} mcg corresponds to ${round(input.units / 100, 4)} mL. On a U-100 scale only, that volume corresponds to ${round(input.units, 4)} units.`,
    "Confirm the actual syringe capacity and graduation spacing. A rounded display is not permission to round a prescribed amount.",
    "Obtain product-specific preparation, administration, storage and discard instructions from the responsible professional or manufacturer. This is a calculation record, not an injection protocol.",
  ];'''+s[b:]
 s=s.replace('`Mix ${vialStrengthMg} mg of ${displayName} with ${round(usedBacMl, 2)} mL of BAC water. `','`Calculation: ${vialStrengthMg} mg of ${displayName} in ${round(usedBacMl, 2)} mL. `')
 s=s.replace('  return {\n    input:', '''  if (![finalConcentrationMgPerMl, finalConcentrationMcgPerMl, doseVolumeMl, syringeUnits, dosesPerVial].every(Number.isFinite)) {
    const fallback = calculate({ vialStrengthMg: 1, doseMcg: 1, bacWaterMl: 1, syringeType: "insulin-1ml" });
    return { ...fallback, errors: [...errors, "These values exceed the supported numeric range. Check the units and amounts."], summary: "Correct the input values before using or saving a calculation.", instructions: [] };
  }
  return {
    input:''')
 return s
edit('src/lib/calc/index.ts',calc)
# Preserve a blend through server validation; reject invalid results before DB writes.
def actions(s):
 s=s.replace('  dateMixed: z.string().optional().nullable(),','''  dateMixed: z.string().max(40).refine((s) => !s || !Number.isNaN(Date.parse(s)), "Invalid date").optional().nullable(),
  secondary: z.object({ peptideSlug: z.string().max(100).optional(), peptideName: z.string().max(160).optional(), vialStrengthMg: z.number().positive() }).optional().nullable(),''')
 s=s.replace('dateMixed: parsed.data.dateMixed ?? null,','dateMixed: parsed.data.dateMixed ?? null,\n    secondary: parsed.data.secondary,')
 s=s.replace('  return { ok: true as const, result };','  if (result.errors.length) return { ok: false as const, error: result.errors.join(" ") };\n  return { ok: true as const, result };')
 s=s.replace('  const result = calculate(input);','  const result = calculate(input);\n  if (result.errors.length) return { ok: false as const, error: result.errors.join(" ") };')
 s=s.replace('c.publicId.length > 0','c.publicId.length >= 10 && c.publicId.length <= 40').replace('c.claimToken.length > 0','c.claimToken.length === 24')
 return s
edit('src/lib/plan-actions.ts',actions)
# New calculations do not inherit a drug regimen from a compound name.
edit('src/components/plan/plan-form.tsx',lambda s:s.replace('peptide.injectionsPerWeek ?? 1','1').replace('scheduleNote={peptide.scheduleNote}','scheduleNote={undefined}').replace(' (typical)',' (initial value, not a recommendation)'))
# All result views including old saved snapshots must avoid invented shelf life.
put('src/lib/calc/display.ts','''import type { CalcResult } from "@/lib/calc";
/** Preserve saved arithmetic, but never revive legacy unverified stability dates. */
export function safeResultDisplay(result: CalcResult): CalcResult {
  return { ...result, expiration: { days: null, date: null, note: "Not determined. Follow product-specific storage and discard instructions." } };
}
''')
for f in (r/'src').rglob('*.tsx'):
 s=f.read_text()
 if 'JSON.parse(plan.data) as CalcResult' in s:
  s='import { safeResultDisplay } from "@/lib/calc/display";\n'+s
  s=s.replace('JSON.parse(plan.data) as CalcResult','safeResultDisplay(JSON.parse(plan.data) as CalcResult)');f.write_text(s)
# Also sanitize PDF data and owner/admin detail results used by client workspaces.
for p in ['src/app/plan/[id]/pdf/route.ts','src/lib/plan-actions.ts','src/lib/admin-actions.ts']:
 s=(r/p).read_text()
 if 'JSON.parse(plan.data)' in s:
  # Insert after the server directive, not before it.
  s=s.replace('import { prisma }','import { safeResultDisplay } from "@/lib/calc/display";\nimport { prisma }',1)
  s=s.replace('JSON.parse(plan.data) as CalcResult','safeResultDisplay(JSON.parse(plan.data) as CalcResult)')
  (r/p).write_text(s)
put('src/components/plan/shelf-life-timeline.tsx','''export function ShelfLifeTimeline({ dateMixed }: { peptideName: string | null; shelfDays: number | null; dateMixed: string | null }) {
  return <div className="space-y-3 text-sm leading-relaxed">
    <p className="font-medium">A calculation cannot establish shelf life.</p>
    {dateMixed && <p>Recorded mixing date: {new Date(dateMixed).toLocaleDateString("en-US")}</p>}
    <p>Follow the specific product label and instructions from the responsible pharmacist or manufacturer. The discard guidance for an opened diluent vial is not proof of a mixed compound&apos;s stability.</p>
    <a className="underline underline-offset-4" href="/learn/bac-water-shelf-life">Read the distinction between diluent and mixed-product storage</a>
  </div>;
}
''')
edit('src/components/plan/plan-results.tsx',lambda s:s.replace('{result.expiration.days} days','Not determined').replace('`${result.expiration.days} days refrigerated`','"Not determined by this calculator"'))
edit('src/components/plan/plan-pdf.tsx',lambda s:s.replace('{result.expiration.days} days','Not determined'))
edit('src/components/plan/wizard-preview.tsx',lambda s:s.replace('`${result.expiration.days} days after mixing`','"Follow product instructions"'))
# Tests preserve explicit user-defined splits, and verify there is no implicit regimen.
edit('src/lib/calc/__tests__/calc.test.ts',lambda s:re.sub(r'if \(!d.expiration.date.*?\n}\n', 'eq(d.expiration.date, null, "No unsupported calculated discard date");\neq(d.expiration.days, null, "No unsupported stability period");\n',s,flags=re.S).replace('  peptideSlug: "retatrutide",\n  vialStrengthMg: 40,','  peptideSlug: "retatrutide",\n  injectionsPerWeek: 2,\n  vialStrengthMg: 40,',1).replace('retatrutide defaults to 2 injections/week','explicit two-measurement split is preserved').replace('  peptideSlug: "bpc-157",\n  vialStrengthMg: 5,\n  doseMcg: 1750,','  peptideSlug: "bpc-157",\n  injectionsPerWeek: 7,\n  vialStrengthMg: 5,\n  doseMcg: 1750,').replace('bpc-157 defaults to daily (7/week)','explicit seven-measurement split is preserved'))
put('src/lib/__tests__/audit-calculation.test.ts','''import assert from "node:assert/strict";
import { calculate, type CalcInput } from "../calc";
const base: CalcInput = { vialStrengthMg: 5, doseMcg: 250, bacWaterMl: 2, syringeType: "insulin-1ml" };
for (const bad of [0, -1, Infinity, NaN]) {
  assert.ok(calculate({ ...base, bacWaterMl: bad }).errors.length);
  assert.ok(calculate({ ...base, vialStrengthMg: bad }).errors.length);
}
assert.ok(calculate({ ...base, injectionsPerWeek: 1.5 }).errors.length);
assert.ok(calculate({ ...base, dateMixed: "invalid" }).errors.length);
assert.equal(calculate({ ...base, peptideSlug: "bpc-157" }).schedule?.injectionsPerWeek, 1);
assert.equal(calculate({ ...base, peptideSlug: "retatrutide" }).schedule?.injectionsPerWeek, 1);
assert.equal(calculate({ ...base, dateMixed: "2026-09-21" }).expiration.date, null);
const small = calculate({ ...base, doseMcg: 12.5 });
assert.ok(small.warnings.some((w) => w.includes("More water increases")));
assert.ok(!small.warnings.some((w) => /[Uu]se less BAC water/.test(w)));
assert.ok(calculate({ ...base, doseMcg: 12.5, bacWaterMl: 4 }).syringeUnits > small.syringeUnits);
assert.equal(calculate({ ...base, secondary: { vialStrengthMg: 10 } }).secondary?.companionDoseMcg, 500);
assert.ok(calculate({ ...base, bacWaterMl: Number.MIN_VALUE }).errors.length);
assert.ok(!calculate(base).instructions.some((s) => s.includes("injection site")));
console.log("Calculation boundary and stability regressions passed.");
''')
edit('package.json',lambda s:s.replace('tsx src/lib/__tests__/audit-security.test.ts"','tsx src/lib/__tests__/audit-security.test.ts && tsx src/lib/__tests__/audit-calculation.test.ts"'))
print('Applied accessibility, safe arithmetic and ownership display repairs.')

for p in ['bac-water','supplies','reverse-bac']:
 edit(f'src/app/tools/{p}/calculator-client.tsx',lambda s:s.replace('<SelectTrigger ', '<SelectTrigger aria-label="Compound" '))
# Make notes and rename failures recoverable and truthful.
edit('src/components/plan/plan-notes-form.tsx',lambda s:s.replace('rows={4}','rows={4}\n        aria-label="Private plan notes"\n        maxLength={2000}').replace('size="sm"','size="sm"\n          disabled={saving}').replace('            const res = await updatePlanNotesAction(publicId, value);','            try {\n            const res = await updatePlanNotesAction(publicId, value);').replace('else toast({ title: "Could not save notes", variant: "destructive" });','else toast({ title: "Could not save notes", variant: "destructive" });\n            } catch { toast({ title: "Could not save notes", description: "Your text is still here. Please retry.", variant: "destructive" }); } finally { setSaving(false); }'))
edit('src/components/plan/plan-name-editor.tsx',lambda s:s.replace('import { useState }','import { toast } from "@/components/ui/toaster";\nimport { useState }').replace('    const next = draft.trim() || name;','    if (saving) return;\n    const next = draft.trim() || name;').replace('    const res = await updatePlanNameAction(publicId, next);','    try {\n    const res = await updatePlanNameAction(publicId, next);').replace('      setEditing(false);\n    }\n  }','      setEditing(false);\n    } else { toast({ title: "Name was not saved", variant: "destructive" }); }\n    } catch { toast({ title: "Could not save the name", description: "Your edit is still here. Please retry.", variant: "destructive" }); } finally { setSaving(false); }\n  }',1).replace('h-9 w-9','h-11 w-11'))
edit('src/components/common/copy-button.tsx',lambda s:s.replace('import { useState }','import { toast } from "@/components/ui/toaster";\nimport { useState }').replace('/* clipboard unavailable; ignore */','toast({ title: "Copy unavailable", description: "Select the visible value and copy it manually.", variant: "destructive" });').replace('className={`inline-flex','aria-live="polite"\n      className={`inline-flex min-h-11'))
# No legacy auto-expiry on labels or workspace rows.
for p in ['src/app/plan/[id]/label/page.tsx','src/app/plans/labels/page.tsx']:
 edit(p,lambda s:re.sub(r'const shelfDays =\s*plan.dateMixed.*?refrigeratedShelfDays \?\? 28;', 'const shelfDays = null;',s,flags=re.S))
edit('src/components/plan/vial-label.tsx',lambda s:s.replace('shelfDays: number;','shelfDays: number | null;').replace('const exp = mixDate ? addDaysIso(mixDate, data.shelfDays) : "";','const exp = "";').replace('within {data.shelfDays} d','per product label').replace('Refrigerate &middot; protect from light &middot; do not freeze','Storage and discard: follow product instructions'))
edit('src/components/plan/batch-label-sheet.tsx',lambda s:s.replace('{p.shelfDays} d shelf life','Storage: follow product instructions'))
for p in ['src/lib/plan-actions.ts','src/lib/admin-actions.ts']:
 edit(p,lambda s:s.replace('result = JSON.parse(plan.data);','result = safeResultDisplay(JSON.parse(plan.data));').replace('expirationDate: plan.expirationDate?.toISOString() ?? null','expirationDate: null'))
edit('src/lib/plan-actions.ts',lambda s:s.replace('  // A name that is just a restatement','  if (result.errors.length) return { ok: false as const, error: result.errors.join(" ") };\n\n  // A name that is just a restatement'))
# Server action response never claims notification delivery; retries share a UUID.
put('src/lib/contact-actions.ts','''"use server";
import { z } from "zod";
import { prisma } from "@/lib/db";
const schema = z.object({
  requestId: z.string().uuid(), name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254), subject: z.string().trim().max(200),
  message: z.string().trim().min(1).max(4000), website: z.literal(""),
});
export async function submitContactAction(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(["requestId", "name", "email", "subject", "message", "website"].map((key) => [key, formData.get(key) ?? ""])));
  if (!parsed.success) return { ok: false as const, error: "Check your name, email and message. Keep the message under 4,000 characters." };
  const { requestId, name, email, subject, message } = parsed.data;
  try {
    // Unique primary key provides race-safe deduplication of the same submission.
    await prisma.contactMessage.upsert({ where: { id: requestId }, update: {}, create: { id: requestId, name, email, subject: subject || null, message } });
    return { ok: true as const };
  } catch { return { ok: false as const, error: "Your message could not be saved. Your text is still here; please retry." }; }
}
''')
put('src/components/common/contact-form.tsx','''"use client";
import { useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitContactAction } from "@/lib/contact-actions";
import { trackUsage } from "@/lib/analytics";
export function ContactForm() {
  const [pending, setPending] = useState(false), [sent, setSent] = useState(false), [error, setError] = useState("");
  const requestId = useRef(""); const locked = useRef(false);
  if (sent) return <div role="status" className="py-8"><h2 className="text-xl font-semibold">Your message has been saved.</h2><p className="mt-2 text-sm">It is now in the support inbox. This confirmation does not mean an email has been delivered.</p></div>;
  return <form className="space-y-4" aria-busy={pending} onSubmit={async (e) => {
    e.preventDefault(); if (locked.current) return;
    locked.current = true; setPending(true); setError("");
    const fd = new FormData(e.currentTarget);
    requestId.current ||= crypto.randomUUID(); fd.set("requestId", requestId.current);
    try { const result = await submitContactAction(fd); if (result.ok) { setSent(true); trackUsage("contact_saved"); } else setError(result.error); }
    catch { setError("Connection interrupted. Your text is still here; please retry."); }
    finally { locked.current = false; setPending(false); }
  }}>
    <div><Label htmlFor="contact-name">Name</Label><Input id="contact-name" name="name" autoComplete="name" required maxLength={120} className="mt-2" /></div>
    <div><Label htmlFor="contact-email">Email</Label><Input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} className="mt-2" /></div>
    <div><Label htmlFor="contact-subject">Subject (optional)</Label><Input id="contact-subject" name="subject" maxLength={200} className="mt-2" /></div>
    <div><Label htmlFor="contact-message">Message</Label><Textarea id="contact-message" name="message" rows={6} required maxLength={4000} aria-describedby="contact-help" /><p id="contact-help" className="mt-2 text-xs text-muted-foreground">Do not include health records, passwords or payment information.</p></div>
    <div hidden aria-hidden="true"><label>Leave blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button type="submit" variant="brand" size="lg" disabled={pending}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{pending ? "Saving message" : "Send message"}</Button>
  </form>;
}
''')
# Explicitly gated manual analytics. No private routes, identifiers, input values or free text.
put('src/lib/analytics.ts','''export const ANALYTICS_CONSENT_KEY = "bacwater.analytics-consent.v1";
export const ANALYTICS_READY = process.env.NEXT_PUBLIC_ANALYTICS_MANUAL_CONFIRMED === "true";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-CWEKGP6NKB";
export function isPublicAnalyticsPath(path: string): boolean {
  return path === "/" || /^\\/(tools|learn|peptides)(\\/|$)/.test(path) || ["/peptide-calculator", "/plan", "/plan/new", "/about", "/contact", "/faq"].includes(path);
}
export function analyticsLocation(path: string): string | null {
  if (!isPublicAnalyticsPath(path) || path.includes("?") || path.includes("#")) return null;
  // Only classify broad page types. Compound identities never leave this site.
  const category = path.startsWith("/peptides/") ? "/peptides/reference" : path.startsWith("/learn/") ? "/learn/article" : path;
  return `https://bacwater.ai${category}`;
}
export function trackUsage(event: "plan_saved" | "plan_updated" | "contact_saved" | "calculation_completed" | "label_printed") {
  if (typeof window === "undefined" || !ANALYTICS_READY) return;
  try {
    if (localStorage.getItem(ANALYTICS_CONSENT_KEY) !== "granted" || !isPublicAnalyticsPath(location.pathname)) return;
    window.dispatchEvent(new CustomEvent("bacwater:usage", { detail: event }));
  } catch { /* Optional measurement never blocks a task. */ }
}
''')
put('src/components/common/analytics-preferences.tsx','''"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ANALYTICS_CONSENT_KEY, ANALYTICS_READY, GA_ID, analyticsLocation } from "@/lib/analytics";
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean | undefined };
export function AnalyticsPreferences() {
  const pathname = usePathname() || "/";
  const [choice, setChoice] = useState("denied");
  useEffect(() => { try { setChoice(localStorage.getItem(ANALYTICS_CONSENT_KEY) || "denied"); } catch {} }, []);
  useEffect(() => {
    const w = window as AnalyticsWindow;
    const pageLocation = analyticsLocation(pathname);
    const allowed = ANALYTICS_READY && choice === "granted" && Boolean(pageLocation);
    w[`ga-disable-${GA_ID}`] = !allowed;
    if (!allowed) { w.gtag?.("consent", "update", { analytics_storage: "denied" }); return; }
    w.dataLayer ||= []; w.gtag ||= function () { w.dataLayer!.push(arguments); };
    if (!document.getElementById("bacwater-manual-analytics")) {
      w.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      w.gtag("js", new Date());
      w.gtag("config", GA_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: pageLocation, page_referrer: "", page_title: "BACwater.ai utility" });
      const script = document.createElement("script"); script.id = "bacwater-manual-analytics"; script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`; document.head.appendChild(script);
    }
    w.gtag("consent", "update", { analytics_storage: "granted" });
    w.gtag("event", "page_view", { page_location: pageLocation, page_referrer: "", page_title: "BACwater.ai utility" });
    const usage = (e: Event) => {
      const name = (e as CustomEvent).detail;
      if (["plan_saved", "plan_updated", "contact_saved", "calculation_completed", "label_printed"].includes(name)) w.gtag?.("event", name, { page_location: pageLocation, page_referrer: "" });
    };
    window.addEventListener("bacwater:usage", usage);
    return () => { window.removeEventListener("bacwater:usage", usage); w[`ga-disable-${GA_ID}`] = true; };
  }, [choice, pathname]);
  function choose(value: string) {
    try { localStorage.setItem(ANALYTICS_CONSENT_KEY, value); } catch {}
    setChoice(value);
    if (value === "denied") {
      const w = window as AnalyticsWindow; w[`ga-disable-${GA_ID}`] = true;
      for (const cookie of document.cookie.split(";")) {
        const key = cookie.split("=")[0].trim();
        if (key === "_ga" || key.startsWith("_ga_")) for (const domain of ["", location.hostname, ".bacwater.ai"]) document.cookie = `${key}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
      }
    }
  }
  return <section className="bac-privacy-preferences border-t border-border px-4 py-5 text-sm" aria-label="Analytics preferences"><div className="mx-auto max-w-7xl flex flex-wrap items-center gap-3"><p className="flex-1 min-w-48">{ANALYTICS_READY ? "Optional usage analytics are off unless you allow them. Calculations work either way." : "Optional analytics and session replay are off. Your calculations work without them."}</p><button type="button" className="min-h-11 rounded-lg border border-border px-4" aria-pressed={choice === "denied"} onClick={() => choose("denied")}>Keep analytics off</button>{ANALYTICS_READY && <button type="button" className="min-h-11 rounded-lg border border-border px-4" aria-pressed={choice === "granted"} onClick={() => choose("granted")}>Allow usage analytics</button>}<a href="/privacy" className="min-h-11 inline-flex items-center underline">Privacy</a></div></section>;
}
''')
def layout(s):
 s=s.replace('import Script from "next/script";','import { AnalyticsPreferences } from "@/components/common/analytics-preferences";')
 s=s.replace('const GA_ID = "G-CWEKGP6NKB";','').replace('const CLARITY_ID = "xgb3ipxhf6";','').replace('const isAuthenticated = !!session?.user;','const isAuthenticated = Boolean((session?.user as { id?: string } | undefined)?.id);')
 a=s.index('        {process.env.NODE_ENV === "production"');b=s.index('        <a\n          href="#main"',a);s=s[:a]+s[b:]
 s=s.replace('<main id="main" className="flex-1">','<AgeGate initialVerified={ageVerified} />\n        <main id="main" className="flex-1">').replace('        <AgeGate initialVerified={ageVerified} />\n      </body>','        <AnalyticsPreferences />\n      </body>')
 return s
edit('src/app/layout.tsx',layout)
# Safer encoded JSON-LD in every existing emitter, including database-backed strings.
put('src/lib/seo/safe-json.ts','''/** Prevent HTML/script termination inside otherwise valid JSON-LD. */
export function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\\\u003c").replace(/>/g, "\\\\u003e").replace(/&/g, "\\\\u0026");
}
'''.replace('\\\\u','\\\\u'))
for f in (r/'src').rglob('*.tsx'):
 s=f.read_text()
 if 'application/ld+json' in s and '__html: JSON.stringify(' in s:
  s=s.replace('__html: JSON.stringify(', '__html: safeJson(')
  i=s.find('import ');s=s[:i]+'import { safeJson } from "@/lib/seo/safe-json";\n'+s[i:];f.write_text(s)
edit('src/lib/seo/schema.ts',lambda s:s.replace('  logo: `${SITE_URL}/favicon.ico`,\n','').replace('and premium supplies.','and educational references.').replace('applicationCategory: "HealthApplication"','applicationCategory: "UtilitiesApplication"'))
# Live publication exports fail visibly, not with a deceptively complete empty sitemap.
edit('src/lib/learn/catalog.ts',lambda s:s.replace('export async function getCatalog():','export async function getCatalog(strict = false):').replace('''      () =>
        [] as {''','''      () => {
        if (strict) throw new Error("Published content is temporarily unavailable.");
        return [] as {''').replace('''        }[]
    );''','''        }[];
      }
    );'''))
edit('src/app/sitemap-learn.xml/route.ts',lambda s:s.replace('export async function GET() {','export async function GET() {\n  try {').replace('.catch(() => [] as { slug: string; updatedAt: Date }[]);',';').replace('getCatalog().catch(() => [])','getCatalog(true)').replace('    urlsetXml([...comparisonUrls, ...guideUrls, ...filterUrls])\n  );\n}','    urlsetXml([...comparisonUrls, ...guideUrls, ...filterUrls])\n  );\n  } catch { return new Response("Sitemap temporarily unavailable", { status: 503, headers: { "Retry-After": "300", "Cache-Control": "no-store" } }); }\n}').replace('export const revalidate = 3600;','export const dynamic = "force-dynamic";'))
edit('src/lib/seo/sitemap.ts',lambda s:s.replace('const body = urls\n    .map','const body = [...new Map(urls.map((u) => [u.path || "/", u])).values()]\n    .map').replace('`${SITE_URL}${u.path}`','`${SITE_URL}${u.path || "/"}`').replace('"public, max-age=3600, s-maxage=3600"','"public, max-age=0, s-maxage=0, must-revalidate"'))
put('src/app/llms.txt/route.ts','''import { STATIC_PAGES, SITE_URL } from "@/lib/seo/sitemap";
import { getCatalog } from "@/lib/learn/catalog";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const catalog = await getCatalog(true);
    const entries = new Map(catalog.map((e) => [e.url, { title: e.title, description: e.excerpt }]));
    for (const page of STATIC_PAGES) if (!entries.has(page.path || "/")) entries.set(page.path || "/", { title: page.path ? page.path.split("/").filter(Boolean).join(" / ").replaceAll("-", " ") : "BACwater.ai", description: "Public information or calculation tool." });
    const clean = (s: string) => s.replace(/[\\r\\n\\[\\]<>]/g, " ").replace(/\\s+/g, " ").trim().slice(0, 200);
    const body = "# BACwater.ai\\n\\n> Free concentration and measurement tools using deterministic arithmetic. This site does not sell products, select a dose, establish compatibility, or validate a storage period.\\n\\nEnter verified values from the applicable product instructions. Research examples are not instructions for human use. Private accounts, saved-plan identifiers, notes, drafts, and administrative routes are excluded from this guide.\\n\\n## Public tools and reference pages\\n\\n" + [...entries].map(([url, e]) => `- [${clean(e.title)}](${SITE_URL}${url}): ${clean(e.description)}`).join("\\n") + "\\n\\n## Limits\\n\\nThis file is an optional discovery guide, not an indexing guarantee or access-control mechanism. Storage and medical decisions require product-specific instructions and qualified review.\\n";
    return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, must-revalidate" } });
  } catch { return new Response("Public reference guide temporarily unavailable", { status: 503, headers: { "Retry-After": "300", "Cache-Control": "no-store" } }); }
}
''')
put('src/app/robots.ts','''import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  // The wildcard applies equally to legitimate search, retrieval and training agents.
  // Private routes require actual authorization. Public noindex pages remain fetchable.
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/plan/*/pdf"] }, sitemap: `${base}/sitemap.xml` };
}
''')
# Shared invalidation includes XML, discovery text, HTML sitemap and FAQs.
put('src/lib/seo/publication.ts','''import { revalidatePath } from "next/cache";
export function revalidatePublication(slugs: Array<string | undefined> = []) {
  for (const path of ["/learn", "/faq", "/sitemap", "/sitemap-learn.xml", "/llms.txt"]) revalidatePath(path);
  for (const slug of new Set(slugs)) if (slug) revalidatePath(`/learn/${slug}`);
}
''')
def admin(s):
 s=s.replace('import { revalidatePath }','import { revalidatePublication } from "@/lib/seo/publication";\nimport { revalidatePath }',1)
 s=s.replace('  revalidatePath("/admin/content");','  revalidatePath("/admin/content");\n  revalidatePublication();')
 s=s.replace('  await prisma.contentBlock.delete({ where: { id } });','  const removed = await prisma.contentBlock.delete({ where: { id } });\n  revalidatePublication([removed.slug]);')
 s=s.replace('slug: z.string().min(1).max(160),','slug: z.string().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by single hyphens."),')
 return s
edit('src/lib/admin-actions.ts',admin)
# Exact public model, not legacy shop promises or unsupported retention deadlines.
put('src/app/privacy/page.tsx','''import Link from "next/link";
export const metadata = { title: "Privacy and Data Use", description: "How BACwater.ai handles accounts, saved calculation plans, support messages and optional analytics.", alternates: { canonical: "/privacy" } };
export default function PrivacyPage() { return <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 space-y-6"><h1 className="text-4xl font-serif">Privacy and data use</h1><p>Updated September 21, 2026. BACwater.ai is a free calculation and reference site, not a medical service or an online shop.</p>
<h2 className="text-2xl font-serif">Accounts and saved plans</h2><p>Creating an account stores your name, email address and a password hash, or the account information supplied by your sign-in provider. Saving a plan sends its calculation inputs and results to our database. Notes and custom plan names are available only to the owning account or the anonymous device holding the plan&apos;s creation secret.</p>
<h2 className="text-2xl font-serif">Shared links</h2><p>Anyone with a saved plan&apos;s share link can read its calculation, label or public PDF. The link is not a private document vault. Private notes are omitted from a shared viewer&apos;s PDF. Do not put personal or health information in compound names or calculation fields.</p>
<h2 className="text-2xl font-serif">Device storage</h2><p>Essential cookies keep you signed in, remember age confirmation, and prove ownership of anonymous plans. Local or session storage may keep your draft, saved-plan list, anonymous claim secrets and preferences. Clearing browser data can remove access to anonymous plans. Sign in and claim plans before clearing it.</p>
<h2 className="text-2xl font-serif">Support and optional AI explanations</h2><p>Support submissions are stored in the administrative inbox. When staff send a reply through the configured email provider, the provider processes the recipient address and message. Requesting an AI explanation sends the submitted question and calculation context to the configured AI provider. Do not submit health records or other sensitive information.</p>
<h2 className="text-2xl font-serif">Analytics and session replay</h2><p>Optional analytics are off by default and require both verified configuration and your consent. The controls at the bottom of this page let you decline or withdraw consent. Where enabled, only approved usage events and broad public page categories are sent, not plan identifiers, notes, input values or full query strings. Session replay is not loaded by this release. Rejecting optional tracking does not prevent calculations or saving plans.</p>
<h2 className="text-2xl font-serif">Service providers and retention</h2><p>Hosting, database, authentication, configured email delivery and optional AI services process the information needed for those functions. Saved records remain until deleted through supported controls or handled through a verified support request. Backup retention and any legally required retention need to be considered separately; this page does not promise immediate removal from every backup.</p>
<h2 className="text-2xl font-serif">Questions and requests</h2><p>Use the <Link className="underline" href="/contact">contact form</Link> to ask about access, correction or deletion. We may need to verify ownership before changing or disclosing account data. Do not send a password. The rights and retention obligations that apply can depend on your location and the circumstances.</p><Link className="underline" href="/">Back to BACwater.ai</Link></article>; }
''')
# Fix stale feature claims in metadata and generated summaries. No URL migration.
edit('src/app/page.tsx',lambda s:re.sub(r'(<h1[^>]*>).*?(</h1>)',r'\1\n          BAC Water Calculator and Mixing Guide\n        \2',s,count=1,flags=re.S))
# Error recovery and blend preservation in client save, plus privacy-safe success events.
edit('src/components/plan/plan-form.tsx',lambda s:s.replace('import { use','import { trackUsage } from "@/lib/analytics";\nimport { use',1).replace('        notes: null,','        notes: null,\n        secondary: result?.secondary ? { peptideName: result.secondary.peptideName, vialStrengthMg: result.secondary.vialStrengthMg } : null,').replace('          toast({ title: "Plan updated"','          trackUsage("plan_updated");\n          toast({ title: "Plan updated"').replace('        setSavedPlan({','        trackUsage("plan_saved");\n        setSavedPlan({').replace('    } finally {\n      setSaving(false);','    } catch { toast({ title: "Could not save plan", description: "Your values are still here. Check your connection and retry.", variant: "destructive" });\n    } finally {\n      setSaving(false);'))
print('Applied privacy, schema, publication and recovery safeguards.')

for f in (r / "src").rglob("*.tsx"):
    t=f.read_text(); f.write_text("\n".join(line.rstrip() for line in t.splitlines()).rstrip()+"\n")
