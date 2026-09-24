"use client";
import { useCallback, type SetStateAction } from "react";
import { useSessionDraft } from "./use-session-draft";
import { EMPTY_MASS_DRAFT, readMassDraft, seedHeroSession, type MassDraft } from "./mass-draft";
export function useMassDraft(screen: string, scope = "mass-vial", initial = EMPTY_MASS_DRAFT) {
  const [draft, set] = useSessionDraft(scope, initial, readMassDraft, scope === "mass-vial" ? seedHeroSession : undefined);
  const update = useCallback((change: Partial<MassDraft> | ((current: MassDraft) => MassDraft)) => set(current => ({ ...(typeof change === "function" ? change(current) : { ...current, ...change }), source: screen })), [screen, set]);
  const clear = useCallback(() => update(current => ({ ...EMPTY_MASS_DRAFT, productId: current.productId, peptideSlug: current.peptideSlug })), [update]);
  const select = useCallback((productId: string, peptideSlug: string) => set(d => ({...d, productId, peptideSlug})), [set]);
  return { draft, update, clear, select, carried: !!(draft.vial || draft.volume || draft.amount) && !!draft.source && draft.source !== screen };
}
