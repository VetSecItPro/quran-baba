"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="bg-cream min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-3xl text-ink mb-2">Something went wrong</h1>
      <p className="font-arabic text-xl text-gold-deep mb-6" dir="rtl">
        حدث خطأ غير متوقع
      </p>
      <p className="text-ink/60 text-sm max-w-md mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="px-5 py-2 rounded-full bg-emerald text-white hover:bg-emerald-deep transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
