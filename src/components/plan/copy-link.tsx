"use client";

import { useState } from "react";
import { toast } from "@/components/ui/toaster";

export function CopyLinkClient({ publicId }: { publicId: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/plan/${publicId}`);
          setCopied(true);
          toast({ title: "Link copied", variant: "success" });
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast({ title: "Could not copy" });
        }
      }}
      className="text-sm text-foreground font-medium hover:underline"
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
