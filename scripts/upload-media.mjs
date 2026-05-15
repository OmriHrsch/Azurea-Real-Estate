import { spawnSync } from "child_process";
import { writeFileSync, readFileSync, readdirSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const PHOTOS_DIR = join(ROOT, "media", "photos-comp");
const BROCHURE_FILENAME = "Azurea Brochure - EN_compressed.pdf";
const DEFAULT_VIDEO_PATH = join(
  ROOT,
  "media",
  "Hero video - Maena's version .mp4",
);
const DEFAULT_BROCHURE_PATH = join(ROOT, "media", BROCHURE_FILENAME);
const MANIFEST_PATH = join(ROOT, "lib", "media-manifest.json");

const PHOTO_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VERCEL = process.env.VERCEL_CLI_PATH ?? "vercel";

const args = process.argv.slice(2);
const videoOnlyFlag = args.includes("--video-only");
const brochureOnlyFlag = args.includes("--brochure-only");
const videoPathArg = args.find((a) => !a.startsWith("--"));
const VIDEO_PATH = videoPathArg
  ? videoPathArg.startsWith("/")
    ? videoPathArg
    : join(ROOT, "media", videoPathArg)
  : DEFAULT_VIDEO_PATH;

if (videoOnlyFlag && brochureOnlyFlag) {
  throw new Error("Use either --video-only or --brochure-only, not both.");
}

const BASE_FLAGS = [
  "--access",
  "public",
  "--add-random-suffix",
  "false",
  "--allow-overwrite",
  "true",
  "--no-color",
  "--non-interactive",
];

if (process.env.BLOB_READ_WRITE_TOKEN) {
  BASE_FLAGS.push("--rw-token", process.env.BLOB_READ_WRITE_TOKEN);
}

function blobPut(localPath, pathname) {
  const result = spawnSync(
    VERCEL,
    ["blob", "put", localPath, "--pathname", pathname, ...BASE_FLAGS],
    { encoding: "utf8", cwd: ROOT },
  );
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  if (result.status !== 0) {
    throw new Error(`vercel blob put failed (${result.status}):\n${output}`);
  }

  const urls = output.match(
    /https:\/\/\S+\.public\.blob\.vercel-storage\.com\/\S+/g,
  );
  if (!urls?.length) {
    throw new Error(`Could not parse URL from output:\n${output}`);
  }
  return urls[urls.length - 1].trim();
}

const existing = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
const shouldUploadPhotos = !videoOnlyFlag && !brochureOnlyFlag;
const shouldUploadVideo = !brochureOnlyFlag;
const shouldUploadBrochure = !videoOnlyFlag;
const manifest = {
  photos: shouldUploadPhotos ? {} : existing.photos,
  video: shouldUploadVideo ? "" : existing.video,
  brochure: shouldUploadBrochure ? "" : existing.brochure,
};

if (shouldUploadPhotos) {
  const photoFiles = readdirSync(PHOTOS_DIR)
    .filter((f) => PHOTO_EXTS.has(extname(f).toLowerCase()))
    .sort((a, b) => {
      const n = (s) => parseInt(s.match(/\d+/)?.[0] ?? "0", 10);
      return n(a) - n(b);
    });

  console.log(`Uploading ${photoFiles.length} photos…`);
  for (const file of photoFiles) {
    process.stdout.write(`  ${file} … `);
    manifest.photos[file] = blobPut(
      join(PHOTOS_DIR, file),
      `azurea/photos/${file}`,
    );
    console.log("done");
  }
} else {
  console.log(`Skipping photos — using existing URLs from manifest.`);
}

if (shouldUploadVideo) {
  console.log(`\nUploading video: ${VIDEO_PATH}`);
  manifest.video = blobPut(VIDEO_PATH, "azurea/Azurea.mp4");
  console.log("  done");
} else {
  console.log(`Skipping video — using existing URL from manifest.`);
}

if (shouldUploadBrochure) {
  console.log(`\nUploading brochure: ${DEFAULT_BROCHURE_PATH}`);
  manifest.brochure = blobPut(
    DEFAULT_BROCHURE_PATH,
    `azurea/${BROCHURE_FILENAME}`,
  );
  console.log("  done");
} else {
  console.log(`Skipping brochure — using existing URL from manifest.`);
}

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n✓ Manifest written to lib/media-manifest.json`);
console.log("  Commit this file — it is safe to store in git.");
