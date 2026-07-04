import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ReviewedBy } from "@/components/common/reviewed-by";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { References } from "@/components/common/references";
import { CORE_BACWATER_REFERENCES } from "@/lib/content/references";

const DESCRIPTION =
  "Buy bacteriostatic water as a sealed, sterile, USP-grade multi-dose vial with 0.9% benzyl alcohol from a supplier that ships in the US and lists lot and returns.";

export const metadata: Metadata = {
  title: "Where to Buy Bacteriostatic Water (2026 Buyer's Guide)",
  description: DESCRIPTION,
  alternates: { canonical: "/learn/where-to-buy-bacteriostatic-water" },
  openGraph: {
    title: "Where to Buy Bacteriostatic Water (2026 Buyer's Guide)",
    description: DESCRIPTION,
  },
};

const CHECKLIST: { check: string; why: string }[] = [
  {
    check: "Sealed and tamper-evident",
    why: "An intact seal is your first sign the vial has not been opened, punctured, or refilled since it left the manufacturer.",
  },
  {
    check: "Sterile, USP-grade",
    why: "USP-grade sterile product is made to a recognized pharmacopeia standard, so you know what is in the vial and how it was prepared.",
  },
  {
    check: "Preservative clearly stated (0.9% benzyl alcohol)",
    why: "The label should name the bacteriostatic preservative and its concentration. If it does not, you cannot tell true bacteriostatic water from plain sterile water.",
  },
  {
    check: "US-based shipping and support",
    why: "A US shipping address and reachable support mean faster delivery, clearer accountability, and someone to contact if an order arrives damaged.",
  },
  {
    check: "Lot or batch number plus a clear returns policy",
    why: "A printed lot number and a written returns policy show the supplier tracks its product and stands behind it if something is wrong.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Can you buy bacteriostatic water over the counter?",
    a: "It is not a typical grocery or big-box shelf item. Some pharmacies stock it, and a pharmacist may ask questions or request a prescription depending on the pharmacy and your location. Many people buy it from online research suppliers instead. In every case, the goal is the same: a sealed, sterile, clearly labeled multi-dose vial sold for research use only.",
  },
  {
    q: "Do you need a prescription for bacteriostatic water?",
    a: "Requirements vary by pharmacy and jurisdiction. Some pharmacies dispense it without a prescription while others ask for one or route the request through a pharmacist. Online research suppliers sell it for research use only rather than for medical use. This page is educational and is not medical or legal advice, so confirm the rules that apply where you are.",
  },
  {
    q: "Is bacteriostatic water sold near me or at pharmacies?",
    a: "Availability is inconsistent. A local pharmacy may carry it, may order it in, or may not stock it at all, so a search for it near you can return few results. Because it is a niche multi-dose vial rather than a mass-market product, many buyers find sealed, clearly labeled options more reliably from online research suppliers that ship in the US.",
  },
  {
    q: "How much does bacteriostatic water cost?",
    a: "It is generally inexpensive per vial compared with the peptides it is used to reconstitute. The exact figure depends on vial size, quantity, and the supplier, so treat any single quoted number with caution. Focus less on shaving a small amount off the price and more on getting sealed, sterile, USP-grade product with the preservative percentage, a lot number, and a returns policy clearly stated.",
  },
];

export default function WhereToBuyBacteriosaticWaterPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-14 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Where to Buy Bacteriostatic Water"
        description={DESCRIPTION}
        url="/learn/where-to-buy-bacteriostatic-water"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Learning Center", url: "/learn" },
          {
            name: "Where to Buy Bacteriostatic Water",
            url: "/learn/where-to-buy-bacteriostatic-water",
          },
        ]}
        reviewed
      />
      <FaqJsonLd items={FAQS} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learning Center", href: "/learn" },
          {
            label: "Where to Buy Bacteriostatic Water",
            href: "/learn/where-to-buy-bacteriostatic-water",
          },
        ]}
      />

      <div className="eyebrow">Buying guide</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        Where to Buy Bacteriostatic Water (2026 Buyer&rsquo;s Guide)
      </h1>

      <p className="mt-6 text-foreground/90 leading-relaxed">
        Bacteriostatic water is sold as a multi-dose vial by some pharmacies and
        by online research suppliers. It is sterile water with a preservative,
        0.9% benzyl alcohol, that lets you draw from the same vial more than once.
        The real decision is not the store but the product: buy a sealed, sterile,
        clearly labeled vial from a supplier that ships in the US and publishes a
        returns policy. See our{" "}
        <Link
          href="/learn/what-is-bac-water"
          className="text-foreground font-medium underline"
        >
          full explainer on what bac water is
        </Link>{" "}
        for background, or head straight to{" "}
        <Link href="/buy" className="text-foreground font-medium underline">
          buy bac water
        </Link>
        .
      </p>
      <ReviewedBy className="mt-2" />

      <h2 className="mt-14 text-2xl sm:text-3xl font-serif font-medium tracking-tight">
        What to check before you buy
      </h2>
      <p className="mt-4 text-foreground/90 leading-relaxed">
        Use this quick reference to judge any listing, in a pharmacy or online.
        Every row is something you can confirm from the label or product page
        before you pay.
      </p>
      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface text-left">
              <th className="px-4 py-3 font-medium">What to check</th>
              <th className="px-4 py-3 font-medium">Why it matters</th>
            </tr>
          </thead>
          <tbody>
            {CHECKLIST.map((row) => (
              <tr key={row.check} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{row.check}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-14 text-2xl sm:text-3xl font-serif font-medium tracking-tight">
        Where people buy bacteriostatic water
      </h2>
      <p className="mt-4 text-foreground/90 leading-relaxed">
        There are two common routes. The first is a pharmacy. Some pharmacies
        stock bacteriostatic water and some do not, and a pharmacist may ask
        questions or request a prescription depending on the pharmacy and your
        location. The second is an online research supplier that sells it for
        research use only and ships it to you directly.
      </p>
      <p className="mt-4 text-foreground/90 leading-relaxed">
        People often search for it &ldquo;over the counter&rdquo; or &ldquo;near
        me&rdquo; and expect a shelf at a big-box store. Honestly, it is a niche
        multi-dose vial rather than a mass-market item, so local availability is
        inconsistent and those searches can come up short. That is why many buyers
        end up with online research suppliers that carry it reliably and ship in
        the US. Wherever you buy, apply the same checklist above, and remember
        this is a research-use-only product, not a medical recommendation.
      </p>
      <div className="mt-6 border border-border bg-surface p-6">
        <p className="text-foreground/90 leading-relaxed">
          Not sure whether you even need bacteriostatic water instead of plain
          sterile water? Our{" "}
          <Link
            href="/learn/vs/sterile-water"
            className="text-foreground font-medium underline"
          >
            bacteriostatic water vs sterile water comparison
          </Link>{" "}
          walks through the difference, and the{" "}
          <Link href="/faq" className="text-foreground font-medium underline">
            FAQ
          </Link>{" "}
          answers the most common first-timer questions.
        </p>
      </div>

      <h2 className="mt-14 text-2xl sm:text-3xl font-serif font-medium tracking-tight">
        Red flags to avoid
      </h2>
      <p className="mt-4 text-foreground/90 leading-relaxed">
        A few warning signs should stop a purchase no matter how good the price
        looks. Skip any listing where the vial is not sealed or the tamper
        evidence is missing, since you cannot verify the contents. Skip anything
        that does not state the preservative and its 0.9% benzyl alcohol
        concentration, because without it you cannot tell true bacteriostatic
        water from plain sterile water. Be wary of a supplier with no lot or batch
        number and no returns policy, and of vague or missing sourcing details
        about where and how the product was made. When sourcing is unclear, treat
        it as a reason to walk away, not a discount to chase. When you are ready,{" "}
        <Link href="/buy" className="text-foreground font-medium underline">
          buy bac water
        </Link>{" "}
        or round out your kit on the{" "}
        <Link href="/shop" className="text-foreground font-medium underline">
          supplies page
        </Link>
        .
      </p>

      <h2 className="mt-14 text-2xl sm:text-3xl font-serif font-medium tracking-tight">
        Frequently asked questions
      </h2>
      <Accordion type="single" collapsible className="mt-4">
        {FAQS.map((faq, i) => (
          <AccordionItem key={faq.q} value={"faq-" + i}>
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>
              <p className="leading-relaxed">{faq.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <References references={CORE_BACWATER_REFERENCES} />

      <div className="mt-14 border border-border bg-surface p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Ready to buy?
        </h2>
        <p className="mt-3 text-foreground/90 leading-relaxed">
          Start with a sealed, sterile, clearly labeled vial, then add the syringes
          and storage supplies you need to reconstitute with confidence.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button asChild variant="brand">
            <Link href="/buy">Buy bac water</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/shop">Shop supplies</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
