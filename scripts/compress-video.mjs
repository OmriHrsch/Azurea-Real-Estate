import { spawnSync } from "child_process";
import { statSync, mkdirSync } from "fs";
import { join, basename, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const MEDIA_DIR = join(ROOT, "media");
const OUT_DIR = join(MEDIA_DIR, "video-comp");

// H.264 CRF: 18=near-lossless, 23=default, 28=smaller/acceptable for web hero
const CRF = 24;
// Scale to max 1920px wide, preserving aspect ratio
const MAX_WIDTH = 1920;
// Two-pass is better for streaming; single-pass is fine for hero loops
const PRESET = "slow";

function fmt(bytes) {
  if (bytes > 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + " MB";
  return (bytes / 1024).toFixed(0) + " KB";
}

const VIDEO_EXTS = new Set([".mp4", ".mov", ".m4v"]);

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/compress-video.mjs <file> [<file> ...]");
  console.error("  Files are resolved relative to media/");
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

for (const arg of args) {
  const srcPath = arg.startsWith("/") ? arg : join(MEDIA_DIR, arg);
  const name = basename(srcPath);
  const ext = extname(name).toLowerCase();

  if (!VIDEO_EXTS.has(ext)) {
    console.warn(`Skipping ${name} — unsupported extension`);
    continue;
  }

  const stem = name.slice(0, -ext.length);
  const outName = `${stem}-comp.mp4`;
  const outPath = join(OUT_DIR, outName);

  console.log(`\nCompressing: ${name}`);

  const ffmpegArgs = [
    "-y",
    "-i", srcPath,
    "-vf", `scale=trunc(min(${MAX_WIDTH}\\,iw)/2)*2:-2`,
    "-c:v", "libx264",
    "-crf", String(CRF),
    "-preset", PRESET,
    "-profile:v", "high",
    "-level", "4.1",
    "-movflags", "+faststart",
    "-c:a", "aac",
    "-b:a", "128k",
    outPath,
  ];

  const result = spawnSync("ffmpeg", ffmpegArgs, { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`ffmpeg exited with code ${result.status}`);
    process.exit(result.status ?? 1);
  }

  const inSize = statSync(srcPath).size;
  const outSize = statSync(outPath).size;
  const saving = ((1 - outSize / inSize) * 100).toFixed(1);

  console.log(`\nResult:`);
  console.log(`  Original:   ${fmt(inSize)}`);
  console.log(`  Compressed: ${fmt(outSize)}  (${saving}% smaller)`);
  console.log(`  Output:     ${outPath}`);
}
