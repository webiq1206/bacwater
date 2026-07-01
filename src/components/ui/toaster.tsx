"use client";

import * as React from "react";

type Toast = { id: string; title: string; description?: string; variant?: "default" | "success" | "destructive" };

const listeners = new Set<(t: Toast) => void>();

export function toast(t: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  listeners.forEach((l) => l({ ...t, id }));
}

export function Toaster() {
  const [items, setItems] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    const l = (t: Toast) => {
      setItems((prev) => [...prev, t]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== t.id)), 4000);
    };
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[80] flex flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={
            "min-w-[280px] rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-lift)] " +
            (t.variant === "destructive"
              ? "text-destructive"
              : t.variant === "success"
                ? "text-emerald-700"
                : "")
          }
        >
          <div className="text-sm font-semibold">{t.title}</div>
          {t.description ? (
            <div className="text-sm text-muted-foreground mt-0.5">
              {t.description}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
