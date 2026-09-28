import { withSocialMetadata } from "@/lib/seo/social-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { CopyButton } from "@/components/common/copy-button";
import { EMBED_WIDGETS, embedSnippet, embedUrl, attributionUrl } from "@/lib/embed/registry";

/**
 * The public offer page for the framed widgets. This is the indexable half of
 * the embed feature: the widget documents themselves are noindex thin
 * duplicates, and this page is what should rank for people looking for a
 * calculator to put on their own site.
 */

const TITLE = "Embed a Free BAC Water Calculator on Your Site";
const DESCRIPTION =
  "Copy one line of HTML to put the BAC water concentration, syringe unit or mg to mcg calculator on your own page. Free, no account, no tracking script.";
const PATH = "/embed";

export const metadata: Metadata = withSocialMetadata({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", siteName: "BACwater.ai" },
});

const FAQ = [
  {
    q: "Is the embedded calculator free to use?",
    a: "Yes. The widgets are free for any site, including commercial ones. There is no account, no API key, no usage limit and no fee. Keeping the attribution line is requested, not enforced, and removing it does not disable the widget.",
  },
  {
    q: "Does the widget load tracking scripts or cookies?",
    a: "No. The framed document contains no JavaScript, sets no cookies, and loads nothing from a third-party domain. Its Content-Security-Policy blocks scripts outright. The form submits to bacwater.ai with a GET request and the entered numbers are not stored.",
  },
  {
    q: "Can I change the size or remove the attribution line?",
    a: "Yes to both. Edit the width, height and border in the iframe style, or drop the attribution paragraph entirely. The widget keeps working either way. The attribution is a plain brand link, not a condition of use.",
  },
  {
    q: "Why is the attribution link outside the iframe?",
    a: "A link inside an iframe belongs to the framed document rather than to the page doing the framing, so search engines credit it to bacwater.ai instead of treating it as a link from your site. Putting the anchor in the snippet's own markup makes it an ordinary link in your page, which is also why you stay in full control of it.",
  },
  {
    q: "Does the embedded widget give dosing advice?",
    a: "No. It divides and converts the numbers a visitor types. It does not select an amount, a liquid, a device or a treatment, and it cannot verify what a vial contains. Every widget links to the full tool page and repeats that the product's own instructions govern.",
  },
  {
    q: "Will the embedded result match the calculator on bacwater.ai?",
    a: "Yes. The widget runs the same arithmetic functions as the on-site tools rather than a separate copy, and the test suite asserts the two agree across a table of inputs.",
  },
];

export default function EmbedPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-9 pb-14">
      <WebPageJsonLd name="Embed the BAC water calculator" description={DESCRIPTION} url={PATH} />
      <FaqJsonLd items={FAQ} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/tools" }, { label: "Embed", href: PATH }]} />

      <p className="eyebrow">For site owners</p>
      <h1 className="mt-3 font-serif">Put our calculator on your page</h1>

      {/* Direct answer block: resolves the core question before any preamble. */}
      <p className="mt-4 max-w-2xl leading-relaxed">
        Copy the HTML under any calculator below and paste it into your page. The calculator appears in a frame
        served from bacwater.ai, so it stays current without you updating anything. It is free for any site, needs no
        account or API key, and loads no JavaScript, no cookies and nothing from a third-party domain.
      </p>

      <div className="bac-info-card mt-8">
        <h2>Who this is for</h2>
        <p>
          Writers, educators, forum operators, veterinary and laboratory reference sites, and anyone explaining
          reconstitution arithmetic who would rather link to a working calculator than rebuild one. BACwater.ai is a
          free measurement and concentration utility. It does not sell water or peptides, does not prescribe a
          treatment and does not select a dose. <Link href="/about" className="underline">More about the site</Link>.
        </p>
      </div>

      <h2 className="mt-10 font-serif">Choose a calculator</h2>
      <div className="mt-5 space-y-8">
        {EMBED_WIDGETS.map(widget => {
          const snippet = embedSnippet(widget);
          return (
            <section key={widget.slug} className="rounded-xl border border-border p-4 sm:p-5">
              <h3 className="text-lg font-semibold">{widget.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{widget.description}</p>
              <p className="mt-2 text-sm">
                <Link href={widget.canonicalPath} className="underline">
                  See the full version
                </Link>{" "}
                <span className="text-muted-foreground">
                  · frame URL <code className="text-xs">{embedUrl(widget)}</code>
                </span>
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <h4 className="text-sm font-medium">Paste this</h4>
                <CopyButton value={snippet} label="Copy HTML" />
              </div>
              {/* The block scrolls sideways, so it has to be reachable and
                  scrollable from the keyboard: axe flags a scrollable region
                  with no focusable content as a serious failure, and someone
                  who cannot use a mouse would otherwise never see the end of
                  the line they are being asked to copy. role="group" carries
                  the name without adding another landmark to the page. */}
              <pre
                role="group"
                aria-label={`Embed code for the ${widget.title} calculator`}
                tabIndex={0}
                className="mt-2 overflow-x-auto rounded-lg border border-border bg-muted/50 p-3 text-xs leading-relaxed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                <code>{snippet}</code>
              </pre>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                The second line is the attribution. It points at{" "}
                <code className="text-[11px]">{attributionUrl(widget)}</code> and is an ordinary link in your page, so
                you control it. Delete the line if you would rather not include it; the calculator still works.
              </p>
            </section>
          );
        })}
      </div>

      <h2 className="mt-12 font-serif">What the widget does and does not do</h2>
      <ul className="mt-4 space-y-2.5 leading-relaxed">
        <li>
          <strong>It shows arithmetic.</strong> Concentration is the vial amount divided by the final liquid volume. A
          U-100 conversion is a scale relationship: on that scale only, 100 units is 1 mL. 1 mg is 1,000 mcg.
        </li>
        <li>
          <strong>It does not choose anything.</strong> No amount, liquid, device, schedule or treatment is selected or
          suggested, and it cannot confirm what is actually in a vial, whether it is sterile, or how long it keeps.
        </li>
        <li>
          <strong>It works without scripting.</strong> The form submits with a GET request and the result is rendered on
          the server, so it works in readers and with JavaScript disabled.
        </li>
        <li>
          <strong>Nothing is stored.</strong> Entered numbers arrive as query parameters, are used to render the
          response, and are not saved to an account or profile. See the{" "}
          <Link href="/privacy" className="underline">privacy notice</Link>.
        </li>
      </ul>

      <h2 className="mt-12 font-serif">Questions about embedding</h2>
      <dl className="mt-4 space-y-5">
        {FAQ.map(item => (
          <div key={item.q}>
            <dt className="font-semibold leading-snug">{item.q}</dt>
            <dd className="mt-1.5 leading-relaxed text-muted-foreground">{item.a}</dd>
          </div>
        ))}
      </dl>

      <div className="bac-info-card mt-10">
        <h2>Prefer to just link?</h2>
        <p>
          A plain link is welcome too. The pages people most often reference are the{" "}
          <Link href="/peptide-calculator" className="underline">full peptide calculator</Link>, the{" "}
          <Link href="/tools/bac-water" className="underline">BAC water calculator</Link>, the{" "}
          <Link href="/methodology" className="underline">methodology</Link> behind every number, and{" "}
          <Link href="/learn/what-you-cannot-know" className="underline">what a calculator cannot tell you</Link>.
        </p>
      </div>
    </div>
  );
}
