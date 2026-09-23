import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Service",
  description: "Terms of service for BACwater.ai. Educational calculations, accuracy limitations and site usage terms.",
  openGraph: {
    title: "Terms of Service",
    description: "Terms of service for BACwater.ai. Educational calculations, accuracy limitations and site usage terms.",
    url: "/terms",
    type: "website",
    siteName: "BACwater.ai",
  },
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
          The current website provides educational calculations and reference content.
          It does not sell products or provide diagnostic or therapeutic services.
          You are responsible for complying with requirements applicable to your use of the website.
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
        <h2>4. Current availability</h2>
        <p>
          There is no active checkout or order fulfillment through this website.
          Historical references to shipping and returns do not describe the current service.
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
