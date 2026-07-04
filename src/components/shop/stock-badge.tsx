import { Badge } from "@/components/ui/badge";

/**
 * Shows real stock state from Product.inventory / active. Reused on the shop
 * listing, the product page, and the buy page so stock reads consistently.
 * Low-stock threshold matches the shop listing (< 20).
 */
export function StockBadge({
  inventory,
  active = true,
  showInStock = false,
  className = "",
}: {
  inventory: number;
  active?: boolean;
  showInStock?: boolean;
  className?: string;
}) {
  if (!active || inventory <= 0) {
    return <Badge variant="warning" className={className}>Sold out</Badge>;
  }
  if (inventory < 20) {
    return <Badge variant="outline" className={className}>Low stock</Badge>;
  }
  if (showInStock) {
    return <Badge variant="success" className={className}>In stock</Badge>;
  }
  return null;
}
