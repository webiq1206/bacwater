import { Package } from "lucide-react";
import type { SupplyRecommendation } from "@/lib/calc";

interface Props {
  supplies: SupplyRecommendation[];
}

/**
 * Supply COUNTS (PRD v3 §9.3.6 / §9.5). How many of each item this plan works
 * out to, counts only. The site sells nothing and points to no seller, so
 * there are no prices, no cart, and no links here.
 */
export function SupplyRecommender({ supplies }: Props) {
  return (
    <section className="border border-border bg-card rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-2.5">
        <Package className="h-5 w-5 accent-check" />
        <h3 className="text-lg font-serif tracking-tight">What this plan needs</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        How many of each item your plan works out to. These are counts so you
        can plan. We don&apos;t sell these and don&apos;t point you to a seller.
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
    </section>
  );
}
