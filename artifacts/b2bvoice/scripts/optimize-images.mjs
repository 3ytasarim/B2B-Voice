// One-off/regenerable: writes responsive AVIF + WebP variants next to the
// original PNGs in public/. The originals stay (admin, fallbacks); the site
// references the variants through <ResponsiveImage> (src/components/ui).
//
//   node scripts/optimize-images.mjs
//
// Output naming: <name>-<width>.avif / <name>-<width>.webp
import sharp from "sharp";
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public");

// dir -> target widths (about 1x and 2x of the largest displayed size)
const JOBS = [
  { dir: "integrations", widths: [64, 128] }, // shown at 32px
  { dir: "ask-ai", widths: [64, 128], match: /-512\.png$/ }, // shown at 28px
  { dir: "partners", widths: [160, 320] }, // shown at up to 80px tall
  { dir: "clients", widths: [140, 280] }, // shown at max 140px wide
];

// Original size + generated widths per source, so <ResponsiveImage> can emit
// srcset and width/height (no layout shift) without measuring at runtime.
const manifest = {};
let bytesBefore = 0;
let bytesAfter = 0;

for (const { dir, widths, match } of JOBS) {
  const full = path.join(publicDir, dir);
  for (const file of await readdir(full)) {
    if (!/\.png$/i.test(file) || (match && !match.test(file))) continue;
    const src = path.join(full, file);
    bytesBefore += (await stat(src)).size;
    const base = file.replace(/\.png$/i, "");
    const meta = await sharp(src).metadata();
    manifest[`/${dir}/${file}`] = { w: meta.width, h: meta.height, variants: widths };
    for (const w of widths) {
      const width = Math.min(w, meta.width ?? w);
      const img = () => sharp(src).resize({ width, withoutEnlargement: true });
      const webp = path.join(full, `${base}-${w}.webp`);
      const avif = path.join(full, `${base}-${w}.avif`);
      await img().webp({ quality: 82, alphaQuality: 90 }).toFile(webp);
      await img().avif({ quality: 55, effort: 6 }).toFile(avif);
      if (w === widths[0]) bytesAfter += (await stat(webp)).size;
    }
  }
}
await writeFile(
  path.resolve(publicDir, "../src/lib/imageManifest.json"),
  `${JSON.stringify(manifest, null, 1)}\n`,
);
console.log(`originals: ${Math.round(bytesBefore / 1024)} KB -> smallest webp variants: ${Math.round(bytesAfter / 1024)} KB`);
