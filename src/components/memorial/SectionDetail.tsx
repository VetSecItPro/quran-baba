"use client";

import { useEffect, useState } from "react";
import type { Section } from "@/lib/khatma";
import { getQuarter, QUARTER_LABEL_AR, QUARTER_LABEL_EN } from "@/lib/hizb-quarters";
import type { SectionRow } from "@/lib/supabase";
import { ArabicInput } from "@/components/create/ArabicInput";
import { Turnstile } from "@/components/site/Turnstile";
import { HONEYPOT_FIELD, HONEYPOT_STYLE } from "@/lib/honeypot";

type Props = {
  section: Section | null;
  row: SectionRow | null;
  /** Whether this client owns the release_token for this section. */
  canControl: boolean;
  /** True when the page is Supabase-backed (claim flow active). False on the create preview. */
  live: boolean;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onClaim: (name: string, dua: string | undefined, turnstileToken: string, honeypot: string) => void;
  onRelease: () => void;
  onComplete: () => void;
};

export function SectionDetail({
  section,
  row,
  canControl,
  live,
  busy,
  error,
  onClose,
  onClaim,
  onRelease,
  onComplete,
}: Props) {
  useEffect(() => {
    if (!section) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [section, onClose]);

  if (!section || !row) return null;
  const entry = getQuarter(section.hizb, section.quarterInHizb);
  const juz = Math.ceil(section.hizb / 2);

  // Deep-link to quran.com - same-surah ranges become a range URL, cross-surah falls back to start.
  const readUrl =
    entry.start.surah === entry.end.surah
      ? `https://quran.com/${entry.start.surah}/${entry.start.ayah}-${entry.end.ayah}`
      : `https://quran.com/${entry.start.surah}:${entry.start.ayah}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="section-detail-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 p-0 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-cream-soft border border-gold/30 rounded-t-2xl md:rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-gold/20 flex items-baseline justify-between gap-4">
          <div>
            <h3 id="section-detail-title" className="font-serif text-2xl font-semibold text-ink">
              Hizb {section.hizb} · {QUARTER_LABEL_EN[section.quarterInHizb]}
            </h3>
            <p className="font-arabic text-gold-deep text-lg mt-1" dir="rtl">
              الْحِزْب {section.hizb} · {QUARTER_LABEL_AR[section.quarterInHizb]}
            </p>
            <p className="text-xs text-ink/60 mt-1">
              Juz {juz} <span className="text-gold-deep">|</span>{" "}
              <span className="font-arabic" dir="rtl">
                الْجُزْء {juz}
              </span>{" "}
              · Quarter {entry.quarter} of 240
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={readUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald text-white text-sm font-medium hover:bg-emerald-deep transition-colors"
              aria-label={`Read on quran.com, Surah ${entry.start.surah} Ayah ${entry.start.ayah}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M14 3h7v7" />
                <path d="M21 3l-9 9" />
                <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
              </svg>
              Read <span className="opacity-80">|</span>{" "}
              <span className="font-arabic">اِقْرَأْ</span>
            </a>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-full border border-gold/40 bg-parchment text-ink hover:border-gold transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {live && (
          <div className="px-6 py-5 border-b border-gold/20 bg-cream-soft/60">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 mb-4 text-sm">
                {error}
              </div>
            )}
            {row.status === "available" ? (
              <ClaimForm onClaim={onClaim} onCancel={onClose} busy={busy} />
            ) : (
              <ClaimedView
                row={row}
                canControl={canControl}
                busy={busy}
                onRelease={onRelease}
                onComplete={onComplete}
                onClose={onClose}
              />
            )}
          </div>
        )}

        <div className="px-2 py-3 text-center bg-parchment">
          <p className="text-xs text-ink/50 uppercase tracking-wider">
            Reading reference{" "}
            <span className="text-gold-deep">|</span>{" "}
            <span className="font-arabic" dir="rtl">مَرْجِعُ الْقِرَاءَة</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:[direction:rtl] gap-0">
          <Column
            tag="Start"
            tagAr="الْبِدَايَة"
            accent="emerald"
            surahAr={entry.start.surahNameAr}
            surahEn={entry.start.surahNameEn}
            surah={entry.start.surah}
            ayah={entry.start.ayah}
            text={entry.start.text}
            note="Opening words"
            noteAr="الْكَلِمَاتُ الِافْتِتَاحِيَّة"
          />
          <Column
            tag="End"
            tagAr="النِّهَايَة"
            accent="gold"
            surahAr={entry.end.surahNameAr}
            surahEn={entry.end.surahNameEn}
            surah={entry.end.surah}
            ayah={entry.end.ayah}
            text={entry.end.text}
            note="Closing words"
            noteAr="الْكَلِمَاتُ الْخِتَامِيَّة"
            divider
          />
        </div>

        <div className="px-6 py-3 border-t border-gold/20 bg-parchment text-xs text-ink/50">
          Source: Madinah-mushaf rub-al-hizb annotations · al-Quran Cloud / Tanzil
        </div>
      </div>
    </div>
  );
}

