import type { MemorialConfig } from "@/components/memorial/MemorialPage";

export type Mode = "memorial" | "living";

import type { Gender } from "./supabase";

const RELATIONSHIP_PRESETS: Record<string, { ar: string; gender: Gender }> = {
  Baba: { ar: "بابا", gender: "male" },
  Mama: { ar: "ماما", gender: "female" },
  Father: { ar: "والد", gender: "male" },
  Mother: { ar: "والدة", gender: "female" },
  Brother: { ar: "أخ", gender: "male" },
  Sister: { ar: "أخت", gender: "female" },
  Uncle: { ar: "عم", gender: "male" },
  Auntie: { ar: "عمة", gender: "female" },
  Grandfather: { ar: "جد", gender: "male" },
  Grandmother: { ar: "جدة", gender: "female" },
  Son: { ar: "ابن", gender: "male" },
  Daughter: { ar: "ابنة", gender: "female" },
  Friend: { ar: "صديق", gender: "male" },
};

export function suggestGender(en: string): Gender | null {
  return RELATIONSHIP_PRESETS[en]?.gender ?? null;
}

export function suggestArabicRelationship(en: string): string {
  return RELATIONSHIP_PRESETS[en]?.ar ?? "";
}

export function relationshipOptions() {
  return Object.keys(RELATIONSHIP_PRESETS);
}

export function configToParams(cfg: MemorialConfig): URLSearchParams {
  const p = new URLSearchParams();
  p.set("mode", cfg.mode);
  p.set("relEn", cfg.relationship.en);
  p.set("relAr", cfg.relationship.ar);
  p.set("nameEn", cfg.name.en);
  p.set("nameAr", cfg.name.ar);
  p.set("datesEn", cfg.dates.en);
  p.set("datesAr", cfg.dates.ar);
  if (cfg.seed != null) p.set("seed", String(cfg.seed));
  return p;
}

export function paramsToConfig(p: URLSearchParams): MemorialConfig {
  const mode = (p.get("mode") === "living" ? "living" : "memorial") as Mode;
  const gender = (p.get("gender") === "female" ? "female" : "male") as Gender;
  return {
    mode,
    gender,
    relationship: { en: p.get("relEn") ?? "Baba", ar: p.get("relAr") ?? "بابا" },
    name: { en: p.get("nameEn") ?? "", ar: p.get("nameAr") ?? "" },
    dates: { en: p.get("datesEn") ?? "", ar: p.get("datesAr") ?? "" },
    seed: p.get("seed") ? Number(p.get("seed")) : 7,
  };
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicDigits(s: string): string {
  return s.replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export function formatDateRangeArabic(startISO: string, endISO: string): string {
  if (!startISO || !endISO) return "";
  const s = new Date(startISO);
  const e = new Date(endISO);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const month = AR_MONTHS[e.getMonth()];
  const year = toArabicDigits(String(e.getFullYear()));
  if (sameMonth) {
    return `${toArabicDigits(String(s.getDate()))} - ${toArabicDigits(String(e.getDate()))} ${month} ${year}`;
  }
  return `${toArabicDigits(String(s.getDate()))} ${AR_MONTHS[s.getMonth()]} - ${toArabicDigits(String(e.getDate()))} ${month} ${year}`;
}

export function formatDateRangeEnglish(startISO: string, endISO: string): string {
  if (!startISO || !endISO) return "";
  const s = new Date(startISO);
  const e = new Date(endISO);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  const yearOpt: Intl.DateTimeFormatOptions = { year: "numeric" };
  const sameYear = s.getFullYear() === e.getFullYear();
  const start = s.toLocaleDateString("en-US", opts);
  const end = e.toLocaleDateString("en-US", { ...opts, ...yearOpt });
  return sameYear ? `${start} – ${end}` : `${start}, ${s.getFullYear()} – ${end}`;
}
