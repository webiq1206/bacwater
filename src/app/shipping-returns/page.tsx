import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
  alternates: { canonical: "/shipping-returns" },
  title: "Shipping & Returns",
  description:
    "How BACwater.ai ships orders, expected delivery times, order tracking, and our returns policy for research supplies.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Shipping & Returns"
        description="How BACwater.ai ships orders, expected delivery times, order tracking, and our returns policy for research supplies."
        url="/shipping-returns"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Shipping & Returns", url: "/shipping-returns" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shipping & Returns", href: "/shipping-returns" },
        ]}
      />
      <div className="eyebrow">Support</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        Shipping and returns
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        We ship research supplies quickly and pack them carefully. This page
        covers how long orders take, how tracking works, and what to do if
        something arrives damaged or is not what you expected.
      </p>

      <div className="mt-10 space-y-10 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            Processing and shipping times
          </h2>
          <p className="mt-3">
            Orders are processed and packed within 1 to 2 business days. Once
            your order ships, you will receive a confirmation email with a
            tracking number so you can follow it to your door. Standard delivery
            within the United States typically takes 2 to 5 business days after
            dispatch, depending on your location.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            Where we ship
          </h2>
          <p className="mt-3">
            We currently ship within the United States. If international
            shipping is important to you,{" "}
            <Link href="/contact" className="underline hover:text-foreground">
              let us know
            </Link>{" "}
            so we can gauge demand.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            Tracking your order
          </h2>
          <p className="mt-3">
            Every order includes tracking. If you created an account at
            checkout, you can also see your order status in your account. If
            your tracking has not updated within a few business days, contact us
            and we will look into it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            Returns and refunds
          </h2>
          <p className="mt-3">
            Because our products are sterile research supplies, we can only
            accept returns of unopened, unused items in their original,
            undamaged packaging within 30 days of delivery. For safety and
            integrity reasons, opened bacteriostatic water vials, syringes, and
            prep pads cannot be returned or resold. Approved returns are
            refunded to the original payment method once we receive and inspect
            the item.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            Damaged, defective, or incorrect items
          </h2>
          <p className="mt-3">
            If your order arrives damaged, defective, or incorrect, please{" "}
            <Link href="/contact" className="underline hover:text-foreground">
              contact us
            </Link>{" "}
            within 7 days of delivery with your order number and a photo of the
            issue. We will make it right with a replacement or refund. Problems
            caused by a shipping carrier are covered the same way, so you are
            never left holding a damaged order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            Questions
          </h2>
          <p className="mt-3">
            For anything not covered here, reach our team through the{" "}
            <Link href="/contact" className="underline hover:text-foreground">
              contact page
            </Link>
            . Products are sold for laboratory research and educational use only.
            See our{" "}
            <Link href="/disclaimer" className="underline hover:text-foreground">
              disclaimer
            </Link>{" "}
            for details.
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
