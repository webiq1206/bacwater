"use client";
import { usePathname } from "next/navigation";
import { isCalculatorWorkspace } from "@/lib/calculator-routes";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, FlaskConical } from "lucide-react";
import { POSITIONING_STATEMENT } from "@/lib/positioning";

const COOKIE = "bacwater_age_ok";

/** The existing age check remains a banner while browsing. A focused calculator
 * uses a dedicated confirmation screen so its controls never hide behind the app.
 * The confirmation cookie, minimum age and decline behavior are unchanged. */
export function AgeGate({ initialVerified }: { initialVerified: boolean }) {
  const workspace = isCalculatorWorkspace(usePathname() || "/");
  const [verified, setVerified] = useState(initialVerified);
  const [declined, setDeclined] = useState(false);

  const declinedButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!declined && !(workspace && !verified)) return;
    const prior = document.activeElement as HTMLElement | null;
    const bodyChildren = [...document.body.children].filter((e) => e instanceof HTMLElement && !e.querySelector("#age-gate-title")) as HTMLElement[];
    const previous = bodyChildren.map((e) => e.inert);
    bodyChildren.forEach((e) => { e.inert = true; });
    declinedButton.current?.focus();
    return () => { bodyChildren.forEach((e, i) => { e.inert = previous[i]; }); prior?.focus(); };
  }, [declined, workspace, verified]);
  if (verified) return null;

  function confirm() {
    // Remember for a year on this device.
    document.cookie = `${COOKIE}=1; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    try {
      localStorage.setItem(COOKIE, "1");
    } catch {
      /* private mode, cookie still covers it */
    }
    setVerified(true);
  }

  // A visitor who declines cannot continue into the calculator.
  if (declined) {
    return (
      <div
        role="dialog"
        data-state="open"
        onKeyDown={(e) => { if (e.key === "Escape") setDeclined(false); if (e.key === "Tab") { e.preventDefault(); declinedButton.current?.focus(); } }}
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
            ref={declinedButton}
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
      role={workspace ? "dialog" : "region"}
      aria-modal={workspace ? true : undefined}
      aria-labelledby="age-gate-title"
      data-age-gate
      onKeyDown={event => {
        if (!workspace || event.key !== "Tab") return;
        const controls=[...event.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
        if(event.shiftKey && document.activeElement===controls[0]) { event.preventDefault(); controls.at(-1)?.focus(); }
        else if(!event.shiftKey && document.activeElement===controls.at(-1)) { event.preventDefault(); controls[0]?.focus(); }
      }}
      className={workspace ? "no-print fixed inset-0 z-[200] flex items-center overflow-auto bg-background p-3" : "no-print border-b border-border bg-card"}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span
              id="age-gate-title"
              className="text-xs uppercase tracking-widest font-medium"
            >
              Age check: are you 21 or older?
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
            ref={declinedButton}
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
