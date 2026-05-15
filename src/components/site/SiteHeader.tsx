import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-cream/80 border-b border-gold/20">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="font-serif text-xl font-semibold text-ink group-hover:text-emerald-deep transition-colors">
            QuranForBaba
          </span>
          <span className="font-arabic text-lg text-gold-deep" dir="rtl">
            قرآن لبابا
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
