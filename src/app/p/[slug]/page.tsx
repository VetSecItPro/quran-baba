import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { MemorialPage } from "@/components/memorial/MemorialPage";
import { formatDateRangeArabic, formatDateRangeEnglish } from "@/lib/page-config";
import type { Database } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

async function fetchPageServer(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const sb = createClient<Database, "quranbaba">(url, key, {
    db: { schema: "quranbaba" },
    auth: { persistSession: false },
  });
  const { data, error } = await sb
    .from("pages")
    .select(
      "id, mode, gender, relationship_en, relationship_ar, name_en, name_ar, start_date, end_date, created_at"
    )
    .eq("id", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const page = await fetchPageServer(slug).catch(() => null);
  if (!page) return { title: "Page not found | QuranForBaba" };
  const verb = page.mode === "memorial" ? "in memory of" : "for the wellbeing of";
  return {
    title: `Quran for ${page.relationship_en} ${verb} ${page.name_en} | QuranForBaba`,
    description: `A collective Qur'an recitation ${verb} ${page.name_en}.`,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const page = await fetchPageServer(slug);
  if (!page) notFound();

  const datesEn =
    page.start_date && page.end_date
      ? formatDateRangeEnglish(page.start_date, page.end_date)
      : "";
  const datesAr =
    page.start_date && page.end_date
      ? formatDateRangeArabic(page.start_date, page.end_date)
      : "";

  return (
    <MemorialPage
      mode={page.mode}
      gender={page.gender}
      relationship={{ en: page.relationship_en, ar: page.relationship_ar }}
      name={{ en: page.name_en, ar: page.name_ar }}
      dates={{ en: datesEn, ar: datesAr }}
      slug={page.id}
    />
  );
}
