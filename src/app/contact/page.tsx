import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ResearchChatButton } from "@/components/search/research-chat-button";
import { PUBLIC_SUPPORT_EMAIL } from "@/lib/site-contact";

const description = "Email hello@bacwater.ai about a calculator issue, a saved plan, account access, privacy, or the website.";

export const metadata = withSocialMetadata({
  alternates: { canonical: "/contact" },
  title: "Contact Us",
  description,
  openGraph: {
    title: "Contact Us",
    description,
    url: "/contact",
    type: "website",
    siteName: "BACwater.ai",
  },
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 pb-16 sm:pb-28">
      <WebPageJsonLd
        name="Contact BACwater.ai"
        description={description}
        url="/contact"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]} />
      <p className="eyebrow mt-6">Support</p>
      <h1 className="mt-2 text-3xl sm:text-5xl font-serif font-medium tracking-tight">
        Contact
      </h1>
      <p className="mt-4 text-base text-muted-foreground leading-relaxed">
        BACwater.ai is a free calculator for concentration, volume, and syringe-scale math. Email us about the website, a saved plan, or a privacy request. We do not sell products or provide medical advice.
      </p>
      <div className="mt-6 border border-border bg-card p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">Email</p>
        <a href={`mailto:${PUBLIC_SUPPORT_EMAIL}`} className="mt-1 inline-flex min-h-11 items-center text-lg font-medium text-foreground underline underline-offset-4">
          {PUBLIC_SUPPORT_EMAIL}
        </a>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Include the page and what you expected. Leave out passwords, health records, and payment details.
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <ResearchChatButton />
        <Link href="/" className="inline-flex min-h-11 items-center justify-center border border-foreground bg-foreground px-4 text-sm font-medium text-background">
          Open the calculator
        </Link>
        <Link href="/faq" className="inline-flex min-h-11 items-center justify-center border border-border px-4 text-sm font-medium">
          Read the FAQ
        </Link>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        For a longer explanation of the math, browse the{" "}
        <Link href="/learn" className="font-medium text-foreground underline">learning center</Link>.
        Chat opens the research assistant for products and studies. It does not collect a name, phone, email, or file. For orders, shipping, or product questions, contact the supplier directly.
      </p>
    </div>
  );
}
