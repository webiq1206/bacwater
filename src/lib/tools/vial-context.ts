"use client";

import { useCallback, useEffect, useState } from "react";

export type MassUnit = "mg" | "mcg";

/**
 * The vial a visitor is currently working with, shared across the calculators.
 *
 * The BAC water, reverse-BAC, and supplies tools each ask for the same three
 * facts — which peptide, how much is in the vial, how much you measure — and
 * each used to keep its own private copy in localStorage. Walking the natural
 * path (work out the water, check what to buy, reverse-check against the
 * syringe you own) therefore meant typing the same three things three times.
 *
 * This is one record they all read and write. The routes are untouched: each
 * calculator stays its own indexable page, it just stops re-asking.
 *
 * The "nothing is pre-populated" rule still holds — a first-time visitor gets
 * an empty context. Only a visitor's own previous entries carry over, and the
 * tools surface that with a dismissible notice rather than silently filling
 * fields in.
 */
export interface StoredVial {
  peptideSlug: string;
  vialInput: number;
  vialUnit: MassUnit;
  doseInput: number;
  doseUnit: MassUnit;
}

const KEY = "bacwater.vial";

const EMPTY: StoredVial = {
  peptideSlug: "",
  vialInput: 0,
  vialUnit: "mg",
  doseInput: 0,
  doseUnit: "mg",
};

function isEmpty(v: StoredVial): boolean {
  return !v.peptideSlug && v.vialInput <= 0 && v.doseInput <= 0;
}

function num(raw: string | null): number {
  if (raw === null) return 0;
  const n = Number(JSON.parse(raw));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function unit(raw: string | null): MassUnit {
  try {
    return JSON.parse(raw ?? '"mg"') === "mcg" ? "mcg" : "mg";
  } catch {
    return "mg";
  }
}

function str(raw: string | null): string {
  try {
    const v = JSON.parse(raw ?? '""');
    return typeof v === "string" ? v : "";
  } catch {
    return "";
  }
}

/**
 * Seed the shared record from the per-tool keys written before this existed,
 * so a returning visitor doesn't find their numbers gone. Whichever legacy
 * tool has the most fields filled in wins; ties go to the earlier tool in the
 * list, which is the order people tend to use them.
 */
function migrateLegacy(): StoredVial {
  const prefixes = [
    "bacwater.tool.bacwater",
    "bacwater.tool.reverse",
    "bacwater.tool.supplies",
  ];
  let best = EMPTY;
  let bestScore = 0;
  for (const p of prefixes) {
    try {
      const candidate: StoredVial = {
        peptideSlug: str(window.localStorage.getItem(`${p}.peptide`)),
        vialInput: num(window.localStorage.getItem(`${p}.vial`)),
        vialUnit: unit(window.localStorage.getItem(`${p}.vialUnit`)),
        doseInput: num(window.localStorage.getItem(`${p}.dose`)),
        doseUnit: unit(window.localStorage.getItem(`${p}.doseUnit`)),
      };
      const score =
        (candidate.peptideSlug ? 1 : 0) +
        (candidate.vialInput > 0 ? 1 : 0) +
        (candidate.doseInput > 0 ? 1 : 0);
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    } catch {
      /* unreadable entry, try the next tool */
    }
  }
  return best;
}

/**
 * Vial contents in mg, from whatever unit was typed. Kept as a standalone
 * function (rather than inline in the hook) so the conversions the tools used
 * before they shared state can be asserted against these directly — sharing
 * the record must not move a single displayed number.
 */
export function vialMgOf(v: Pick<StoredVial, "vialInput" | "vialUnit">): number {
  return v.vialUnit === "mg" ? v.vialInput : v.vialInput / 1000;
}

/** Measured amount in mcg, from whatever unit was typed. */
export function doseMcgOf(v: Pick<StoredVial, "doseInput" | "doseUnit">): number {
  return v.doseUnit === "mcg" ? v.doseInput : Math.round(v.doseInput * 100000) / 100;
}

export interface VialContext extends StoredVial {
  /** Vial contents in mg, whatever unit was typed. */
  vialMg: number;
  /** Amount measured in mcg, whatever unit was typed. */
  doseMcg: number;
  setPeptideSlug: (slug: string) => void;
  setVialInput: (n: number) => void;
  setVialUnit: (u: MassUnit) => void;
  /** For the supplies tool, which asks for mg with no unit toggle. */
  setVialMg: (mg: number) => void;
  setDoseInput: (n: number) => void;
  setDoseUnit: (u: MassUnit) => void;
  /**
   * True when these values were restored from a previous visit and the user
   * has not touched them yet on this screen. Drives the "carried over" notice.
   */
  carriedOver: boolean;
  /** Empty the shared record and the notice. */
  clear: () => void;
  /** False until localStorage has been read, to keep SSR and first paint equal. */
  hydrated: boolean;
}

export function useVialContext(): VialContext {
  const [value, setValue] = useState<StoredVial>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [carriedOver, setCarriedOver] = useState(false);

  useEffect(() => {
    let restored = EMPTY;
    try {
      const raw = window.localStorage.getItem(KEY);
      restored = raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<StoredVial>) } : migrateLegacy();
    } catch {
      /* storage unavailable or malformed; start empty */
    }
    if (!isEmpty(restored)) {
      setValue(restored);
      setCarriedOver(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(value));
    } catch {
      /* quota or unavailable storage, non-fatal */
    }
  }, [value, hydrated]);

  // Every setter counts as the user taking ownership of the values, which
  // retires the "carried over" notice.
  const patch = useCallback((p: Partial<StoredVial>) => {
    setCarriedOver(false);
    setValue((v) => ({ ...v, ...p }));
  }, []);

  const clear = useCallback(() => {
    setCarriedOver(false);
    setValue(EMPTY);
  }, []);

  return {
    ...value,
    vialMg: vialMgOf(value),
    doseMcg: doseMcgOf(value),
    setPeptideSlug: (peptideSlug) => patch({ peptideSlug }),
    setVialInput: (vialInput) => patch({ vialInput }),
    setVialUnit: (vialUnit) => patch({ vialUnit }),
    setVialMg: (mg) => patch({ vialInput: mg, vialUnit: "mg" }),
    setDoseInput: (doseInput) => patch({ doseInput }),
    setDoseUnit: (doseUnit) => patch({ doseUnit }),
    carriedOver,
    clear,
    hydrated,
  };
}
