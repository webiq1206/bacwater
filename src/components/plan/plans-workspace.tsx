"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArchiveRestore,
  CalendarClock,
  Copy,
  Download,
  Loader2,
  Pencil,
  Plus,
  Printer,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { formatDate } from "@/lib/utils";
import { formatDose, formatSyringeReading, formatUnits } from "@/lib/calc/format";
import type { CalcResult } from "@/lib/calc";
import { PlanResults } from "@/components/plan/plan-results";
import { PlanQr } from "@/components/plan/plan-qr";
import { CopyLinkClient } from "@/components/plan/copy-link";
import { PlanShareButton } from "@/components/plan/plan-share-button";
import {
  duplicatePlanAction,
  getPlanDetailAction,
  removePlanAction,
  togglePlanArchivedAction,
  updatePlanAction,
  updatePlanNotesAction,
} from "@/lib/plan-actions";
import {
  PlanInlineEditor,
  type PlanEditableFields,
} from "@/components/plan/plan-inline-editor";
import type { SyringeType } from "@/lib/calc";

export interface PlanSummary {
  publicId: string;
  name: string | null;
  peptideName: string | null;
  vialStrengthMg: number;
  doseMcg: number;
  dosesPerVial: number;
  syringeUnits: number;
  /** Pre-formatted on the server from the stored snapshot, so it matches the PDF. */
  readout: string;
  injectionsPerWeek: number | null;
  archived: boolean;
  dateMixed: string | null;
  expirationDate: string | null;
  createdAt: string;
}

type Detail = NonNullable<Awaited<ReturnType<typeof getPlanDetailAction>>["plan"]>;
type Tab = "active" | "archived";

/**
 * Pull the syringe reading out of a recalculated snapshot so the queue row
 * matches the plan page and the PDF. Returns null when the snapshot is
 * unreadable, and the caller keeps whatever it had.
 */
function readoutOf(result: unknown): string | null {
  const readout = (result as CalcResult | null)?.syringeReadout;
  return readout ? formatSyringeReading(readout) : null;
}

function expiryState(expirationDate: string | null) {
  if (!expirationDate) return null;
  const days = Math.ceil(
    (new Date(expirationDate).getTime() - Date.now()) / 86_400_000
  );
  if (days < 0) return { tone: "expired" as const, label: `Expired ${Math.abs(days)}d ago` };
  if (days <= 7) return { tone: "soon" as const, label: `${days}d left` };
  return { tone: "ok" as const, label: `${days}d left` };
}

/**
 * My Plans as one screen: the plan list on the left, the plan itself in the
 * middle, and everything you can do to it on the right. Opening a plan used to
 * be a full page navigation to /plan/[id] and a trip back for the next one,
 * which made comparing two plans or printing a batch of labels needlessly slow.
 *
 * /plan/[id] is untouched — shared links and printed QR codes still land there.
 */