function Column({
  tag,
  tagAr,
  accent,
  surahAr,
  surahEn,
  surah,
  ayah,
  text,
  note,
  noteAr,
  divider = false,
}: {
  tag: string;
  tagAr: string;
  accent: "emerald" | "gold";
  surahAr: string;
  surahEn: string;
  surah: number;
  ayah: number;
  text: string;
  note: string;
  noteAr: string;
  divider?: boolean;
}) {
  const tagColor =
    accent === "emerald"
      ? "bg-emerald/10 text-emerald-deep border-emerald/40"
      : "bg-gold/10 text-gold-deep border-gold/40";
  return (
    <div
      className={`p-6 [direction:ltr] ${divider ? "md:border-l md:border-gold/20" : ""} border-t md:border-t-0 border-gold/20`}
    >
      <div
        className={`inline-flex items-baseline gap-2 px-3 py-1 rounded-full border ${tagColor} text-sm`}
      >
        <span className="font-medium">{tag}</span>
        <span className="opacity-60">|</span>
        <span className="font-arabic text-base" dir="rtl">
          {tagAr}
        </span>
      </div>

      <p className="font-serif text-xl font-semibold text-ink mt-4">{surahEn}</p>
      <p className="font-arabic text-2xl text-gold-deep" dir="rtl">
        {surahAr}
      </p>
      <p className="text-sm text-ink/60 mt-1">
        Surah {surah} · Ayah {ayah}
      </p>

      <p className="font-arabic text-2xl md:text-3xl text-ink leading-loose mt-4" dir="rtl">
        {text}
      </p>

      <p className="text-xs text-ink/50 mt-3">
        {note} <span className="text-gold-deep">|</span>{" "}
        <span className="font-arabic" dir="rtl">
          {noteAr}
        </span>
      </p>
    </div>
  );
}

