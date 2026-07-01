export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <div className="eyebrow">Legal</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">Privacy</h1>
      <div className="mt-6 prose prose-neutral max-w-none text-foreground/90 space-y-4">
        <p>
          BACWater.ai collects only the information needed to run our service:
          your email and any information you enter into the plan builder or
          checkout.
        </p>
        <h2>Payment</h2>
        <p>Payments are processed by Stripe. We never see or store your card number.</p>
        <h2>Cookies</h2>
        <p>
          We use minimal cookies for authentication and your cart. We do not
          sell your data. We do not run third-party ad trackers.
        </p>
        <h2>Contact</h2>
        <p>Email <a href="mailto:privacy@bacwater.ai" className="text-brand">privacy@bacwater.ai</a> to exercise any privacy right (access, correction, deletion).</p>
      </div>
    </div>
  );
}
