from pathlib import Path
import re
r=Path('.')
def edit(p, old, new):
    q=r/p;s=q.read_text()
    if old in s:q.write_text(s.replace(old,new))
    elif new not in s:raise RuntimeError('Source did not match: '+p+' '+old[:60])
def put(p,content):
    q=r/p;q.parent.mkdir(parents=True,exist_ok=True);q.write_text(content)

edit('scripts/audit-publication-browser.mjs','passwordHash: await bcrypt.hash','hashedPassword: await bcrypt.hash')
p=r/'scripts/audit-publication-browser.mjs';s=p.read_text()
s=s.replace("    assert.ok((await reader.locator('meta[name=\"robots\"]').allTextContents()).length >= 0);\n",'')
s=s.replace("    assert.equal(body.includes(path), included,", "    const exactPath = path.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');\n    const appears = new RegExp(exactPath + '(?=[<\\\"\\\\s)#?])').test(body);\n    assert.equal(appears, included,")
s=s.replace("await discovery(false, `/learn/${old}` + '\"');", "await discovery(false, `/learn/${old}`);")
p.write_text(s)

p=r/'src/lib/content/publication-store.ts';s=p.read_text()
s=s.replace('    const canonicalPath = c.canonicalPath && c.canonicalPath !== self ? c.canonicalPath : null;', '    const proposedCanonical = c.canonicalPath === undefined ? old?.canonicalPath : c.canonicalPath;\n    const canonicalPath = proposedCanonical && proposedCanonical !== self ? proposedCanonical : null;\n    const noindex = c.noindex ?? old?.noindex ?? false;')
s=s.replace('|| c.noindex || c.kind === "faq"', '|| noindex || c.kind === "faq"').replace('|| c.noindex || canonicalPath', '|| noindex || canonicalPath')
s=s.replace('seoTitle: c.seoTitle || null, metaDescription: c.metaDescription || null, noindex: c.noindex ?? old?.noindex ?? false, canonicalPath', 'seoTitle: c.seoTitle === undefined ? old?.seoTitle ?? null : c.seoTitle || null, metaDescription: c.metaDescription === undefined ? old?.metaDescription ?? null : c.metaDescription || null, noindex, canonicalPath')
p.write_text(s)

p=r/'src/components/common/webpage-json-ld.tsx';s=p.read_text()
s=s.replace('  if (reviewed) {\n    jsonLd.reviewedBy = orgRef;\n    jsonLd.lastReviewed = LAST_REVIEWED_ISO;\n    jsonLd.dateModified = LAST_REVIEWED_ISO;\n  }','  // A caller flag is not evidence of a completed clinical or editorial review.\n  void reviewed;')
p.write_text(s)
p=r/'src/app/learn/[slug]/page.tsx';s=p.read_text()
s=s.replace('import { HowToJsonLd } from "@/components/common/howto-json-ld";\n','').replace('import { HOWTO_SCHEMAS } from "@/lib/learn/howto-schema";\n','').replace('  const howtoSchema = HOWTO_SCHEMAS[slug];\n','')
s=re.sub(r'\n      \{howtoSchema && \([\s\S]*?\n      \)\}', '', s)
s=s.replace('<ArticleJsonLd title={guide.title} body={guide.body} slug={guide.slug} createdAt={guide.createdAt} updatedAt={guide.updatedAt} citations={refs} />', '{!guide.canonicalPath && guide.kind !== "faq" && <ArticleJsonLd title={guide.title} body={guide.body} slug={guide.slug} createdAt={guide.createdAt} updatedAt={guide.updatedAt} citations={refs} />}')
p.write_text(s)

