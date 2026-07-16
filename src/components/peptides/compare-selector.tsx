"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";

interface Option {
  slug: string;
  name: string;
}

/**
 * Two dropdowns that drive the side-by-side comparison. Changing either one
 * navigates to /peptides/compare?a=..&b=.. so the comparison is server-rendered,
 * shareable, and indexable. A swap button flips the two sides.
 */
export function CompareSelector({
  options,
  a,
  b,
}: {
  options: Option[];
  a: string;
  b: string;
}) {
  const router = useRouter();

  function go(next: { a?: string; b?: string }) {
    const params = new URLSearchParams({ a: next.a ?? a, b: next.b ?? b });
    router.push(`/peptides/compare?${params.toString()}`);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 sm:items-end">
      <label className="block">
        <span className="eyebrow">First compound</span>
        <select
          value={a}
          onChange={(e) => go({ a: e.target.value })}
          className="mt-1.5 h-11 w-full border border-input bg-card px-3 text-sm"
          aria-label="First compound to compare"
        >
          {options.map((o) => (
            <option key={o.slug} value={o.slug}>
              {o.name}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() => go({ a: b, b: a })}
        className="hidden sm:inline-flex h-11 w-11 items-center justify-center border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Swap the two compounds"
        title="Swap"
      >
        <ArrowLeftRight className="h-4 w-4" />
      </button>

      <label className="block">
        <span className="eyebrow">Second compound</span>
        <select
          value={b}
          onChange={(e) => go({ b: e.target.value })}
          className="mt-1.5 h-11 w-full border border-input bg-card px-3 text-sm"
          aria-label="Second compound to compare"
        >
          {options.map((o) => (
            <option key={o.slug} value={o.slug}>
              {o.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
