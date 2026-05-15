import type { Gender } from "@/lib/supabase";

type Props = {
  mode: "memorial" | "living";
  relationship: { en: string; ar: string };
  gender: Gender;
};

export function Message({ mode, relationship, gender }: Props) {
  const en =
    mode === "memorial"
      ? `In loving memory of our beloved ${relationship.en}, we invite family and friends to join us in completing a collective Qur'an recitation (Khatma) during this blessed period.`
      : `In love and prayer for our beloved ${relationship.en}, we invite family and friends to join us in completing a collective Qur'an recitation (Khatma) for healing and blessings.`;

  const beloved = gender === "female" ? "الحبيبة" : "الحبيب";
  const ar =
    mode === "memorial"
      ? `في ذكرى ${relationship.ar} ${beloved}، ندعو الأهل والأصدقاء للمشاركة في ختمة قرآنية جماعية خلال هذه الفترة المباركة.`
      : `محبةً ودعاءً ل${relationship.ar} ${beloved}، ندعو الأهل والأصدقاء للمشاركة في ختمة قرآنية جماعية للشفاء والبركة.`;

  return (
    <section className="bg-parchment border-y border-gold/20 px-6 py-10">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-arabic text-gold-deep text-6xl md:text-7xl leading-none mb-8">﷽</p>
        <p className="text-ink/80 leading-relaxed text-base md:text-lg">{en}</p>
        <p className="font-arabic text-ink/80 mt-4 text-lg md:text-xl" dir="rtl">
          {ar}
        </p>
        <p className="text-ink/70 italic mt-6 text-sm md:text-base">
          Each participant can claim one or more sections below. May your time spent be a source of
          reward and blessings for all who participate.
        </p>
        <p className="font-arabic text-ink/70 mt-3 text-base md:text-lg" dir="rtl">
          يمكن لكل مشارك اختيار قسم أو أكثر أدناه. تقبّل الله من جميع من شارك.
        </p>
      </div>
    </section>
  );
}
