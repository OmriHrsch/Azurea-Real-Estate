# AGENTS.md

This file is the sole source of truth for all AI agents working in this repository. Do not look for or rely on any other instruction files.

## Next.js Warning

This project uses Next.js 16 with React 19. APIs, conventions, and file structure **may differ from your training data**. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

---

## Project

A luxury real-estate marketing site for Villa Azurea, a property in Mougins on the Côte d'Azur. Built with Next.js 16, React 19, TypeScript (strict mode), and Tailwind CSS v4. Deployed on Vercel.

---

## Commands

```bash
npm run dev          # start local dev server
npm run build        # production build
npm run lint         # ESLint
npm run upload-media # upload media/ assets to Vercel Blob and update lib/media-manifest.json
```

`upload-media` requires `BLOB_READ_WRITE_TOKEN` in `.env.local`.

---

## Architecture

### Path alias

`@/` maps to the repository root (configured in `tsconfig.json`). Always use `@/` imports — never relative `../../` paths.

### Folder structure

```
app/              # Next.js App Router — layout, page, globals.css
components/       # One file pair per section: Foo.tsx + Foo.module.css
lib/
  i18n/           # Localization: en.json, fr.json, index.tsx (LocaleProvider + useLocale)
  media.ts        # photo() helper + VIDEO_URL
  media-manifest.json  # CDN URLs committed to git — do not edit by hand
  useReveal.ts    # Intersection-based reveal animation hook
scripts/          # upload-media.mjs, generate-manifest.mjs
refactor/         # Design reference only — HTML prototype + spec. Not source code to ship.
```

### Media pipeline

**Media pipeline** — All images and video are stored on Vercel Blob, not in `public/`. Local originals live in `media/photos/` (JPGs) and `media/hero-video.mp4`. Running `npm run upload-media` uploads them and writes the CDN URLs into `lib/media-manifest.json`, which is committed to git. Components consume media through `lib/media.ts`:

```ts
import { photo, VIDEO_URL } from "@/lib/media";
// photo('Azurea-10.JPG') returns the Vercel Blob URL; throws if not uploaded yet
```

Never reference `media/` files directly in components. If `photo()` throws, run `upload-media` first.

### Styling

CSS Modules only, colocated with each component (e.g. `components/Navbar.module.css`). Tailwind is available but the existing design uses plain CSS Module classes. No Tailwind utility classes in component JSX.

Fonts are set as CSS variables on `<html>`:
- `--font-serif` → Cormorant Garamond (headings, editorial text)
- `--font-sans` → Montserrat (body, UI, labels)

Use these via `font-family: var(--font-serif)` in CSS.

### Design tokens

All colors come from CSS custom properties defined in `app/globals.css`. Never use raw hex codes in component CSS or logic.

| Token | Value | Use |
|---|---|---|
| `--navy` | `#0a1a2e` | Primary text, dark backgrounds |
| `--navy-deep` | `#050d1a` | Darkest backgrounds (Contact, Footer) |
| `--gold` | `#b89968` | Eyebrows, accents, CTAs |
| `--paper` | `#fbf9f4` | Default page background |
| `--paper-warm` | `#fafaf7` | Alternate section background |
| `--paper-cool` | `#f4f5f7` | Subtle contrast sections |
| `--muted` | `#6b7280` | Secondary text |
| `--line` | `rgba(10,26,46,0.12)` | Dividers, borders |

No dark mode.

### Images

Use Next.js `<Image>` with `fill` + `object-fit: cover` for full-bleed shots. The `next.config.ts` allowlist covers `*.public.blob.vercel-storage.com`.

### Page structure

The page is composed of 9 sections in this order:

```
Navbar / Hero / About / Narrative / FeatureStrip / Location / Gallery / Contact / Footer
```

Section anchors: `#about`, `#location`, `#gallery`, `#contact`. The full visual spec and HTML prototype live in `refactor/` — treat that directory as the design reference when building or updating any section.

### Reveal animations

Every section uses the shared reveal pattern. To animate elements as they scroll into view:

1. Add `className="reveal"` to each element that should animate.
2. Attach a `containerRef` to the section's root element.
3. Call `useReveal(containerRef)` inside the component.

`useReveal` is an `IntersectionObserver` hook in `lib/useReveal.ts`. The `.reveal` / `.reveal.visible` classes and the `@media (prefers-reduced-motion)` override are defined globally in `app/globals.css`.

### Scroll listeners

All scroll event listeners must use `{ passive: true }` and throttle updates with `requestAnimationFrame`.

### Buttons

All `<button>` elements must have `border-radius: 0` explicitly set in CSS. This is a global design constraint.

### `"use client"` boundary rules

