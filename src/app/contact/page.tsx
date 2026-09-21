import Link from "next/link";
import { ContactForm } from "@/components/common/contact-form";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
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
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Contact BACwater.ai"
        description="Report a calculator issue or ask about saved plans, privacy or the BACwater.ai website."
        url="/contact"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]} />
      <div className="eyebrow">Contact</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        Get in touch
      </h1>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        Questions about a calculation, a saved plan or this website?
        Send the support team a note. We do not sell products or provide medical advice.
      </p>
      <div className="mt-6 border border-border p-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          For quick answers, check our{" "}
          <Link href="/faq" className="font-medium text-foreground underline">FAQ</Link>{" "}
          or browse the{" "}
          <Link href="/learn" className="font-medium text-foreground underline">learning center</Link>.
        </p>
      </div>
      <div className="mt-8 border border-border p-8">
        <ContactForm />
      </div>
    </div>
  );
}
