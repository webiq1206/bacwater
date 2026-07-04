/**
 * Single source of truth for shipping and tax math. Cart, checkout, and the
 * server checkout route all import from here so the numbers can never drift
 * (previously the cart used >= $50 and checkout used > $50, so an exactly-$50
 * order was promised free shipping and then charged).
 */

export const FREE_SHIP_THRESHOLD_CENTS = 5000; // $50.00
export const SHIPPING_FLAT_CENTS = 899; // $8.99
export const TAX_RATE = 0.07;

/** Free at or above the threshold; flat rate below it. */
export function shippingCents(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIP_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
}

export function taxCents(subtotalCents: number): number {
  return Math.round(subtotalCents * TAX_RATE);
}

/** Reader-facing copy that matches the actual boundary (at or above $50). */
export const FREE_SHIP_COPY = "Free shipping on orders of $50 or more.";
