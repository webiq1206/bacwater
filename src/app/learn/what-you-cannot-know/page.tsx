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

/**
 * The five things no calculation can check. Each has a stable anchor id so it
 * can be deep-linked from a compound page or the results view, and the same
 * question set is emitted as FAQPage schema so answer engines can extract it.
 */
const SECTIONS = [
  {
    id: "whats-in-your-vial",
    h: "What is actually in your vial",
    takeaway: "The label on a research vial is a claim, not a guarantee.",
    faqA:
      "The label is a claim, not a guarantee. Independent testing in this market has found products that were mislabeled, that held more or less than the label said, or that were contaminated. You cannot tell by looking, and buying from a friendly-looking website does not change that.",
  },
  {
    id: "research-grade",
    h: "What “research-grade” means, legally",
    takeaway: "“Research-grade” is a marketing phrase, not a standard.",
    faqA:
      "Legally, nothing. It is not a standard, a grade, or a claim that anyone checks. It does not promise the powder is what the label says, that it is pure, or that the amount is correct. It is a marketing phrase.",
  },
  {
    id: "ten-times-mistake",
    h: "What a 10-times mistake does",
    takeaway:
      "A milligram and microgram mix-up is a 1,000-times error that still looks small on a syringe.",
    faqA:
      "The most common serious error is mixing up milligrams and micrograms. There are 1,000 micrograms in a milligram, so the wrong unit can make an amount 1,000 times too big or too small. A measurement that is ten or a hundred times off still looks like a small amount of liquid, which is why it slips through.",
  },
  {
    id: "between-two-marks",
    h: "Why “between two marks” is how people get hurt",
    takeaway: "An amount between two syringe marks cannot be measured. Do not guess it.",
    faqA:
      "A U-100 insulin syringe is marked every 1 unit on the small barrels and every 2 units on the 1 mL barrel. If your amount lands between two marks you cannot measure it, so people round or guess. Change how much water you add so the amount lands on a line you can read.",
  },
  {
    id: "human-data",
    h: "Which compounds have real human data, and which do not",
    takeaway: "Many compounds have no published human safety data at all.",
    faqA:
      "They are not all the same. A few are FDA-approved medicines with large human trials. Some have small or early human studies, many have only animal studies, and some have no published safety data in people at all. An amount given to rats cannot be turned into a safe amount for a person.",
  },
];

function Q({ id, h, children }: { id: string; h: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-24">
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
      <FaqJsonLd items={SECTIONS.map((sxn) => ({ q: sxn.h, a: sxn.faqA }))} />
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

      {/* Direct answer, the extractable one-liner for AI overviews. */}
      <AnswerBox className="mt-6" label="The honest answer">
        The calculators here do the math on the numbers you type, and they show
        every step. They cannot check what is really in your vial. That part is
        not math, and no tool on any website can do it for you.
      </AnswerBox>

      {/* Takeaways double as a jump list to each section. */}
      <KeyTakeaways
        className="mt-6"
        title="Five things no calculation can check"
        items={SECTIONS.map((sxn) => (
          <Link
            key={sxn.id}
            href={`#${sxn.id}`}
            className="underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            {sxn.takeaway}
          </Link>
        ))}
      />

      <Q id={SECTIONS[0].id} h={SECTIONS[0].h}>
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

      <Q id={SECTIONS[1].id} h={SECTIONS[1].h}>
        <p>
          Nothing. &ldquo;Research-grade&rdquo; is not a standard, not a grade,
          and not a claim that anyone checks. It does not promise that the powder
          is what the label says, that it is pure, or that the amount is correct.
          It is a marketing phrase.
        </p>
      </Q>

      <Q id={SECTIONS[2].id} h={SECTIONS[2].h}>
        <p>
          The most common serious error in this area is mixing up milligrams and
          micrograms. There are 1,000 micrograms in a milligram, so picking the
          wrong unit can make an amount 1,000 times too big or too small.
        </p>
        <p>
          A measurement that is ten or a hundred times off does not look
          dramatic on a syringe. It is still a small amount of liquid. That is
          exactly why it slips through. Our calculators flag amounts that are far
          outside what the studies on a page used, and amounts that would only
          make sense if the unit were wrong. Read the warning when it appears.
        </p>
      </Q>

      <Q id={SECTIONS[3].id} h={SECTIONS[3].h}>
        <p>
          A U-100 insulin syringe is marked every 1 unit on the small barrels and
          every 2 units on the 1 mL barrel. If your amount lands between two
          marks, say 7.5 units on a barrel marked every 2, you cannot measure it.
          People round, or guess, and a guess is where a small error becomes a
          big one.
        </p>
        <p>
          The fix is not to eyeball it. Change how much water you add so the
          amount lands on a line you can actually read. The calculator tells you
          when it does not, and the reverse calculator finds a water amount that
          lands cleanly.
        </p>
        <Callout variant="tip" className="mt-4">
          <Link href="/tools/reverse-bac" className="font-medium underline underline-offset-4">
            Reverse calculator: get a clean syringe mark
          </Link>
        </Callout>
      </Q>

      <Q id={SECTIONS[4].id} h={SECTIONS[4].h}>
        <p>
          These are not all the same. A few are FDA-approved medicines with large
          human trials behind them. Some have small or early human studies. Many
          have only animal studies. Some have no published safety data in people
          at all, only stories.
        </p>
        <p>
          An amount that was given to rats cannot be turned into a safe amount for
          a person. Where a compound page shows what research looked at, it is
          showing study details, not instructions. When there is no human data,
          the honest answer is that nobody knows.
        </p>
      </Q>

      <AdSlot />

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
