"use client";

import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceShellProps {
  /** Left rail: the queue of records being processed. */
  queue: React.ReactNode;
  /** Centre pane: the item under review, always visible on desktop. */
  children: React.ReactNode;
  /** Right rail: decisions, editable fields, supporting context. Optional. */
  aside?: React.ReactNode;
  /** Header strip: position in the queue, item identity, shortcut hints. */
  header?: React.ReactNode;
  /** Sticky bottom strip: Approve & next, Save, Skip, and friends. */
  actionBar?: React.ReactNode;
  /**
   * Mobile only. `false` shows the queue full-width; `true` swaps to the
   * record with a back affordance. Desktop always shows every pane, so this
   * is ignored from `lg` up.
   */
  hasSelection: boolean;
  onBack?: () => void;
  backLabel?: string;
  /** Outer height. Defaults to filling the admin content area. */
  className?: string;
}

/**
 * The one-screen workspace: queue on the left, the record in the middle,
 * decisions on the right, actions pinned along the bottom. Every pane scrolls
 * independently so moving through a long body never scrolls the queue away.
 *
 * Below `lg` this is deliberately NOT three squeezed columns. It becomes a
 * queue that swaps to a single record view, with the right rail folded in
 * below the record — the mobile shape people actually use.
 */
export function WorkspaceShell({
  queue,
  children,
  aside,
  header,
  actionBar,
  hasSelection,
  onBack,
  backLabel = "Back to queue",
  className,
}: WorkspaceShellProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-card",
        "h-[calc(100dvh-7rem)] min-h-[34rem]",
        className
      )}
    >
      {header ? (
        <div className="shrink-0 border-b border-border bg-muted/30 px-3 py-2 sm:px-4">
          {header}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 lg:grid lg:grid-cols-[clamp(15rem,20vw,19rem)_minmax(0,1fr)_clamp(17rem,24vw,22rem)]">
        {/* Queue */}
        <div
          className={cn(
            "min-h-0 flex-1 flex-col overflow-y-auto lg:flex",
            hasSelection ? "hidden lg:flex" : "flex"
          )}
        >
          {queue}
        </div>

        {/*
          `lg:contents` promotes the record and the rail to direct grid items
          at desktop width. Below that this wrapper stays a real box, so the
          rail simply flows underneath the record in one scroll.
        */}
        <div
          className={cn(
            "min-h-0 flex-1 flex-col overflow-y-auto lg:contents",
            hasSelection ? "flex" : "hidden lg:contents"
          )}
        >
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex shrink-0 items-center gap-1 border-b border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground lg:hidden"
            >
              <ChevronLeft className="h-4 w-4" /> {backLabel}
            </button>
          ) : null}

          <main className="min-w-0 border-border lg:min-h-0 lg:overflow-y-auto lg:border-l">
            {children}
          </main>

          {aside ? (
            <aside className="min-w-0 border-t border-border lg:min-h-0 lg:overflow-y-auto lg:border-l lg:border-t-0">
              {aside}
            </aside>
          ) : null}
        </div>
      </div>

      {actionBar ? (
        <div className="shrink-0 border-t border-border bg-card px-3 py-2.5 sm:px-4">
          {actionBar}
        </div>
      ) : null}
    </div>
  );
}

/** Section heading used inside the queue and the right rail. */
export function PaneLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-4 pb-2 pt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

/** A single row in the queue rail. */
export function QueueRow({
  index,
  active,
  onSelect,
  title,
  meta,
  trailing,
  muted,
}: {
  index: number;
  active: boolean;
  onSelect: () => void;
  title: React.ReactNode;
  meta?: React.ReactNode;
  trailing?: React.ReactNode;
  muted?: boolean;
}) {
  const ref = React.useRef<HTMLButtonElement>(null);

  // Keep the highlighted row in view when the queue is driven from the
  // keyboard, without stealing focus from whatever field is being edited.
  React.useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors",
        active ? "bg-muted" : "hover:bg-muted/50"
      )}
    >
      <span className="w-5 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm",
            active ? "font-semibold" : "font-medium",
            muted && "text-muted-foreground"
          )}
        >
          {title}
        </span>
        {meta ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {meta}
          </span>
        ) : null}
      </span>
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </button>
  );
}

/** Monospaced shortcut chip, e.g. `J / K` or `⌘↵`. */
export function KeyHint({
  keys,
  label,
}: {
  keys: string;
  label: string;
}) {
  return (
    <span className="hidden items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground sm:inline-flex">
      <kbd className="font-mono text-[11px] text-foreground">{keys}</kbd>
      {label}
    </span>
  );
}

/** Label/value row used in the right rail. */
export function FieldRow({
  label,
  children,
  attention,
}: {
  label: string;
  children: React.ReactNode;
  attention?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-border px-4 py-2.5 text-sm last:border-b-0",
        attention && "bg-amber-50"
      )}
    >
      <span
        className={cn(
          "shrink-0 text-muted-foreground",
          attention && "text-amber-900"
        )}
      >
        {label}
      </span>
      <span className="min-w-0 truncate text-right font-medium">{children}</span>
    </div>
  );
}
