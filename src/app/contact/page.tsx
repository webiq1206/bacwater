import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import { LeadRequest } from "@/components/common/lead-request";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { PUBLIC_SUPPORT_EMAIL } from "@/lib/site-contact";

export const metadata = withSocialMetadata({
  alternates: { canonical: "/contact" },
  title: "Contact Us",
  description: "Report a calculator issue or ask about saved plans, privacy or the BACwater.ai website.",
  openGraph: {
    title: "Contact Us",
    description: "Report a calculator issue or ask about saved plans, privacy or the BACwater.ai website.",
    url: "/contact",
    type: "website",
    siteName: "BACwater.ai",
  },
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 pt-4 sm:pt-10 pb-10 sm:pb-32">
      <WebPageJsonLd
        name="Contact BACwater.ai"
        description="Report a calculator issue or ask about saved plans, privacy or the BACwater.ai website."
        url="/contact"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <h1 className="mt-1 text-3xl sm:text-5xl font-serif font-medium tracking-tight">
        Get in touch
      </h1>
      <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
        Send a request in one step. Chat if you would rather ask here.
        We do not sell products or provide medical advice.
      </p>
      <div className="mt-2">
        <LeadRequest variant="contact" />
      </div>
      <div className="mt-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]} />
      </div>
      <div className="mt-4 border border-border p-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          For quick answers, check our{" "}
          <Link href="/faq" className="font-medium text-foreground underline">FAQ</Link>{" "}
          or browse the{" "}
          <Link href="/learn" className="font-medium text-foreground underline">learning center</Link>.
        </p>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        Use this form for website support or a correction. For orders, shipping, or product questions, contact the supplier directly.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Prefer email?{" "}
        <a href={`mailto:${PUBLIC_SUPPORT_EMAIL}`} className="font-medium text-foreground underline">{PUBLIC_SUPPORT_EMAIL}</a>.
      </p>
    </div>
  );
}
