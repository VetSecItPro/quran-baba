"use client";

import { useCallback, useEffect, useState } from "react";

export type Claim = {
  name: string;
  dua?: string;
  completed?: boolean;
  claimedAt: string; // ISO
};

export type ClaimMap = Record<string, Claim>; // key = section id (e.g. "1-¼")

function storageKey(pageId: string) {
  return `quranbaba.claims.${pageId}`;
}

function readAll(pageId: string): ClaimMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(pageId));
    return raw ? (JSON.parse(raw) as ClaimMap) : {};
  } catch {
    return {};
  }
}

function writeAll(pageId: string, map: ClaimMap) {
  try {
    localStorage.setItem(storageKey(pageId), JSON.stringify(map));
    window.dispatchEvent(new StorageEvent("storage", { key: storageKey(pageId) }));
  } catch {}
}

export function useClaims(pageId: string) {
  const [claims, setClaims] = useState<ClaimMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setClaims(readAll(pageId));
    setHydrated(true);
    function onStorage(e: StorageEvent) {
      if (e.key === storageKey(pageId)) setClaims(readAll(pageId));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [pageId]);

  const claim = useCallback(
    (sectionId: string, data: Omit<Claim, "claimedAt">) => {
      const next: ClaimMap = {
        ...readAll(pageId),
        [sectionId]: { ...data, claimedAt: new Date().toISOString() },
      };
      writeAll(pageId, next);
      setClaims(next);
    },
    [pageId]
  );

  const release = useCallback(
    (sectionId: string) => {
      const next = { ...readAll(pageId) };
      delete next[sectionId];
      writeAll(pageId, next);
      setClaims(next);
    },
    [pageId]
  );

  const markComplete = useCallback(
    (sectionId: string) => {
      const cur = readAll(pageId);
      if (!cur[sectionId]) return;
      const next = { ...cur, [sectionId]: { ...cur[sectionId], completed: true } };
      writeAll(pageId, next);
      setClaims(next);
    },
    [pageId]
  );

  return { claims, claim, release, markComplete, hydrated };
}
