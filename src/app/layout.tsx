import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartHydrator } from "@/components/shop/cart-hydrator";
import { Toaster } from "@/components/ui/toaster";
import { OrgJsonLd } from "@/components/common/org-json-ld";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BACwater.ai - The Complete BAC Water Calculator & Reconstitution Guide",
    template: "%s · BACwater.ai",
  },
  description:
    "Build a personalized peptide reconstitution plan in minutes. Get exact BAC water amounts, syringe units, storage guidance, printable labels, and the supplies you need.",
  keywords: [
    "BAC water",
    "bacteriostatic water",
    "peptide reconstitution",
    "reconstitution calculator",
    "insulin syringe units",
    "peptide dosing",
  ],
  applicationName: "BACwater.ai",
  authors: [{ name: "BACwater.ai" }],
  openGraph: {
    type: "website",
    siteName: "BACwater.ai",
    title: "BACwater.ai - The Complete BAC Water Calculator & Reconstitution Guide",
    description:
      "Build a plan, get exact syringe units, download a PDF, and buy the supplies you need. Simple, accurate, trustworthy.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "BACwater.ai",
    description:
      "Personalized peptide reconstitution plans and premium supplies.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <OrgJsonLd />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "BACwater.ai",
            url: siteUrl,
            description: "The complete BAC water calculator and reconstitution guide.",
            publisher: { "@type": "Organization", name: "BACwater.ai" },
          }) }}
        />
        <CartHydrator />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
