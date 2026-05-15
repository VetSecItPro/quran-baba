export function Footer({ mode }: { mode: "memorial" | "living" }) {
  const tagEn = mode === "memorial" ? "Made with love" : "Made with prayer";
  const tagAr = mode === "memorial" ? "صُنع بحب" : "صُنع بدعاء";

  return (
    <footer className="px-6 py-12 border-t border-gold/20 bg-parchment text-center">
      <div className="max-w-2xl mx-auto">
        <p className="font-arabic text-emerald-deep text-2xl md:text-3xl" dir="rtl">
          تَقَبَّلَ اللهُ مِنَّا وَمِنْكُمْ
        </p>
        <p className="text-ink/70 italic mt-2 text-base md:text-lg">
          &ldquo;May Allah accept from all who participated.&rdquo;
        </p>

        <blockquote className="mt-8 text-ink/80 text-sm leading-relaxed">
          &ldquo;Whoever recites a letter from the Book of Allah will be credited with a good deed,
          and a good deed gets a tenfold reward.&rdquo;
          <span className="block text-ink/50 mt-1">— Prophet Muhammad ﷺ (Tirmidhi)</span>
        </blockquote>

        <p className="mt-10 text-ink/60 text-sm">
          {tagEn} <span className="ornament">✦</span>{" "}
          <span className="font-arabic">{tagAr}</span>
        </p>
        <p className="text-ink/40 text-xs mt-2">QuranForBaba · 2026</p>
      </div>
    </footer>
  );
}
