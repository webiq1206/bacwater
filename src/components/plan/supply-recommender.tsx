import { SupplierWaterLink } from "@/components/partners/supplier-context";
import { Package } from "lucide-react";
import type { SupplyRecommendation } from "@/lib/calc";

interface Props {
  supplies: SupplyRecommendation[];
}

/** Displays existing arithmetic counts, not personal product or treatment advice. */
export function SupplyRecommender({ supplies }: Props) {
  return (
    <section className="border border-border bg-card rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-2.5">
        <Package className="h-5 w-5 accent-check" />
        <h3 className="text-lg font-serif tracking-tight">Supply counts to check</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        These counts use the numbers in your plan. Check them against your product instructions. They do not choose what you should use or buy.
      </p>
      <ul className="mt-4 divide-y divide-border rounded-xl border border-border overflow-hidden">
        {supplies.map((s) => (
          <li key={s.sku} className="flex items-start gap-4 p-4">
            <span className="grid h-8 min-w-8 px-2 place-items-center rounded-full bg-accent-guide-soft text-sm font-semibold tabular-nums shrink-0">
              {s.quantity}
            </span>
            <div className="min-w-0">
              <div className="font-medium leading-tight">{s.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                {s.reason}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5"><SupplierWaterLink/></div>
    </section>
  );
}
