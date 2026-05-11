import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("public/portfolio");
const files = (await readdir(dir)).filter((f) => f.endsWith(".png"));

for (const f of files) {
  const file = path.join(dir, f);
  const img = sharp(file);
  const meta = await img.metadata();
  const { width, height } = meta;

  // Get raw RGB; ignore alpha
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels; // 3 or 4

  // Scan from bottom: find last row that has non-white pixels
  let lastInteresting = 0;
  for (let y = height - 1; y >= 0; y--) {
    let nonWhite = 0;
    for (let x = 0; x < width; x += 8) {
      const i = (y * width + x) * ch;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // Ignore near-white AND near-black uniform
      const nearWhite = r > 248 && g > 248 && b > 248;
      if (!nearWhite) nonWhite++;
    }
    if (nonWhite > 4) {
      lastInteresting = y;
      break;
    }
  }

  const newHeight = Math.min(height, lastInteresting + 40);
  if (newHeight < height - 5) {
    const buf = await sharp(file)
      .extract({ left: 0, top: 0, width, height: newHeight })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await sharp(buf).toFile(file);
    console.log(`✂ ${f}  ${height} → ${newHeight}`);
  } else {
    console.log(`= ${f}  ${height} (no trim)`);
  }
}
