import { RecommendationsNavLink } from "@/components/partners/supplier-recommendations";
import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { SupplierWaterLink } from "@/components/partners/supplier-context";
import { POSITIONING_STATEMENT } from "@/lib/positioning";
import { PreferredSourceButton } from "@/components/common/preferred-source-button";

const FOOTER = {
  Product: [
    { href: "/peptide-calculator", label: "Peptide Calculator" },
    { href: "/plan", label: "Build My Plan" },
    { href: "/peptides", label: "Compound guide" },
    { href: "/tools", label: "Calculators" },
    { href: "/tools/reverse-bac", label: "Reverse Calculator" },
    { href: "/tools/vial-labels", label: "Vial Labels" },
  ],
  Learn: [
    { href: "/learn", label: "Learning Center" },
    { href: "/learn/what-is-bac-water", label: "What is BAC Water?" },
    { href: "/learn/bac-water-for-peptides", label: "BAC Water for Peptides" },
    { href: "/learn/how-peptide-reconstitution-works", label: "How reconstitution works" },
    { href: "/learn/bac-water-shelf-life", label: "Shelf life & storage" },
    { href: "/learn/glossary", label: "Glossary" },
    { href: "/faq", label: "FAQ" },
  ],
  Company: [
    { href: "/about", label: "About" },
  { href: "/methodology", label: "How the math works" },
    { href: "/preferred-source", label: "Prefer us on Google" },
    { href: "/sitemap", label: "Site map" },
    { href: "/contact", label: "Contact" },
    { href: "/editorial-policy", label: "How we check content" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/disclaimer", label: "Disclaimer" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="section-dark mt-6 [overflow-wrap:anywhere]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div className="col-span-2 max-w-sm lg:col-span-1">
            <Link href="/" aria-label="BACwater.ai home"><Wordmark inverse/></Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Put in your label numbers. See the math. Save a copy. Free tools for clear calculations.
            </p>
            {/* Sitewide preferred-sources entry point. The "link" variant is a
                plain deeplink to Google's source preferences tool, so the
                footer costs no third-party script on every page view; the
                Google-rendered button lives on /preferred-source. */}
            <PreferredSourceButton
              variant="link"
              className="mt-5"
              label="Prefer BACwater.ai on Google"
              linkClassName="text-xs"
            />
          </div>
          {Object.entries(FOOTER).map(([title, links]) => (
            <div key={title} className="min-w-0">
              <div className="eyebrow" style={{ color: "var(--color-accent-guide)" }}>{title}</div>
              <ul className="mt-3 space-y-2 text-sm">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-start gap-6"><SupplierWaterLink compact/><RecommendationsNavLink /></div>
        <div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} BACwater.ai. All rights reserved.
          </div>
          <div className="max-w-2xl md:text-right">
            {POSITIONING_STATEMENT}{" "}
            <Link href="/disclaimer" className="underline hover:text-foreground">
              Full disclaimer
            </Link>
            .
          </div>
        </div>
      </div>
    </footer>
  );
}
