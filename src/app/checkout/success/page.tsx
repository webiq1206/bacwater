import Link from "next/link";
import { CheckCircle2, HelpCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ClearCart } from "@/components/shop/clear-cart";

interface Props { searchParams: Promise<{ order?: string }>; }

export const metadata = { title: "Order confirmed", robots: { index: false, follow: false } };

export default async function CheckoutSuccess({ searchParams }: Props) {
  const { order } = await searchParams;
  const found = order
    ? await prisma.order.findUnique({
        where: { publicId: order },
        include: { items: true },
      })
    : null;

  // If we can't locate the order (stale or bad link), do NOT claim success and
  // do NOT clear the cart.
  if (!found) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-20 sm:pt-28 pb-24 sm:pb-32">
        <div className="border border-border p-8 sm:p-12 text-center">
          <div className="mx-auto h-12 w-12 border border-border bg-surface grid place-items-center">
            <HelpCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="mt-5 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
            We couldn&apos;t find that order
          </h1>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            If you just paid, your confirmation is on its way by email. Check
            your inbox for the receipt and tracking. If you don&apos;t see it,
            reach out and we&apos;ll help.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button asChild variant="brand"><Link href="/contact">Contact us</Link></Button>
            <Button asChild variant="outline"><Link href="/shop">Back to shop</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-20 sm:pt-28 pb-24 sm:pb-32">
      <ClearCart />
      <div className="border border-border p-8 sm:p-12 text-center">
        <div className="mx-auto h-12 w-12 border border-success/30 bg-success/5 grid place-items-center">
          <CheckCircle2 className="h-6 w-6 text-success" />
        </div>
        <h1 className="mt-5 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
          Order confirmed
        </h1>
        <p className="mt-2 text-muted-foreground">
          Thank you! We&apos;ll email you a confirmation and tracking number
          when your order ships.
        </p>
        {found ? (
          <div className="mt-6 text-sm">
            <div className="text-xs text-muted-foreground">Order</div>
            <div className="font-medium">#{found.publicId}</div>
            <div className="mt-4 bg-surface p-4 text-left">
              <ul className="divide-y divide-border">
                {found.items.map((i) => (
                  <li key={i.id} className="py-2 flex justify-between text-sm">
                    <span>{i.productName} × {i.quantity}</span>
                    <span>{formatCurrency(i.unitCents * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border mt-2 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(found.totalCents)}</span>
              </div>
            </div>
          </div>
        ) : null}
        <div className="mt-8 bg-surface border border-border p-5 text-left">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
            While you wait for your supplies
          </div>
          <ul className="space-y-2.5 text-sm">
            <li className="flex gap-2.5">
              <span className="step-number step-number--filled h-5 w-5 text-[9px] mt-0.5">1</span>
              <span className="text-muted-foreground">
                <Link href="/plan" className="text-foreground font-medium underline">Build your mixing plan</Link>. Answer 3 questions and get step-by-step instructions for when your supplies arrive.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="step-number step-number--filled h-5 w-5 text-[9px] mt-0.5">2</span>
              <span className="text-muted-foreground">
                <Link href="/learn" className="text-foreground font-medium underline">Read the guides</Link>. Learn how reconstitution works, common mistakes to avoid, and storage tips.
              </span>
            </li>
          </ul>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Button asChild variant="brand">
            <Link href="/plan">Build my mixing plan</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
