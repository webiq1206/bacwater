from pathlib import Path
import re
r=Path('.')
def edit(path, fn):
    p=r/path; p.write_text(fn(p.read_text()))
p=r/'src/components/plan/plan-form.tsx'; s=p.read_text()
a=s.index('  const dosePresets = useMemo('); b=s.index('  const primaryName =',a)
s=s[:a]+'''  const dosePresets: { mcg: number; label: string; hint: string }[] = [];
  const weeklyRangeHint = "Enter the total from instructions you already have. This tool does not recommend a dose or treatment schedule.";

'''+s[b:]
s=s.replace('showCustomDose: !dosePresetValues.includes(doseMcg)', 'showCustomDose: true').replace('init?.showCustomDose ?? false', 'init?.showCustomDose ?? true')
s=s.replace('hint={`${weeklyRangeHint} Not sure? Pick the most commonly studied amount.`}', 'hint={weeklyRangeHint}')
s=s.replace('"Type your total for the week, in mg or mcg. We\'ll split it across your injections."', 'weeklyRangeHint')
s=s.replace('              {". "}Amounts studied here: {peptide.typicalDoseMcgRange[0] / 1000} to {peptide.typicalDoseMcgRange[1] / 1000} mg ({peptide.typicalDoseMcgRange[0].toLocaleString()} to {peptide.typicalDoseMcgRange[1].toLocaleString()} mcg). These are study details, not instructions.', '              {". "}Confirm the amount and units on your own label.')
s=s.replace('hint="Not sure? A 1 mL insulin syringe works for almost everyone."', 'hint="Choose the scale printed on your actual syringe. These markings are not interchangeable."')
s=s.replace('(recommended)', '(arithmetic example)').replace('Chosen to give clean, round numbers on your syringe.', 'An arithmetic example only. Follow the product instructions and vial capacity.').replace('Pick your own amount.', 'Enter the product-specified or actual final volume.')
s=s.replace('Optional. Lets us calculate when the vial expires so you know when to discard it.', 'Optional recordkeeping only. This date does not determine shelf life or a safe discard date.')
s=s.replace('Pick the day you added BAC water, or the day you plan to. This sets your discard date. We won\'t guess this one for you.', 'Record the mixing date, or leave it blank. Follow product-specific storage and discard instructions.')
s=s.replace('nextDisabled={!dateMixed}', 'nextDisabled={false}').replace(". We&apos;ll count your shelf life from this date.", '. This is a record, not a calculated expiry date.')
s=s.replace('behavior: "smooth"', 'behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"')
s=s.replace('className={cn("chip", active && "chip--active")}', 'aria-pressed={active}\n      className={cn("chip", active && "chip--active")}')
s=s.replace('onClick={() => onChange(opt)}', 'onClick={() => onChange(opt)}\n          aria-pressed={value === opt}')
s=s.replace('onClick={() => onChange("beginner")}', 'onClick={() => onChange("beginner")}\n        aria-pressed={mode === "beginner"}').replace('onClick={() => onChange("advanced")}', 'onClick={() => onChange("advanced")}\n        aria-pressed={mode === "advanced"}')
s=s.replace('    setSaving(true);', '    if (saving || !hasValidInputs || result.errors.length) return;\n    setSaving(true);',1)
labels={'customPeptideName':'Custom peptide name','secondaryVialInput':'Second compound amount','vialInput':'Vial strength','doseInput':'Dose amount','customBacMl':'Final liquid volume in mL','dateMixed':'Mixing date'}
def label_input(m):
    text=m.group(0)
    if 'aria-label=' in text or 'id=' in text: return text
    for var,label in labels.items():
        if re.search(r'value=\{'+var+r'(?:\s|\})',text): return text.replace('<Input','<Input aria-label="'+label+'"',1)
    return text
s=re.sub(r'<Input\b.*?/>',label_input,s,flags=re.S)
s=s.replace('  dateMixed?: string | null;','  dateMixed?: string | null;\n  secondary?: CalcInput["secondary"];',1)
s=s.replace('useState<boolean>(false);\n  const [secondarySlug', 'useState<boolean>(!!initial?.secondary);\n  const [secondarySlug',1)
s=s.replace('useState<string>("cjc-1295-no-dac")', 'useState<string>(initial?.secondary?.peptideSlug || "custom")')
s=s.replace('const [customSecondaryName, setCustomSecondaryName] = useState("");', 'const [customSecondaryName, setCustomSecondaryName] = useState(initial?.secondary?.peptideName || "");')
s=s.replace('const [secondaryVialInput, setSecondaryVialInput] = useState<number>(5);','const [secondaryVialInput, setSecondaryVialInput] = useState<number>(initial?.secondary?.vialStrengthMg || 0);')
p.write_text(s)
edit('src/components/plan/plan-editor.tsx', lambda s:s.replace('  dateMixed: string;', '  dateMixed: string;\n  secondary?: PlanFormInitial["secondary"];').replace('    dateMixed: initial.dateMixed || null,','    dateMixed: initial.dateMixed || null,\n    secondary: initial.secondary,'))
edit('src/app/plan/[id]/edit/page.tsx', lambda s:s.replace('  let injectionsPerWeek = 1;', '  let injectionsPerWeek = 1;\n  let secondary: import("@/lib/calc").CalcInput["secondary"];').replace('      schedule?: { injectionsPerWeek?: number };','      schedule?: { injectionsPerWeek?: number };\n      input?: { secondary?: import("@/lib/calc").CalcInput["secondary"] };').replace('    if (\n      typeof snapshot.schedule', '    secondary = snapshot.input?.secondary;\n    if (\n      typeof snapshot.schedule').replace('            injectionsPerWeek,','            injectionsPerWeek,\n            secondary,'))
# Preserve the existing blend if the compact inline editor does not expose it.
edit('src/lib/plan-actions.ts', lambda s:s.replace('  const result = calculate(parsed.data as CalcInput);', '  const result = calculate(parsed.data as CalcInput);'))
edit('src/components/plan/plans-workspace.tsx', lambda s:s.replace('          dateMixed: fields.dateMixed || null,','          dateMixed: fields.dateMixed || null,\n          secondary: detail?.result?.input.secondary ?? null,'))
edit('src/app/peptides/compare/page.tsx',lambda s:s.replace('a: a.storageNote,','a: "Follow the exact product instructions; stability is not calculated.",').replace('b: b.storageNote,','b: "Follow the exact product instructions; stability is not calculated.",'))
edit('src/lib/contact-actions.ts',lambda s:s.replace('    await prisma.contactMessage.upsert(', '    const stored = await prisma.contactMessage.upsert(').replace('    return { ok: true as const };', '    if (stored.name !== name || stored.email !== email || (stored.subject || "") !== subject || stored.message !== message) return { ok: false as const, error: "An earlier version of this message was already saved. Refresh before sending a different message." };\n    return { ok: true as const };'))
(r/'scripts/post-merge.sh').write_text('#!/bin/bash\nset -euo pipefail\n# Match the deploy lockfile. Never modify or seed the production database here.\nnpm ci\nnpx prisma generate\n')
(r/'src/app/error.tsx').write_text('''"use client";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="mx-auto max-w-xl px-5 py-16" role="alert"><h1 className="text-2xl font-semibold">This page could not load.</h1><p className="mt-3">Your saved plans have not been deleted. Retry the page or return to the calculators.</p><div className="mt-6 flex flex-wrap gap-4"><button type="button" onClick={reset} className="min-h-11 rounded-lg border px-5">Try again</button><a href="/tools" className="inline-flex min-h-11 items-center underline">Open calculators</a></div></section>;
}
''')
print('Release hardening applied.')
