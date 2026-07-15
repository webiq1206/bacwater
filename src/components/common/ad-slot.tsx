"use client";

import { useEffect } from "react";

const AD_CLIENT = "ca-pub-3192081478482854";

/**
 * Replace with a real ad-unit slot ID from your AdSense dashboard:
 * Ads → By ad unit → Display ads → create a responsive unit → copy the
 * `data-ad-slot` value here. Until then, ads will not fill in production.
 * (You can also just enable Auto ads in AdSense and ignore these units.)
 */
export const DEFAULT_AD_SLOT = "0000000000";

/**
 * A single responsive AdSense display unit, used only inside long-form content
 * (never on the calculators, wizard, or results — a tool page should not carry
 * ads). Renders the real unit in production; in development it shows a labeled
 * placeholder so ad positions are visible while building.
 */
export function AdSlot({
  slot = DEFAULT_AD_SLOT,
  className = "",
}: {
  slot?: string;
  className?: string;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /* loader not ready yet; the push queues on the array */
    }
  }, []);

  if (process.env.NODE_ENV !== "production") {
    return (
      <div className={`my-8 ${className}`} aria-hidden>
        <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-border bg-muted/40 py-8 text-center text-xs text-muted-foreground">
          Advertisement placeholder (slot {slot})
        </div>
      </div>
    );
  }

  return (
    <div className={`my-8 ${className}`}>
      <div className="mb-1 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
        Advertisement
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
