import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
  alternates: { canonical: "/about" },
  title: "About Us",
  description:
    "BACwater.ai is an unmonetized BAC water and reconstitution calculator. Exact math on the numbers you enter, plain-English explanations, and every value labeled by source. Nothing is for sale.",
  openGraph: {
    title: "About Us",
    description:
      "BACwater.ai is an unmonetized BAC water and reconstitution calculator. Exact math on the numbers you enter, plain-English explanations, and every value labeled by source. Nothing is for sale.",
    url: "/about",
    type: "website",
    siteName: "BACwater.ai",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="About BACwater.ai"
        description="BACwater.ai is an unmonetized BAC water and reconstitution calculator. Exact math on the numbers you enter, plain-English explanations, and every value labeled by source. Nothing is for sale."
        url="/about"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />
      <div className="eyebrow">About</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        A calmer way to reconstitute
      </h1>
      <div className="mt-6 space-y-5 text-lg text-foreground/90 leading-relaxed">
        <p>
          We built BACwater.ai because every other reconstitution calculator felt
          like homework: cluttered with ads, filled with jargon, or locked
          behind signup walls.
        </p>
        <p>
          Our approach is different. Every calculation shows exactly how the
          answer was reached, in plain English. Every result can be saved,
          printed, or shared with a single link. And every tool is designed for
          people who are doing this for the very first time.
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-serif font-medium tracking-tight">Our math</h2>
      <div className="mt-3 space-y-4 text-foreground/90 leading-relaxed">
        <p>
          Our reconstitution math is deterministic. The same inputs always produce
          the same outputs. We use transparent, verified formulas backed by
          automated tests, not AI-generated guesses. Every result page shows the
          formula so you can check our work.
        </p>
        <p>
          We chose this approach because accuracy matters when you are calculating
          doses. Rounding errors in micrograms can produce real consequences, so
          we never truncate, never approximate, and always show you the exact
          numbers.
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-serif font-medium tracking-tight">Our tools</h2>
      <div className="mt-3 space-y-4 text-foreground/90 leading-relaxed">
        <p>
          The <Link href="/plan" className="font-medium underline">Plan Builder</Link> is
          our flagship tool. Tell it what peptide you have, what dose you need, and
          which syringe you are using. It calculates how much BAC water to add, how
          many syringe units to draw, how many doses you will get per vial, and when
          your reconstituted vial expires. Save it, download a PDF, or print a vial
          label with a QR code.
        </p>
        <p>
          We also offer standalone <Link href="/tools" className="font-medium underline">calculators</Link> for
          quick, one-off questions: BAC water amount, dose conversion, syringe
          unit conversion, mg/mcg conversion, and supply planning.
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-serif font-medium tracking-tight">What we do not do</h2>
      <div className="mt-3 space-y-4 text-foreground/90 leading-relaxed">
        <p>
          We don&apos;t sell peptides or supplies, and we recommend no vendor.
          When your plan works out that you need three of something, we show you
          the count so you can source it yourself. We do not select compounds,
          recommend quantities, or provide dosing guidance.
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-serif font-medium tracking-tight">Important notice</h2>
      <div className="mt-3 space-y-4 text-foreground/90 leading-relaxed">
        <p>
          This is a calculation and reference tool for research and educational
          use only. We do <b>not</b> provide medical advice, and we do not
          diagnose, prescribe, or recommend treatment.
        </p>
      </div>

      <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
        <p>
          Have questions?{" "}
          <Link href="/contact" className="font-medium text-foreground underline">Get in touch</Link> or
          check our{" "}
          <Link href="/faq" className="font-medium text-foreground underline">FAQ</Link>.
          Want to learn the basics first? Start with our{" "}
          <Link href="/learn" className="font-medium text-foreground underline">learning center</Link>.
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Button asChild variant="brand"><Link href="/plan">Build a plan</Link></Button>
        <Button asChild variant="outline"><Link href="/tools">Open calculators</Link></Button>
      </div>
    </div>
  );
}
