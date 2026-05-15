#!/usr/bin/env node
// One-time image generation via fal.ai. Run once; commit outputs to public/ornaments/.
// Not part of the runtime — pure tooling.

import fs from "node:fs";
import path from "node:path";
import { fal } from "@fal-ai/client";

const FAL_KEY = process.env.FAL_KEY || readEnvFile().FAL_KEY;
if (!FAL_KEY) throw new Error("FAL_KEY required (in env or .env.local)");
fal.config({ credentials: FAL_KEY });

function readEnvFile() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(p, "utf8")
      .split("\n")
      .filter((l) => l && !l.startsWith("#") && l.includes("="))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
      })
  );
}

const OUT_DIR = path.join(process.cwd(), "public", "ornaments");
fs.mkdirSync(OUT_DIR, { recursive: true });

const jobs = [
  {
    name: "hero-arabesque.jpg",
    model: "fal-ai/flux-pro/v1.1-ultra",
    args: {
      prompt: [
        "An elegant symmetrical Moroccan Islamic decorative composition,",
        "two ornate brass Moroccan lanterns with intricate filigree and warm candle glow,",
        "flanking a delicately carved wooden rehal book stand holding an open illuminated Qur'an,",
        "surrounded by flowing arabesque vine flourishes in soft gold,",
        "subtle zellige geometric tilework framing the edges,",
        "deep teal and antique gold and warm parchment color palette,",
        "reverent and meditative atmosphere, soft ambient light,",
        "ornate fine-art illustration, hand-painted look, gilded leaf accents,",
        "centered composition, no text, no calligraphy, no human figures, no animals,",
        "cinematic depth, museum-quality detail",
      ].join(" "),
      aspect_ratio: "21:9",
      num_images: 1,
      output_format: "jpeg",
      raw: false,
    },
  },
  {
    name: "zellige-strip.png",
    model: "fal-ai/flux-pro/v1.1-ultra",
    args: {
      prompt: [
        "A horizontal Moroccan zellige tile pattern strip,",
        "traditional 8-pointed star tessellation with interlocking polygons,",
        "antique gold and deep teal and ivory cream colors,",
        "geometric Islamic art, repeating tileable pattern,",
        "fine-line detail, slight aged-brass patina,",
        "flat top-down view, museum-quality reproduction,",
        "no text, no calligraphy, no human figures",
      ].join(" "),
      aspect_ratio: "21:9",
      num_images: 1,
      output_format: "jpeg",
      raw: false,
    },
  },
];

for (const job of jobs) {
  console.log(`\n→ generating ${job.name} via ${job.model}…`);
  const t0 = Date.now();
  const result = await fal.subscribe(job.model, {
    input: job.args,
    logs: false,
    onQueueUpdate: (u) => {
      if (u.status === "IN_PROGRESS") process.stdout.write(".");
    },
  });
  const url = result?.data?.images?.[0]?.url;
  if (!url) throw new Error(`no image url for ${job.name}: ${JSON.stringify(result)}`);
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const outPath = path.join(OUT_DIR, job.name);
  fs.writeFileSync(outPath, buf);
  console.log(`  ${(buf.length / 1024).toFixed(1)} KB → ${outPath} (${Date.now() - t0}ms)`);
}

console.log("\ndone.");
