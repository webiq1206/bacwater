/**
 * Retail pricing rules.
 *
 * Every product's selling price is derived from its supplier cost with a fixed
 * markup, then rounded to the nearest whole dollar. Storing the supplier cost
 * as the source of truth means retail prices update automatically whenever a
 * supplier cost changes — just recompute with `retailFromCostCents`.
 */
export const MARKUP = 1.25; // 25% margin over supplier cost

/**
 * Retail price in cents from a supplier cost in cents:
 * cost × 1.25, rounded to the nearest whole dollar.
 * e.g. 1999 (¢, $19.99 cost) → 2500 (¢, $25 retail).
 */
export function retailFromCostCents(costCents: number): number {
  const markedUp = (costCents / 100) * MARKUP; // dollars
  return Math.round(markedUp) * 100; // nearest whole dollar, back to cents
}
