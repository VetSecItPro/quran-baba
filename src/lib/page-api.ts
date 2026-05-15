"use client";

import { nanoid } from "nanoid";
import { supabase, type Gender, type PageRow, type SectionRow } from "./supabase";

// All writes go through Next.js API routes (server-side, service_role + Turnstile).
// Reads stay direct to Supabase with the publishable key (RLS + column grants are the boundary).

export type CreatePageInput = {
  mode: "memorial" | "living";
  gender: Gender;
  relationship: { en: string; ar: string };
  name: { en: string; ar: string };
  startDate?: string;
  endDate?: string;
  turnstileToken: string;
  honeypot?: string;
};

export type CreatedPage = {
  slug: string;
  editToken: string;
};

const SLUG_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

function newSlug(): string {
  const raw = nanoid(16).toLowerCase().replace(/[^a-z0-9]/g, "");
  if (raw.length >= 12) return raw.slice(0, 16);
  // Fallback for the unlucky case where filtering shortens the string too much.
  return Array.from({ length: 16 }, () => SLUG_ALPHABET[Math.floor(Math.random() * SLUG_ALPHABET.length)]).join("");
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string } & T;
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `${url} failed (${res.status})`);
  }
  return data;
}

export async function createPage(input: CreatePageInput): Promise<CreatedPage> {
  const slug = newSlug();
  const editToken = nanoid(32);

  await postJson<{ slug: string }>("/api/pages", {
    turnstileToken: input.turnstileToken,
    website: input.honeypot ?? "",
    slug,
    editToken,
    mode: input.mode,
    gender: input.gender,
    relationship: input.relationship,
    name: input.name,
    startDate: input.startDate ?? null,
    endDate: input.endDate ?? null,
  });

  rememberEditToken(slug, editToken);
  return { slug, editToken };
}

// ===== Reads (direct to Supabase, column-grant-protected) =====

const PAGE_COLUMNS =
  "id, mode, gender, relationship_en, relationship_ar, name_en, name_ar, start_date, end_date, created_at" as const;

const SECTION_COLUMNS =
  "page_id, quarter, hizb, quarter_in_hizb, status, claimant_name, claimant_dua, completed, claimed_at, updated_at" as const;

export async function fetchPage(slug: string): Promise<PageRow | null> {
  const { data, error } = await supabase()
    .from("pages")
    .select(PAGE_COLUMNS)
    .eq("id", slug)
    .maybeSingle();
  if (error) throw new Error(`fetchPage failed: ${error.message}`);
  return data;
}

export async function fetchSections(slug: string): Promise<SectionRow[]> {
  const { data, error } = await supabase()
    .from("sections")
    .select(SECTION_COLUMNS)
    .eq("page_id", slug)
    .order("quarter", { ascending: true });
  if (error) throw new Error(`fetchSections failed: ${error.message}`);
  return data ?? [];
}

// ===== Writes (all via API routes) =====

export async function claimSection(
  slug: string,
  quarter: number,
  name: string,
  dua: string | undefined,
  turnstileToken: string,
  honeypot: string = ""
): Promise<string> {
  const releaseToken = nanoid(24);
  await postJson("/api/sections/claim", {
    turnstileToken,
    website: honeypot,
    pageId: slug,
    quarter,
    name,
    dua: dua ?? null,
    releaseToken,
  });
  rememberReleaseToken(slug, quarter, releaseToken);
  return releaseToken;
}

export async function releaseSection(slug: string, quarter: number): Promise<void> {
  const token = recallReleaseToken(slug, quarter);
  if (!token) throw new Error("You don't have permission to release this claim.");
  await postJson("/api/sections/release", {
    pageId: slug,
    quarter,
    releaseToken: token,
  });
  forgetReleaseToken(slug, quarter);
}

export async function completeSection(slug: string, quarter: number): Promise<void> {
  const token = recallReleaseToken(slug, quarter);
  if (!token) throw new Error("You don't have permission to mark this complete.");
  await postJson("/api/sections/complete", {
    pageId: slug,
    quarter,
    releaseToken: token,
  });
}

// ===== Per-claim token storage (localStorage) =====

function tokenKey(slug: string, quarter: number) {
  return `qb.rt.${slug}.${quarter}`;
}
function editKey(slug: string) {
  return `qb.et.${slug}`;
}

export function rememberReleaseToken(slug: string, quarter: number, token: string) {
  try {
    localStorage.setItem(tokenKey(slug, quarter), token);
  } catch {}
}
export function recallReleaseToken(slug: string, quarter: number): string | null {
  try {
    return localStorage.getItem(tokenKey(slug, quarter));
  } catch {
    return null;
  }
}
export function forgetReleaseToken(slug: string, quarter: number) {
  try {
    localStorage.removeItem(tokenKey(slug, quarter));
  } catch {}
}
export function hasReleaseToken(slug: string, quarter: number) {
  return recallReleaseToken(slug, quarter) !== null;
}

export function rememberEditToken(slug: string, token: string) {
  try {
    localStorage.setItem(editKey(slug), token);
  } catch {}
}
export function recallEditToken(slug: string): string | null {
  try {
    return localStorage.getItem(editKey(slug));
  } catch {
    return null;
  }
}
