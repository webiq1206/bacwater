import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description: "How BACwater.ai collects, uses, and protects your data. Payments processed by Stripe. No ad trackers.",
  openGraph: {
    title: "Privacy Policy",
    description: "How BACwater.ai collects, uses, and protects your data. Payments processed by Stripe. No ad trackers.",
    url: "/privacy",
    type: "website",
    siteName: "BACwater.ai",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Privacy Policy"
        description="How BACwater.ai collects, uses, and protects your data. Payments processed by Stripe. No ad trackers."
        url="/privacy"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy" },
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy", href: "/privacy" }]} />
      <div className="eyebrow">Legal</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">Privacy</h1>
      <div className="mt-6 prose prose-neutral max-w-none text-foreground/90 space-y-4">
        <h2>1. Information we collect</h2>
        <p>
          When you create an account or place an order we collect your email
          address, the plan and calculator data you enter, and the information
          you provide at checkout (name, shipping address). We do not collect
          information beyond what is needed to operate the service.
        </p>

        <h2>2. How we use your information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Operate and maintain your account and saved plans.</li>
          <li>Process and fulfill orders placed through the shop.</li>
          <li>Send transactional emails (order confirmations, password resets).</li>
          <li>Improve our tools and fix bugs.</li>
        </ul>
        <p>We do not use your data for advertising and we do not sell it.</p>

        <h2>3. Payment processing</h2>
        <p>
          All payments are processed by{" "}
          <a href="https://stripe.com/privacy" className="text-foreground underline" target="_blank" rel="noopener noreferrer">Stripe</a>.
          Your card number, expiration date, and CVC are sent directly to
          Stripe and never touch our servers. We only receive a confirmation
          that payment succeeded, along with the last four digits of the card
          for your order history.
        </p>

        <h2>4. Cookies &amp; local storage</h2>
        <p>
          We use a session cookie for authentication and local storage for your
          cart state. We do not run third-party ad trackers, retargeting pixels,
          or analytics scripts that identify you personally.
        </p>

        <h2>5. Third-party services</h2>
        <p>
          We share data with only two third-party services, and only as needed
          to operate BACwater.ai:
        </p>
        <ul>
          <li><b>Stripe</b>: payment processing (see above).</li>
          <li><b>Resend</b>: transactional email delivery (order confirmations, password resets). Resend receives your email address solely to deliver messages on our behalf.</li>
        </ul>
        <p>We do not sell, rent, or trade your data with any other party.</p>

        <h2>6. Data retention</h2>
        <p>
          We keep your account data for as long as your account is active. If
          you delete your account, we remove your personal data within 30 days.
          Order records may be retained longer as required for tax and legal
          compliance.
        </p>

        <h2>7. Your rights</h2>
        <p>
          You may request access to, correction of, or deletion of your
          personal data at any time by emailing{" "}
          <a href="mailto:privacy@bacwater.ai" className="text-foreground underline">privacy@bacwater.ai</a>.
          We will respond within 30 days.
        </p>

        <h2>8. CCPA / GDPR</h2>
        <p>
          If you are a California resident, you have the right to know what
          personal information we collect, request its deletion, and opt out of
          its sale (we do not sell personal information). If you are an EU/EEA
          resident, you have the right to access, rectify, port, and erase
          your data, and to restrict or object to processing. To exercise any
          of these rights, contact{" "}
          <a href="mailto:privacy@bacwater.ai" className="text-foreground underline">privacy@bacwater.ai</a>.
        </p>

        <h2>9. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. When we make material
          changes, we will notify you by email or by posting a notice on the
          site. Continued use of BACwater.ai after changes constitutes
          acceptance.
        </p>

        <h2>10. Contact</h2>
        <p>
          For privacy questions or data requests, email{" "}
          <a href="mailto:privacy@bacwater.ai" className="text-foreground underline">privacy@bacwater.ai</a>.
        </p>

        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/" className="text-sm font-medium text-foreground hover:underline">&larr; Back to BACwater.ai</Link>
        </div>
      </div>
    </div>
  );
}
