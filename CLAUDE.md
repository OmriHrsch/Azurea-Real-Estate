# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

A luxury real-estate marketing site for Villa Azurea, a property in Mougins on the Côte d'Azur. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. Deployed on Vercel.

## Commands

```bash
npm run dev          # start local dev server
npm run build        # production build
npm run lint         # ESLint
npm run upload-media # upload media/ assets to Vercel Blob and update lib/media-manifest.json
```

`upload-media` requires `BLOB_READ_WRITE_TOKEN` in `.env.local`.

## Architecture

**Media pipeline** — All images and video are stored on Vercel Blob, not in `public/`. Local originals live in `media/photos/` (JPGs) and `media/Azurea.mp4`. Running `npm run upload-media` uploads them and writes the CDN URLs into `lib/media-manifest.json`, which is committed to git. Components consume media through `lib/media.ts`:

```ts
import { photo, VIDEO_URL } from '@/lib/media';
// photo('Azurea-10.JPG') returns the Vercel Blob URL; throws if not uploaded yet
```

Never reference `media/` files directly in components. If `photo()` throws, run `upload-media` first.

**Styling** — CSS Modules only, colocated with each component (e.g. `components/Navbar.module.css`, `components/Hero.module.css`). Tailwind is available but the existing design uses plain CSS Module classes. Two Google Font CSS variables are set on `<html>`: `--font-serif` (Noto Serif) and `--font-sans` (Manrope). Use these via `font-family: var(--font-serif)` in CSS or the Tailwind `font-serif`/`font-sans` utilities.

**Color palette** — background `#fcf9f4`, text `#1c1c19`, muted text `#7b766f`, warm hover `#625e53`. No dark mode.

**Images** — use Next.js `<Image>` with `fill` + `object-fit: cover` for full-bleed shots. The `next.config.ts` allowlist covers `*.public.blob.vercel-storage.com`.

**Nav sections** planned (anchors not yet built): `#estate`, `#poi`, `#location`, `#vault`, `#contact`.
