import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

/** Send the customer an order confirmation. Best-effort; never throws. */
async function sendOrderConfirmation(publicId: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const order = await prisma.order.findUnique({
    where: { publicId },
    include: { items: true },
  });
  if (!order) return;

  const from = process.env.RESEND_FROM || "orders@bacwater.ai";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  const items = order.items
    .map((i) => `  ${i.quantity} x ${i.productName}  ${money(i.unitCents * i.quantity)}`)
    .join("\n");
  const text = `Thanks for your order, ${order.shippingName || ""}.

Order ${order.publicId}

${items}

Subtotal: ${money(order.subtotalCents)}
Shipping: ${order.shippingCents === 0 ? "Free" : money(order.shippingCents)}
Tax: ${money(order.taxCents)}
Total: ${money(order.totalCents)}

We are preparing your order. You can view it any time at
${siteUrl}/checkout/success?order=${order.publicId}

BACwater.ai. Products are for research and educational use only.`;

  const resend = new Resend(key);
  await resend.emails.send({
    from,
    to: order.email,
    subject: `Order ${order.publicId} confirmed - BACwater.ai`,
    text,
  });
}

/** Mark an order paid, decrement inventory, and email the customer. Idempotent. */
async function fulfillOrder(publicId: string, paymentIntent: string | null) {
  const order = await prisma.order.findUnique({
    where: { publicId },
    include: { items: true },
  });
  if (!order) return;
  // Idempotency: skip if already fulfilled (webhooks can fire more than once).
  if (["paid", "shipped", "refunded"].includes(order.status)) return;

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: {
        status: "paid",
        stripePaymentIntent: paymentIntent ?? order.stripePaymentIntent,
      },
    }),
    ...order.items.map((it) =>
      prisma.product.update({
        where: { id: it.productId },
        data: { inventory: { decrement: it.quantity } },
      })
    ),
  ]);

  await sendOrderConfirmation(publicId).catch((e) =>
    console.error("Order confirmation email failed", e)
  );
}

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) {
    return NextResponse.json(
      { ok: false, error: "Stripe not configured." },
      { status: 400 }
    );
  }
  const stripe = new Stripe(key);
  const sig = req.headers.get("stripe-signature") || "";
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, secret);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `Webhook signature invalid: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        const publicId = session.metadata?.orderPublicId;
        // Only fulfill once payment is actually collected.
        if (publicId && session.payment_status === "paid") {
          await fulfillOrder(publicId, (session.payment_intent as string) || null);
        }
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const publicId = session.metadata?.orderPublicId;
        if (publicId) {
          await prisma.order.updateMany({
            where: { publicId, status: "pending" },
            data: { status: "cancelled" },
          });
        }
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const publicId = session.metadata?.orderPublicId;
        if (publicId) {
          await prisma.order.updateMany({
            where: { publicId, status: "pending" },
            data: { status: "needs_attention" },
          });
        }
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const pi =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent?.id;
        if (pi) {
          await prisma.order.updateMany({
            where: { stripePaymentIntent: pi },
            data: { status: "refunded" },
          });
        }
        break;
      }
      default:
        // Unhandled event types are acknowledged so Stripe does not retry.
        break;
    }
  } catch (err) {
    console.error("Webhook handler error", event.type, err);
    // 500 tells Stripe to retry (transient DB/email failure).
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
