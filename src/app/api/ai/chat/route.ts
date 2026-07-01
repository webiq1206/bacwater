import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { CalcResult } from "@/lib/calc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatBody {
  plan: CalcResult;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}

const SYSTEM_PROMPT = `You are the BACwater.ai plan assistant.

Rules you MUST follow:
- NEVER perform reconstitution math yourself. The deterministic math library already computed every number in the plan. Only explain those numbers.
- If a user asks "what if I changed X", explain the direction of the change in plain English but tell them to re-run the planner to get the exact new numbers.
- Be plain-spoken, calm, and beginner-friendly. Short paragraphs.
- Do NOT provide medical advice, diagnose, prescribe, or make claims about treating disease. Encourage the user to consult a qualified professional for medical guidance.
- If asked something outside of reconstitution, storage, syringes, or the plan itself, politely redirect.
- Never invent product names, prices, or SKUs. Only mention items that are in the plan's supply list.

The user's current plan (JSON) is provided in the first user turn as CONTEXT. Reason from it; do not question its numbers.`;

export async function POST(req: Request) {
  const body = (await req.json()) as ChatBody;
  if (!body?.plan || !Array.isArray(body?.messages)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({
      reply:
        "The AI assistant isn't connected yet. Once ANTHROPIC_API_KEY is set in the environment, this drawer will explain your plan and answer follow-ups.",
    });
  }
  const client = new Anthropic({ apiKey: key });
  const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

  const contextTurn = {
    role: "user" as const,
    content: `CONTEXT (do not re-derive, only explain):\n${JSON.stringify(body.plan, null, 2)}`,
  };
  const turns = [contextTurn, ...body.messages.map((m) => ({ role: m.role, content: m.content }))];

  try {
    const res = await client.messages.create({
      model,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: turns,
    });
    const reply = res.content
      .map((c) => (c.type === "text" ? c.text : ""))
      .join("\n")
      .trim();
    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json({ error: `AI error: ${(e as Error).message}` }, { status: 502 });
  }
}
