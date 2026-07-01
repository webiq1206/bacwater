"use client";

import { useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CalcResult } from "@/lib/calc";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "Why did it recommend that BAC water amount?",
  "What if I used 1 mL instead?",
  "What does the unit reading mean on my syringe?",
  "How long is this good for after mixing?",
];

export function AiAssistantDrawer({ plan }: { plan: CalcResult }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  async function send(text: string) {
    if (!text.trim()) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan, messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply || data.error || "No response." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "The assistant is unavailable right now." }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-brand">
          <Sparkles className="h-4 w-4" />
          <div className="text-sm font-medium">Ask about your plan</div>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          The assistant explains numbers and answers follow-ups. It never does the math itself.
        </p>
        {!open ? (
          <Button className="mt-3 w-full" variant="brand" size="sm" onClick={() => setOpen(true)}>
            Open assistant
          </Button>
        ) : (
          <div className="mt-3 rounded-2xl border border-border p-3">
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {messages.length === 0 ? (
                <div className="text-xs text-muted-foreground">
                  Try one of these:
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {SUGGESTED.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-border bg-muted/60 text-[11px] px-3 py-1 hover:bg-muted"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={
                      "text-sm rounded-2xl px-3 py-2 " +
                      (m.role === "user"
                        ? "bg-brand-soft text-emerald-900"
                        : "bg-muted")
                    }
                  >
                    {m.content}
                  </div>
                ))
              )}
              {pending ? (
                <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
                </div>
              ) : null}
            </div>
            <form
              className="mt-3 flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                className="flex-1 rounded-full border border-input bg-background px-4 h-9 text-sm"
              />
              <Button type="submit" size="icon" disabled={pending || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
