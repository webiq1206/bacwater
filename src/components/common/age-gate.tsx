"use client";

import { useState } from "react";
import { ShieldCheck, FlaskConical } from "lucide-react";
import { POSITIONING_STATEMENT } from "@/lib/positioning";

const COOKIE = "bacwater_age_ok";

/**
 * 21+ confirmation, shown as a non-blocking bottom banner.
 *
 * This used to be a full-screen overlay that covered the page and locked body
 * scroll until the visitor confirmed. Age verification is a permitted
 * interstitial as far as Google is concerned, so it was not what kept pages
 * out of the index, but it did mean every first-time visitor and every
 * stricter renderer (Bing, several AI crawlers) met a covered page before any
 * content. On a site whose entire job is answering a question on arrival, that
 * is a lot of engagement to spend on a confirmation click.
 *
 * The banner keeps the same confirmation and the same cookie. It just lets the
 * answer stay readable behind it. Declining still blanks the page, so an
 * under-21 visitor does not simply get to dismiss their way in.
 */
export function AgeGate({ initialVerified }: { initialVerified: boolean }) {
  const [verified, setVerified] = useState(initialVerified);
  const [declined, setDeclined] = useState(false);

  if (verified) return null;

  function confirm() {
    // Remember for a year on this device.
    document.cookie = `${COOKIE}=1; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
    try {
      localStorage.setItem(COOKIE, "1");
    } catch {
      /* private mode, cookie still covers it */
    }
    setVerified(true);
  }

  // Declining is the one case that still takes over the screen: someone who
  // has said they are under 21 should not keep reading.
  if (declined) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background"
      >
        <div className="w-full max-w-md text-center">
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
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-labelledby="age-gate-title"
      className="fixed inset-x-0 bottom-0 z-[200] border-t border-border bg-card/95 backdrop-blur-sm shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span
              id="age-gate-title"
              className="text-xs uppercase tracking-widest font-medium"
            >
              Age check &mdash; are you 21 or older?
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {POSITIONING_STATEMENT}
          </p>
          <div className="mt-2 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <FlaskConical className="h-3.5 w-3.5 mt-px shrink-0" />
            <span>
              By continuing you confirm you are 21 or older and understand this
              site is a calculation and reference tool for research and
              educational use.
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
          <button
            type="button"
            onClick={confirm}
            className="h-12 rounded-xl bg-foreground px-6 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Yes, I am 21 or older
          </button>
          <button
            type="button"
            onClick={() => setDeclined(true)}
            className="h-12 rounded-xl border border-border bg-white px-6 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            No, I am under 21
          </button>
        </div>
      </div>
    </div>
  );
}
