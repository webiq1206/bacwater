import Link from "next/link";

const FOOTER = {
  Product: [
    { href: "/plan", label: "Build My Plan" },
    { href: "/peptides", label: "Peptide Guides" },
    { href: "/buy", label: "Buy Bac Water" },
    { href: "/shop", label: "Shop Supplies" },
    { href: "/tools", label: "Calculators" },
    { href: "/tools/reverse-bac", label: "Reverse Calculator" },
    { href: "/tools/vial-labels", label: "Vial Labels" },
  ],
  Learn: [
    { href: "/learn", label: "Learning Center" },
    { href: "/learn/what-is-bac-water", label: "What is BAC Water?" },
    { href: "/learn/how-peptide-reconstitution-works", label: "How reconstitution works" },
    { href: "/learn/bac-water-shelf-life", label: "Shelf life & storage" },
    { href: "/learn/glossary", label: "Glossary" },
    { href: "/learn/where-to-buy-bacteriostatic-water", label: "Where to buy bac water" },
    { href: "/faq", label: "FAQ" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/editorial-policy", label: "Editorial & Sourcing Policy" },
    { href: "/shipping-returns", label: "Shipping & Returns" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/disclaimer", label: "Disclaimer" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="max-w-sm">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-medium tracking-tight leading-none">
                BACwater
              </span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase leading-none pb-0.5">
.ai
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              The complete guide to peptide reconstitution. Build a plan,
              get exact syringe units, download a PDF, and buy the supplies you
              need.
            </p>
          </div>
          {Object.entries(FOOTER).map(([title, links]) => (
            <div key={title}>
              <div className="text-sm font-semibold">{title}</div>
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
            The content and products on this site are for research and
            educational purposes only. BACwater.ai is not a medical company.
            Nothing here is intended to diagnose, treat, cure, or prevent any
            disease, and nothing here is medical advice or creates a
            doctor-patient relationship. Always verify anything health-related
            with your doctor before acting on it.{" "}
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
