from pathlib import Path
import json
r=Path('.')
p=r/'package.json'; d=json.loads(p.read_text()); d['scripts']['build']='next build --webpack'; p.write_text(json.dumps(d,indent=2)+'\n')
for name in ['.github/workflows/ci.yml','.github/workflows/master-audit.yml']:
 p=r/name; p.write_text(p.read_text().replace('npx next build','npm run build'))
p=r/'src/app/page.tsx'; s=p.read_text()
s=s.replace('Sterile water plus 0.9% benzyl alcohol preservative.','Sterile water with a benzyl alcohol preservative. Check the exact product label; formulations differ.')
s=s.replace('Answer a few short questions about the numbers on your vial and get an exact reconstitution plan with every step shown, syringe units, a PDF, and a printable label.','Enter the vial amount, final liquid volume and amount to measure. Save the resulting calculation, check its formulas, or print a reference label.')
s=s.replace('Already know your numbers? Use a single calculator: how much water to add, how many syringe units, mg to mcg, and more.','Already know your numbers? Check concentration, syringe-volume notation, mg to mcg, and quantities in separate tools.')
s=s.replace('BAC Water Calculator and Mixing Guide','BAC Water Calculators and Measurement Tools').replace('Nothing is guessed','Your inputs, visible formulas')
a=s.index('              Bacteriostatic water is sterile water with 0.9% benzyl alcohol in')
b=s.index('            </p>',a)
s=s[:a]+'''              Bacteriostatic water is sterile water with a benzyl alcohol
              <Term id="preservative"> preservative</Term>. Pfizer's labeling
              includes 0.9% and 1.1% formulations. The exact product label, not
              the name alone, determines its contents and instructions.
              Preservative does not guarantee protection from contamination.
              These tools calculate from entered values; they do not select a
              diluent or confirm that a product is suitable to use.
''' +s[b:]
s=s.replace('            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">','''            <p className="mt-3 text-xs text-muted-foreground">Sources: <a href="https://www.pfizermedical.com/bacteriostatic-water" className="underline">Pfizer product labeling</a> and <a href="https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html" className="underline">CDC injection safety guidance</a>. Checked September 22, 2026.</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">''',1)
s=s.replace('className="eyebrow">Example</div>','className="eyebrow">Illustrative arithmetic, not instructions</div>').replace('className="mt-2 text-xl font-serif font-medium">BPC-157</div>','className="mt-2 text-xl font-serif font-medium">Check a concentration</div>').replace('text-muted-foreground">BAC water</dt>','text-muted-foreground">Final liquid volume</dt>')
s=s.replace('on a 1 mL insulin syringe.', 'on a U-100 scale. The example is not a recommended dilution or dose.')
s=s.replace('''            Every answer shows its work. Concentration is the vial amount divided
            by the water you add. We keep full precision inside and round only
            when we show a number. If an amount lands between the marks on your
            syringe, we tell you, because you cannot measure it. The AI helper
            explains the result in plain words. It never does the math itself.''','''            Concentration is total dissolved mass divided by the final solution
            volume. The amount of water added is not always identical to that
            final volume. The tools show formulas and rounded results, not a
            guarantee of measurement accuracy. Check the scale on your actual
            device and read the <Link href="/methodology" className="underline">calculation methodology</Link>.
            Built-in explanations restate the arithmetic without choosing a dose.''')
p.write_text(s)
p=r/'src/app/layout.tsx';p.write_text(p.read_text().replace('import { ADS_ENABLED } from "@/lib/ads";\n','').replace('The complete BAC water calculator and reconstitution guide.','Free concentration and unit-conversion tools with explicit inputs, formulas and limitations.'))
print('Homepage and build corrections applied.')
