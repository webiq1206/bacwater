import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

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

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-16 pb-24">
      <Card>
        <CardContent className="p-8 sm:p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-brand-soft grid place-items-center">
            <CheckCircle2 className="h-6 w-6 text-brand" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            Order confirmed
          </h1>
          <p className="mt-2 text-muted-foreground">
            Thank you! We&apos;ll email you when your order ships.
          </p>
          {found ? (
            <div className="mt-6 text-sm">
              <div className="text-xs text-muted-foreground">Order</div>
              <div className="font-medium">#{found.publicId}</div>
              <div className="mt-4 rounded-2xl bg-muted p-4 text-left">
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
          <div className="mt-8">
            <Button asChild variant="brand">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
