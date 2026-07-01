import Link from "next/link";
import { ArrowRight, Wand2, Calculator, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Build My Plan",
  description:
    "Create a personalized peptide reconstitution plan in minutes. Beginner or advanced mode.",
};

export default function PlanEntryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-24">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Let&apos;s build your plan.
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Choose beginner mode for a friendly, step-by-step flow, or advanced
          mode for a compact calculator. You can save the result as a plan with
          a permanent link, a PDF, and a printable vial label.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <Card className="hover:shadow-[var(--shadow-lift)] transition-shadow">
          <CardContent className="p-8 flex h-full flex-col">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft">
              <Wand2 className="h-5 w-5 text-brand" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">
              Beginner mode
            </h2>
            <p className="mt-2 text-muted-foreground">
              One question at a time. Plain English explanations. Visual
              examples. Great for your first reconstitution.
            </p>
            <ul className="mt-4 text-sm text-muted-foreground space-y-1.5">
              <li>• Peptide picker with common defaults</li>
              <li>• We recommend a clean BAC water amount</li>
              <li>• Explains every number in plain English</li>
            </ul>
            <div className="mt-8">
              <Button asChild variant="brand" size="lg">
                <Link href="/plan/new">
                  Start beginner mode <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-[var(--shadow-lift)] transition-shadow">
          <CardContent className="p-8 flex h-full flex-col">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-muted">
              <Calculator className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">
              Advanced mode
            </h2>
            <p className="mt-2 text-muted-foreground">
              Compact form. Instant math. Just what you need if you already know
              your vial strength and target dose.
            </p>
            <ul className="mt-4 text-sm text-muted-foreground space-y-1.5">
              <li>• Single-screen calculator layout</li>
              <li>• Choose your own BAC water amount</li>
              <li>• Save, PDF, and label with one click</li>
            </ul>
            <div className="mt-8">
              <Button asChild variant="outline" size="lg">
                <Link href="/plan/advanced">
                  Open advanced mode <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 rounded-3xl border border-border bg-muted/50 p-6 flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-brand mt-0.5" />
          <div>
            <div className="font-medium">First time reconstituting?</div>
            <div className="text-sm text-muted-foreground">
              Read the 5-minute primer before you start.
            </div>
          </div>
        </div>
        <Button asChild variant="ghost">
          <Link href="/learn/how-peptide-reconstitution-works">Read the primer</Link>
        </Button>
      </div>
    </div>
  );
}
