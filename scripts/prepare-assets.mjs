// Crops the supplied MORA reference images into web assets.
// Run with: node scripts/prepare-assets.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "assets-src";
const OUT = "public/images/mora";
await mkdir(OUT, { recursive: true });

const crop = (file, name, region, width) =>
  sharp(`${SRC}/${file}`)
    .extract(region)
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(`${OUT}/${name}.jpg`);

// Logo: keep the supplied wordmark, convert luminance to alpha so it sits on any dark surface.
async function logo(region, name, width) {
  const { data, info } = await sharp(`${SRC}/mora-logo-glow.png`)
    .extract(region)
    .resize({ width })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const l = data[i * info.channels];
    // cut the soft glow halo, keep crisp letterforms
    const a = Math.max(0, Math.min(255, Math.round(((l - 95) / (230 - 95)) * 255)));
    rgba[i * 4] = 0xf4;
    rgba[i * 4 + 1] = 0xeb;
    rgba[i * 4 + 2] = 0xdd;
    rgba[i * 4 + 3] = a;
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${name}.png`);
}

await Promise.all([
  logo({ left: 250, top: 350, width: 1020, height: 252 }, "mora-wordmark", 1000),
  logo({ left: 250, top: 350, width: 1020, height: 345 }, "mora-logo-tagline", 1000),

  // Hero product photograph (bar, beans, broken pieces)
  crop("mora-hero-bar.png", "hero-bar", { left: 0, top: 400, width: 1254, height: 854 }, 1254),
  crop("mora-hero-bar.png", "hero-bar-tall", { left: 250, top: 400, width: 760, height: 854 }, 760),
  // Broken squares (sensory)
  crop("mora-hero-bar.png", "broken-squares", { left: 840, top: 400, width: 414, height: 640 }, 414),
  // Cocoa beans bowl (philosophy)
  crop("mora-hero-bar.png", "cocoa-beans", { left: 0, top: 400, width: 360, height: 480 }, 360),
  crop("mora-hero-bar.png", "cocoa-powder", { left: 0, top: 960, width: 420, height: 294 }, 420),

  // Range lineup (gifting) and per-flavour bars
  // Bars only: the reference flavour cards carry offers (₹50 off, golden card) that are not confirmed
  crop("mora-range.jpg", "range-lineup", { left: 0, top: 40, width: 1536, height: 570 }, 1536),
  crop("mora-range.jpg", "bar-bold", { left: 95, top: 170, width: 300, height: 450 }, 300),
  crop("mora-range.jpg", "bar-crush", { left: 435, top: 190, width: 300, height: 450 }, 300),
  crop("mora-range.jpg", "bar-chill", { left: 790, top: 190, width: 300, height: 450 }, 300),
  crop("mora-range.jpg", "bar-midnight", { left: 1140, top: 190, width: 300, height: 450 }, 300),
  crop("mora-range.jpg", "card-bold", { left: 125, top: 600, width: 250, height: 310 }, 250),
  crop("mora-range.jpg", "card-midnight", { left: 1220, top: 610, width: 250, height: 300 }, 250),
]);

console.log("assets ready");

// Favicon: the cacao "O" from the supplied wordmark, on obsidian
const wordmark = sharp(`${OUT}/mora-wordmark.png`);
const meta = await wordmark.metadata();
const o = await sharp(`${OUT}/mora-wordmark.png`)
  .extract({ left: Math.round(meta.width * 0.29), top: 0, width: Math.round(meta.width * 0.26), height: meta.height })
  .resize({ width: 46, height: 46, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();
await sharp({ create: { width: 64, height: 64, channels: 4, background: "#090807" } })
  .composite([{ input: o, gravity: "center" }])
  .png()
  .toFile("app/icon.png");
console.log("icon ready");
