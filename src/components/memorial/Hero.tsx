import type { Gender } from "@/lib/supabase";

type Props = {
  relationship: { en: string; ar: string };
  name: { en: string; ar: string };
  dates: { en: string; ar: string };
  mode: "memorial" | "living";
  gender: Gender;
};

export function Hero({ relationship, name, dates, mode, gender }: Props) {
  const titleEn = `Quran for ${relationship.en}`;
  // Prefix is vowelized (harakat); the user-supplied relationship word stays as typed.
  const titleAr = `قُرْآنٌ لِ${relationship.ar}`;
  const subtitleEn =
    mode === "memorial"
      ? "A collective Qur'an recitation in memory of"
      : "A collective Qur'an recitation for the benefit and blessing of";
  const subtitleAr =
    mode === "memorial"
      ? "خَتْمَةٌ قُرْآنِيَّةٌ جَمَاعِيَّةٌ فِي ذِكْرَى"
      : "خَتْمَةٌ قُرْآنِيَّةٌ جَمَاعِيَّةٌ لِخَيْرٍ وَبَرَكَةٍ";
  const honorific =
    mode === "memorial"
      ? gender === "female"
        ? "رَحِمَهَا اللَّهُ"
        : "رَحِمَهُ اللَّهُ"
      : gender === "female"
        ? "حَفِظَهَا اللَّهُ"
        : "حَفِظَهُ اللَّهُ";

  // Opening verse / du'a swaps with mode.
  // Memorial: Quran 2:156 - the verse of return.
  // Living: Quran 26:80 - Ibrahim's words "And when I am ill, He heals me."
  const openingAr =
    mode === "memorial"
      ? "إِنَّا لِلّهِ وَإِنَّـا إِلَيْهِ رَاجِعونَ"
      : "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ";
  const openingEn =
    mode === "memorial"
      ? "Indeed, to Allah we belong and to Him we shall return."
      : "And when I am ill, it is He who heals me.";

  return (
    <header className="text-center pt-16 pb-10 px-6">
      <p className="font-arabic text-gold-deep text-2xl md:text-3xl mb-2" dir="rtl">
        {openingAr}
      </p>
      <p className="italic text-ink/70 text-base md:text-lg mb-10">
        &ldquo;{openingEn}&rdquo;
      </p>

      <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight text-ink">
        {titleEn}
      </h1>
      <p className="font-arabic text-4xl md:text-5xl text-gold-deep mt-3" dir="rtl">
        {titleAr}
      </p>

      <p className="text-ink/70 mt-8 text-base md:text-lg">{subtitleEn}</p>
      <p className="font-arabic text-ink/70 text-lg md:text-xl mt-1" dir="rtl">
        {subtitleAr}
      </p>

      <h2 className="font-serif text-2xl md:text-3xl font-semibold text-emerald-deep mt-4">
        {name.en}
      </h2>
      <p className="font-arabic text-3xl md:text-4xl text-emerald-deep mt-1" dir="rtl">
        {name.ar} <span className="text-gold-deep">{honorific}</span>
      </p>

      <p className="mt-6 text-ink/60 text-sm md:text-base">
        <span className="ornament">✦</span> {dates.en} <span className="ornament">✦</span>
      </p>
      <p className="font-arabic text-ink/60 text-base md:text-lg" dir="rtl">
        {dates.ar}
      </p>
    </header>
  );
}
