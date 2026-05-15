export function HowToParticipate() {
  return (
    <section className="px-6 pt-2 pb-6 max-w-6xl mx-auto">
      <div className="bg-parchment border border-gold/30 rounded-2xl p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            How to Participate <span className="text-gold-deep">|</span>{" "}
            <span className="font-arabic text-gold-deep" dir="rtl">
              كيفية المشاركة
            </span>
          </h2>
        </div>
        <p className="text-ink/80 leading-relaxed text-base md:text-lg">
          Each card represents a <strong className="text-emerald-deep">1/4 Hizb</strong> section of
          the Qur&apos;an. Tap any card to see where to start and stop: Surah name, Ayah numbers,
          and the opening and closing words.
        </p>
        <p
          className="font-arabic text-ink/80 leading-loose text-lg md:text-xl mt-4"
          dir="rtl"
        >
          كُلُّ بِطَاقَةٍ تُمَثِّلُ رُبْعَ حِزْبٍ مِنَ الْقُرْآنِ الْكَرِيمِ. اِضْغَطْ عَلَى أَيِّ
          بِطَاقَةٍ لِمَعْرِفَةِ مَكَانِ الْبِدَايَةِ وَالنِّهَايَةِ: اسْمَ السُّورَةِ وَأَرْقَامَ
          الْآيَاتِ وَالْكَلِمَاتِ الْاِفْتِتَاحِيَّةَ وَالْخِتَامِيَّةَ.
        </p>
      </div>
    </section>
  );
}