p=r/'src/app/peptide-calculator/page.tsx';s=p.read_text()
s=s.replace('Free peptide calculator. Enter your vial amount and how much you want to measure to get the exact bacteriostatic water to add, the concentration, and how many syringe units that is. Every step shown. For research use.', 'Free peptide calculator for concentration, mL and U-100 units. Enter your label values and final liquid volume. Save a plan or print a vial label.')
s=s.replace("A peptide calculator does the reconstitution math. It turns your vial's amount and the amount you want to measure into how much bacteriostatic water to add, the concentration that makes, and how many units to draw on an insulin syringe. It calculates from your numbers, it does not recommend how much to use.", 'A peptide calculator converts the labeled amount and final liquid volume into concentration. Enter the amount to measure from instructions you already have to find its mL and syringe-unit equivalent. It does not select a diluent, dose or treatment.')
s=s.replace('Enough that your measurement lands on a clean, easy-to-read mark. The calculator suggests an amount that puts a typical measurement near 10 units on a 1 mL insulin syringe, and you can change it to any amount you prefer.', 'Vial strength alone cannot answer that question. Use the volume and diluent in the exact product instructions. An arithmetic comparison can show how concentration changes, but it does not establish compatibility, vial capacity or a safe preparation.')
s=s.replace('Free peptide reconstitution calculator: enter your vial amount and the amount to measure to get the exact bacteriostatic water to add, the concentration, syringe units, and measurements per vial.', 'Free concentration and measurement calculator using your stated vial amount, final volume and amount to measure. Includes printable labels and optional saved plans.')
s=s.replace('''          A peptide calculator turns the numbers on your vial into a mixing plan:
          how much bacteriostatic water to add, the concentration that makes, how
          many units to measure on your syringe, and how many measurements the
          vial gives. Enter your numbers below to see all of it, with the math.''', '''          A peptide calculator divides the labeled amount by the final liquid
          volume to find concentration, then converts your entered measurement
          into mL and syringe units. Use values from the product instructions.
          No account is needed to calculate; saving a plan is optional.''')
s=s.replace('The vial amount divided by the amount per measurement, so you know how long a vial lasts.', 'The vial amount divided by the amount per measurement. This is a quantity estimate, not a safe storage period.')
s=s.replace('Concentration equals the vial amount divided by the bacteriostatic water you add.', 'Concentration equals the vial amount divided by the final liquid volume.').replace('Vial amount divided by the bacteriostatic water you add. A 5 mg vial with 2 mL of water is 2.5 mg/mL.', 'Vial amount divided by final liquid volume. An illustrative 5 mg in a final 2 mL is 2.5 mg/mL.')
p.write_text(s)
metadata={
 'src/app/tools/bac-water/page.tsx':('BAC Water Calculator: Volume and Concentration','Compare BAC water volume and concentration using the values you enter. Check the arithmetic and follow the exact product instructions, not a suggested dose.'),
 'src/app/tools/syringe-units/page.tsx':('Syringe Units to mL Converter: U-100 and U-40','Convert syringe units to mL and back using your actual syringe scale. U-100 means 100 units per mL; this tool does not convert units directly into milligrams.'),
 'src/app/tools/mg-to-mcg/page.tsx':('mg to mcg Converter: Milligrams and Micrograms','Convert milligrams to micrograms and back. Multiply mg by 1,000 or divide mcg by 1,000. Check label units without estimating a dose or choosing a treatment.'),
}
for name,(title,description) in metadata.items():
 p=r/name;s=p.read_text();s=re.sub(r"const TITLE = '[^']*';",'const TITLE = '+repr(title)+';',s);s=re.sub(r"const DESCRIPTION = '[^']*';",'const DESCRIPTION = '+repr(description)+';',s);p.write_text(s)
p=r/'src/app/page.tsx';s=p.read_text().replace('  alternates: { canonical: "/" },','  title: "BACwater.ai: Free Calculators, Saved Plans and Vial Labels",\n  description: "Check concentration, syringe units and unit conversions. Use the free calculators, save your entered values, and print labels. No product sales or dose recommendations.",\n  alternates: { canonical: "/" },',1)
s=s.replace('It depends on how strong you want the liquid. Use the calculator instead of guessing.', 'Follow the exact product instructions. Vial strength alone does not determine a suitable mixing volume.')
p.write_text(s)
edit('src/components/plan/batch-label-sheet.tsx', '''          vial needs and when it was mixed — expiry fills in from that plan&apos;s
          own shelf life. Print at 100% scale and cut along the outlines.''', '''          vial needs and when it was mixed. Storage and discard instructions
          come from the exact product, not this calculation. Print at 100% scale
          and cut along the outlines.''')

