import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
/** A compact statement of the input-verification boundary, without unsupported market claims. */
export function VialIdentityWarning({ compound }: { compound?: string }) {
  const name = compound && compound !== "Other / Custom" ? compound : "the stated material";
  return <aside className="mt-8 rounded-2xl border border-warning/40 bg-warning/5 p-5 sm:p-6" aria-label="What a calculation cannot verify">
    <div className="flex items-center gap-2.5"><AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0" style={{ color: "var(--color-warning)" }}/><h2 className="text-lg sm:text-xl font-serif">A label is not product verification.</h2></div>
    <p className="mt-3 text-sm leading-relaxed">Entering a name does not establish that a vial contains {name}, the stated amount or an uncontaminated material. Research-use wording does not establish suitability for human or animal use. The calculator checks relationships between your inputs and may round displayed values.</p>
    <Link href="/learn/what-you-cannot-know" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4">Read what no calculation can verify <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0"/></Link>
  </aside>;
}
