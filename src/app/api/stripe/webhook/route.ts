import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) {
    return NextResponse.json({ ok: false, error: "Stripe not configured." }, { status: 400 });
  }
  const stripe = new Stripe(key);
  const sig = req.headers.get("stripe-signature") || "";
  const buf = Buffer.from(await req.arrayBuffer());
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, secret);
  } catch (err) {
    return NextResponse.json({ ok: false, error: `Webhook signature invalid: ${(err as Error).message}` }, { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const publicId = session.metadata?.orderPublicId;
    if (publicId) {
      await prisma.order.update({
        where: { publicId },
        data: {
          status: "paid",
          stripePaymentIntent: (session.payment_intent as string) || null,
        },
      });
    }
  }
  return NextResponse.json({ received: true });
}
