// Arabic text vowelized (harakat / tashkeel) so non-native readers can pronounce.
const steps = [
  {
    n: 1,
    en: { title: "Choose a Section", body: "Tap any card to claim it." },
    ar: {
      title: "اِخْتَرْ قِسْمًا",
      body: "اِضْغَطْ عَلَى أَيِّ بِطَاقَةٍ لِحَجْزِهَا.",
    },
  },
  {
    n: 2,
    en: { title: "Recite", body: "Complete your portion in your own time." },
    ar: {
      title: "اِقْرَأْ",
      body: "أَكْمِلْ قِسْمَكَ فِي الْوَقْتِ الْمُنَاسِبِ لَكَ.",
    },
  },
  {
    n: 3,
    en: { title: "Mark Complete", body: "Return and mark your section finished." },
    ar: {
      title: "أَتْمَمْتُ الْقِرَاءَةَ",
      body: "عُدْ وَضَعْ عَلَامَةً عَلَى الْقِسْمِ بِأَنَّهُ مُكْتَمِلٌ.",
    },
  },
];

export function Steps() {
  return (
    <section className="px-6 py-12 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-3 gap-5">
        {steps.map((s) => (
          <div
            key={s.n}
            className="bg-cream-soft border border-gold/30 rounded-2xl p-5 text-center"
          >
            <div className="mx-auto w-9 h-9 rounded-full bg-gold text-ink flex items-center justify-center font-semibold mb-3">
              {s.n}
            </div>
            <h3 className="font-serif text-lg font-semibold text-ink">{s.en.title}</h3>
            <p className="font-arabic text-gold-deep text-lg mt-1" dir="rtl">{s.ar.title}</p>
            <p className="text-ink/70 text-sm md:text-base mt-2">{s.en.body}</p>
            <p className="font-arabic text-ink/70 text-base md:text-lg mt-1" dir="rtl">
              {s.ar.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
