"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Download, LogIn, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Shown right after a plan is saved. Always offers the PDF download first,
 * then routes based on auth state:
 * - signed-in: a single primary action to My Saved Plans
 * - signed-out: sign in / create account (the plan is claimed into the account
 *   after auth), or continue without an account (plan stays on this device)
 */
export function PostSaveDialog({
  publicId,
  ownedByUser,
  open,
  onOpenChange,
}: {
  publicId: string;
  ownedByUser: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  function dismissTo(path: string) {
    onOpenChange(false);
    router.push(path);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          // Dismissing still lands somewhere useful: the saved plan page.
          dismissTo(`/plan/${publicId}`);
        } else {
          onOpenChange(next);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <DialogTitle>Plan saved</DialogTitle>
          </div>
          <DialogDescription>
            Your reconstitution plan is ready. Download the PDF to keep a copy
            or print it out.
          </DialogDescription>
        </DialogHeader>

        <Button asChild variant="brand" size="lg" className="w-full">
          {/* Open in a new tab so the user keeps their place in this flow. */}
          <a href={`/plan/${publicId}/pdf`} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" /> Download PDF
          </a>
        </Button>

        {ownedByUser ? (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => dismissTo("/plans")}
            >
              Go to My Saved Plans <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => dismissTo(`/plan/${publicId}`)}
            >
              View this plan
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Sign in or create a free account to keep this plan in your
              account and access it from any device.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="lg">
                <Link href="/signin?next=/plans">
                  <LogIn className="h-4 w-4" /> Sign in
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/signup">
                  <UserPlus className="h-4 w-4" /> Create account
                </Link>
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => dismissTo(`/plan/${publicId}`)}
            >
              Continue without an account
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              No account? Your plan stays saved on this device.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
