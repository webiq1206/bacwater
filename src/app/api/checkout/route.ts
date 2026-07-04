import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { shippingCents as computeShipping, taxCents as computeTax } from "@/lib/shipping";

const schema = z.object({
  email: z.string().email(),
  shipping: z.object({
    name: z.string().min(1),
    address1: z.string().min(1),
    address2: z.string().optional().nullable(),
    city: z.string().min(1),
    state: z.string().min(1),
    postal: z.string().min(1),
    country: z.string().default("US"),
    phone: z.string().optional().nullable(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string(),
        sku: z.string(),
        name: z.string(),
        priceCents: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const { email, shipping, items } = parsed.data;

  // Recompute totals server-side using DB prices to prevent tampering.
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });
  const priceMap = new Map(dbProducts.map((p) => [p.id, p]));

  let subtotal = 0;
  for (const i of items) {
    const dbp = priceMap.get(i.productId);
    if (!dbp) {
      return NextResponse.json({ ok: false, error: "Unknown product in cart." }, { status: 400 });
    }
    // Guard against ordering something that is no longer for sale or is out of
    // stock (prevents overselling; the client also disables Add to Cart).
    if (!dbp.active) {
      return NextResponse.json(
        { ok: false, error: `${dbp.name} is no longer available. Please remove it from your cart.` },
        { status: 409 }
      );
    }
    if (dbp.inventory < i.quantity) {
      return NextResponse.json(
        {
          ok: false,
          error:
            dbp.inventory <= 0
              ? `${dbp.name} is sold out. Please remove it from your cart.`
              : `Only ${dbp.inventory} of ${dbp.name} left. Please lower the quantity.`,
        },
        { status: 409 }
      );
    }
    subtotal += dbp.priceCents * i.quantity;
  }
  const shippingCents = computeShipping(subtotal);
  const taxCents = computeTax(subtotal);
  const totalCents = subtotal + shippingCents + taxCents;

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  const publicId = nanoid(10);

  const order = await prisma.order.create({
    data: {
      publicId,
      userId,
      email,
      status: "pending",
      subtotalCents: subtotal,
      shippingCents,
      taxCents,
      totalCents,
      shippingName: shipping.name,
      shippingAddress1: shipping.address1,
      shippingAddress2: shipping.address2 ?? null,
      shippingCity: shipping.city,
      shippingState: shipping.state,
      shippingPostal: shipping.postal,
      shippingCountry: shipping.country,
      shippingPhone: shipping.phone ?? null,
      items: {
        create: items.map((i) => {
          const dbp = priceMap.get(i.productId)!;
          return {
            productId: dbp.id,
            productName: dbp.name,
            sku: dbp.sku,
            unitCents: dbp.priceCents,
            quantity: i.quantity,
          };
        }),
      },
    },
  });

  // If Stripe is configured, create a Checkout Session.
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey) {
    try {
      const stripe = new Stripe(stripeKey);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        items.map((i) => {
          const dbp = priceMap.get(i.productId)!;
          return {
            price_data: {
              currency: "usd",
              product_data: { name: dbp.name },
              unit_amount: dbp.priceCents,
            },
            quantity: i.quantity,
          };
        });
      // Charge the same tax recorded on the order so the amount Stripe collects
      // matches order.totalCents exactly.
      if (taxCents > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: { name: "Estimated sales tax" },
            unit_amount: taxCents,
          },
          quantity: 1,
        });
      }

      const stripeSession = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email,
        line_items: lineItems,
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: shippingCents, currency: "usd" },
              display_name:
                shippingCents === 0 ? "Free shipping" : "Standard shipping",
            },
          },
        ],
        metadata: { orderPublicId: publicId, orderId: order.id },
        success_url: `${siteUrl}/checkout/success?order=${publicId}`,
        cancel_url: `${siteUrl}/cart`,
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: stripeSession.id },
      });
      return NextResponse.json({ ok: true, url: stripeSession.url, publicId });
    } catch (e) {
      console.error("Stripe checkout failed", e);
      // Never mark the order paid on a Stripe error. Leave it pending so no
      // unpaid order is treated as paid.
      return NextResponse.json(
        { ok: false, error: "Could not start checkout. Please try again." },
        { status: 502 }
      );
    }
  }

  // No Stripe key configured (local/dev only): mark paid so the admin flow is
  // testable offline. In production the key is set, so this never runs.
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "paid" },
  });
  return NextResponse.json({ ok: true, publicId });
}
