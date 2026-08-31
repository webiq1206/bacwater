"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Archive,
  ArchiveRestore,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Printer,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  WorkspaceShell,
  PaneLabel,
  QueueRow,
  KeyHint,
  FieldRow,
} from "@/components/workspace/workspace-shell";
import { useQueueKeys } from "@/components/workspace/use-queue-keys";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { formatDate } from "@/lib/utils";
import { formatDose } from "@/lib/calc/format";
import type { CalcResult } from "@/lib/calc";
import { PlanResults } from "@/components/plan/plan-results";
import {
  deletePlanAsAdmin,
  getAdminPlanDetail,
  setPlanArchivedAsAdmin,
} from "@/lib/admin-actions";

export interface PlanRow {
  publicId: string;
  name: string | null;
  peptideName: string | null;
  ownerEmail: string | null;
  vialStrengthMg: number;
  doseMcg: number;
  dosesPerVial: number;
  archived: boolean;
  expirationDate: string | null;
  createdAt: string;
}

type Detail = NonNullable<Awaited<ReturnType<typeof getAdminPlanDetail>>["plan"]>;
type Filter = "active" | "archived" | "all";

export function PlansWorkspace({
  plans,
  initialId,
}: {
  plans: PlanRow[];
  /** Preselect a plan — how the users workspace links into this one. */
  initialId?: string;
}) {
  const [rows, setRows] = useState(plans);
  // An archived plan linked to directly would be filtered out of the default
  // "active" view, so widen the filter when the target is archived.
  const [filter, setFilter] = useState<Filter>(
    initialId && plans.find((p) => p.publicId === initialId)?.archived ? "all" : "active"
  );
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialId ?? null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();

  const queue = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "active" && r.archived) return false;
      if (filter === "archived" && !r.archived) return false;
      if (!q) return true;
      return (
        (r.name ?? "").toLowerCase().includes(q) ||
        (r.peptideName ?? "").toLowerCase().includes(q) ||
        (r.ownerEmail ?? "guest").toLowerCase().includes(q) ||
        r.publicId.toLowerCase().includes(q)
      );
    });
  }, [rows, filter, query]);

  const index = queue.findIndex((r) => r.publicId === selectedId);
  const current = index >= 0 ? queue[index] : null;

  // Load the full snapshot for whatever is selected. A stale flag keeps a slow
  // response from overwriting a newer selection.
  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let stale = false;
    setLoading(true);
    getAdminPlanDetail(selectedId)
      .then((res) => {
        if (stale) return;
        if (res.ok) setDetail(res.plan);
        else {
          setDetail(null);
          toast({ title: "Could not load plan", description: res.error, variant: "destructive" });
        }
      })
      .finally(() => {
        if (!stale) setLoading(false);
      });
    return () => {
      stale = true;
    };
  }, [selectedId]);

  const move = useCallback(
    (delta: number) => {
      if (queue.length === 0) return;
      // With nothing picked yet, the first press lands on the first row rather
      // than stepping past it.
      if (index < 0) {
        setSelectedId(queue[0].publicId);
        return;
      }
      const next = Math.min(queue.length - 1, Math.max(0, index + delta));
      setSelectedId(queue[next].publicId);
    },
    [index, queue]
  );

  function toggleArchive() {
    if (!current) return;
    const id = current.publicId;
    const next = !current.archived;
    startTransition(async () => {
      const res = await setPlanArchivedAsAdmin(id, next);
      setRows((rs) => rs.map((r) => (r.publicId === id ? { ...r, archived: res.archived } : r)));
      setDetail((d) => (d && d.publicId === id ? { ...d, archived: res.archived } : d));
      toast({ title: res.archived ? "Archived" : "Restored", variant: "success" });
      if (filter !== "all") move(1);
    });
  }

  function remove() {
    if (!current) return;
    if (
      !window.confirm(
        `Delete plan ${current.publicId}? Anyone holding its link or a printed QR label loses it permanently.`
      )
    )
      return;
    const id = current.publicId;
    startTransition(async () => {
      await deletePlanAsAdmin(id);
      const remaining = queue.filter((r) => r.publicId !== id);
      setRows((rs) => rs.filter((r) => r.publicId !== id));
      setSelectedId(remaining[Math.min(Math.max(index, 0), remaining.length - 1)]?.publicId ?? null);
      toast({ title: "Plan deleted", variant: "success" });
    });
  }

  useQueueKeys({
    onNext: () => move(1),
    onPrev: () => move(-1),
    onSkip: () => move(1),
    onEscape: () => setSelectedId(null),
    enabled: !pending,
  });

  const expired =
    current?.expirationDate && new Date(current.expirationDate) < new Date();

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Plans</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Inspect any saved plan in place — no trip out to the public site.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Peptide, owner, or ID"
              className="h-9 w-56 pl-8 text-sm"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
            {(["active", "archived", "all"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${filter === f ? "bg-muted" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <WorkspaceShell
        hasSelection={Boolean(selectedId)}
        onBack={() => setSelectedId(null)}
        header={
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {queue.length === 0 ? "No plans" : `Plan ${Math.max(index, 0) + 1} of ${queue.length}`}
              </span>
              {current ? (
                <span className="truncate rounded-full border border-border px-2.5 py-0.5 font-mono text-xs">
                  {current.publicId}
                </span>
              ) : null}
            </div>
            <KeyHint keys="J / K" label="move" />
          </div>
        }
        queue={
          <>
            <PaneLabel>Queue</PaneLabel>
            {queue.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                <FileText className="mx-auto mb-2 h-5 w-5" />
                No plans match.
              </div>
            ) : (
              <div className="pb-3">
                {queue.map((p, i) => (
                  <QueueRow
                    key={p.publicId}
                    index={i}
                    active={selectedId === p.publicId}
                    onSelect={() => setSelectedId(p.publicId)}
                    title={p.name || p.peptideName || "Untitled plan"}
                    meta={`${p.ownerEmail ?? "guest"} · ${formatDate(p.createdAt)}`}
                    muted={p.archived}
                    trailing={
                      p.archived ? <Archive className="h-3.5 w-3.5 text-muted-foreground" /> : null
                    }
                  />
                ))}
              </div>
            )}
          </>
        }
        aside={
          current ? (
            <div className="pb-4">
              <PaneLabel>Record</PaneLabel>
              <div className="border-y border-border">
                <FieldRow label="Plan ID">
                  <span className="font-mono text-xs">{current.publicId}</span>
                </FieldRow>
                <FieldRow label="Owner">
                  {detail?.owner ? (
                    <Link
                      href={`/admin/users?email=${encodeURIComponent(detail.owner.email)}`}
                      className="hover:underline"
                    >
                      {detail.owner.email}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">Guest (unclaimed)</span>
                  )}
                </FieldRow>
                <FieldRow label="Saved">{formatDate(current.createdAt)}</FieldRow>
                <FieldRow label="Vial">{current.vialStrengthMg} mg</FieldRow>
                <FieldRow label="Amount">{formatDose(current.doseMcg)}</FieldRow>
                <FieldRow label="Measures/vial">{current.dosesPerVial}</FieldRow>
                <FieldRow label="Expires" attention={Boolean(expired)}>
                  {current.expirationDate ? formatDate(current.expirationDate) : "—"}
                </FieldRow>
                <FieldRow label="Status">
                  <Badge variant={current.archived ? "outline" : "success"}>
                    {current.archived ? "archived" : "active"}
                  </Badge>
                </FieldRow>
              </div>

              {detail?.notes ? (
                <>
                  <PaneLabel>Owner&apos;s notes</PaneLabel>
                  <p className="whitespace-pre-line px-4 text-sm leading-relaxed text-foreground/90">
                    {detail.notes}
                  </p>
                </>
              ) : null}

              <PaneLabel>Open elsewhere</PaneLabel>
              <div className="flex flex-col gap-2 px-4">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/plan/${current.publicId}`} target="_blank">
                    <ExternalLink className="h-4 w-4" /> Public page
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/plan/${current.publicId}/pdf`} target="_blank">
                    <Download className="h-4 w-4" /> PDF
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/plan/${current.publicId}/label`} target="_blank">
                    <Printer className="h-4 w-4" /> Vial label
                  </Link>
                </Button>
              </div>
            </div>
          ) : null
        }
        actionBar={
          current ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => move(1)} disabled={pending} variant="brand">
                Next plan <span className="ml-1 font-mono text-[10px] opacity-70">J</span>
              </Button>
              <Button onClick={toggleArchive} disabled={pending} variant="outline">
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : current.archived ? (
                  <ArchiveRestore className="h-4 w-4" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}
                {current.archived ? "Restore" : "Archive"}
              </Button>
              <Button
                onClick={remove}
                disabled={pending}
                variant="ghost"
                className="ml-auto text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          ) : null
        }
      >
        {loading ? (
          <div className="flex h-full min-h-[16rem] items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading plan…
          </div>
        ) : detail ? (
          <div className="p-4 sm:p-5">
            {detail.parseError ? (
              <div className="mb-4 flex gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <div className="font-medium">Snapshot unreadable</div>
                  <p className="mt-0.5 text-xs leading-relaxed">
                    {detail.parseError} The summary in the right rail comes from the
                    plan&apos;s own columns and is still accurate.
                  </p>
                </div>
              </div>
            ) : null}
            {detail.result ? (
              <PlanResults result={detail.result as CalcResult} />
            ) : (
              <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
                No rendered plan available for this record.
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full min-h-[16rem] items-center justify-center p-8 text-center text-sm text-muted-foreground">
            {queue.length === 0 ? "Nothing to show." : "Pick a plan, or press J to start."}
          </div>
        )}
      </WorkspaceShell>
    </div>
  );
}