A component must be `"use client"` if it uses any of:
- `useLocale` / `t()` — the i18n context is client-only
- Scroll or resize event listeners
- `IntersectionObserver` / `useReveal`
- Any other browser API (`window`, `document`, `localStorage`, etc.)

Static components with no interactivity can omit the directive and render as React Server Components.

### Localization (i18n)

Supported locales: `en` (default), `fr`. All user-facing strings must use the `t()` function — no hardcoded strings in JSX.

```ts
import { useLocale } from "@/lib/i18n";

// inside a "use client" component:
const { t, locale, setLocale } = useLocale();
```

Adding new strings: add the key to both `lib/i18n/en.json` and `lib/i18n/fr.json`. The TypeScript type for `TranslationKey` is derived from `en.json`, so missing keys are caught at compile time.

---

## Git

Commit message format: `type: short description` — e.g. `feat: add Gallery section`, `fix: correct scroll listener cleanup`, `chore: update media manifest`. Types: `feat`, `fix`, `chore`, `refactor`, `docs`.

---

## Coding Standards

### Naming

- **Functions use action verbs** — `loadBookings()`, `calculatePrice()`, not `bookings()` or `process()`.
- **Booleans use semantic prefixes** — `isLoading`, `hasError`, `canEdit`, `shouldRefresh`. A boolean name must read as a yes/no question.
- **Constants use UPPER_SNAKE_CASE** — `MAX_RETRIES`, `API_TIMEOUT_MS`.
- **Event handler naming** — props that expose events use `on*` (`onPress`, `onError`); internal handlers use `handle*` (`handlePress`, `handleError`).

### Values & Types

- **No magic numbers** — replace every bare literal with a named constant. `if (retries > MAX_RETRIES)` beats `if (retries > 3)`.
- **No hardcoded user-facing strings** — all text shown to users must go through the localization system (`lib/i18n/`). Hardcoded strings break localization and are scattered across the codebase.
- **Use design tokens, not raw values** — colors, spacing, typography must use the project's CSS custom properties. Raw hex codes and pixel values break theming.
- **Explicit return types on public functions** — forces you to think about the contract before writing the body, and makes the API self-documenting.
- **`interface` for object shapes, `type` for unions/aliases** — keeps type intent clear.

### Comments

- **Comments explain WHY, not WHAT** — if a comment describes what the code does, delete it. Comments earn their place only when explaining a non-obvious constraint, a workaround, or a business rule not derivable from the code.
- **TODOs must include context** — `// TODO: Remove after migration to v2 (TICKET-1234)` is useful. `// TODO: fix this` is noise.

### Code Structure

- **Single responsibility per module** — each piece of code has one clear purpose. When a module does two things, split it.
- **Dependency injection via constructors** — dependencies flow inward; classes receive what they need and do not reach out to get it.
- **No business logic in the UI layer** — components render state. They do not fetch, transform, or make decisions. Delegate to a logic layer.
- **Import from public entrypoints only** — never reach into internal implementation paths (`from '@pkg/src/internal/...'`). Depend on the public contract, not the internals.
- **Separate user-facing errors from developer logs** — users see friendly messages; developers get detailed context in logs. Never expose stack traces or raw API errors to the UI.

### Async

- **Use `Promise.all` for independent async calls** — sequential `await` for independent operations wastes time. Parallelize when there is no data dependency between calls.
- **Always use `finally` for cleanup** — loading state, locks, spinners — anything that must be reset regardless of success or failure belongs in `finally`.

### Testing

- **AAA pattern: Arrange → Act → Assert** — every test has exactly three phases, clearly separated.
- **One behavior per test** — tests that assert multiple things fail ambiguously. One assertion, one intent.
- **Descriptive test names** — the name should read as a specification: `'should show error when network request fails'`, not `'test error'`.
- **Use random/generated data for test inputs** — hardcoded test values hide assumptions. Randomized inputs surface edge cases and prevent tests from passing only for specific magic values.
- **Test edge cases explicitly** — empty states, error conditions, boundary values. The happy path is the least likely to be wrong.
- **Extract shared setup** — common test scaffolding belongs in `beforeEach` or a factory function, not copy-pasted into every test.
- **Mock at the boundary, not the internals** — mock external dependencies (APIs, DB, services), not internal business logic. Over-mocking couples tests to implementation details.

### Architecture & Process

- **Search before creating** — before writing a new abstraction, function, or module, search the codebase for an existing one. Duplication is the silent killer of maintainability.
- **Unidirectional data flow** — data flows down (state to UI), events flow up (user actions to logic). Two-way data binding between layers creates unpredictable state.
- **Each layer is independently testable** — if you can only test a component by also running a real API, the architecture is leaking. Proper layering means each unit can be exercised alone.
