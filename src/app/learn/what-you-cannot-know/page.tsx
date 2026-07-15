import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ArticleJsonLd } from "@/components/common/article-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Button } from "@/components/ui/button";

const TITLE = "What you cannot know about your vial";
const DESCRIPTION =
  "The math on this site is exact for the numbers you type. It cannot tell you what is actually in the powder. Here is what no calculation can verify.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/learn/what-you-cannot-know" },
  openGraph: {
    title: `${TITLE} · BACwater.ai`,
    description: DESCRIPTION,
    url: "/learn/what-you-cannot-know",
    type: "article",
    siteName: "BACwater.ai",
  },
};

function Q({ h, children }: { h: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
        {h}
      </h2>
      <div className="mt-4 space-y-3 text-foreground/90 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function WhatYouCannotKnowPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-16 pb-24">
      <WebPageJsonLd name={TITLE} description={DESCRIPTION} url="/learn/what-you-cannot-know" />
      <ArticleJsonLd
        title={TITLE}
        body={DESCRIPTION}
        url="/learn/what-you-cannot-know"
        createdAt={new Date("2026-07-15")}
        updatedAt={new Date("2026-07-15")}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learning Center", href: "/learn" },
          { label: "What you cannot know", href: "/learn/what-you-cannot-know" },
        ]}
      />

      <div className="eyebrow mt-6">The honest part</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        {TITLE}
      </h1>

      {/* Direct answer block */}
      <div className="mt-6 rounded-2xl border border-warning/40 bg-warning/5 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "var(--color-warning)" }} />
          <p className="text-[15px] leading-relaxed text-foreground/90">
            The calculators here do the math on the numbers you type, and they
            show every step. They cannot check what is really in your vial. That
            part is not math, and no tool on any website can do it for you.
          </p>
        </div>
      </div>

      <Q h="What is actually in your vial">
        <p>
          A research powder comes with a label. The label is a claim, not a
          guarantee. Independent testing in this market has found products that
          were mislabeled, that held more or less than the label said, or that
          were contaminated with other substances.
        </p>
        <p>
          You cannot tell any of this by looking. A vial of white powder looks
          the same whether it is what the label says or something else entirely.
          Buying from a friendly-looking website does not change that.
        </p>
      </Q>

      <Q h="What &ldquo;research-grade&rdquo; means, legally">
        <p>
          Nothing. &ldquo;Research-grade&rdquo; is not a standard, not a grade,
          and not a claim that anyone checks. It does not promise that the powder
          is what the label says, that it is pure, or that the amount is correct.
          It is a marketing phrase.
        </p>
      </Q>

      <Q h="What a 10-times mistake does">
        <p>
          The most common serious error in this area is mixing up milligrams and
          micrograms. There are 1,000 micrograms in a milligram, so picking the
          wrong unit can make an amount 1,000 times too big or too small.
        </p>
        <p>
          A measurement that is ten or a hundred times off does not look
          dramatic on a syringe &mdash; it is still a small amount of liquid.
          That is exactly why it slips through. Our calculators flag amounts that
          are far outside what the studies on a page used, and amounts that would
          only make sense if the unit were wrong. Read the warning when it
          appears.
        </p>
      </Q>

      <Q h="Why &ldquo;between two marks&rdquo; is how people get hurt">
        <p>
          A U-100 insulin syringe is marked every 1 unit on the small barrels and
          every 2 units on the 1 mL barrel. If your amount lands between two
          marks &mdash; say 7.5 units on a barrel marked every 2 &mdash; you
          cannot measure it. People round, or guess, and a guess is where a small
          error becomes a big one.
        </p>
        <p>
          The fix is not to eyeball it. Change how much water you add so the
          amount lands on a line you can actually read. The calculator tells you
          when it does not, and the reverse calculator finds a water amount that
          lands cleanly.
        </p>
        <p>
          <Link href="/tools/reverse-bac" className="font-medium underline underline-offset-4">
            Reverse calculator: get a clean syringe mark
          </Link>
        </p>
      </Q>

      <Q h="Which compounds have real human data, and which do not">
        <p>
          These are not all the same. A few are FDA-approved medicines with large
          human trials behind them. Some have small or early human studies. Many
          have only animal studies. Some have no published safety data in people
          at all &mdash; only stories.
        </p>
        <p>
          An amount that was given to rats cannot be turned into a safe amount for
          a person. Where a compound page shows what research looked at, it is
          showing study details, not instructions. When there is no human data,
          the honest answer is that nobody knows.
        </p>
      </Q>

      <div className="mt-12 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="text-xl font-serif tracking-tight">The one thing to take away</h2>
        <p className="mt-3 text-foreground/90 leading-relaxed">
          This site can tell you exactly how to turn the numbers on your vial into
          a concentration and a syringe measurement. It cannot tell you that the
          numbers on your vial are true, or that the compound is safe or right for
          anyone. Those are different questions, and they are not arithmetic.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="brand">
            <Link href="/plan">Build a plan</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/learn">
              More guides <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
