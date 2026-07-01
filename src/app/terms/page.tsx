import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of service for BACwater.ai. Research use, accuracy, orders, returns, and site usage terms.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Terms of Service"
        description="Terms of service for BACwater.ai."
        url="/terms"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Terms of Service", url: "/terms" },
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service", href: "/terms" }]} />
      <div className="eyebrow">Legal</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">Terms of service</h1>
      <div className="mt-6 prose prose-neutral max-w-none text-foreground/90 space-y-4">
        <p>
          Welcome to BACwater.ai. By using this website you agree to these terms.
        </p>
        <h2>1. Research use only</h2>
        <p>
          Products sold through BACwater.ai are intended for laboratory research
          and educational purposes only. They are not intended for human or
          veterinary diagnostic or therapeutic use. You are responsible for
          complying with all local, state, and federal regulations that apply
          to your use of these products.
        </p>
        <h2>2. No medical advice</h2>
        <p>
          Calculations, guides, and AI-assisted explanations on this site are
          educational tools. They are not medical advice, and they do not
          create a doctor-patient relationship. Consult a licensed medical
          professional for any medical guidance.
        </p>
        <h2>3. Accuracy</h2>
        <p>
          We take calculation accuracy seriously. Our math library uses
          transparent, verified formulas backed by automated tests. However,
          you are the final check: verify every input against the label on
          your vial and your syringe. We are not liable for errors resulting
          from mislabeled products or inputs.
        </p>
        <h2>4. Orders and returns</h2>
        <p>
          Orders ship within 1-2 business days. Sealed items are returnable
          within 30 days. Opened items are not returnable for safety reasons.
        </p>
        <h2>5. Changes</h2>
        <p>We may update these terms at any time. Continued use constitutes acceptance.</p>
        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/" className="text-sm font-medium text-foreground hover:underline">&larr; Back to BACwater.ai</Link>
        </div>
      </div>
    </div>
  );
}
