export const HIZB_COUNT = 60;
export const QUARTERS = ["¼", "½", "¾", "⁴⁄₄"] as const;
export type Quarter = (typeof QUARTERS)[number];

export type SectionStatus = "available" | "claimed" | "completed";

export type Section = {
  hizb: number;
  quarter: Quarter;
  quarterInHizb: 1 | 2 | 3 | 4;
  id: string;
  status: SectionStatus;
};

export function buildSections(seed = 0, opts: { clean?: boolean } = {}): Section[] {
  const out: Section[] = [];
  const rng = opts.clean ? null : mulberry32(seed || 1);
  for (let h = 1; h <= HIZB_COUNT; h++) {
    QUARTERS.forEach((q, i) => {
      let status: SectionStatus = "available";
      if (rng) {
        const r = rng();
        status = r < 0.45 ? "completed" : r < 0.7 ? "claimed" : "available";
      }
      out.push({
        hizb: h,
        quarter: q,
        quarterInHizb: (i + 1) as 1 | 2 | 3 | 4,
        id: `${h}-${q}`,
        status,
      });
    });
  }
  return out;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
