import Link from "next/link";
import { POSITIONING_STATEMENT } from "@/lib/positioning";

const FOOTER = {
  Product: [
    { href: "/peptide-calculator", label: "Peptide Calculator" },
    { href: "/plan", label: "Build My Plan" },
    { href: "/peptides", label: "Compound Reference" },
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
    { href: "/contact", label: "Contact" },
    { href: "/editorial-policy", label: "Editorial & Sourcing Policy" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/disclaimer", label: "Disclaimer" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="section-dark mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="max-w-sm">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-medium tracking-tight leading-none">
                BACwater
              </span>
              <span className="font-accent text-sm leading-none pb-0.5" style={{ color: "var(--color-accent-guide)" }}>
                .ai
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              A concentration and measurement calculator for peptide
              reconstitution. Enter your vial&apos;s numbers, see every step, and
              download a PDF.
            </p>
          </div>
          {Object.entries(FOOTER).map(([title, links]) => (
            <div key={title}>
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
