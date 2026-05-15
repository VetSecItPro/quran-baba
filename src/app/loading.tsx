export default function Loading() {
  return (
    <main className="bg-cream min-h-screen flex flex-col">
      <div className="pt-16 pb-10 px-6 text-center max-w-3xl mx-auto w-full">
        <div className="h-6 w-64 mx-auto rounded bg-gold/20 animate-pulse" />
        <div className="h-12 w-96 max-w-full mx-auto mt-4 rounded bg-gold/20 animate-pulse" />
        <div className="h-8 w-72 max-w-full mx-auto mt-3 rounded bg-gold/10 animate-pulse" />
        <div className="h-6 w-56 mx-auto mt-8 rounded bg-emerald/10 animate-pulse" />
      </div>
      <section className="px-6 py-10 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-cream-soft border border-gold/20 animate-pulse"
            />
          ))}
        </div>
      </section>
      <p className="text-center text-ink/50 text-sm pb-10 font-arabic" dir="rtl">
        جارٍ التحميل…
      </p>
    </main>
  );
}
