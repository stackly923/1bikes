const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const TARGET_BYTES = 98 * 1024;
const BACKUP_DIR = path.join(ROOT, "assets", "image-originals");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (fullPath !== BACKUP_DIR) walk(fullPath, out);
    } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      out.push(fullPath);
    }
  }
  return out;
}

async function encodeWebp(input, width, quality) {
  let pipeline = sharp(input).rotate();
  if (width) {
    pipeline = pipeline.resize({ width, withoutEnlargement: true });
  }
  return pipeline.webp({
    quality,
    effort: 6,
    smartSubsample: true,
    nearLossless: quality >= 88,
  }).toBuffer();
}

async function bestUnderTarget(file) {
  const meta = await sharp(file).metadata();
  const sourceWidth = meta.width || 1200;
  const widths = [
    sourceWidth,
    1600,
    1400,
    1200,
    1000,
    900,
    800,
    720,
    640,
    560,
    480,
    420,
    360,
  ].filter((width, index, all) => width <= sourceWidth && all.indexOf(width) === index);

  let best = null;
  for (const width of widths) {
    for (const quality of [95, 92, 90, 88, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 65, 62, 60]) {
      const buffer = await encodeWebp(file, width, quality);
      if (!best || buffer.length > best.buffer.length) {
        best = { buffer, width, quality };
      }
      if (buffer.length <= TARGET_BYTES) {
        return { buffer, width, quality };
      }
    }
  }

  return best;
}

(async () => {
  const files = walk(path.join(ROOT, "assets"));
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const backup = path.join(BACKUP_DIR, rel);
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    if (!fs.existsSync(backup)) fs.copyFileSync(file, backup);

    const originalSize = fs.statSync(backup).size;
    const currentSize = fs.existsSync(file) ? fs.statSync(file).size : originalSize;
    if (currentSize <= TARGET_BYTES) {
      console.log(`OK\t${originalSize}\t${currentSize}\tunchanged\t${rel}`);
      continue;
    }

    const result = await bestUnderTarget(backup);
    const tempFile = `${file}.tmp`;
    fs.writeFileSync(tempFile, result.buffer);
    fs.unlinkSync(file);
    fs.renameSync(tempFile, file);
    const status = result.buffer.length <= TARGET_BYTES ? "OK" : "OVER";
    console.log(`${status}\t${originalSize}\t${result.buffer.length}\twebp q${result.quality} w${result.width}\t${rel}`);
  }
})();
