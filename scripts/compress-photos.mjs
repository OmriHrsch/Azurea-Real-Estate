import sharp from "sharp";
import { mkdirSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const SRC_DIR = join(ROOT, "media", "photos");
const OUT_DIR = join(ROOT, "media", "photos-comp");

const PHOTO_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_EDGE = 2400;
const QUALITY = 82;

function fmt(bytes) {
  if (bytes > 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + " MB";
  return (bytes / 1024).toFixed(0) + " KB";
}

mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SRC_DIR)
  .filter((f) => PHOTO_EXTS.has(extname(f).toLowerCase()))
  .sort((a, b) => {
    const n = (s) => parseInt(s.match(/\d+/)?.[0] ?? "0", 10);
    return n(a) - n(b);
  });

console.log(`Compressing ${files.length} photos → ${OUT_DIR}`);
console.log(`Settings: max edge ${MAX_EDGE}px, JPEG quality ${QUALITY}, mozjpeg\n`);

let totalIn = 0;
let totalOut = 0;

for (const name of files) {
  const srcPath = join(SRC_DIR, name);
  const outPath = join(OUT_DIR, name);

  const meta = await sharp(srcPath).metadata();
  const isLandscape = meta.width >= meta.height;

  await sharp(srcPath)
    .rotate()
    .resize({
      width: isLandscape ? MAX_EDGE : null,
      height: !isLandscape ? MAX_EDGE : null,
      withoutEnlargement: true,
    })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outPath);

  const inSize = statSync(srcPath).size;
  const outSize = statSync(outPath).size;
  totalIn += inSize;
  totalOut += outSize;

  console.log(
    `  ${name.padEnd(20)} ${fmt(inSize).padStart(9)} → ${fmt(outSize).padStart(8)}  (${((1 - outSize / inSize) * 100).toFixed(1)}% smaller)`,
  );
}

console.log(
  `\nTotal: ${fmt(totalIn)} → ${fmt(totalOut)}  (${((1 - totalOut / totalIn) * 100).toFixed(1)}% smaller)`,
);
