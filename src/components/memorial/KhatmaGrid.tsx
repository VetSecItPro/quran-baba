"use client";

import { useMemo, useState } from "react";
import { buildSections, QUARTERS, type Section } from "@/lib/khatma";
import { SectionDetail } from "./SectionDetail";
import { usePageSections } from "@/lib/use-page-sections";
import { claimSection, completeSection, hasReleaseToken, releaseSection } from "@/lib/page-api";
import type { SectionRow } from "@/lib/supabase";

type Props = {
  /** Live Supabase-backed mode. */
  slug?: string;
  /** Preview mode (no DB) for /create — all available, no progress bar. */
  clean?: boolean;
  /** Legacy random seed for the hardcoded Baba page. */
  seed?: number;
};

function cardClasses(status: Section["status"]) {
  const base =
    "relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all shadow-sm";
  if (status === "completed")
    return `${base} bg-emerald text-white border-emerald shadow-md shadow-emerald/30 hover:shadow-lg`;
  if (status === "claimed")
    return `${base} bg-gold text-white border-gold-deep shadow-md shadow-gold/20 hover:shadow-lg`;
  // Available: warm pale-gold "blank coin" that lifts on hover.
  return `${base} bg-gold-soft/20 text-ink/80 border-gold/45 hover:bg-gold-soft/35 hover:border-gold-deep hover:shadow-md hover:-translate-y-0.5`;
}

function toSection(r: SectionRow): Section {
  return {
    hizb: r.hizb,
    quarter: QUARTERS[r.quarter_in_hizb - 1],
    quarterInHizb: r.quarter_in_hizb,
    id: `${r.hizb}-${QUARTERS[r.quarter_in_hizb - 1]}`,
    status: r.status,
  };
}