function ClaimForm({
  onClaim,
  onCancel,
  busy,
}: {
  onClaim: (name: string, dua: string | undefined, turnstileToken: string, honeypot: string) => void;
  onCancel: () => void;
  busy: boolean;
}) {
  const [name, setName] = useState("");
  const [dua, setDua] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [honey, setHoney] = useState("");
  const canClaim = name.trim().length > 0 && captchaToken.length > 0 && !busy;

  function handleSubmit() {
    if (!canClaim) return;
    onClaim(name.trim(), dua.trim() || undefined, captchaToken, honey);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div>
        <div className="flex items-baseline justify-between">
          <label className="text-sm font-medium text-ink/80">
            Your name <span className="text-red-500">*</span>{" "}
            <span className="text-ink/50 text-xs">(English or Arabic)</span>
          </label>
          <span className="font-arabic text-gold-deep text-base" dir="rtl">
            اِسْمُكَ
          </span>
        </div>
        <div className="mt-1.5">
          <ArabicInput value={name} onChange={setName} placeholder="Enter your name · أَدْخِلِ اسْمَكَ" />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <label className="text-sm font-medium text-ink/80">
            Personal message <span className="text-ink/50">(optional)</span>{" "}
            <span className="text-ink/50 text-xs">English or Arabic</span>
          </label>
          <span className="font-arabic text-gold-deep text-base" dir="rtl">
            رِسَالَة / دُعَاء (اِخْتِيَارِيّ)
          </span>
        </div>
        <div className="mt-1.5">
          <ArabicInput
            value={dua}
            onChange={setDua}
            placeholder="A short message, du'a, or dedication · رِسَالَةٌ قَصِيرَة أَوْ دُعَاء"
            multiline
          />
        </div>
      </div>

      <input
        type="text"
        name={HONEYPOT_FIELD}
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className={HONEYPOT_STYLE}
      />

      <div className="mt-5">
        <Turnstile onToken={setCaptchaToken} />
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="px-5 py-2.5 rounded-full border border-gold/40 bg-parchment text-ink hover:border-gold transition-colors disabled:opacity-50"
        >
          Cancel <span className="text-gold-deep">|</span>{" "}
          <span className="font-arabic" dir="rtl">إِلْغَاء</span>
        </button>
        <button
          type="submit"
          disabled={!canClaim}
          className="px-6 py-2.5 rounded-full bg-gold text-white font-medium hover:bg-gold-deep disabled:bg-gold/30 disabled:cursor-not-allowed transition-colors"
        >
          {busy ? "Claiming…" : (
            <>
              Claim <span className="opacity-80">|</span>{" "}
              <span className="font-arabic">اِحْجِزْ</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function ClaimedView({
  row,
  canControl,
  busy,
  onRelease,
  onComplete,
  onClose,
}: {
  row: SectionRow;
  canControl: boolean;
  busy: boolean;
  onRelease: () => void;
  onComplete: () => void;
  onClose: () => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-ink/70">
        {row.completed ? "Completed by" : "Reserved by"}{" "}
        <span className="text-gold-deep">|</span>{" "}
        <span className="font-arabic" dir="rtl">
          {row.completed ? "أَتَمَّهَا" : "اِحْتَجَزَهَا"}
        </span>
      </p>
      <p className="font-serif text-3xl md:text-4xl text-ink mt-1" dir="auto">
        <span className="font-arabic">{row.claimant_name}</span>
      </p>

      <div className="mt-4 bg-parchment border border-gold/20 rounded-xl p-4">
        <p className="text-xs text-ink/50 mb-2 uppercase tracking-wide">
          Personal message <span className="text-gold-deep">|</span>{" "}
          <span className="font-arabic normal-case" dir="rtl">
            رِسَالَة / دُعَاء
          </span>
        </p>
        {row.claimant_dua ? (
          <p
            className="font-arabic text-lg md:text-xl text-ink leading-loose"
            dir="rtl"
          >
            {row.claimant_dua}
          </p>
        ) : (
          <p className="text-ink/40 italic text-sm">
            No personal message <span className="text-gold-deep/60">|</span>{" "}
            <span className="font-arabic" dir="rtl">
              لَا تُوجَدُ رِسَالَة
            </span>
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {canControl ? (
          <>
            <button
              type="button"
              onClick={onRelease}
              disabled={busy}
              className="px-5 py-2.5 rounded-full border border-gold/40 bg-parchment text-ink hover:border-gold transition-colors disabled:opacity-50"
            >
              Release <span className="text-gold-deep">|</span>{" "}
              <span className="font-arabic" dir="rtl">إِلْغَاءُ الْحَجْز</span>
            </button>
            {!row.completed && (
              <button
                type="button"
                onClick={onComplete}
                disabled={busy}
                className="px-6 py-2.5 rounded-full bg-emerald text-white font-medium hover:bg-emerald-deep disabled:bg-emerald/30 transition-colors"
              >
                {busy ? "Saving…" : (
                  <>
                    Mark Complete <span className="opacity-80">|</span>{" "}
                    <span className="font-arabic">أَتْمَمْتُ</span>
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-gold/40 bg-parchment text-ink hover:border-gold transition-colors"
          >
            Close <span className="text-gold-deep">|</span>{" "}
            <span className="font-arabic" dir="rtl">إِغْلَاق</span>
          </button>
        )}
      </div>
    </div>
  );
}
