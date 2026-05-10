import puppeteer from "puppeteer-core";
import sharp from "sharp";
import path from "node:path";
import { mkdir, readFile, unlink, readdir } from "node:fs/promises";

const OUT_DIR = path.resolve("public/portfolio/haribo-tmp");
const FINAL = path.resolve("public/portfolio/team-haribo.png");
await mkdir(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

const BASE = "https://team-haribo.vercel.app";
const targets = [
  { slug: "home", url: "/" },
  { slug: "apply", url: "/apply" },
];

const captured = [];

for (const t of targets) {
  await page.goto(`${BASE}${t.url}`, { waitUntil: "networkidle2", timeout: 60000 });

  // Disable native lazy loading and force-eager all images/iframes BEFORE scrolling
  await page.evaluate(() => {
    for (const img of document.querySelectorAll("img")) {
      img.loading = "eager";
      img.decoding = "sync";
      // Force currentSrc resolution by reassigning src
      if (img.dataset.src) img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    }
    for (const iframe of document.querySelectorAll("iframe")) {
      iframe.loading = "eager";
    }
    for (const v of document.querySelectorAll("video")) {
      v.preload = "auto";
    }
  });

  await page.evaluate(async () => {
    await document.fonts?.ready;
  });
  await new Promise((r) => setTimeout(r, 2500));

  // 3 passes of slow scroll to trigger lazy mounts, IntersectionObserver, scroll-animations
  for (let pass = 0; pass < 3; pass++) {
    await page.evaluate(async () => {
      const total = document.documentElement.scrollHeight;
      const step = 120;
      for (let y = 0; y <= total + 2000; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 140));
      }
      // Reverse scroll too — some sites only mount on intersection-enter
      for (let y = total; y >= 0; y -= step * 3) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 800));
    });

    // Wait for ALL images (including newly mounted) to decode
    await page.evaluate(async () => {
      const waitForImg = (img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise((r) => {
              img.addEventListener("load", r, { once: true });
              img.addEventListener("error", r, { once: true });
              setTimeout(r, 6000);
            });
      const imgs = [...document.images];
      await Promise.all(imgs.map(waitForImg));
      // Also try decode() to ensure pixel data is ready
      await Promise.all(
        imgs.map((img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()))
      );
      // Check for background-image elements that haven't loaded
      const bgElements = [...document.querySelectorAll("*")].filter((el) => {
        const bg = getComputedStyle(el).backgroundImage;
        return bg && bg.includes("url(");
      });
      // Force layout to ensure they paint
      bgElements.forEach((el) => el.getBoundingClientRect());
    });

    // Network idle wait between passes
    await new Promise((r) => setTimeout(r, 1500));
  }

  // Final settle
  await new Promise((r) => setTimeout(r, 3000));

  const file = path.join(OUT_DIR, `${t.slug}.png`);
  await page.screenshot({ path: file, fullPage: true });
  const meta = await sharp(file).metadata();
  console.log(`captured ${t.url} → ${meta.width}x${meta.height}`);
  captured.push({ ...t, file, w: meta.width, h: meta.height });
}

await browser.close();

const targetW = Math.max(...captured.map((c) => c.w));
const dividerH = 24;
const buffers = [];
let totalH = 0;
for (let i = 0; i < captured.length; i++) {
  const c = captured[i];
  let buf = await readFile(c.file);
  if (c.w !== targetW) buf = await sharp(buf).resize({ width: targetW }).png().toBuffer();
  const meta = await sharp(buf).metadata();
  buffers.push({ buf, h: meta.height });
  totalH += meta.height;
  if (i < captured.length - 1) totalH += dividerH;
}
const composite = [];
let y = 0;
for (let i = 0; i < buffers.length; i++) {
  composite.push({ input: buffers[i].buf, top: y, left: 0 });
  y += buffers[i].h;
  if (i < buffers.length - 1) y += dividerH;
}
await sharp({
  create: { width: targetW, height: totalH, channels: 3, background: { r: 245, g: 245, b: 247 } },
})
  .composite(composite)
  .png({ compressionLevel: 9 })
  .toFile(FINAL);
const meta = await sharp(FINAL).metadata();
console.log("final:", meta.width, "x", meta.height);

for (const f of await readdir(OUT_DIR)) await unlink(path.join(OUT_DIR, f));
