"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PREFERRED_SOURCE_PUBLICATION,
  PREFERRED_SOURCE_SCRIPT,
  preferredSourceDeeplink,
} from "@/lib/preferred-source";

/**
 * "Add BACwater.ai as a preferred source" control.
 *
 * Renders the button exactly the way Google's publisher guide specifies: load
 * `publisher.js` once, then leave an empty container carrying the
 * `google-add-preferred-source-btn` attribute wherever the button belongs. The
 * library hydrates the container into a Google-branded button, and a click
 * opens a short confirmation overlay that drops the reader back on the page
 * they were reading.
 *
 * Two things the bare snippet does not handle, and this component does:
 *
 *  - **The library never arriving.** Ad blockers, tracking-protection modes,
 *    and a stale CSP all silently leave the container empty, turning the call
 *    to action into blank space. If nothing has rendered shortly after mount we
 *    swap in Google's documented deeplink, which needs no JavaScript and lands
 *    the reader on the same source preferences tool with our domain pre-filled.
 *  - **Client-side navigation.** The script scans on load, so a container that
 *    mounts during a soft navigation can be missed. The same fallback covers
 *    it, so the control is never dead.
 *
 * `variant="link"` skips the Google button entirely and renders the deeplink on
 * its own. Use it in dense chrome like the footer, where a third-party script
 * per page view buys less than a plain link does.
 */

const SCRIPT_ID = "google-preferred-source-lib";

/** How long to wait for Google's library before falling back to the deeplink. */
const HYDRATE_TIMEOUT_MS = 3500;

function ensureLibrary(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = PREFERRED_SOURCE_SCRIPT;
  document.head.appendChild(script);
}

export interface PreferredSourceButtonProps {
  /**
   * "button" mounts Google's own rendered button (with a deeplink fallback).
   * "link" renders only the deeplink, styled by the caller.
   */
  variant?: "button" | "link";
  /** Passed through to Google's button as `data-theme`. */
  theme?: "light" | "dark";
  /** Passed through as `data-lang`, pinning the overlay's language. */
  lang?: string;
  /** Link text for the deeplink (fallback, `noscript`, and "link" variant). */
  label?: string;
  className?: string;
  /** Extra classes for the deeplink anchor only. */
  linkClassName?: string;
}

export function PreferredSourceButton({
  variant = "button",
  theme = "light",
  lang = "en",
  label = `Add ${PREFERRED_SOURCE_PUBLICATION} as a preferred source`,
  className,
  linkClassName,
}: PreferredSourceButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(variant === "link");
  const href = preferredSourceDeeplink();

  useEffect(() => {
    if (variant === "link") return;
    ensureLibrary();

    // Google's button is injected into the container, so "did it render?" is
    // just "does the container have children?". Watch for it, and give up on a
    // timer rather than polling forever.
    const el = containerRef.current;
    if (!el) return;
    if (el.childElementCount > 0) return;

    const observer = new MutationObserver(() => {
      if (el.childElementCount > 0) {
        setShowFallback(false);
        observer.disconnect();
      }
    });
    observer.observe(el, { childList: true });

    const timer = window.setTimeout(() => {
      if (el.childElementCount === 0) setShowFallback(true);
      observer.disconnect();
    }, HYDRATE_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [variant]);

  const deeplink = (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        linkClassName
      )}
    >
      {label}
    </a>
  );

  if (variant === "link") {
    return <div className={className}>{deeplink}</div>;
  }

  return (
    <div className={className}>
      <div
        ref={containerRef}
        google-add-preferred-source-btn=""
        data-theme={theme}
        data-lang={lang}
      />
      {showFallback && deeplink}
      <noscript>{deeplink}</noscript>
    </div>
  );
}
