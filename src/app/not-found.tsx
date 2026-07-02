import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/", label: "Homepage" },
  { href: "/plan", label: "Build My Plan" },
  { href: "/shop", label: "Shop Supplies" },
  { href: "/learn", label: "Learning Center" },
  { href: "/tools", label: "Calculators & Tools" },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-24 sm:pt-32 pb-32 sm:pb-40 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        Page not found
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Try one of the links below to get back on track.
      </p>

      <nav className="mt-10 border border-border divide-y divide-border max-w-sm mx-auto text-left">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-surface transition-colors group"
          >
            {link.label}
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
