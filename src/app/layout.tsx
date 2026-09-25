import { SiteSearchProvider } from "@/components/search/site-search";
import { SiteChrome } from "@/components/calculator/site-chrome";
import { safeJson } from "@/lib/seo/safe-json";
import type { Metadata } from "next";
import { AnalyticsPreferences } from "@/components/common/analytics-preferences";
import { cookies } from "next/headers";
import { Montserrat, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import "./design-accessibility.css";
import { SiteFrame } from "@/components/brand/site-frame";
import { SupplierProvider } from "@/components/partners/supplier-context";
import { ResearchDirectoryLink } from "@/components/partners/supplier-recommendations";
import { getSupplierCatalog } from "@/lib/partners/supplier-catalog";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Toaster } from "@/components/ui/toaster";
import { OrgJsonLd } from "@/components/common/org-json-ld";
import { AgeGate } from "@/components/common/age-gate";
import { ADS_ENABLED } from "@/lib/ads";
import { auth } from "@/lib/auth";

// Montserrat carries the body, labels and clear, medium-weight headings.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// Fraunces is used only for brief display accents.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
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
    default: "BAC Water Concentration Calculator | BACwater.ai",
    template: "%s · BACwater.ai",
  },
  description:
    "Work out concentration, how much to measure, and syringe units from the numbers on your vial. Every step is shown.",
  applicationName: "BACwater.ai",
  icons: { icon: "/brand/bacwater-mark.svg", shortcut: "/brand/bacwater-mark.svg", apple: "/icon" },
  authors: [{ name: "BACwater.ai" }],
  openGraph: {
    type: "website",
    siteName: "BACwater.ai",
    title: "BAC Water Concentration Calculator | BACwater.ai",
    description:
      "Work out concentration, how much to measure, and syringe units from the numbers on your vial. Every step is shown.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
  other: {
    "google-adsense-account": "ca-pub-3192081478482854",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const catalog = getSupplierCatalog();
  const session = await auth();
  const isAuthenticated = Boolean((session?.user as { id?: string } | undefined)?.id);
  const ageVerified = (await cookies()).get("bacwater_age_ok")?.value === "1";
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${fraunces.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SupplierProvider water={catalog[0]} products={catalog}>
        <SiteSearchProvider>
        <OrgJsonLd />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJson({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            name: "BACwater.ai",
            url: siteUrl,
            description: "The complete BAC water calculator and reconstitution guide.",
            publisher: { "@id": `${siteUrl}/#organization` },
          }) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[100] focus:border focus:border-border focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <SiteChrome><SiteHeader isAuthenticated={isAuthenticated} /></SiteChrome>
        <AgeGate initialVerified={ageVerified} />
        <main id="main" className="flex-1 min-w-0"><SiteFrame shelf={<ResearchDirectoryLink/>}>{children}</SiteFrame></main>
        <SiteChrome><SiteFooter /></SiteChrome>
        <SiteChrome><MobileBottomNav /></SiteChrome>
        <Toaster />
        <SiteChrome><AnalyticsPreferences /></SiteChrome>
        </SiteSearchProvider>
        </SupplierProvider>
      </body>
    </html>
  );
}
