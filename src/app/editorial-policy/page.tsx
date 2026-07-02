import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
  alternates: { canonical: "/editorial-policy" },
  title: "Editorial & Sourcing Policy",
  description:
    "How BACwater.ai researches, fact-checks, and maintains its reconstitution guides and calculators. Company-level accountability, verified formulas, quarterly review.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Editorial & Sourcing Policy"
        description="How BACwater.ai researches, fact-checks, and maintains its reconstitution guides and calculators."
        url="/editorial-policy"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Editorial & Sourcing Policy", url: "/editorial-policy" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Editorial & Sourcing Policy", href: "/editorial-policy" },
        ]}
      />
      <div className="eyebrow">Trust</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        Editorial and sourcing policy
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        Everything we publish is accountable at the company level. We do not use
        individual author or reviewer bylines. Instead, BACwater.ai stands
        behind every guide, calculator, and dosage reference as an organization,
        and this page explains exactly how that content is researched, checked,
        and kept current.
      </p>

      <div className="mt-10 space-y-10 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            How we research
          </h2>
          <p className="mt-3">
            Our reconstitution content draws on manufacturer product
            documentation, published pharmacology and stability references, and
            established clinical-pharmacy practice for handling sterile
            multi-dose vials. When sources disagree, we describe the range
            rather than presenting a single number as settled fact, and we say
            plainly when a value is a typical reference rather than a rule.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            How our calculators work
          </h2>
          <p className="mt-3">
            The math behind our calculators is deterministic. The same inputs
            always produce the same outputs, using transparent formulas that are
            backed by automated tests. We do not use AI to generate dosing
            numbers. Every result page shows the underlying formula so you can
            verify our work, and the calculator flags input combinations that
            would produce an implausible or hard-to-measure result instead of
            silently returning a number.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            How we fact-check
          </h2>
          <p className="mt-3">
            Before publishing, every dosage table and reconstitution step is
            checked against the commercial vial strengths actually sold for that
            peptide and against the calculator&apos;s own tested output. Numeric
            claims are presented in tables so they are easy to audit. If a claim
            cannot be verified, it does not go on the page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            How we keep content current
          </h2>
          <p className="mt-3">
            Dosing norms, product availability, and the comparison landscape in
            this category change quickly. We audit our content at least
            quarterly to re-verify dosage tables against current product
            offerings, confirm that comparison and buying-guide claims are still
            accurate, and update the last-updated date on each page only when
            the content genuinely changes, never as a cosmetic bump.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            Our limits
          </h2>
          <p className="mt-3">
            BACwater.ai is a calculation and education tool, not a medical
            service. Our content is not created or reviewed by a licensed
            physician and is not a substitute for professional medical judgment.
            Everything on the site is for research and informational purposes
            only. See our{" "}
            <Link href="/disclaimer" className="underline hover:text-foreground">
              full disclaimer
            </Link>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            Found an error?
          </h2>
          <p className="mt-3">
            If you spot something inaccurate or out of date, please{" "}
            <Link href="/contact" className="underline hover:text-foreground">
              contact us
            </Link>
            . We take corrections seriously and will review and fix verified
            errors promptly.
          </p>
        </section>

        <div className="mt-8 pt-6 border-t border-border">
          <Link
            href="/"
            className="text-sm font-medium text-foreground hover:underline"
          >
            &larr; Back to BACwater.ai
          </Link>
        </div>
      </div>
    </div>
  );
}
