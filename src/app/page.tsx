import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-cream min-h-screen">
      {/* Top zellige border */}
      <div
        className="w-full h-8 md:h-10 bg-repeat-x bg-contain bg-center opacity-90"
        style={{ backgroundImage: "url('/ornaments/zellige-strip.png')" }}
        aria-hidden="true"
      />

      {/* Hero */}
      <section className="relative px-6 pt-12 md:pt-16 pb-16 max-w-5xl mx-auto text-center">
        <p className="font-arabic text-gold-deep text-3xl md:text-4xl leading-none mb-4" dir="rtl">
          ﷽
        </p>
        <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight text-ink">
          A Qur&apos;an for someone you love
        </h1>
        <p className="font-arabic text-gold-deep text-3xl md:text-4xl mt-3" dir="rtl">
          قُرْآنٌ لِمَنْ تُحِبُّ
        </p>

        {/* Hero ornament panel */}
        <div className="mt-10 mx-auto max-w-3xl rounded-2xl overflow-hidden border border-gold/30 shadow-lg shadow-gold/10">
          <Image
            src="/ornaments/hero-arabesque.jpg"
            alt="Two Moroccan lanterns flank an open Qur'an on a wooden rehal, framed with gilded arabesque ornament."
            width={1792}
            height={768}
            priority
            className="w-full h-auto"
          />
        </div>

        <p className="text-ink/70 text-lg md:text-xl mt-8 max-w-2xl mx-auto leading-relaxed">
          Create a memorial or wellbeing page in minutes. Family and friends claim sections of the
          Qur&apos;an to read together, at home, abroad, or across generations.
        </p>
        <p
          className="font-arabic text-ink/70 text-lg md:text-xl mt-3 max-w-2xl mx-auto leading-loose"
          dir="rtl"
        >
          أَنْشِئْ صَفْحَةً تِذْكَارِيَّةً أَوْ لِلدُّعَاءِ بِالشِّفَاءِ فِي دَقَائِقَ. يَحْجُزُ
          الْأَهْلُ وَالْأَصْدِقَاءُ أَجْزَاءً مِنَ الْقُرْآنِ الْكَرِيمِ لِقِرَاءَتِهَا مَعًا،
          فِي الْبَيْتِ، فِي الْغُرْبَةِ، أَوْ عَبْرَ الْأَجْيَالِ.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/create"
            className="px-8 py-3 rounded-full bg-emerald text-white font-medium text-lg hover:bg-emerald-deep transition-colors"
          >
            Create a page <span className="opacity-80">|</span>{" "}
            <span className="font-arabic">أَنْشِئْ صَفْحَة</span>
          </Link>
          <a
            href="#how"
            className="px-6 py-3 rounded-full border border-gold/40 bg-parchment text-ink hover:border-gold transition-colors"
          >
            How it works <span className="text-gold-deep">|</span>{" "}
            <span className="font-arabic">كَيْفَ تَعْمَل</span>
          </a>
        </div>

        <p className="text-xs text-ink/50 mt-6">
          Free · No account needed · No tracking <span className="text-gold-deep">|</span>{" "}
          <span className="font-arabic" dir="rtl">مَجَّانِيّ · بِدُونِ حِسَاب · بِدُونِ تَتَبُّع</span>
        </p>
      </section>

      {/* Value props */}
      <section className="bg-parchment border-y border-gold/20 px-6 py-16">
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
          <ValueProp
            titleEn="For the departed"
            titleAr="لِمَنْ رَحَلُوا"
            bodyEn="Gather the family to complete a khatma in memory of a parent, grandparent, sibling, or friend who has passed."
            bodyAr="اِجْمَعِ الْعَائِلَةَ لِإِتْمَامِ خَتْمَةٍ قُرْآنِيَّةٍ فِي ذِكْرَى وَالِدٍ أَوْ وَالِدَةٍ أَوْ جَدٍّ أَوْ صَدِيقٍ رَحَلَ."
          />
          <ValueProp
            titleEn="For the living"
            titleAr="لِلْأَحْيَاء"
            bodyEn="Recite on behalf of a loved one recovering from illness, or for any soul in need of du'a and blessings."
            bodyAr="اِقْرَأْ نِيَابَةً عَنْ حَبِيبٍ يَتَعَافَى مِنْ مَرَضٍ، أَوْ لِأَيِّ رُوحٍ بِحَاجَةٍ إِلَى الدُّعَاءِ وَالْبَرَكَة."
          />
          <ValueProp
            titleEn="Together, anywhere"
            titleAr="مَعًا، أَيْنَمَا كُنْتُم"
            bodyEn="240 sections to share. Each card has its exact starting and ending verses, with a one-tap link to read on Quran.com."
            bodyAr="٢٤٠ قِسْمًا لِلْمُشَارَكَة. كُلُّ بِطَاقَةٍ بِدَايَةٌ وَنِهَايَةُ الْآيَات، مَعَ رَابِطٍ مُبَاشِرٍ لِلْقِرَاءَةِ عَلَى Quran.com."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink text-center">
          How it works
        </h2>
        <p className="font-arabic text-gold-deep text-2xl md:text-3xl mt-1 text-center" dir="rtl">
          كَيْفَ تَعْمَل
        </p>

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          <Step
            n={1}
            titleEn="Create the page"
            titleAr="أَنْشِئِ الصَّفْحَة"
            bodyEn="Enter the relationship, name, and dates, in English and Arabic."
            bodyAr="أَدْخِلْ صِلَةَ الْقَرَابَةِ وَالِاسْمَ وَالتَّوَارِيخَ بِالْإِنْجِلِيزِيَّةِ وَالْعَرَبِيَّة."
          />
          <Step
            n={2}
            titleEn="Share the link"
            titleAr="شَارِكِ الرَّابِط"
            bodyEn="You get a private URL. Send it to family and friends however you like."
            bodyAr="سَتَحْصُلُ عَلَى رَابِطٍ خَاصّ. أَرْسِلْهُ لِلْأَهْلِ وَالْأَصْدِقَاءِ كَيْفَمَا تَشَاء."
          />
          <Step
            n={3}
            titleEn="Read together"
            titleAr="اِقْرَأُوا مَعًا"
            bodyEn="Everyone claims a section, reads it, and marks it complete. The page tracks the whole khatma in real time."
            bodyAr="يَخْتَارُ كُلٌّ قِسْمًا، يَقْرَأُهُ، ثُمَّ يَضَعُ عَلَامَةَ إِتْمَام. الصَّفْحَةُ تُتَابِعُ الْخَتْمَةَ كَامِلَةً فِي الْوَقْتِ الْفِعْلِيّ."
          />
        </ol>

        <div className="text-center mt-12">
          <Link
            href="/create"
            className="inline-block px-8 py-3 rounded-full bg-emerald text-white font-medium text-lg hover:bg-emerald-deep transition-colors"
          >
            Start your page <span className="opacity-80">|</span>{" "}
            <span className="font-arabic">اِبْدَأْ صَفْحَتَك</span>
          </Link>
        </div>
      </section>

      {/* Verse */}
      <section className="bg-emerald/5 border-t border-emerald/20 px-6 py-14">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-arabic text-emerald-deep text-2xl md:text-3xl leading-loose" dir="rtl">
            مَن قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ
            أَمْثَالِهَا
          </p>
          <p className="italic text-ink/70 text-base md:text-lg mt-4">
            &ldquo;Whoever recites a letter from the Book of Allah will be credited with a good deed,
            and a good deed gets a tenfold reward.&rdquo;
          </p>
          <p className="text-ink/50 text-sm mt-2">Prophet Muhammad ﷺ · Tirmidhi</p>
        </div>
      </section>

      <footer className="px-6 py-10 text-center border-t border-gold/20">
        <p className="font-arabic text-emerald-deep text-xl md:text-2xl" dir="rtl">
          تَقَبَّلَ اللهُ مِنَّا وَمِنْكُمْ
        </p>
        <p className="text-ink/60 italic mt-1 text-sm">
          May Allah accept from us and from you.
        </p>
        <p className="text-ink/40 text-xs mt-4">QuranForBaba · 2026</p>
      </footer>

      {/* Bottom zellige border */}
      <div
        className="w-full h-8 md:h-10 bg-repeat-x bg-contain bg-center opacity-90"
        style={{ backgroundImage: "url('/ornaments/zellige-strip.png')" }}
        aria-hidden="true"
      />
    </main>
  );
}

