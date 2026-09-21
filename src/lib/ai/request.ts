import { z } from "zod";
import { calculate, type CalcInput } from "@/lib/calc";
import { MAX_MESSAGE_CHARS, MAX_MESSAGES, replyLooksLikeAdvice, refusalReply } from "./guardrails";
export const MAX_BODY_BYTES = 32 * 1024;
const positive = z.number().finite().positive().max(1_000_000);
const inputSchema = z.object({ vialStrengthMg: positive, doseMcg: positive, bacWaterMl: positive.max(1000), injectionsPerWeek: z.number().int().min(1).max(28).optional(), syringeType: z.enum(["insulin-0.3ml", "insulin-0.5ml", "insulin-1ml", "tuberculin-1ml", "syringe-3ml"]) });
const schema = z.object({ plan: z.object({ input: inputSchema, secondary: z.object({ vialStrengthMg: positive }).nullish() }), messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(MAX_MESSAGE_CHARS) })).min(1).max(MAX_MESSAGES) });
/** Recompute validated inputs; ignore all browser-provided outputs and unknown fields. */
export function prepareChatRequest(raw: unknown) {
  const data = schema.parse(raw);
  if (data.messages.at(-1)?.role !== "user") throw new Error("A question is required.");
  const input: CalcInput = { ...data.plan.input, peptideSlug: "custom", peptideName: "Entered compound", dateMixed: null, secondary: data.plan.secondary ? { peptideName: "Second entered compound", vialStrengthMg: data.plan.secondary.vialStrengthMg } : null };
  const result = calculate(input);
  if (result.errors.length) throw new Error("Fix the calculator inputs before asking about them.");
  const context = {
    u100UnitsPerMl: 100, microgramsPerMg: 1000,
    vialAmountMg: result.input.vialStrengthMg, finalLiquidVolumeMl: result.usedBacMl,
    concentrationMgPerMl: result.finalConcentrationMgPerMl, enteredTotalMcg: result.input.doseMcg,
    measurementsInEnteredTotal: result.schedule?.injectionsPerWeek || 1,
    amountPerMeasurementMcg: result.schedule?.dosePerInjectionMcg || result.input.doseMcg,
    volumePerMeasurementMl: result.doseVolumeMl, scale: result.syringeReadout.kind,
    u100Units: result.syringeReadout.kind === "u100" ? result.syringeUnits : null,
    exceedsSyringeCapacity: result.syringeReadout.exceedsSyringe, fullMeasurementsPerVial: result.dosesPerVial,
    secondConcentrationMgPerMl: result.secondary?.concentrationMgPerMl ?? null,
    secondAmountPerMeasurementMcg: result.secondary?.companionDoseMcg ?? null,
    storageAndExpiry: "Not determined by this calculator.",
    warning: "Arithmetic describes the user's inputs; it does not select a dose, dilution, preparation method or schedule.",
  };
  return { context, messages: data.messages.slice(-8) };
}
export async function readBoundedJson(request: Request, maximum = MAX_BODY_BYTES): Promise<unknown> {
  const declared = request.headers.get("content-length");
  if (declared && Number(declared) > maximum) throw new RangeError("Request too large.");
  if (!request.body) throw new Error("Missing request body.");
  const reader = request.body.getReader(), chunks: Uint8Array[] = []; let length = 0;
  try { for (;;) { const { done, value } = await reader.read(); if (done) break; length += value.byteLength; if (length > maximum) { await reader.cancel(); throw new RangeError("Request too large."); } chunks.push(value); } }
  finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
/** Defense in depth, not a clinical or semantic safety certification. */
export function reviewReply(text: string, context: ReturnType<typeof prepareChatRequest>["context"]) {
  const allowed = new Set(Object.values(context).filter((x): x is number => typeof x === "number"));
  const numericText = text.replace(/U-100/gi, "U100");
  const numbers = numericText.match(/(?:^|[^A-Za-z])[-+]?\d+(?:[,.]\d+)*(?:e[-+]?\d+)?/gi) || [];
  const hasNewNumber = numbers.some(value => !allowed.has(Number(value.replace(/^[^+\-\d]+/, "").replace(/,/g, ""))));
  const refused = !text.trim() || text.length > 6000 || replyLooksLikeAdvice(text) || hasNewNumber;
  return { reply: refused ? refusalReply() : text.replace(/\u2014/g, ", ").replace(/--/g, ", "), refused };
}
