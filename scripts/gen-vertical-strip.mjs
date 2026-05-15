#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fal } from "@fal-ai/client";

const env = fs.existsSync(".env.local")
  ? Object.fromEntries(
      fs.readFileSync(".env.local", "utf8").split("\n").filter((l) => l && !l.startsWith("#") && l.includes("="))
        .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
    )
  : {};
fal.config({ credentials: process.env.FAL_KEY || env.FAL_KEY });

const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
  input: {
    prompt: [
      "A tall narrow Moroccan zellige tile column ornament,",
      "vertical seamless pattern of 8-pointed star tessellation,",
      "antique gold and deep teal and ivory cream colors,",
      "traditional Islamic geometric art, repeating top-to-bottom tileable column,",
      "fine-line detail, slight aged-brass patina, flat top-down view,",
      "narrow vertical strip, no text, no calligraphy, no figures",
    ].join(" "),
    aspect_ratio: "9:21",
    num_images: 1,
    output_format: "jpeg",
    raw: false,
  },
});

const url = result?.data?.images?.[0]?.url;
if (!url) throw new Error(`no image: ${JSON.stringify(result)}`);
const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
const out = path.join("public", "ornaments", "zellige-column.jpg");
fs.writeFileSync(out, buf);
console.log(`${(buf.length / 1024).toFixed(1)} KB → ${out}`);
