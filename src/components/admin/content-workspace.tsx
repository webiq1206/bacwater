"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CircleDashed,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  WorkspaceShell,
  PaneLabel,
  QueueRow,
  KeyHint,
} from "@/components/workspace/workspace-shell";
import { useQueueKeys } from "@/components/workspace/use-queue-keys";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { formatDate, slugify } from "@/lib/utils";
import { renderBody } from "@/lib/content/render";
import { contentChecks } from "@/lib/content/checks";
import {
  deleteContent,
  saveContentBlock,
  toggleContentPublished,
} from "@/lib/admin-actions";

export interface ContentRecord {
  id: string;
  slug: string;
  kind: string;
  title: string;
  body: string;
  published: boolean;
  updatedAt: string;
}

type Draft = Omit<ContentRecord, "updatedAt">;
type View = "write" | "split" | "preview";
const NEW_ID = "__new__";

function emptyDraft(): Draft {
  return { id: NEW_ID, slug: "", kind: "guide", title: "", body: "", published: false };
}

export function ContentWorkspace({
  blocks,
  initialId,
  startNew: openNew,
}: {
  blocks: ContentRecord[];
  /** Preselect a row — used by the old /admin/content/[id] bookmarks. */
  initialId?: string;
  /** Open an empty draft — used by /admin/content/new. */
  startNew?: boolean;
}) {
  const [rows, setRows] = useState(blocks);
  const [selectedId, setSelectedId] = useState<string | null>(
    openNew ? NEW_ID : initialId ?? blocks[0]?.id ?? null
  );
  const [drafts, setDrafts] = useState<Record<string, Draft>>(
    openNew ? { [NEW_ID]: emptyDraft() } : {}
  );
  const [view, setView] = useState<View>("split");
  const [filter, setFilter] = useState<"all" | "drafts">("all");
  const [pending, startTransition] = useTransition();

  const queue = useMemo(
    () => (filter === "drafts" ? rows.filter((r) => !r.published) : rows),
    [rows, filter]
  );

  const saved = selectedId === NEW_ID ? null : rows.find((r) => r.id === selectedId) ?? null;
  const draft: Draft | null =
    selectedId === null
      ? null
      : drafts[selectedId] ??
        (saved
          ? { id: saved.id, slug: saved.slug, kind: saved.kind, title: saved.title, body: saved.body, published: saved.published }
          : emptyDraft());

  const dirty = Boolean(
    draft &&
      (selectedId === NEW_ID
        ? draft.title || draft.body || draft.slug
        : saved &&
          (draft.title !== saved.title ||
            draft.body !== saved.body ||
            draft.slug !== saved.slug ||
            draft.kind !== saved.kind ||
            draft.published !== saved.published))
  );

  // Warn before a reload or tab close drops unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const index = queue.findIndex((r) => r.id === selectedId);

  const patch = useCallback(
    (p: Partial<Draft>) => {
      if (!draft || selectedId === null) return;
      setDrafts((d) => ({ ...d, [selectedId]: { ...draft, ...p } }));
    },
    [draft, selectedId]
  );

  const move = useCallback(
    (delta: number) => {
      if (queue.length === 0) return;
      const from = index < 0 ? 0 : index;
      const next = Math.min(queue.length - 1, Math.max(0, from + delta));
      setSelectedId(queue[next].id);
    },
    [index, queue]
  );

  const takenSlugs = useMemo(
    () => rows.filter((r) => r.id !== selectedId).map((r) => r.slug),
    [rows, selectedId]
  );

  const checks = useMemo(
    () => (draft ? contentChecks({ ...draft, takenSlugs }) : []),
    [draft, takenSlugs]
  );
  const blockers = checks.filter((c) => c.status === "block");

  const save = useCallback(
    (then?: "next") => {
      if (!draft || selectedId === null) return;
      if (blockers.length > 0) {
        toast({
          title: "Fix the blockers first",
          description: blockers[0].label,
          variant: "destructive",
        });
        return;
      }
      startTransition(async () => {
        const res = await saveContentBlock({
          id: selectedId === NEW_ID ? undefined : selectedId,
          slug: draft.slug,
          kind: draft.kind as "guide" | "faq" | "page",
          title: draft.title,
          body: draft.body,
          published: draft.published,
        });
        if (!res.ok) {
          toast({ title: "Save failed", description: res.error, variant: "destructive" });
          return;
        }
        const block = res.block;
        setRows((rs) => {
          const without = rs.filter((r) => r.id !== block.id && r.id !== selectedId);
          return [block, ...without].sort(
            (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
          );
        });
        setDrafts((d) => {
          const copy = { ...d };
          delete copy[selectedId];
          return copy;
        });
        toast({ title: "Saved", description: block.title, variant: "success" });
        // A brand-new block has no position in the queue to advance from, so
        // "next" simply lands on the row that was just created.
        if (then === "next" && selectedId !== NEW_ID) {
          const remaining = queue.filter((r) => r.id !== selectedId);
          setSelectedId(remaining[Math.min(Math.max(index, 0), remaining.length - 1)]?.id ?? block.id);
        } else {
          setSelectedId(block.id);
        }
      });
    },
    [blockers, draft, index, queue, selectedId]
  );

  function togglePublish() {
    if (!draft) return;
    // An unsaved row toggles locally; a saved one flips server-side straight
    // away so publishing does not require a full save round trip.
    if (selectedId === NEW_ID || dirty) {
      patch({ published: !draft.published });
      return;
    }
    if (!saved) return;
    startTransition(async () => {
      const res = await toggleContentPublished(saved.id);
      if (!res.ok) {
        toast({ title: "Could not change status", description: res.error, variant: "destructive" });
        return;
      }
      setRows((rs) =>
        rs.map((r) => (r.id === saved.id ? { ...r, published: res.published } : r))
      );
      toast({ title: res.published ? "Published" : "Unpublished", variant: "success" });
    });
  }

  function remove() {
    if (!saved) return;
    if (!window.confirm(`Delete "${saved.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteContent(saved.id);
      setRows((rs) => rs.filter((r) => r.id !== saved.id));
      toast({ title: "Deleted", variant: "success" });
      const remaining = queue.filter((r) => r.id !== saved.id);
      setSelectedId(remaining[Math.min(Math.max(index, 0), remaining.length - 1)]?.id ?? null);
    });
  }

  function startNew() {
    setDrafts((d) => ({ ...d, [NEW_ID]: emptyDraft() }));
    setSelectedId(NEW_ID);
  }

  useQueueKeys({
    onNext: () => move(1),
    onPrev: () => move(-1),
    onPrimary: () => save("next"),
    onSave: () => save(),
    onEscape: () => setSelectedId(null),
    enabled: !pending,
  });

  const draftCount = rows.filter((r) => !r.published).length;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Content</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Edit, preview, and publish without leaving the page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${filter === "all" ? "bg-muted" : "text-muted-foreground hover:text-foreground"}`}
            >
              All ({rows.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("drafts")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${filter === "drafts" ? "bg-muted" : "text-muted-foreground hover:text-foreground"}`}
            >
              Drafts ({draftCount})
            </button>
          </div>
          <Button onClick={startNew} variant="brand" size="sm">
            <Plus className="h-4 w-4" /> New
          </Button>
        </div>
      </div>

      <WorkspaceShell
        hasSelection={selectedId !== null}
        onBack={() => setSelectedId(null)}
        header={
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {selectedId === NEW_ID
                  ? "New content"
                  : queue.length === 0
                    ? "Nothing here"
                    : `Item ${index + 1} of ${queue.length}`}
              </span>
              {dirty ? (
                <Badge variant="warning">unsaved</Badge>
              ) : draft ? (
                <Badge variant={draft.published ? "success" : "outline"}>
                  {draft.published ? "published" : "draft"}
                </Badge>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <div className="hidden items-center gap-0.5 rounded-md border border-border p-0.5 md:flex">
                {(["write", "split", "preview"] as View[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    className={`rounded px-2 py-1 text-[11px] font-medium capitalize ${view === v ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <KeyHint keys="⌘↵" label="save + next" />
            </div>
          </div>
        }
        queue={
          <>
            <PaneLabel>Library</PaneLabel>
            {drafts[NEW_ID] ? (
              <QueueRow
                index={-1}
                active={selectedId === NEW_ID}
                onSelect={() => setSelectedId(NEW_ID)}
                title={drafts[NEW_ID].title || "Untitled"}
                meta="New, unsaved"
                trailing={<CircleDashed className="h-3.5 w-3.5 text-muted-foreground" />}
              />
            ) : null}
            {queue.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                <FileText className="mx-auto mb-2 h-5 w-5" />
                Nothing here yet.
              </div>
            ) : (
              <div className="pb-3">
                {queue.map((b, i) => (
                  <QueueRow
                    key={b.id}
                    index={i}
                    active={selectedId === b.id}
                    onSelect={() => setSelectedId(b.id)}
                    title={b.title}
                    meta={`${b.kind} · ${formatDate(b.updatedAt)}`}
                    muted={!b.published}
                    trailing={
                      drafts[b.id] ? (
                        <span className="block h-1.5 w-1.5 rounded-full bg-amber-500" />
                      ) : b.published ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <CircleDashed className="h-3.5 w-3.5 text-muted-foreground" />
                      )
                    }
                  />
                ))}
              </div>
            )}
          </>
        }
        aside={
          draft ? (
            <div className="space-y-4 p-4 pb-6">
              <div>
                <PaneLabel className="px-0 pt-0">Publishing</PaneLabel>
                <label className="mt-1 block text-xs text-muted-foreground">Slug</label>
                <div className="mt-1 flex gap-1.5">
                  <Input
                    value={draft.slug}
                    onChange={(e) => patch({ slug: e.target.value })}
                    placeholder="url-slug"
                    className="h-10 font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    disabled={!draft.title}
                    onClick={() => patch({ slug: slugify(draft.title) })}
                    title="Generate the slug from the title"
                  >
                    Auto
                  </Button>
                </div>

                <label className="mt-3 block text-xs text-muted-foreground">Kind</label>
                <select
                  value={draft.kind}
                  onChange={(e) => patch({ kind: e.target.value })}
                  className="mt-1 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
                >
                  <option value="guide">guide</option>
                  <option value="faq">faq</option>
                  <option value="page">page</option>
                </select>

                <button
                  type="button"
                  onClick={togglePublish}
                  disabled={pending}
                  className="mt-3 flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm hover:bg-muted/50"
                >
                  <span className="font-medium">Published</span>
                  <span
                    className={`inline-flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${draft.published ? "bg-emerald-600" : "bg-muted-foreground/30"}`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-white transition-transform ${draft.published ? "translate-x-4" : ""}`}
                    />
                  </span>
                </button>

                {saved && saved.published ? (
                  <Link
                    href={`/learn/${saved.slug}`}
                    target="_blank"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> View live page
                  </Link>
                ) : null}
              </div>

              <div>
                <PaneLabel className="px-0">Checks</PaneLabel>
                <ul className="space-y-1.5">
                  {checks.map((c) => (
                    <li
                      key={c.id}
                      className={`rounded-lg border p-2.5 text-xs ${
                        c.status === "block"
                          ? "border-destructive/40 bg-destructive/5"
                          : c.status === "warn"
                            ? "border-amber-300 bg-amber-50"
                            : "border-border"
                      }`}
                    >
                      <div className="flex items-start gap-1.5 font-medium">
                        {c.status === "ok" ? (
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        ) : (
                          <AlertTriangle
                            className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${c.status === "block" ? "text-destructive" : "text-amber-600"}`}
                          />
                        )}
                        <span>{c.label}</span>
                      </div>
                      <p className="mt-1 pl-5 leading-relaxed text-muted-foreground">{c.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null
        }
        actionBar={
          draft ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => save("next")} disabled={pending || !dirty} variant="brand">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Save &amp; next
                <span className="ml-1 font-mono text-[10px] opacity-70">⌘↵</span>
              </Button>
              <Button onClick={() => save()} disabled={pending || !dirty} variant="outline">
                <Save className="h-4 w-4" /> Save
                <span className="ml-1 font-mono text-[10px] opacity-70">⌘S</span>
              </Button>
              <Button onClick={() => move(1)} disabled={pending} variant="outline">
                Skip
              </Button>
              {saved ? (
                <Button
                  onClick={remove}
                  disabled={pending}
                  variant="ghost"
                  className="ml-auto text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              ) : null}
            </div>
          ) : null
        }
      >
        {draft ? (
          <div
            className={`grid min-h-full ${view === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`}
          >
            {view !== "preview" ? (
              <div className="min-w-0 p-4 sm:p-5">
                <Input
                  value={draft.title}
                  onChange={(e) => patch({ title: e.target.value })}
                  placeholder="Title"
                  className="h-12 border-0 px-0 font-serif text-2xl font-medium tracking-tight shadow-none focus-visible:ring-0"
                />
                <Textarea
                  value={draft.body}
                  onChange={(e) => patch({ body: e.target.value })}
                  placeholder={"Write the guide.\n\n## Sections use two hashes\n\n- Lists use hyphens\n\n**Bold** and *italic* work inline."}
                  className="mt-3 min-h-[24rem] resize-y border-0 px-0 font-mono text-sm leading-relaxed shadow-none focus-visible:ring-0"
                />
              </div>
            ) : null}

            {view !== "write" ? (
              <div
                className={`min-w-0 bg-muted/20 p-4 sm:p-5 ${view === "split" ? "border-t border-border lg:border-l lg:border-t-0" : ""}`}
              >
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" /> Live preview
                </div>
                <h2 className="font-serif text-3xl font-medium tracking-tight">
                  {draft.title || "Untitled"}
                </h2>
                <article className="prose prose-neutral mt-2 max-w-none">
                  {draft.body ? (
                    renderBody(draft.body)
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">
                      The rendered page appears here as you type.
                    </p>
                  )}
                </article>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex h-full min-h-[16rem] items-center justify-center p-8 text-center text-sm text-muted-foreground">
            Pick something from the library, or start a new one.
          </div>
        )}
      </WorkspaceShell>
    </div>
  );
}
