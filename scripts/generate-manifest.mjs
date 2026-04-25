import { execFileSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const MANIFEST_PATH = join(ROOT, 'lib', 'media-manifest.json');
const VERCEL = process.env.VERCEL_CLI_PATH ?? 'vercel';
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!TOKEN) {
  console.error('Error: BLOB_READ_WRITE_TOKEN not set in .env.local');
  process.exit(1);
}

function listPage(cursor) {
  const args = [
    'blob', 'list',
    '--rw-token', TOKEN,
    '--no-color',
    '--non-interactive',
  ];
  if (cursor) args.push('--cursor', cursor);
  return execFileSync(VERCEL, args, { encoding: 'utf8', cwd: ROOT });
}

const urlPattern = /https:\/\/\S+\.(?:public|private)\.blob\.vercel-storage\.com\/\S+/g;
const cursorPattern = /--cursor\s+(\S+)/;

const allUrls = [];
let cursor = null;

do {
  const output = listPage(cursor);
  const found = [...output.matchAll(urlPattern)].map((m) => m[0].trim());
  allUrls.push(...found);
  const cursorMatch = output.match(cursorPattern);
  cursor = cursorMatch ? cursorMatch[1] : null;
} while (cursor);

console.log(`Found ${allUrls.length} blobs total.`);

const privateUrls = allUrls.filter((u) => u.includes('.private.'));
if (privateUrls.length > 0) {
  console.error(`\n⚠️  ${privateUrls.length} files are uploaded as PRIVATE and cannot be served publicly.`);
  console.error('   Re-upload them as public by running:  npm run upload-media\n');
  process.exit(1);
}

const manifest = { photos: {}, video: '' };

for (const url of allUrls) {
  const filename = decodeURIComponent(url.split('/').pop().split('?')[0]);
  if (/\.mp4$/i.test(filename)) {
    manifest.video = url;
  } else if (/\.(jpe?g|png|webp)$/i.test(filename)) {
    manifest.photos[filename] = url;
  }
}

const photoCount = Object.keys(manifest.photos).length;
console.log(`Photos: ${photoCount}, video: ${manifest.video ? 'yes' : 'no'}`);
writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
console.log('✓ Manifest written to lib/media-manifest.json — commit this file.');