function ValueProp({
  titleEn,
  titleAr,
  bodyEn,
  bodyAr,
}: {
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
}) {
  return (
    <div className="bg-cream-soft border border-gold/30 rounded-2xl p-6">
      <h3 className="font-serif text-xl font-semibold text-ink">{titleEn}</h3>
      <p className="font-arabic text-gold-deep text-lg mt-1" dir="rtl">
        {titleAr}
      </p>
      <p className="text-ink/70 text-sm md:text-base mt-3 leading-relaxed">{bodyEn}</p>
      <p className="font-arabic text-ink/70 text-base md:text-lg mt-3 leading-loose" dir="rtl">
        {bodyAr}
      </p>
    </div>
  );
}

function Step({
  n,
  titleEn,
  titleAr,
  bodyEn,
  bodyAr,
}: {
  n: number;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
}) {
  return (
    <li className="bg-cream-soft border border-gold/30 rounded-2xl p-5">
      <div className="w-9 h-9 rounded-full bg-gold text-white flex items-center justify-center font-semibold mb-3">
        {n}
      </div>
      <h3 className="font-serif text-lg font-semibold text-ink">{titleEn}</h3>
      <p className="font-arabic text-gold-deep text-base mt-1" dir="rtl">
        {titleAr}
      </p>
      <p className="text-ink/70 text-sm mt-3 leading-relaxed">{bodyEn}</p>
      <p className="font-arabic text-ink/70 text-base mt-2 leading-loose" dir="rtl">
        {bodyAr}
      </p>
    </li>
  );
}
