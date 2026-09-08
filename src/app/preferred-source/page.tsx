import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { HowToJsonLd } from "@/components/common/howto-json-ld";
import { AnswerBox } from "@/components/common/answer-box";
import { PreferredSourceButton } from "@/components/common/preferred-source-button";
import {
  PREFERRED_SOURCE_DOMAIN,
  PREFERRED_SOURCE_PUBLICATION,
  preferredSourceDeeplink,
} from "@/lib/preferred-source";

const TITLE = "Make BACwater.ai a Preferred Source on Google";
const DESCRIPTION =
  "Add BACwater.ai as a preferred source in Google Search so our calculators and reconstitution guides show up first in Top Stories, AI Overviews, and AI Mode. Two clicks, no account changes.";

export const metadata: Metadata = {
  alternates: { canonical: "/preferred-source" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/preferred-source",
    type: "website",
    siteName: "BACwater.ai",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const STEPS = [
  {
    name: "Open Google's source preferences tool",
    text: `Select the "Add ${PREFERRED_SOURCE_PUBLICATION} as a preferred source" button on this page, or open google.com/preferences/source and search for ${PREFERRED_SOURCE_DOMAIN}.`,
  },
  {
    name: `Confirm ${PREFERRED_SOURCE_PUBLICATION}`,
    text: `Google shows a short confirmation panel with the publication name. Select Add. You stay signed in to the same Google account you already use; nothing else about it changes.`,
  },
  {
    name: "Return to what you were reading",
    text: "Google sends you straight back to the page you came from. The preference applies to your Google account, so it follows you across devices where you are signed in.",
  },
];

const FAQ = [
  {
    q: "What are preferred sources in Google Search?",
    a: "Preferred sources is a Google Search setting that lets you pick the publications you want to see more of. When a site you have marked as preferred has relevant content, Google is more likely to surface it in Top Stories, AI Overviews, and AI Mode, labeled with a preferred badge. You choose the sources; Google does not sell the slot.",
  },
  {
    q: `Does adding ${PREFERRED_SOURCE_PUBLICATION} cost anything or create an account?`,
    a: `No. It is a free setting on the Google account you are already signed in to. It creates no account with ${PREFERRED_SOURCE_PUBLICATION}, sends us no personal information, and does not subscribe you to anything.`,
  },
  {
    q: "Can I remove a preferred source later?",
    a: "Yes. Open google.com/preferences/source at any time and remove any source from your list. The change takes effect immediately, and you can add it back later.",
  },
  {
    q: "Does this change my search results for everything?",
    a: "No. The preference only nudges which sources Google favors when several publications cover the same thing. It does not filter out other sites, and it does not change results for queries where your preferred sources have nothing relevant.",
  },
  {
    q: `Why is the entry ${PREFERRED_SOURCE_DOMAIN} rather than a specific page?`,
    a: `Google's source preferences work at the domain and subdomain level only, so ${PREFERRED_SOURCE_DOMAIN} is the entry you add. A subdirectory such as ${PREFERRED_SOURCE_DOMAIN}/learn cannot be added on its own, and adding the domain covers every calculator and guide on the site.`,
  },
  {
    q: "The button did not appear. What now?",
    a: `Google's button is loaded from news.google.com, so a content blocker or strict tracking protection can stop it from rendering. The plain link on this page goes to the same place and needs no scripts: ${preferredSourceDeeplink()}.`,
  },
];

export default function PreferredSourcePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name={TITLE}
        description={DESCRIPTION}
        url="/preferred-source"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Preferred source on Google", url: "/preferred-source" },
        ]}
      />
      <HowToJsonLd
        name={`How to add ${PREFERRED_SOURCE_PUBLICATION} as a preferred source on Google`}
        description={`The three steps to mark ${PREFERRED_SOURCE_DOMAIN} as a preferred source in Google Search.`}
        steps={STEPS}
        totalTime="PT1M"
      />
      <FaqJsonLd items={FAQ} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Preferred source on Google", href: "/preferred-source" },
        ]}
      />

      <div className="eyebrow">Google Search</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        Make BACwater.ai a preferred source on Google
      </h1>

      <AnswerBox className="mt-6">
        Preferred sources is a free Google Search setting that lets you choose
        the publications you want to see more of. Adding{" "}
        <strong>{PREFERRED_SOURCE_DOMAIN}</strong> takes two clicks and makes
        our reconstitution calculators and guides more likely to appear in Top
        Stories, AI Overviews, and AI Mode when they are relevant. It is free,
        it changes nothing else about your Google account, and you can undo it
        at any time.
      </AnswerBox>

      <div className="section-dark mt-8 rounded-2xl p-6 sm:p-8">
        <div className="font-medium">Add us in two clicks</div>
        <p className="mt-1 text-sm text-muted-foreground">
          Google handles the whole flow and returns you to this page when you
          are done.
        </p>
        <PreferredSourceButton className="mt-4" theme="dark" />
      </div>

      <div className="mt-12 space-y-10 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            What does &ldquo;preferred source&rdquo; actually do?
          </h2>
          <p className="mt-3">
            Google Search lets every signed-in user nominate the publications
            they trust. When one of those publications has covered what you are
            searching for, Google is more likely to show it, and marks it with a
            preferred badge so you can see why it is there. The setting applies
            to Top Stories and, in the locales where those features run, to AI
            Overviews and AI Mode.
          </p>
          <p className="mt-3">
            It is a reader preference, not an advertising placement. Nobody can
            buy the slot, and marking a source does not hide anyone else: it
            only changes which of several sources covering the same ground
            Google leans toward for you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            How to add BACwater.ai as a preferred source
          </h2>
          <ol className="mt-3 space-y-4">
            {STEPS.map((step, i) => (
              <li key={step.name} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium"
                >
                  {i + 1}
                </span>
                <div>
                  <div className="font-medium">{step.name}</div>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-muted-foreground">
            Prefer a plain link? This one goes to the same place and works
            without JavaScript:{" "}
            <a
              href={preferredSourceDeeplink()}
              target="_blank"
              rel="noopener"
              className="underline hover:text-foreground"
            >
              open Google&apos;s source preferences for {PREFERRED_SOURCE_DOMAIN}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            Why we are asking
          </h2>
          <p className="mt-3">
            BACwater.ai publishes one narrow thing: deterministic reconstitution
            math and the reference material around it. Every number on the site
            comes from a tested formula, never from a language model, and every
            calculator page shows the formula so you can check our work. Search
            results and AI answers on this topic are crowded with vendor copy
            that has a product to move; we sell nothing and recommend no vendor,
            which is exactly the sort of distinction a ranking algorithm cannot
            see but a reader can.
          </p>
          <p className="mt-3">
            Marking us as a preferred source is how you tell Google that
            distinction matters to you. Our{" "}
            <Link
              href="/editorial-policy"
              className="underline hover:text-foreground"
            >
              editorial and sourcing policy
            </Link>{" "}
            sets out how the content is researched, checked, and kept current,
            and our{" "}
            <Link href="/disclaimer" className="underline hover:text-foreground">
              disclaimer
            </Link>{" "}
            is plain about what this site is not.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            Common questions
          </h2>
          <dl className="mt-3 space-y-6">
            {FAQ.map((item) => (
              <div key={item.q}>
                <dt className="font-medium">{item.q}</dt>
                <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            Where to go next
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/peptide-calculator"
                className="underline hover:text-foreground"
              >
                Peptide calculator
              </Link>{" "}
              &mdash; the all-in-one reconstitution calculator, every step shown.
            </li>
            <li>
              <Link href="/learn" className="underline hover:text-foreground">
                Learning Center
              </Link>{" "}
              &mdash; the guides and comparisons we keep current.
            </li>
            <li>
              <Link href="/about" className="underline hover:text-foreground">
                About BACwater.ai
              </Link>{" "}
              &mdash; who publishes this and why.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
