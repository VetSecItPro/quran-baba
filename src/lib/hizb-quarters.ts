import raw from "./hizb-quarters.json";

export type AyahRef = {
  surah: number;
  surahNameAr: string;
  surahNameEn: string;
  ayah: number;
  text: string;
};

export type HizbQuarterEntry = {
  quarter: number; // 1-240
  hizb: number; // 1-60
  quarterInHizb: 1 | 2 | 3 | 4;
  start: AyahRef;
  end: AyahRef;
};

const data = raw as { generatedAt: string; source: string; quarters: HizbQuarterEntry[] };

if (data.quarters.length !== 240) {
  throw new Error(`expected 240 quarters in dataset, got ${data.quarters.length}`);
}

export const HIZB_QUARTERS: HizbQuarterEntry[] = data.quarters;

export function getQuarter(hizb: number, quarterInHizb: 1 | 2 | 3 | 4): HizbQuarterEntry {
  const idx = (hizb - 1) * 4 + (quarterInHizb - 1);
  const e = HIZB_QUARTERS[idx];
  if (!e) throw new Error(`no quarter for hizb=${hizb} q=${quarterInHizb}`);
  return e;
}

export const QUARTER_LABEL_AR: Record<1 | 2 | 3 | 4, string> = {
  1: "الرُّبْعُ الْأَوَّل",
  2: "النِّصْف",
  3: "الثَّلَاثَةُ أَرْبَاع",
  4: "نِهَايَةُ الْحِزْب",
};

export const QUARTER_LABEL_EN: Record<1 | 2 | 3 | 4, string> = {
  1: "First quarter",
  2: "Half",
  3: "Three quarters",
  4: "End of Hizb",
};
