import type { Metadata } from "next";
import { Cormorant_Garamond, Amiri } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const arabic = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "QuranForBaba | قرآن لبابا",
  description: "A collective Qur'an recitation for a loved one.",
};

const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (!t) {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (t === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = t;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${serif.variable} ${arabic.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* Ornament frame is applied per-page (only on landing + memorial pages),
          since /create has a split tool layout that conflicts with edge bars. */}
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