put('src/app/editorial-policy/page.tsx','''import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
const description = "How BACwater.ai calculates concentration and syringe units, handles sources and corrections, and separates arithmetic from medical advice.";
export const metadata = { title: "Calculation Methodology and Editorial Policy", description, alternates: { canonical: "/editorial-policy" }, openGraph: { title: "Calculation Methodology and Editorial Policy", description, url: "/editorial-policy", type: "website" } };
export default function EditorialPolicyPage() {
  return <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-12 pb-24">
    <WebPageJsonLd name="Calculation methodology and editorial policy" description={description} url="/editorial-policy" />
    <Breadcrumbs items={[{label:"Home",href:"/"},{label:"Editorial policy",href:"/editorial-policy"}]} />
    <div className="eyebrow">Method and limitations</div><h1 className="mt-2 text-4xl font-serif">Calculation methodology and editorial policy</h1>
    <p className="mt-5 text-lg leading-relaxed">BACwater.ai is a free calculation and reference website. The calculator works from values you enter. Publisher attribution is not a claim that a clinician has reviewed an article or approved a result.</p>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">The arithmetic</h2>
      <p>Concentration in mg/mL equals the total amount in mg divided by the final liquid volume in mL. A measurement in mL equals the entered amount in mg divided by that concentration. One mg equals 1,000 mcg.</p>
      <p>On a U-100 scale, multiply mL by 100 to obtain syringe units. On a U-40 scale, multiply by 40. Syringe capacity and syringe calibration are different: a smaller U-100 syringe still uses the U-100 ratio.</p>
      <p>For an arithmetic example, 10 mg in a final 2 mL is 5 mg/mL. An entered 0.4 mg measurement corresponds to 0.08 mL, or 8 U-100 units. These numbers demonstrate a conversion. They are not a mixing or dosing recommendation.</p>
    </section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">Inputs, rounding and warnings</h2>
      <p>The result assumes the stated amount is present and fully dissolved in the stated final volume. The website cannot inspect the vial or verify its contents. Enter the correct mass unit and use the scale printed on the actual measuring device.</p>
      <p>Calculations retain numeric precision before display formatting. A displayed rounded syringe mark is an approximation, not permission to change an instruction. Warnings flag invalid inputs, capacity problems or measurements that may be difficult to read.</p>
      <p>Automated fixtures test arithmetic and application behavior. A passing software test does not establish sterility, product quality, chemical compatibility or clinical suitability.</p>
    </section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">What the tool does not decide</h2>
      <p>The calculator does not choose a dose, treatment frequency, diluent or route of administration. It does not calculate a safe storage period. Dates in a saved plan are recordkeeping, not proof that a product remains usable.</p>
      <p>Use instructions for the exact formulation and ask the dispensing pharmacist or prescriber about medication-specific questions. Read <Link href="/learn/what-you-cannot-know" className="underline">what no calculation can verify</Link> and our <Link href="/disclaimer" className="underline">full disclaimer</Link>.</p>
    </section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">Sources and corrections</h2>
      <p>Consequential factual claims should link to applicable primary sources and identify their limits. A manufacturer label for one product is not a storage rule for every mixture. Research discussion does not establish an approved use.</p>
      <p>A content timestamp records an edit. It is not a medical review date. Corrections, changed product documentation and changes to the calculation code trigger renewed review. We do not claim that every article has received a completed clinical review.</p>
      <p>Report a problem through <Link href="/contact" className="underline">support</Link>. Include the public page, units, expected result and actual result. Leave out personal health information, account tokens and private share links.</p>
    </section>
    <section className="mt-9 space-y-3"><h2 className="text-2xl font-serif">Use the right tool</h2><p><Link href="/peptide-calculator" className="underline">Full concentration calculator</Link>, <Link href="/tools/syringe-units" className="underline">syringe units to mL</Link>, <Link href="/tools/mg-to-mcg" className="underline">mg to mcg</Link>, and <Link href="/tools/vial-labels" className="underline">vial labels</Link> are available without a purchase. Saved plans and public share links have separate <Link href="/privacy" className="underline">privacy considerations</Link>.</p></section>
  </div>;
}
''')

# Remove prohibited punctuation in display strings, preserving valid CSS and CLI syntax.
for p in (r/'src').rglob('*'):
 if p.suffix in {'.ts','.tsx'}:
  s=p.read_text();s=s.replace(' — ', ': ').replace('"—"','"Not set"').replace('&mdash;', ': ').replace('&#8212;', ': ')
  p.write_text(s)
print('Editorial, metadata, schema and lifecycle follow-up changes applied.')
