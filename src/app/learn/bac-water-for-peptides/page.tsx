import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ArticleJsonLd } from "@/components/common/article-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { AnswerBox } from "@/components/common/answer-box";
import { KeyTakeaways } from "@/components/common/key-takeaways";
import { Callout } from "@/components/common/callout";
import { AdSlot } from "@/components/common/ad-slot";
import { Button } from "@/components/ui/button";
import { Term } from "@/components/common/term";

const TITLE = "BAC Water for Peptides: What It Is and How Much to Use";
const DESCRIPTION =
  "Bacteriostatic water is the standard solution for reconstituting peptides. What it is, why it is used instead of sterile water or saline, how much to add, and how to store the mixed vial.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/learn/bac-water-for-peptides" },
  openGraph: {
    title: `${TITLE} · BACwater.ai`,
    description: DESCRIPTION,
    url: "/learn/bac-water-for-peptides",
    type: "article",
    siteName: "BACwater.ai",
  },
};

const FAQS = [
  {
    q: "Is bacteriostatic water good for peptides?",
    a: "Yes. Bacteriostatic water is the standard reconstitution solution for peptides. Its benzyl alcohol preservative holds bacteria back, so a reconstituted vial stays usable for weeks of repeated draws rather than a single use, which suits how peptides are measured out over time.",
  },
  {
    q: "Can you use sterile water or saline instead of bacteriostatic water for peptides?",
    a: "You can dissolve a peptide in sterile water or saline, but neither has a preservative, so the mixed vial is single-use and should not be stored and re-entered. Bacteriostatic water is preferred for multi-dose vials because the preservative lets you draw from it repeatedly. Never use tap or bottled water.",
  },
  {
    q: "How much bacteriostatic water do you use for a peptide?",
    a: "Enough that your measurement lands on a clean mark on the syringe. There is no fixed amount, it depends on the vial strength and how much you want to measure. A common starting point is 2 mL for a 5 mg vial, which makes 2.5 mg/mL. Use a calculator to get the exact amount for your vial.",
  },
  {
    q: "What is a reconstitution solution?",
    a: "A reconstitution solution is the sterile liquid you add to a dried (lyophilized) powder to dissolve it into a measurable form. For peptides, that solution is almost always bacteriostatic water; the preservative is what makes a multi-dose vial practical.",
  },
  {
    q: "Is bacteriostatic water the same as water for injection?",
    a: "No. Sterile water for injection has no preservative and is intended for single use. Bacteriostatic water is the same sterile water with 0.9% benzyl alcohol added, which lets a vial be entered more than once. It is not safe for newborns.",
  },
];

