import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-cream min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-5xl text-ink mb-2">404</h1>
      <p className="font-arabic text-2xl text-gold-deep mb-6" dir="rtl">
        الصفحة غير موجودة
      </p>
      <p className="text-ink/60 text-sm mb-6">This page could not be found.</p>
      <Link
        href="/"
        className="px-5 py-2 rounded-full bg-emerald text-white hover:bg-emerald-deep transition-colors"
      >
        Return home
      </Link>
    </main>
  );
}
