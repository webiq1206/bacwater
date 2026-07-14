"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, FlaskConical } from "lucide-react";

const COOKIE = "bacwater_age_ok";

/**
 * Full-screen 21+ age confirmation shown before a visitor can use the site.
 *
 * To avoid a flash of the page behind it, the server reads the confirmation
 * cookie and passes `initialVerified`, so the overlay is present in the very
 * first HTML when the visitor hasn't confirmed yet.
 */
export function AgeGate({ initialVerified }: { initialVerified: boolean }) {
  const [verified, setVerified] = useState(initialVerified);
  const [declined, setDeclined] = useState(false);

  // Lock background scroll while the gate is up.
  useEffect(() => {
    if (!verified) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [verified]);

  if (verified) return null;

  function confirm() {
    // Remember for a year on this device.
    document.cookie = `${COOKIE}=1; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
    try {
      localStorage.setItem(COOKIE, "1");
    } catch {
      /* private mode — cookie still covers it */
    }
    setVerified(true);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-md"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 sm:p-8 shadow-xl">
        {declined ? (
          <div className="text-center">
            <h2
              id="age-gate-title"
              className="text-2xl font-serif font-medium tracking-tight"
            >
              Come back when you&apos;re 21
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              You must be at least 21 years old to use BACwater.ai. This site is
              for laboratory and research professionals only.
            </p>
            <button
              type="button"
              onClick={() => setDeclined(false)}
              className="mt-6 text-sm font-medium underline underline-offset-4 text-muted-foreground hover:text-foreground"
            >
              Go back
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs uppercase tracking-widest font-medium">
                Age check
              </span>
            </div>

            <h2
              id="age-gate-title"
              className="mt-4 text-2xl sm:text-3xl font-serif font-medium tracking-tight"
            >
              Are you 21 or older?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              You must be at least 21 to enter. BACwater.ai provides calculators
              and supplies for{" "}
              <strong className="text-foreground">laboratory research use only</strong>
              . Nothing here is for human or veterinary use, and nothing here is
              medical advice.
            </p>

            <div className="mt-6 grid gap-2.5">
              <button
                type="button"
                onClick={confirm}
                className="h-12 w-full rounded-xl bg-foreground text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Yes, I am 21 or older
              </button>
              <button
                type="button"
                onClick={() => setDeclined(true)}
                className="h-12 w-full rounded-xl border border-border bg-white text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                No, I am under 21
              </button>
            </div>

            <div className="mt-6 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
              <FlaskConical className="h-3.5 w-3.5 mt-px shrink-0" />
              <span>
                By entering you confirm you are 21+ and understand all content
                and products are strictly for laboratory research and
                educational purposes.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
