"use client";
/**
 * Optional memory of the last calculation on this device.
 *
 * The calculation session itself lives only in the current tab, which keeps
 * someone's numbers off a shared computer by default. When a person ticks
 * "Remember my numbers on this device", the shared numbers are also kept in
 * local storage so their next visit lands on the result in one tap. Untick,
 * or Clear, and the memory is removed.
 */
import { readCalculation, patchCalculation, chooseCalculationProduct, sanitizeShared, type SharedCalculation } from "./calculation-session";

export const MEMORY_KEY = "bacwater.lastCalculation.v1";
export const MEMORY_FLAG = "bacwater.rememberOnDevice.v1";

function storage(): Storage | null {
  try { return typeof window !== "undefined" && window.localStorage ? window.localStorage : null; } catch { return null; }
}
export function rememberEnabled(): boolean {
  try { return storage()?.getItem(MEMORY_FLAG) === "1"; } catch { return false; }
}
export function setRememberEnabled(enabled: boolean) {
  const store = storage(); if (!store) return;
  try {
    if (enabled) { store.setItem(MEMORY_FLAG, "1"); rememberNow(); }
    else { store.removeItem(MEMORY_FLAG); store.removeItem(MEMORY_KEY); }
  } catch { /* Memory is a convenience only. */ }
}
/** Write the current shared numbers when memory is on. Safe to call often. */
export function rememberNow() {
  if (!rememberEnabled()) return;
  try { storage()?.setItem(MEMORY_KEY, JSON.stringify({ ...readCalculation(), carried: false })); } catch { /* ignore */ }
}
export function readRemembered(): SharedCalculation | null {
  if (!rememberEnabled()) return null;
  try {
    const text = storage()?.getItem(MEMORY_KEY);
    if (!text || text.length > 4096) return null;
    const value = JSON.parse(text);
    return value && typeof value === "object" ? sanitizeShared({ ...value, carried: false }) : null;
  } catch { return null; }
}
/** A tab with nothing of its own starts from the remembered numbers. */
export function restoreRememberedIfEmpty() {
  const current = readCalculation();
  if (current.vialInput || current.amount || current.finalVolume || current.productId) return;
  const remembered = readRemembered();
  if (!remembered || remembered.kind !== "single") return;
  chooseCalculationProduct(remembered.productId, "single", remembered.peptideSlug);
  patchCalculation({ customName: remembered.customName, vialInput: remembered.vialInput, vialUnit: remembered.vialUnit, finalVolume: remembered.finalVolume, amount: remembered.amount, amountUnit: remembered.amountUnit, basis: remembered.basis, timesPerWeek: remembered.timesPerWeek, carried: false });
}
export function forgetRemembered() {
  try { storage()?.removeItem(MEMORY_KEY); } catch { /* ignore */ }
}
