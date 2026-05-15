"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MemorialPage, type MemorialConfig } from "@/components/memorial/MemorialPage";
import { ArabicInput } from "./ArabicInput";
import {
  formatDateRangeArabic,
  formatDateRangeEnglish,
  relationshipOptions,
  suggestArabicRelationship,
} from "@/lib/page-config";
import { createPage } from "@/lib/page-api";
import { Turnstile } from "@/components/site/Turnstile";
import { suggestGender } from "@/lib/page-config";
import { HONEYPOT_FIELD, HONEYPOT_STYLE } from "@/lib/honeypot";
import type { Gender } from "@/lib/supabase";

export function CreateForm() {
  const [mode, setMode] = useState<"memorial" | "living">("memorial");
  const [gender, setGender] = useState<Gender>("male");
  const [relEn, setRelEn] = useState("Baba");
  const [relAr, setRelAr] = useState("بابا");
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [honey, setHoney] = useState("");
  const router = useRouter();

  const cfg: MemorialConfig = useMemo(
    () => ({
      mode,
      gender,
      relationship: { en: relEn || "Baba", ar: relAr || suggestArabicRelationship(relEn) || "بابا" },
      name: { en: nameEn || "…", ar: nameAr || "…" },
      dates: {
        en: formatDateRangeEnglish(startDate, endDate) || "…",
        ar: formatDateRangeArabic(startDate, endDate) || "…",
      },
      seed: 7,
      clean: true,
    }),
    [mode, gender, relEn, relAr, nameEn, nameAr, startDate, endDate]
  );

  const canPublish =
    nameEn.trim().length > 0 &&
    nameAr.trim().length > 0 &&
    relEn.trim().length > 0 &&
    relAr.trim().length > 0 &&
    captchaToken.length > 0 &&
    !publishing;

  async function publish() {
    if (!canPublish) return;
    setPublishing(true);
    setPublishError(null);
    try {
      const { slug } = await createPage({
        mode,
        gender,
        relationship: { en: relEn.trim(), ar: relAr.trim() },
        name: { en: nameEn.trim(), ar: nameAr.trim() },
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        turnstileToken: captchaToken,
        honeypot: honey,
      });
      router.push(`/p/${slug}`);
    } catch (e) {
      setPublishError((e as Error).message);
      setPublishing(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[420px_1fr] min-h-[calc(100vh-3.5rem)]">
      <aside className="border-r border-gold/20 bg-cream-soft p-6 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] overflow-y-auto">
        <h1 className="font-serif text-2xl font-semibold text-ink">Create a page</h1>
        <p className="font-arabic text-gold-deep text-lg mt-1" dir="rtl">
          أنشئ صفحة
        </p>
        <p className="text-ink/60 text-sm mt-3">
          Build a collective Qur&apos;an recitation page for someone you love.
        </p>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-ink/80 mb-2">Who is this for?</legend>
          <div className="grid grid-cols-2 gap-2">
            <ModeButton active={mode === "memorial"} onClick={() => setMode("memorial")}>
              <div className="font-medium">In memory</div>
              <div className="font-arabic text-sm" dir="rtl">في ذكرى</div>
              <div className="text-xs opacity-70 mt-1">For someone who has passed</div>
            </ModeButton>
            <ModeButton active={mode === "living"} onClick={() => setMode("living")}>
              <div className="font-medium">For their wellbeing</div>
              <div className="font-arabic text-sm" dir="rtl">من أجل شفاء</div>
              <div className="text-xs opacity-70 mt-1">For someone living</div>
            </ModeButton>
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="text-sm font-medium text-ink/80 mb-1">Gender</legend>
          <p className="font-arabic text-gold-deep text-base mb-2" dir="rtl">
            الجنس
          </p>
          <div className="grid grid-cols-2 gap-2">
            <GenderButton active={gender === "male"} onClick={() => setGender("male")}>
              <div className="font-medium">Male</div>
              <div className="font-arabic text-sm" dir="rtl">ذكر</div>
            </GenderButton>
            <GenderButton active={gender === "female"} onClick={() => setGender("female")}>
              <div className="font-medium">Female</div>
              <div className="font-arabic text-sm" dir="rtl">أنثى</div>
            </GenderButton>
          </div>
        </fieldset>

        <Field label="Relationship (English)" hint="e.g. Baba, Mama, Uncle">
          <input
            list="relationship-presets"
            value={relEn}
            onChange={(e) => {
              const v = e.target.value;
              setRelEn(v);
              const ar = suggestArabicRelationship(v);
              if (ar) setRelAr(ar);
              const g = suggestGender(v);
              if (g) setGender(g);
            }}
            className={inputCls}
          />
          <datalist id="relationship-presets">
            {relationshipOptions().map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </Field>

        <Field label="Relationship (Arabic)" hint="Type, paste, or use the on-screen keyboard">
          <ArabicInput value={relAr} onChange={setRelAr} placeholder="بابا، ماما، عم…" />
        </Field>

        <Field label="Name (English)">
          <input
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="Full name"
            className={inputCls}
          />
        </Field>

        <Field label="Name (Arabic)" hint="Type, paste, or use the on-screen keyboard">
          <ArabicInput value={nameAr} onChange={setNameAr} placeholder="الاسم بالعربية" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Start date">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="mt-6 pt-6 border-t border-gold/20">
          {publishError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 mb-3 text-sm">
              {publishError}
            </div>
          )}
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
          <Turnstile onToken={setCaptchaToken} className="mb-3" />
          <button
            type="button"
            onClick={publish}
            disabled={!canPublish}
            className="w-full px-5 py-3 rounded-full bg-emerald text-white font-medium hover:bg-emerald-deep disabled:bg-emerald/30 disabled:cursor-not-allowed transition-colors"
          >
            {publishing ? "Publishing…" : (
              <>
                Publish &amp; share <span className="opacity-80">|</span>{" "}
                <span className="font-arabic">انشر وشارك</span>
              </>
            )}
          </button>
          <p className="text-xs text-ink/50 mt-2">
            You&apos;ll get a private link to share with family. No account needed.
          </p>
        </div>
      </aside>

      <section className="overflow-y-auto">
        <div className="px-4 py-2 text-xs text-ink/50 bg-parchment border-b border-gold/20">
          Live preview
        </div>
        <MemorialPage {...cfg} />
      </section>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-parchment border border-gold/30 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-colors";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mt-4">
      <span className="text-sm font-medium text-ink/80">{label}</span>
      {hint && <span className="block text-xs text-ink/50">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function GenderButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-3 rounded-xl border-2 transition-colors ${
        active
          ? "bg-emerald/10 border-emerald text-emerald-deep"
          : "bg-parchment border-gold/30 text-ink hover:border-gold"
      }`}
    >
      {children}
    </button>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-3 rounded-xl border-2 transition-colors ${
        active
          ? "bg-emerald/10 border-emerald text-emerald-deep"
          : "bg-parchment border-gold/30 text-ink hover:border-gold"
      }`}
    >
      {children}
    </button>
  );
}
