import Image from "next/image";
import { Hero } from "./Hero";
import { Message } from "./Message";
import { Steps } from "./Steps";
import { DuaCard } from "./DuaCard";
import { HowToParticipate } from "./HowToParticipate";
import { KhatmaGrid } from "./KhatmaGrid";
import { Footer } from "./Footer";

import type { Gender } from "@/lib/supabase";

function ZelligeBorder() {
  return (
    <div
      className="w-full h-8 md:h-10 bg-repeat-x bg-contain bg-center opacity-90"
      style={{ backgroundImage: "url('/ornaments/zellige-strip.png')" }}
      aria-hidden="true"
    />
  );
}

export type MemorialConfig = {
  mode: "memorial" | "living";
  gender: Gender;
  relationship: { en: string; ar: string };
  name: { en: string; ar: string };
  dates: { en: string; ar: string };
  /** Supabase-backed page slug. When provided, the grid uses live claims. */
  slug?: string;
  /** Preview-only flag for the /create live preview. Ignored when `slug` is set. */
  clean?: boolean;
  /** Legacy seed for the hardcoded Baba homepage. */
  seed?: number;
};

export function MemorialPage(cfg: MemorialConfig) {
  return (
    <main className="bg-cream min-h-screen">
      <ZelligeBorder />
      <Hero
        mode={cfg.mode}
        gender={cfg.gender}
        relationship={cfg.relationship}
        name={cfg.name}
        dates={cfg.dates}
      />

      {/* Hero ornament panel */}
      <div className="px-6 max-w-3xl mx-auto -mt-2 mb-6">
        <div className="rounded-2xl overflow-hidden border border-gold/30 shadow-lg shadow-gold/10">
          <Image
            src="/ornaments/hero-arabesque.jpg"
            alt="Moroccan lanterns flanking an open Qur'an on a wooden rehal with gilded arabesque ornament."
            width={1792}
            height={768}
            priority
            className="w-full h-auto"
          />
        </div>
      </div>

      <Message mode={cfg.mode} relationship={cfg.relationship} gender={cfg.gender} />
      <Steps />
      <div className="px-6">
        <DuaCard mode={cfg.mode} gender={cfg.gender} />
      </div>
      <HowToParticipate />
      <KhatmaGrid slug={cfg.slug} clean={cfg.clean} seed={cfg.seed} />
      <Footer mode={cfg.mode} />
      <ZelligeBorder />
    </main>
  );
}
