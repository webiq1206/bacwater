"use client";

import { toast } from "@/components/ui/toaster";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { trackUsage } from "@/lib/analytics";

/**
 * Small copy-to-clipboard control for calculator results, so users don't have
 * to re-type a number onto a syringe or into an order.
 */
export function CopyButton({
  value,
  label = "Copy",
  className = "",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          trackUsage("result_copied");
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast({ title: "Copy unavailable", description: "Select the visible value and copy it manually.", variant: "destructive" });
        }
      }}
      aria-label={`Copy ${value}`}
      aria-live="polite"
      className={`inline-flex min-h-11 items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}
