import manifest from "./media-manifest.json";

export type PhotoKey = keyof typeof manifest.photos;

export const PHOTOS = manifest.photos as Record<string, string>;
export const VIDEO_URL: string = manifest.video;

export function photo(filename: PhotoKey): string {
  const url = PHOTOS[filename];
  if (!url)
    throw new Error(
      `Media not uploaded yet. Run: npm run upload-media\nMissing: ${filename}`,
    );
  return url;
}
