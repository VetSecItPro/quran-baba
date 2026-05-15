"use client";

import { useEffect, useState } from "react";
import { supabase, type SectionRow } from "./supabase";
import { fetchSections } from "./page-api";

export function usePageSections(slug: string | null) {
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setSections([]);
      setLoading(false);
      return;
    }
    let cancelled = false;

    setLoading(true);
    fetchSections(slug)
      .then((rows) => {
        if (!cancelled) setSections(rows);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const channel = supabase()
      .channel(`page:${slug}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "quranbaba", table: "sections", filter: `page_id=eq.${slug}` },
        (payload) => {
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            const row = payload.new as SectionRow;
            setSections((prev) => {
              const i = prev.findIndex((s) => s.quarter === row.quarter);
              if (i === -1) return [...prev, row].sort((a, b) => a.quarter - b.quarter);
              const next = prev.slice();
              next[i] = row;
              return next;
            });
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase().removeChannel(channel);
    };
  }, [slug]);

  return { sections, loading, error };
}
