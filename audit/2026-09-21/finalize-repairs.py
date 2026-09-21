from pathlib import Path
import re
r = Path('.')
def rep(path, old, new):
    p=r/path; p.write_text(p.read_text().replace(old,new))
rep('src/components/common/analytics-preferences.tsx','window as AnalyticsWindow','window as unknown as AnalyticsWindow')
rep('src/app/globals.css','--color-accent: #b6c3a8;', '--color-accent-guide: #b6c3a8;')
rep('src/components/plan/plan-results.tsx','$Not determined refrigerated','Not determined by this calculator')
rep('src/components/plan/plan-results.tsx','The shelf life comes from published research.', 'Shelf life is not calculated. Use the product-specific instructions.')
rep('src/components/plan/plan-results.tsx','>refrigerated</div>', '>follow product instructions</div>')
rep('src/components/plan/plan-pdf.tsx','Shelf life (refrigerated)', 'Shelf life')
rep('src/components/plan/plan-form.tsx','{c.perWeek === defaultPerWeek ? " · typical" : ""}', '')
rep('src/components/plan/plan-form.tsx','How many injections per week?', 'Split your entered weekly total into how many measurements?')
rep('src/components/plan/plan-form.tsx','"rounded-full border px-3 py-1.5 text-sm transition-colors"', '"min-h-11 rounded-full border px-3 py-1.5 text-sm transition-colors"')
rep('src/components/plan/plan-form.tsx','"px-3 h-8 text-xs font-semibold transition-colors"', '"px-3 min-h-11 text-xs font-semibold transition-colors"')
rep('src/lib/calc/index.ts', "peptide's typical frequency (driven by its half-life); 1 when unknown.", 'explicit user input; defaults to 1. No regimen is inferred.')
rep('src/app/plan/page.tsx','doses per vial, expiration, supplies','measurements per vial and supply quantities')
rep('src/app/signin/page.tsx','your saved plans and order history','your saved calculations')
rep('src/app/signup/page.tsx','Save your plans, download PDFs, print vial labels, and track your orders.', 'Save your calculations, download PDFs and print vial labels.')
rep('src/app/contact/page.tsx','Have a question about an order, a plan, or our products? Reach the BACwater.ai team.', 'Report a calculator issue or ask about saved plans, privacy or the BACwater.ai website.')
rep('src/app/contact/page.tsx', 'Questions about an order, a plan, a product, or wholesale pricing?\n        Send us a note and we&apos;ll get back to you within one business day.', 'Questions about a calculation, a saved plan or this website?\n        Send the support team a note. We do not sell products or provide medical advice.')
p=r/'src/lib/peptides/page-data.ts'; s=p.read_text()
a=s.index('export function directAnswer'); b=s.index('/** Reconstitution steps',a)
s=s[:a]+'''export function directAnswer(p: PeptideRef): string {
  const name = shortName(p.name);
  return `Use this ${name} calculator to convert your stated vial amount and final liquid volume into concentration and U-100 syringe units. Enter an amount to measure from instructions you already have. Vial strength alone cannot determine a suitable diluent, mixing volume, dose or storage time.`;
}

'''+s[b:]
a=s.index('export function reconstitutionSteps'); b=s.index('export interface FaqItem',a)
s=s[:a]+'''export function reconstitutionSteps(p: PeptideRef): { name: string; text: string }[] {
  return [
    { name: "Check the product instructions", text: `Confirm the identity, amount and units on your ${shortName(p.name)} label. A name alone does not establish formulation, purity or suitability for use.` },
    { name: "Enter the known volume", text: "Use the liquid volume specified for your product or the actual final volume of an existing solution. A convenient calculator result is not permission to change those instructions." },
    { name: "Check the concentration", text: "Divide the total amount in milligrams by the final volume in milliliters to obtain mg/mL. The calculation assumes the stated amount is fully dissolved in that final volume." },
    { name: "Check the measurement", text: "Convert the amount you entered to milliliters using that concentration. U-100 markings represent 100 units per mL, not milligrams of a compound." },
    { name: "Keep storage instructions separate", text: "Use the product-specific storage and discard instructions. This calculation cannot determine a safe use period or verify sterility." },
  ];
}

'''+s[b:]
s=s.replace('a: `Add about ${r.bacMl} mL of bacteriostatic water to a ${r.vialMg} mg vial of ${name}. That creates a ${r.concentrationMgPerMl} mg/mL solution, so a ${r.doseLabel} dose is about ${r.units} units on a 1 mL insulin syringe. Adjust the water amount to move the dose to a cleaner mark.`,','a: `A ${r.vialMg} mg vial in a final volume of ${r.bacMl} mL would have a concentration of ${r.concentrationMgPerMl} mg/mL. In that arithmetic example, ${r.doseLabel} corresponds to ${r.units} U-100 units. These are illustrative inputs, not a recommended dilution or dose. Follow the product-specific instructions.`,')
s=s.replace('a: `Once mixed, ${name} is typically stable for about ${p.refrigeratedShelfDays} days when refrigerated. ${p.storageNote} Discard it sooner if the solution turns cloudy or develops particles.`,', 'a: `A reliable storage period for ${name} cannot be inferred from the compound name or concentration alone. Follow the instructions for the exact formulation. This calculator does not establish sterility, stability or a discard date.`,')
p.write_text(s)
p=r/'src/app/peptides/[slug]/page.tsx'; s=p.read_text()
s=s.replace('`${p.refrigeratedShelfDays} days`','"Product-specific"').replace('"refrigerated, once mixed"','"not calculated"').replace('"refrigerated, mixed"','"not calculated"')
s=s.replace('{p.refrigeratedShelfDays} days','Product-specific').replace('>refrigerated</div>','>not calculated</div>')
s=s.replace('''            {p.storageNote}
            {content?.caveat ? ` ${content.caveat}` : ""} Once you add bac water,
            the peptide slowly breaks down, so refrigerate the vial and discard
            it if the solution turns cloudy or develops particles.''','''            Follow the storage and discard instructions for the exact formulation.
            A compound name or concentration cannot establish stability or sterility.
            <Link href="/learn/bac-water-shelf-life" className="ml-1 underline">Read about storage limits.</Link>''')
