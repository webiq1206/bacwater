import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Calculators & tools",
  description:
    "Standalone calculators for BAC water, reconstitution, dose, syringe units, and unit conversion.",
};

const TOOLS = [
  { href: "/tools/reconstitution", title: "Reconstitution Calculator", body: "Full calculator with vial strength, dose, and BAC water." },
  { href: "/tools/bac-water", title: "BAC Water Calculator", body: "Just get the recommended BAC water amount for a given vial and dose." },
  { href: "/tools/dose", title: "Dose Calculator", body: "Solve for dose given concentration and desired volume." },
  { href: "/tools/syringe-units", title: "Syringe Unit Converter", body: "Convert mL ↔ U-100 units." },
  { href: "/tools/mg-to-mcg", title: "mg ↔ mcg Converter", body: "Convert milligrams to micrograms and back." },
  { href: "/tools/supplies", title: "Supply Calculator", body: "Figure out how many vials, syringes, and pads you need per cycle." },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <h1 className="text-4xl font-semibold tracking-tight">Calculators &amp; tools</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">
        Small, focused calculators for when you don&apos;t want the full planner.
        Everything below uses the same deterministic math library.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <Link key={t.href} href={t.href} className="group">
            <Card className="h-full hover:shadow-[var(--shadow-lift)] transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold group-hover:underline">
                  {t.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand group-hover:gap-2 transition-all">
                  Open <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