export function KhatmaGrid({ slug, clean = false, seed = 7 }: Props) {
  const live = usePageSections(slug ?? null);
  const [openQuarter, setOpenQuarter] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build display rows: either live Supabase data, or local fallback.
  const rows = useMemo<SectionRow[]>(() => {
    if (slug && live.sections.length > 0) return live.sections;
    // Local fallback for clean preview or legacy hardcoded page
    const sections = buildSections(seed, { clean });
    return sections.map(
      (s) =>
        ({
          page_id: "preview",
          quarter: (s.hizb - 1) * 4 + s.quarterInHizb,
          hizb: s.hizb,
          quarter_in_hizb: s.quarterInHizb,
          status: s.status,
          claimant_name: null,
          claimant_dua: null,
          completed: s.status === "completed",
          claimed_at: null,
          updated_at: new Date().toISOString(),
        }) satisfies SectionRow
    );
  }, [slug, live.sections, seed, clean]);

  const completed = rows.filter((r) => r.status === "completed").length;
  const claimed = rows.filter((r) => r.status === "claimed").length;
  const available = rows.length - completed - claimed;
  const pct = rows.length ? Math.round((completed / rows.length) * 100) : 0;

  const openRow = openQuarter ? rows.find((r) => r.quarter === openQuarter) ?? null : null;
  const openSection = openRow ? toSection(openRow) : null;

  async function handleClaim(
    name: string,
    dua: string | undefined,
    turnstileToken: string,
    honeypot: string
  ) {
    if (!slug || !openRow) return;
    setBusy(true);
    setError(null);
    try {
      await claimSection(slug, openRow.quarter, name, dua, turnstileToken, honeypot);
      setOpenQuarter(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRelease() {
    if (!slug || !openRow) return;
    setBusy(true);
    setError(null);
    try {
      await releaseSection(slug, openRow.quarter);
      setOpenQuarter(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleComplete() {
    if (!slug || !openRow) return;
    setBusy(true);
    setError(null);
    try {
      await completeSection(slug, openRow.quarter);
      setOpenQuarter(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="px-6 pb-10 max-w-6xl mx-auto">
      {!clean && (
        <ProgressCard
          completed={completed}
          claimed={claimed}
          available={available}
          pct={pct}
          total={rows.length || 240}
        />
      )}

      {live.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 mb-4 text-sm">
          {live.error}
        </div>
      )}

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {rows.map((r) => (
          <SectionCard
            key={r.quarter}
            row={r}
            onClick={() => setOpenQuarter(r.quarter)}
          />
        ))}
      </div>

      <SectionDetail
        section={openSection}
        row={openRow}
        canControl={!!slug && !!openRow && hasReleaseToken(slug, openRow.quarter)}
        live={!!slug}
        busy={busy}
        error={error}
        onClose={() => {
          setOpenQuarter(null);
          setError(null);
        }}
        onClaim={handleClaim}
        onRelease={handleRelease}
        onComplete={handleComplete}
      />

      <p className="text-center text-ink/60 text-sm md:text-base mt-8">
        Tap any card to view the starting and ending points{" "}
        <span className="ornament">✦</span>{" "}
        <span className="font-arabic" dir="rtl">
          اضغط على أي بطاقة لعرض البداية والنهاية
        </span>
      </p>
    </section>
  );
}

function SectionCard({ row, onClick }: { row: SectionRow; onClick: () => void }) {
  const section = toSection(row);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cardClasses(section.status)}
      aria-label={`Hizb ${section.hizb} ${section.quarter}, ${section.status}`}
    >
      <span className="text-[9px] uppercase tracking-wider opacity-70 leading-none">
        Hizb · <span className="font-arabic normal-case">حزب</span>
      </span>
      <span className="text-xl font-semibold leading-none mt-0.5">{section.hizb}</span>
      <span className="text-sm opacity-80 leading-none mt-0.5">{section.quarter}</span>
      {row.claimant_name && (
        <span
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 max-w-[95%] truncate bg-parchment text-ink border border-gold/40 rounded-full px-2 py-0.5 text-[10px] font-arabic shadow-sm"
          dir="auto"
          title={row.claimant_name}
        >
          {row.claimant_name}
        </span>
      )}
      {row.completed && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-deep text-white text-[10px] flex items-center justify-center border border-white shadow">
          ✓
        </span>
      )}
    </button>
  );
}

function ProgressCard({
  completed,
  claimed,
  available,
  pct,
  total,
}: {
  completed: number;
  claimed: number;
  available: number;
  pct: number;
  total: number;
}) {
  return (
    <div className="bg-parchment border border-gold/30 rounded-2xl p-6 md:p-8 mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-ink">Khatma Progress</h2>
          <p className="font-arabic text-gold-deep text-lg mt-1" dir="rtl">
            تقدم الختمة
          </p>
        </div>
        <div className="text-right">
          <p className="leading-none">
            <span className="font-serif text-4xl md:text-5xl font-semibold text-gold-deep">
              {completed}
            </span>
            <span className="text-ink/50 text-xl md:text-2xl"> / {total}</span>
          </p>
          <p className="text-sm text-ink/60 mt-2">
            sections completed <span className="text-gold-deep">|</span>{" "}
            <span className="font-arabic" dir="rtl">
              أقسام مكتملة
            </span>
          </p>
        </div>
      </div>

      <div
        className="h-3 rounded-full bg-cream-soft border border-gold/20 overflow-hidden mt-5"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, var(--gold) 0%, var(--emerald) 100%)",
          }}
        />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-sm md:text-base text-ink/70">
        <LegendDot color="var(--gold-soft)" count={available} en="Open" ar="متاح" />
        <LegendDot color="var(--gold)" count={claimed} en="Claimed" ar="محجوز" />
        <LegendDot color="var(--emerald)" count={completed} en="Done" ar="مكتمل" />
      </div>
    </div>
  );
}

function LegendDot({
  color,
  count,
  en,
  ar,
}: {
  color: string;
  count: number;
  en: string;
  ar: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block w-3 h-3 rounded-full"
        style={{ background: color }}
        aria-hidden
      />
      <span>
        {count} {en}
      </span>
      <span className="text-gold-deep">|</span>
      <span className="font-arabic text-ink/70" dir="rtl">
        {ar}
      </span>
    </span>
  );
}