s=s.replace('name={`How to reconstitute ${short}`}','name={`How to check a ${short} concentration calculation`}').replace('description={`Step-by-step reconstitution of ${short} with bacteriostatic water.`}','description={`Check the label inputs and concentration arithmetic for ${short}. Not preparation or medical instructions.`}').replace('          totalTime="PT5M"\n','').replace('          How to reconstitute {short}', '          Check the {short} calculation')
p.write_text(s)
p=r/'src/app/peptides/compare/page.tsx'; s=p.read_text().replace('refrigerated shelf life','storage limitations').replace('`${a.refrigeratedShelfDays} days refrigerated`','"Follow the exact product instructions"').replace('`${b.refrigeratedShelfDays} days refrigerated`','"Follow the exact product instructions"'); p.write_text(s)
p=r/'src/app/tools/vial-labels/page.tsx'; s=p.read_text().replace('Based on shelf life','Follow product instructions').replace("a discard-by date based on the peptide's refrigerated shelf life",'a separate product-specified discard date').replace('the mix date, and the expiration date','the mix date and product-specific storage instructions'); p.write_text(s)
p=r/'src/components/auth/sign-in-form.tsx'; s=p.read_text().replace('    setPending(true);','    if (pending) return;\n    setPending(true);',1).replace('    const res = await signinAction(form);','    try {\n    const res = await signinAction(form);').replace('const next = params.get("next") || "/plans";', 'const candidate = params.get("next") || "/plans";\n      const next = /^\\/(?![\\/\\\\])/.test(candidate) && !/[\\r\\n]/.test(candidate) ? candidate : "/plans";').replace('  }\n\n  return (','    } catch { toast({ title: "Connection interrupted", description: "Your entries are still here. Please retry.", variant: "destructive" }); }\n    finally { setPending(false); }\n  }\n\n  return (',1); p.write_text(s)
p=r/'src/components/auth/sign-up-form.tsx'; s=p.read_text().replace('    setPending(true);','    if (pending) return;\n    setPending(true);',1).replace('    const res = await signupAction(form);','    try {\n    const res = await signupAction(form);').replace('  }\n\n  return (','    } catch { toast({ title: "Could not finish signup", description: "Please retry, or sign in if the account was already created.", variant: "destructive" }); }\n    finally { setPending(false); }\n  }\n\n  return (',1); p.write_text(s)
print('Follow-up corrections applied.')
