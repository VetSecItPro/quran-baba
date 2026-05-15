import type { Gender } from "@/lib/supabase";

export function DuaCard({ mode, gender }: { mode: "memorial" | "living"; gender: Gender }) {
  const isFem = gender === "female";
  const ar =
    mode === "memorial"
      ? isFem
        ? "اللَّهُمَّ اغْفِرْ لَهَا وَارْحَمْهَا وَعَافِهَا وَاعْفُ عَنْهَا"
        : "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ"
      : isFem
        ? "اللَّهُمَّ اشْفِهَا شِفَاءً لا يُغَادِرُ سَقَمًا"
        : "اللَّهُمَّ اشْفِهِ شِفَاءً لا يُغَادِرُ سَقَمًا";
  const enPronoun = isFem ? "her" : "him";
  const en =
    mode === "memorial"
      ? `O Allah, forgive ${enPronoun}, have mercy on ${enPronoun}, grant ${enPronoun} wellness, and pardon ${enPronoun}.`
      : `O Allah, grant ${enPronoun} a healing that leaves no illness behind.`;
  return (
    <div className="mx-auto max-w-2xl bg-emerald/5 border border-emerald/30 rounded-2xl px-6 py-6 text-center">
      <p className="font-arabic text-2xl md:text-3xl text-emerald-deep leading-loose" dir="rtl">
        {ar}
      </p>
      <p className="text-emerald-deep/80 italic mt-4 text-base md:text-lg">&ldquo;{en}&rdquo;</p>
    </div>
  );
}
