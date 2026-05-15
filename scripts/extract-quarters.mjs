#!/usr/bin/env node
// Reads the full al-Quran Cloud Uthmani JSON and emits the 240 rub-al-hizb boundaries.
// Source: api.alquran.cloud/v1/quran/quran-uthmani (saved to /tmp/quran-uthmani.json).
// Uses the canonical Madinah-mushaf rub-al-hizb annotations attached to each ayah.

import fs from "node:fs";

const raw = JSON.parse(fs.readFileSync("/tmp/quran-uthmani.json", "utf8"));
if (raw.code !== 200) throw new Error("source fetch failed");

// Flatten all ayahs in mushaf order, preserving annotations.
const flat = [];
for (const s of raw.data.surahs) {
  for (const a of s.ayahs) {
    flat.push({
      globalIndex: flat.length, // 0..6235
      surahNumber: s.number,
      surahNameAr: s.name,
      surahNameEn: s.englishName,
      surahNameEnTranslation: s.englishNameTranslation,
      ayahNumberInSurah: a.numberInSurah,
      text: a.text,
      hizbQuarter: a.hizbQuarter, // 1..240
    });
  }
}

if (flat.length !== 6236) {
  throw new Error(`expected 6236 ayahs, got ${flat.length}`);
}

// Find the FIRST ayah of each hizbQuarter — that's the start point.
const starts = new Array(241).fill(null); // 1-indexed
for (const a of flat) {
  const q = a.hizbQuarter;
  if (q < 1 || q > 240) throw new Error(`bad hizbQuarter ${q} at ${a.surahNumber}:${a.ayahNumberInSurah}`);
  if (starts[q] === null) starts[q] = a;
}
for (let q = 1; q <= 240; q++) {
  if (!starts[q]) throw new Error(`missing start for quarter ${q}`);
}

// End of quarter Q = the ayah immediately before the start of quarter Q+1.
// End of quarter 240 = last ayah of the Quran (114:6).
const quarters = [];
for (let q = 1; q <= 240; q++) {
  const start = starts[q];
  const nextStart = q < 240 ? starts[q + 1] : null;
  const end = nextStart ? flat[nextStart.globalIndex - 1] : flat[flat.length - 1];

  // Compute hizb (1-60) and quarter-within-hizb (1-4).
  const hizb = Math.floor((q - 1) / 4) + 1;
  const quarterInHizb = ((q - 1) % 4) + 1;

  quarters.push({
    quarter: q,
    hizb,
    quarterInHizb,
    start: {
      surah: start.surahNumber,
      surahNameAr: start.surahNameAr,
      surahNameEn: start.surahNameEn,
      ayah: start.ayahNumberInSurah,
      text: start.text,
    },
    end: {
      surah: end.surahNumber,
      surahNameAr: end.surahNameAr,
      surahNameEn: end.surahNameEn,
      ayah: end.ayahNumberInSurah,
      text: end.text,
    },
  });
}

// Sanity assertions.
if (quarters.length !== 240) throw new Error(`expected 240 quarters, got ${quarters.length}`);
const last = quarters[239].end;
if (last.surah !== 114 || last.ayah !== 6) {
  throw new Error(`expected quarter 240 to end at 114:6, got ${last.surah}:${last.ayah}`);
}
const first = quarters[0].start;
if (first.surah !== 1 || first.ayah !== 1) {
  throw new Error(`expected quarter 1 to start at 1:1, got ${first.surah}:${first.ayah}`);
}

const outPath = "src/lib/hizb-quarters.json";
fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), source: "api.alquran.cloud/v1/quran/quran-uthmani", quarters }, null, 2));
console.log(`wrote ${quarters.length} quarters to ${outPath}`);
console.log(`first: ${first.surah}:${first.ayah} (${first.surahNameEn})`);
console.log(`last:  ${last.surah}:${last.ayah} (${last.surahNameEn})`);
