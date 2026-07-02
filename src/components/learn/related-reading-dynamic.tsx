"use client";

import { useEffect, useState } from "react";
import { RelatedReadingPanel, type RelatedItem } from "./related-reading";
import { getInterestPeptide } from "@/lib/learn/interest";

/**
 * Client-side contextual "related reading" panel. Resolves the current signal
 * (an explicit peptide prop, or the stored interest peptide when useInterest is
 * set), queries /api/related, and renders the panel. When hideWhenNoSignal is
 * true and there is no signal, it renders nothing, preserving the "generic by
 * default, personalized only after a signal" rule.
 */
export function RelatedReadingDynamic({
  peptide,
  topics,
  types,
  exclude,
  limit = 4,
  title = "Related reading",
  useInterest = false,
  hideWhenNoSignal = false,
}: {
  peptide?: string;
  topics?: string[];
  types?: string[];
  exclude?: string;
  limit?: number;
  title?: string;
  useInterest?: boolean;
  hideWhenNoSignal?: boolean;
}) {
  const [items, setItems] = useState<RelatedItem[]>([]);

  const topicsKey = (topics ?? []).join(",");
  const typesKey = (types ?? []).join(",");

  useEffect(() => {
    let pep = peptide;
    if (!pep && useInterest) pep = getInterestPeptide() ?? undefined;

    // The gating signal is the peptide (explicit prop or stored interest).
    // topics/types only bias the ranking; they do not, on their own, make a
    // hide-when-no-signal panel appear.
    if (hideWhenNoSignal && !pep) {
      setItems([]);
      return;
    }

    const params = new URLSearchParams();
    if (pep) params.set("peptide", pep);
    if (topics?.length) params.set("topics", topics.join(","));
    if (types?.length) params.set("types", types.join(","));
    if (exclude) params.set("exclude", exclude);
    params.set("limit", String(limit));

    let active = true;
    fetch(`/api/related?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (active) setItems(Array.isArray(d.items) ? d.items : []);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peptide, topicsKey, typesKey, exclude, limit, useInterest, hideWhenNoSignal]);

  return <RelatedReadingPanel title={title} items={items} />;
}
