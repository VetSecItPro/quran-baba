import { Hero } from "./Hero";
import { Message } from "./Message";
import { Steps } from "./Steps";
import { DuaCard } from "./DuaCard";
import { HowToParticipate } from "./HowToParticipate";
import { KhatmaGrid } from "./KhatmaGrid";
import { Footer } from "./Footer";

import type { Gender } from "@/lib/supabase";

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
      <Hero
        mode={cfg.mode}
        gender={cfg.gender}
        relationship={cfg.relationship}
        name={cfg.name}
        dates={cfg.dates}
      />
      <Message mode={cfg.mode} relationship={cfg.relationship} gender={cfg.gender} />
      <Steps />
      <div className="px-6">
        <DuaCard mode={cfg.mode} gender={cfg.gender} />
      </div>
      <HowToParticipate />
      <KhatmaGrid slug={cfg.slug} clean={cfg.clean} seed={cfg.seed} />
      <Footer mode={cfg.mode} />
    </main>
  );
}
