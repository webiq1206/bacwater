"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

interface Props {
  /** Path or absolute URL to share. Relative paths are resolved against the origin. */
  url: string;
  title?: string;
  text?: string;
  className?: string;
  /** When true, render as a compact icon+label suitable for the sticky bar. */
  compact?: boolean;
}

/**
 * Share a plan using the native share sheet on supported devices (all modern
 * mobile browsers), falling back to copying the link to the clipboard. One
 * button that "just works" on both desktop and mobile.
 */
export function PlanShareButton({ url, title, text, className, compact }: Props) {
  const [done, setDone] = useState(false);

  async function handleShare() {
    const absolute =
      typeof window !== "undefined" && url.startsWith("/")
        ? `${window.location.origin}${url}`
        : url;

    // Native share sheet (iOS/Android/Safari/Edge): SMS, email, AirDrop, etc.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: absolute });
        return;
      } catch {
        // User dismissed the sheet, or share failed — fall through to copy.
      }
    }

    // Fallback: copy the link.
    try {
      await navigator.clipboard.writeText(absolute);
      setDone(true);
      toast({ title: "Link copied", description: absolute });
      setTimeout(() => setDone(false), 2000);
    } catch {
      toast({ title: "Couldn't share", description: "Copy the link from your address bar." });
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        "inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors",
        compact
          ? "flex-col gap-1 text-xs"
          : "h-10 px-4 border border-border bg-white hover:bg-muted rounded-lg",
        className
      )}
      aria-label="Share this plan"
    >
      {done ? (
        <Check className={compact ? "h-5 w-5 accent-check" : "h-4 w-4 accent-check"} />
      ) : (
        <Share2 className={compact ? "h-5 w-5" : "h-4 w-4"} />
      )}
      Share
    </button>
  );
}
