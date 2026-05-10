import puppeteer from "puppeteer-core";
import sharp from "sharp";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const OUT = path.resolve("public/portfolio");
await mkdir(OUT, { recursive: true });

const targets = [
  { name: "team-haribo", url: "https://team-haribo.vercel.app" },
  { name: "nest", url: "https://nest.hi-vits.com" },
  { name: "shop", url: "http://localhost:3000/demo/shop" },
  { name: "restaurant", url: "http://localhost:3000/demo/restaurant" },
  { name: "clinic", url: "http://localhost:3000/demo/clinic" },
  { name: "wedding", url: "http://localhost:3000/demo/wedding" },
];

const browser = await puppeteer.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
});

/** Trim trailing rows that are mostly blank (within tolerance). */
async function trimTrailingBlank(file) {
  const img = sharp(file);
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();
  const channels = raw.length / (width * height); // usually 3 (RGB) or 4 (RGBA)

  // Find lowest non-blank row scanning from bottom up.
  // A row is "interesting" if it has at least 0.6% of pixels with significant variation
  // OR pixels that aren't near-white/near-black uniform.
  let lastInteresting = 0;
  for (let y = height - 1; y >= 0; y--) {
    let varied = 0;
    let prevR = -1, prevG = -1, prevB = -1;
    for (let x = 0; x < width; x += 4) {
      const i = (y * width + x) * channels;
      const r = raw[i], g = raw[i + 1], b = raw[i + 2];
      // Pixel is "ink" if not near-white
      const isInk = !(r > 245 && g > 245 && b > 245);
      // Edge-ish if differs much from previous sampled
      const isEdge = prevR >= 0 && Math.abs(r - prevR) + Math.abs(g - prevG) + Math.abs(b - prevB) > 30;
      if (isInk || isEdge) varied++;
      prevR = r; prevG = g; prevB = b;
    }
    if (varied > Math.floor(width / 4) * 0.01) {
      lastInteresting = y;
      break;
    }
  }
  // Add a small bottom padding so we don't cut content tightly
  const cutHeight = Math.min(height, lastInteresting + 80);
  if (cutHeight < height - 20) {
    const cropped = await sharp(file)
      .extract({ left: 0, top: 0, width, height: cutHeight })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await writeFile(file, cropped);
    return { from: height, to: cutHeight };
  }
  return { from: height, to: height };
}

for (const { name, url } of targets) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 25000 });
  } catch {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
  }

  // Hide Next.js dev indicator
  await page.addStyleTag({
    content: `
      [data-nextjs-toast], #__next-build-watcher,
      [class*="__nextjs_dev_indicator"], #__nextjs__container_devtools,
      nextjs-portal { display: none !important; visibility: hidden !important; }
    `,
  });

  // Trigger scroll-driven animations
  await page.evaluate(async () => {
    await document.fonts?.ready;
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y < total; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 600));
  });

  await new Promise((r) => setTimeout(r, 800));

  const out = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: out, fullPage: true });
  const dim = await page.evaluate(() => ({
    w: document.documentElement.scrollWidth,
    h: document.documentElement.scrollHeight,
  }));

  // Trim trailing blank rows
  const trim = await trimTrailingBlank(out);
  console.log(`✓ ${name} → ${out}  page ${dim.w}×${dim.h}  trimmed ${trim.from}→${trim.to}`);
  await page.close();
}

await browser.close();
console.log("done");