export function PlansWorkspace({ plans }: { plans: PlanSummary[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(plans);
  const [tab, setTab] = useState<Tab>("active");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(false);
  // Label-batching selection. Empty set = normal browsing; the checkboxes only
  // appear once the mode is on, so the queue stays uncluttered the rest of the time.
  const [labelMode, setLabelMode] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  const queue = useMemo(
    () => rows.filter((r) => (tab === "archived" ? r.archived : !r.archived)),
    [rows, tab]
  );
  const index = queue.findIndex((r) => r.publicId === selectedId);
  const current = index >= 0 ? queue[index] : null;

  useEffect(() => {
    // Switching plans always leaves edit mode, so an open form can never be
    // showing one plan's numbers while the rails describe another.
    setEditing(false);
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let stale = false;
    setLoading(true);
    getPlanDetailAction(selectedId)
      .then((res) => {
        if (stale) return;
        if (res.ok) setDetail(res.plan);
        else {
          setDetail(null);
          toast({ title: "Could not open plan", description: res.error, variant: "destructive" });
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

  const noteValue = current ? notes[current.publicId] ?? detail?.notes ?? "" : "";
  const notesDirty = Boolean(current && notes[current.publicId] !== undefined && notes[current.publicId] !== (detail?.notes ?? ""));

  function saveNotes() {
    if (!current || !notesDirty) return;
    const id = current.publicId;
    const value = notes[id] ?? "";
    startTransition(async () => {
      const res = await updatePlanNotesAction(id, value);
      if (!res.ok) {
        toast({ title: "Could not save notes", variant: "destructive" });
        return;
      }
      setDetail((d) => (d && d.publicId === id ? { ...d, notes: value } : d));
      setNotes((n) => {
        const copy = { ...n };
        delete copy[id];
        return copy;
      });
      toast({ title: "Notes saved", variant: "success" });
    });
  }

  function togglePicked(publicId: string) {
    setPicked((p) =>
      p.includes(publicId) ? p.filter((id) => id !== publicId) : [...p, publicId]
    );
  }

  function saveEdits(fields: PlanEditableFields) {
    if (!current) return;
    const id = current.publicId;
    startTransition(async () => {
      const res = await updatePlanAction(
        id,
        {
          peptideSlug: fields.peptideSlug === "custom" ? null : fields.peptideSlug,
          peptideName:
            fields.peptideSlug === "custom" ? fields.peptideName || "Custom" : null,
          vialStrengthMg: fields.vialStrengthMg,
          doseMcg: fields.doseMcg,
          injectionsPerWeek: fields.injectionsPerWeek,
          bacWaterMl: fields.bacWaterMl,
          syringeType: fields.syringeType,
          dateMixed: fields.dateMixed || null,
        },
        { name: fields.name }
      );
      if (!res.ok) {
        toast({ title: "Could not save", description: res.error, variant: "destructive" });
        return;
      }
      // Re-read rather than patching locally: the recalculated readout,
      // measures per vial, and expiry all come from the server's snapshot.
      const fresh = await getPlanDetailAction(id);
      if (fresh.ok) {
        setDetail(fresh.plan);
        setRows((rs) =>
          rs.map((r) =>
            r.publicId === id
              ? {
                  ...r,
                  name: fresh.plan.name,
                  peptideName: fresh.plan.peptideName,
                  vialStrengthMg: fresh.plan.vialStrengthMg,
                  doseMcg: fresh.plan.doseMcg,
                  dosesPerVial: fresh.plan.dosesPerVial,
                  dateMixed: fresh.plan.dateMixed,
                  expirationDate: fresh.plan.expirationDate,
                  injectionsPerWeek: fresh.plan.injectionsPerWeek,
                  readout: readoutOf(fresh.plan.result) ?? r.readout,
                }
              : r
          )
        );
      }
      setEditing(false);
      toast({ title: "Plan updated", variant: "success" });
    });
  }

  function toggleArchive() {
    if (!current) return;
    const id = current.publicId;
    startTransition(async () => {
      const res = await togglePlanArchivedAction(id);
      if (!res.ok) return;
      const nowArchived = Boolean(res.archived);
      const remaining = queue.filter((r) => r.publicId !== id);
      setRows((rs) => rs.map((r) => (r.publicId === id ? { ...r, archived: nowArchived } : r)));
      setSelectedId(remaining[Math.min(Math.max(index, 0), remaining.length - 1)]?.publicId ?? null);
      toast({ title: nowArchived ? "Archived" : "Restored", variant: "success" });
    });
  }

  function duplicate() {
    if (!current) return;
    startTransition(async () => {
      const res = await duplicatePlanAction(current.publicId);
      if (!res.ok) {
        toast({ title: "Could not duplicate", variant: "destructive" });
        return;
      }
      toast({ title: "Plan duplicated", variant: "success" });
      // The copy needs a fresh server render to appear in the queue.
      router.refresh();
    });
  }

  function remove() {
    if (!current) return;
    if (!window.confirm("Delete this plan? This can't be undone.")) return;
    const id = current.publicId;
    startTransition(async () => {
      const res = await removePlanAction(id);
      if (!res.ok) {
        toast({ title: "Could not delete", description: res.error, variant: "destructive" });
        return;
      }
      const remaining = queue.filter((r) => r.publicId !== id);
      setRows((rs) => rs.filter((r) => r.publicId !== id));
      setSelectedId(remaining[Math.min(Math.max(index, 0), remaining.length - 1)]?.publicId ?? null);
      toast({ title: "Plan deleted", variant: "success" });
    });
  }

  useQueueKeys({
    onNext: () => move(1),
    onPrev: () => move(-1),
    onSave: saveNotes,
    onEscape: () => setSelectedId(null),
    // Queue navigation is off while editing: a stray J outside a text field
    // would jump to another plan and silently discard the open form.
    enabled: !pending && !editing,
  });

  const activeCount = rows.filter((r) => !r.archived).length;
  const archivedCount = rows.length - activeCount;
  const expiry = current ? expiryState(current.expirationDate) : null;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">Dashboard</div>
          <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight">My Plans</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
            {(["active", "archived"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  setSelectedId(null);
                  // Otherwise a selection made for a label sheet would silently
                  // keep plans that are no longer in the visible queue.
                  setPicked([]);
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${tab === t ? "bg-muted" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t} ({t === "active" ? activeCount : archivedCount})
              </button>
            ))}
          </div>
          <Button
            onClick={() => {
              setLabelMode((m) => !m);
              setPicked([]);
            }}
            variant={labelMode ? "brand" : "outline"}
            size="sm"
          >
            <Printer className="h-4 w-4" /> {labelMode ? "Done" : "Label sheet"}
          </Button>
          <Button asChild variant="brand" size="sm">
            <Link href="/plan">
              <Plus className="h-4 w-4" /> New plan
            </Link>
          </Button>
        </div>
      </div>

      {labelMode ? (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5">
          <span className="text-sm text-muted-foreground">
            {picked.length === 0
              ? "Tick the plans you want labels for."
              : `${picked.length} plan${picked.length === 1 ? "" : "s"} selected.`}
          </span>
          <button
            type="button"
            onClick={() => setPicked(queue.map((p) => p.publicId))}
            className="text-xs font-medium hover:underline"
          >
            Select all
          </button>
          {picked.length > 0 ? (
            <button
              type="button"
              onClick={() => setPicked([])}
              className="text-xs font-medium text-muted-foreground hover:underline"
            >
              Clear
            </button>
          ) : null}
          <Button
            asChild={picked.length > 0}
            disabled={picked.length === 0}
            variant="brand"
            size="sm"
            className="ml-auto"
          >
            {picked.length > 0 ? (
              <Link href={`/plans/labels?ids=${picked.join(",")}`} target="_blank">
                <Printer className="h-4 w-4" /> Build sheet for {picked.length}
              </Link>
            ) : (
              <span>
                <Printer className="h-4 w-4" /> Build sheet
              </span>
            )}
          </Button>
        </div>
      ) : null}

      <WorkspaceShell
        className="h-[calc(100dvh-13rem)] min-h-[32rem]"
        hasSelection={Boolean(selectedId)}
        onBack={() => setSelectedId(null)}
        backLabel="All plans"
        header={
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {queue.length === 0
                  ? "No plans"
                  : `Plan ${Math.max(index, 0) + 1} of ${queue.length}`}
              </span>
              {current ? (
                <span className="truncate rounded-full border border-border px-2.5 py-0.5 text-xs">
                  {current.name || current.peptideName || "Untitled"} · {current.readout}
                </span>
              ) : null}
            </div>
            <KeyHint keys="J / K" label="move" />
          </div>
        }
        queue={
          <>
            <PaneLabel>{tab === "archived" ? "Archived" : "Your plans"}</PaneLabel>
            {queue.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                {tab === "archived" ? "Nothing archived." : "No plans yet."}
              </div>
            ) : (
              <div className="pb-3">
                {queue.map((p, i) => {
                  const e = expiryState(p.expirationDate);
                  return (
                    <QueueRow
                      key={p.publicId}
                      index={i}
                      active={selectedId === p.publicId}
                      onSelect={() => setSelectedId(p.publicId)}
                      title={p.name || p.peptideName || "Untitled plan"}
                      meta={`${p.readout}${p.injectionsPerWeek ? ` · ${p.injectionsPerWeek}x/week` : ""}`}
                      selected={picked.includes(p.publicId)}
                      onToggleSelect={labelMode ? () => togglePicked(p.publicId) : undefined}
                      trailing={
                        e ? (
                          <span
                            className={`block h-1.5 w-1.5 rounded-full ${
                              e.tone === "expired"
                                ? "bg-destructive"
                                : e.tone === "soon"
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                            }`}
                            title={e.label}
                          />
                        ) : null
                      }
                    />
                  );
                })}
              </div>
            )}
          </>
        }
        aside={
          current ? (
            <div className="pb-4">
              <PaneLabel>At a glance</PaneLabel>
              <div className="border-y border-border">
                <FieldRow label="Vial">{current.vialStrengthMg} mg</FieldRow>
                <FieldRow label="Amount">{formatDose(current.doseMcg)}</FieldRow>
                <FieldRow label="Measure">{current.readout}</FieldRow>
                <FieldRow label="Measures left">{current.dosesPerVial}</FieldRow>
                <FieldRow label="Mixed">
                  {current.dateMixed ? formatDate(current.dateMixed) : "Not set"}
                </FieldRow>
                <FieldRow label="Expires" attention={expiry?.tone !== "ok" && Boolean(expiry)}>
                  {current.expirationDate ? formatDate(current.expirationDate) : "—"}
                </FieldRow>
              </div>

              <PaneLabel>Notes</PaneLabel>
              <div className="px-4">
                <Textarea
                  value={noteValue}
                  onChange={(e) =>
                    setNotes((n) => ({ ...n, [current.publicId]: e.target.value }))
                  }
                  rows={4}
                  placeholder="Anything you want to remember about this plan."
                  className="text-sm"
                />
                <Button
                  onClick={saveNotes}
                  disabled={pending || !notesDirty}
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                >
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save notes <span className="ml-1 font-mono text-[10px]">⌘S</span>
                </Button>
              </div>

              <PaneLabel>Share</PaneLabel>
              <div className="px-4">
                <PlanQr publicId={current.publicId} />
                <div className="mt-2 break-all text-xs text-muted-foreground">
                  bacwater.ai/plan/{current.publicId}
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  <PlanShareButton
                    url={`/plan/${current.publicId}`}
                    title={`${current.peptideName ?? "Reconstitution"} plan`}
                    text="Here's my peptide reconstitution plan from BACwater.ai"
                    className="w-full"
                  />
                  <CopyLinkClient publicId={current.publicId} />
                </div>
              </div>
            </div>
          ) : null
        }
        actionBar={
          current ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="brand" size="sm">
                <Link href={`/plan/${current.publicId}/label`} target="_blank">
                  <Printer className="h-4 w-4" /> Vial label
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/plan/${current.publicId}/pdf`} target="_blank">
                  <Download className="h-4 w-4" /> PDF
                </Link>
              </Button>
              <Button
                onClick={() => setEditing((e) => !e)}
                disabled={pending || !detail?.result}
                variant={editing ? "brand" : "outline"}
                size="sm"
                title={
                  detail?.result
                    ? undefined
                    : "This plan's saved calculation can't be read, so it can't be edited here."
                }
              >
                <Pencil className="h-4 w-4" /> {editing ? "Editing" : "Edit"}
              </Button>
              <Button onClick={duplicate} disabled={pending} variant="outline" size="sm">
                <Copy className="h-4 w-4" /> Duplicate
              </Button>
              <Button onClick={toggleArchive} disabled={pending} variant="outline" size="sm">
                {current.archived ? (
                  <>
                    <ArchiveRestore className="h-4 w-4" /> Restore
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4" /> Archive
                  </>
                )}
              </Button>
              <Button
                onClick={remove}
                disabled={pending}
                variant="ghost"
                size="sm"
                className="ml-auto text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete plan</span>
              </Button>
            </div>
          ) : null
        }
      >
        {loading ? (
          <div className="flex h-full min-h-[16rem] items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Opening plan…
          </div>
        ) : current && detail && editing && detail.result ? (
          <PlanInlineEditor
            saving={pending}
            onCancel={() => setEditing(false)}
            onSave={saveEdits}
            initial={{
              name: detail.name ?? "",
              peptideSlug: detail.peptideSlug || "custom",
              peptideName: detail.peptideName ?? "",
              vialStrengthMg: detail.vialStrengthMg,
              doseMcg: detail.doseMcg,
              injectionsPerWeek: detail.injectionsPerWeek,
              bacWaterMl: detail.bacWaterMl,
              syringeType: detail.syringeType as SyringeType,
              dateMixed: detail.dateMixed ? detail.dateMixed.slice(0, 10) : "",
            }}
          />
        ) : current && detail ? (
          <div className="p-4 sm:p-5">
            {expiry && expiry.tone !== "ok" ? (
              <div
                className={`mb-4 flex gap-2.5 rounded-xl border p-3 text-sm ${
                  expiry.tone === "expired"
                    ? "border-destructive/40 bg-destructive/5 text-destructive"
                    : "border-amber-300 bg-amber-50 text-amber-900"
                }`}
              >
                {expiry.tone === "expired" ? (
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <div>
                  <div className="font-medium">
                    {expiry.tone === "expired"
                      ? "This vial is past its estimated shelf life"
                      : `Shelf life ends in ${expiry.label}`}
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed opacity-90">
                    Estimated from the mix date and the peptide&apos;s typical
                    refrigerated stability. Archive this plan once the vial is done.
                  </p>
                </div>
              </div>
            ) : null}

            {detail.result ? (
              <PlanResults result={detail.result as CalcResult} />
            ) : (
              <div className="rounded-xl border border-border p-6">
                <Badge variant="warning">Snapshot unreadable</Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  The saved calculation for this plan could not be read. The figures in
                  the right rail come from the plan&apos;s own record and are still
                  correct: {current.vialStrengthMg} mg vial,{" "}
                  {formatDose(current.doseMcg)} per measure,{" "}
                  {formatUnits(current.syringeUnits)} units.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full min-h-[16rem] items-center justify-center p-8 text-center text-sm text-muted-foreground">
            {queue.length === 0
              ? "Nothing here yet."
              : "Pick a plan from the list, or press J to start."}
          </div>
        )}
      </WorkspaceShell>
    </div>
  );
}