export default function BacWaterForPeptidesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-16 pb-24">
      <WebPageJsonLd name={TITLE} description={DESCRIPTION} url="/learn/bac-water-for-peptides" />
      <ArticleJsonLd
        title={TITLE}
        body={DESCRIPTION}
        url="/learn/bac-water-for-peptides"
        createdAt={new Date("2026-07-16")}
        updatedAt={new Date("2026-07-16")}
      />
      <FaqJsonLd items={FAQS} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learning Center", href: "/learn" },
          { label: "BAC water for peptides", href: "/learn/bac-water-for-peptides" },
        ]}
      />

      <div className="eyebrow mt-6">The basics</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        BAC water for peptides
      </h1>

      <AnswerBox className="mt-6">
        <strong>Bacteriostatic water is the standard solution for reconstituting
        peptides.</strong> It is sterile water with 0.9% benzyl alcohol, a{" "}
        <Term id="preservative">preservative</Term> that lets you draw from the
        same vial for weeks. You add it to the dried peptide powder to turn it
        into a liquid you can measure on a syringe.
      </AnswerBox>

      <KeyTakeaways
        className="mt-6"
        title="The essentials"
        items={[
          "BAC water is sterile water plus 0.9% benzyl alcohol, a preservative.",
          "The preservative is why a mixed vial lasts weeks of repeated draws, not one use.",
          "Sterile water and saline work but are single-use; never use tap or bottled water.",
          "How much to add depends on your vial strength and the amount you measure.",
        ]}
      />

      <section className="mt-12">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Why bacteriostatic water is used for peptides
        </h2>
        <div className="mt-4 space-y-3 text-foreground/90 leading-relaxed">
          <p>
            Peptides arrive as a dried, <Term id="lyophilized">lyophilized</Term>{" "}
            powder. Before you can measure any amount, the powder has to be
            dissolved in a liquid, a step called{" "}
            <Term id="reconstitute">reconstitution</Term>. The liquid you add is
            the <Term id="diluent">diluent</Term>, and for peptides that diluent
            is almost always bacteriostatic water.
          </p>
          <p>
            What sets it apart is the benzyl alcohol. It slows bacterial growth,
            so a mixed vial can be entered again and again over several weeks
            instead of being thrown out after one use. Because peptide amounts are
            typically measured out over many draws, that multi-dose practicality
            is exactly what you want.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          What not to use
        </h2>
        <div className="mt-4 space-y-3 text-foreground/90 leading-relaxed">
          <p>
            Plain <strong>sterile water for injection</strong> and{" "}
            <strong>saline</strong> can dissolve a peptide, but neither contains a
            preservative, so the vial is single-use and should not be stored and
            re-entered. Bacteriostatic water is preferred precisely because it can
            be. <strong>Tap water and bottled water are never appropriate</strong>,
            they are not sterile.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/learn/vs/sterile-water" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">BAC water vs sterile water</Link>
          <Link href="/learn/vs/saline" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">BAC water vs saline</Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          How much bacteriostatic water to add
        </h2>
        <div className="mt-4 space-y-3 text-foreground/90 leading-relaxed">
          <p>
            There is no single right amount. The water sets the{" "}
            <Term id="concentration">concentration</Term>: more water makes a
            weaker solution you measure more of, less water makes a stronger one
            you measure less of. The goal is an amount that lands your measurement
            on a clean, readable mark on the syringe. A common starting point is
            2 mL for a 5 mg vial, which makes 2.5 mg/mL.
          </p>
        </div>
        <Callout variant="tip" className="mt-4">
          <Link href="/peptide-calculator" className="font-medium underline underline-offset-4">
            Use the peptide calculator
          </Link>{" "}
          to get the exact bac water amount and syringe units for your vial.
        </Callout>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Storing the mixed vial
        </h2>
        <div className="mt-4 space-y-3 text-foreground/90 leading-relaxed">
          <p>
            Once mixed, most peptides are kept refrigerated and out of light, and
            an opened multi-dose vial is commonly dated and discarded within a few
            weeks. How long a specific peptide lasts depends on the compound, so
            follow the instructions that came with your product rather than a
            general figure.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/learn/bac-water-shelf-life" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">Shelf life and storage</Link>
          <Link href="/faq" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">BAC water FAQ</Link>
        </div>
      </section>

      <Callout variant="warning" className="mt-10" title="What no calculation can verify">
        The math on this site is exact for the numbers you type. It cannot tell
        you what is actually in your vial, its identity, purity, or strength.{" "}
        <Link href="/learn/what-you-cannot-know" className="font-medium underline underline-offset-4">
          Read the honest part.
        </Link>
      </Callout>

      <section className="mt-12">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          BAC water for peptides FAQ
        </h2>
        <div className="mt-4 space-y-6">
          {FAQS.map((f, i) => (
            <div key={i}>
              <h3 className="font-medium text-foreground">{f.q}</h3>
              <p className="mt-1.5 text-foreground/90 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <AdSlot />

      <div className="mt-12 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="text-xl font-serif tracking-tight">Ready to mix?</h2>
        <p className="mt-3 text-foreground/90 leading-relaxed">
          The peptide calculator turns your vial amount and the amount you want to
          measure into the exact bac water to add, the concentration, and your
          syringe units, with every step shown.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="brand">
            <Link href="/peptide-calculator">Open the calculator <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/learn">More guides</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
