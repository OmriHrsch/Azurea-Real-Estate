# Plan: Villa Azuréa — Full Site Refactor

## Context

The `refactor/` directory contains a high-fidelity HTML prototype (`index.html`) and a detailed spec (`README.md`) defining the final look of the site. The current codebase has 3 components (Navbar, Hero, EstateGallery) using the wrong fonts (Noto Serif / Manrope), wrong design tokens, and no sections below the hero. This plan rebuilds the full 9-section page to match the refactor spec.

---

## Steps

### 1. Install Leaflet

```bash
npm install leaflet
npm install --save-dev @types/leaflet
```

### 2. `app/layout.tsx` — swap fonts

Replace `Noto_Serif` + `Manrope` with:

- `Cormorant_Garamond`: weights `['300','400','500','600','700']`, styles `['normal','italic']`, variable `--font-serif`
- `Montserrat`: weights `['300','400','500','600']`, variable `--font-sans`

Update `<title>` to `"Villa Azuréa — Mougins, French Riviera"`.

### 3. `app/globals.css` — design tokens + base

Replace file content with reset, design tokens, body defaults, and a global `.reveal` / `.visible` animation class used across all sections.

```css
:root {
  --navy: #0a1a2e;
  --navy-deep: #050d1a;
  --gold: #b89968;
  --paper: #fbf9f4;
  --paper-warm: #fafaf7;
  --paper-cool: #f4f5f7;
  --muted: #6b7280;
  --line: rgba(10, 26, 46, 0.12);
}
body {
  font-family: var(--font-sans);
  font-weight: 300;
  color: var(--navy);
  background: var(--paper);
}
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 1s ease,
    transform 1s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    transition: opacity 0.3s;
    transform: none;
  }
}
```

### 4. `lib/useReveal.ts` — shared hook (new file)

```ts
export function useReveal(containerRef: React.RefObject<Element | null>): void;
```

`useEffect` — creates an `IntersectionObserver({ threshold: 0.12 })` that queries all `.reveal` descendants of the container, adds `visible`, then unobserves. Cleanup disconnects. Used by every section component.

### 5. `components/Navbar.tsx` + `Navbar.module.css` — rewrite

**State:** `scrolled: boolean` (passive scroll listener, >60px), `menuOpen: boolean`.

**Changes from current:**

- Logo: `AZURÉA`, Cormorant `font-size:26px`, `letter-spacing:0.32em`
- Default state: `background:transparent`, all text white
- `.scrolled`: `background:rgba(255,255,255,0.97)`, text `var(--navy)`, `box-shadow:0 1px 0 rgba(10,26,46,0.07)`, padding reduced `22px 48px` → `14px 48px`
- Links (4): "The Estate" → `#about`, "Location" → `#location`, "Gallery" → `#gallery`, "Contact" → `#contact` — Montserrat 11px uppercase, gap 38px
- CTA: border `1px solid currentColor`, transparent fill, NOT filled black
- Locale switcher: keep EN/FR toggle, restyled to match transparent/scrolled states
- Mobile breakpoint: `960px` (up from 768px)
- Mobile dropdown: full-width, `var(--paper)` bg, navy text

### 6. `components/Hero.tsx` + `Hero.module.css` — rewrite

**Remove:** all h1/subtitle text. Hero is intentionally bare.

**Add:**

- `<video autoPlay muted loop playsInline>` using `VIDEO_URL`; `<Image>` (`Azurea-6.JPG`) as poster/fallback behind the video
- Overlay gradient: `linear-gradient(180deg, rgba(10,26,46,0.35) 0%, rgba(10,26,46,0.10) 35%, rgba(10,26,46,0.55) 100%)`
- Scroll indicator: absolute bottom-center, `width:1px; height:56px`, white→transparent, `@keyframes drop` (scaleY 0.4→1→0.4, 2.4s ease-in-out infinite)
- Parallax: scroll listener (passive) → `heroBg.style.transform = scale(1.06) translateY(min(scrollY*0.35, 200)px)` — skip on `prefers-reduced-motion`
- `IntersectionObserver` on video element: pause when off-screen

### 7. `components/About.tsx` + `About.module.css` — new

`"use client"` (scroll listener for parallax).

- `id="about"`, padding `130px 48px 0`, bg `var(--paper)`
- Two-col grid `1fr 1.4fr`, gap 80px, max-width 1280px. Left: eyebrow + h2. Right: lede (Cormorant 20–26px) + rule + 2 body paragraphs (Montserrat 15px 300)
- Parallax block below: `margin-top:110px; height:70vh; min-height:480px; position:relative; overflow:hidden`. Contains `<Image fill>` (`Azurea-2.JPG`) + overlay gradient + centered white quote
- Parallax via JS `scroll` listener: translate image div by `scrollRatio * -60px`. Disabled on `prefers-reduced-motion` and mobile
- `.reveal` on both columns; uses `useReveal(containerRef)`

### 8. `components/Narrative.tsx` + `Narrative.module.css` — new

`"use client"` (for `useLocale` + `useReveal`).

- bg `var(--paper-warm)`, padding `150px 48px`
- Single `max-width:740px` centered column, `text-align:center`
- Gold eyebrow, two Cormorant paragraphs (`clamp(22px,2vw,28px)`, line-height 1.55, `text-wrap:pretty`), verbatim copy from spec

### 9. `components/FeatureStrip.tsx` + `FeatureStrip.module.css` — new

`"use client"` (for `useLocale` + `useReveal`).

- Image strip: `display:grid; grid-template-columns:1fr 1fr; height:60vh; min-height:460px`. Each cell: `<Image fill>` (`Azurea-10.JPG` left, `Azurea-12.JPG` right)
- Caption block: bg `var(--navy-deep)`, padding `130px 48px`, centered, max-width 800px inner. Gold eyebrow, white Cormorant h2 (`clamp(36px,4.6vw,62px)`), Montserrat lead at 86% opacity
- Mobile: strip goes single column, each image `height:50vh`

### 10. `components/LocationMap.tsx` + `LocationMap.module.css` — new Leaflet island

`"use client"`. Contains the map + POI list.

- `import 'leaflet/dist/leaflet.css'` at top
- POI data constant (9 items, coords verbatim from spec — **note:** 9th POI is Saint-Paul de Vence, not Saint-Tropez)
- `useEffect` map init: `L.map(mapRef.current, { scrollWheelZoom: false })`, CartoCDN Voyager tiles, initial view `[43.5856, 6.9990]` zoom 11
- Villa marker: `L.divIcon`, 44px navy circle with white "A" (Cormorant)
- POI markers: `L.divIcon`, 14px white circle, navy border → gold + scale(1.4) when active
- `:global(.leaflet-popup-content-wrapper) { border-radius: 0 }` to enforce square corners
- State: `activePoi: number` (default → 0 after 600ms)
- `activatePOI(i)`: `map.flyTo(coord, zoom, {duration:0.8})`, open popup, update marker + list styles
- POI list renders below map on mobile (border-left removed, max-height:none)

### 11. `components/Location.tsx` + `Location.module.css` — new wrapper

`"use client"` (needs `useLocale`).

- `dynamic(() => import('./LocationMap'), { ssr: false })`
- `id="location"`, padding `130px 48px 0`, bg `var(--paper)`
- Header: two-col grid `1fr 1.4fr`, eyebrow + h2 left, intro paragraph right
- Grid below: `1.6fr 1fr`, border-top `var(--line)`, map 600px tall left, POI list right

### 12. `components/Gallery.tsx` + `Gallery.module.css` — new

`"use client"`.

**CARDS constant** (11 entries): `{ file: PhotoKey; size: 'landscape'|'portrait'|'square'; label: string }[]` — order and labels verbatim from spec.

**Reel:**

- `display:flex; gap:18px; overflow-x:auto; scroll-snap-type:x mandatory; padding:0 48px 36px`; no scrollbar (`scrollbar-width: none`)
- Card sizes (exact px): `.portrait {width:360px;height:560px}`, `.landscape {width:720px;height:480px}`, `.square {width:520px;height:520px}`
- Image: `<Image fill>`, hover `transform:scale(1.04)` at `transition:transform 1.2s cubic-bezier(.2,.7,.3,1)`
- Caption: absolute bottom-left 22px, gold Cormorant number block + white uppercase label

**Controls:**

- ← / → 44px circular buttons (1px border, fills navy on hover), disabled at scroll limits
- Progress bar: `flex:1; height:1px; background:var(--line)` + inner fill div updated via inline style
- Counter: Cormorant 14px, `01 / 11` format
- `scrollBy(dir * clientWidth * 0.6)` on button click

**Lightbox:**

- Conditionally rendered `<div>` when `lightboxIndex !== null`
- `position:fixed; inset:0; background:rgba(5,13,26,0.96); display:flex; align-items:center; justify-content:center`
- `<Image>` with `width={1920} height={1080}`, `object-fit:contain; max-width:92vw; max-height:88vh`
- Close (Esc), ← / → keyboard navigation via `document.addEventListener('keydown', …)` in `useEffect`
- `border-radius:0` on all lightbox buttons

**Mobile (<960px):** portrait `70vw×90vw`, landscape `86vw×60vw`, square `78vw×78vw`

### 13. `components/Contact.tsx` + `Contact.module.css` — new

`"use client"`. Agent data as a constant in the file.

- `id="contact"`, bg `var(--navy-deep)`, color `var(--paper)`, `position:relative; overflow:hidden`
- Bg layer: `<Image fill>` (`Azurea-50.JPG`), `opacity:0.18`, `z-index:0`
- Inner: max-width 880px, padding `150px 48px 130px`, `text-align:center`, `z-index:1`
- Gold rule: `width:60px; height:1px; background:var(--paper); opacity:0.4`
- Agent grid: `1fr 1fr`, gap 32px, left-aligned. Each card: gold role label, Cormorant name, stacked action buttons
  - Primary "Appeler": bg `var(--gold)`, color `var(--navy)` — `href="tel:+33…"`
  - Secondary "WhatsApp": transparent, `border:1px solid rgba(255,255,255,0.22)` — `href="https://wa.me/…" target="_blank" rel="noopener"`
  - Phone number: `margin-left:auto`, Cormorant 14px
  - All buttons: `border-radius:0; padding:14px 18px`
- SVG icons: phone, WhatsApp, download — copied verbatim from `refactor/index.html`, use `currentColor`
- Contact-secondary row: email (Cormorant 16px) + 1px divider + brochure link
- Mobile: agents `grid-template-columns:1fr`, divider `display:none`

### 14. `components/Footer.tsx` + `Footer.module.css` — new

No `"use client"`. Static content, no i18n.

- bg `var(--navy-deep)`, `border-top:1px solid rgba(255,255,255,0.08)`, `padding:36px 48px`
- Montserrat 11px uppercase, letter-spacing 0.18em, `rgba(255,255,255,0.5)`
- "AZURÉA" in Cormorant, letter-spacing 0.3em, `rgba(255,255,255,0.7)`

### 15. `app/page.tsx` — rewrite

Replace with full 9-section composition:

```tsx
<Navbar /> <Hero /> <About /> <Narrative /> <FeatureStrip />
<Location /> <Gallery /> <Contact /> <Footer />
```

### 16. Delete `EstateGallery.tsx` + `EstateGallery.module.css`

No longer referenced after page.tsx is rewritten.

### 17. `lib/i18n/en.json` + `fr.json` — update keys

**Keys to REMOVE** (both files — component deleted or hero is now bare):
`hero.heading`, `hero.subtitle`, `nav.poi`, `nav.vault`, all `estate.section[1-6].*`

**Keys to UPDATE:**

| Key             | New EN value                                               |
| --------------- | ---------------------------------------------------------- |
| `nav.cta`       | `"Private Viewing"`                                        |
| `hero.imageAlt` | `"Villa Azuréa — a 600 m² estate above the Bay of Cannes"` |

**Keys to ADD** (keep existing `nav.estate` and `nav.location` — only add new ones):

| Key                   | EN value                                                                                                                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nav.gallery`         | `"Gallery"`                                                                                                                                                                                                                                             |
| `nav.contact`         | `"Contact"`                                                                                                                                                                                                                                             |
| `about.eyebrow`       | `"The Estate"`                                                                                                                                                                                                                                          |
| `about.title`         | `"A 600 m² oasis\nabove the Bay of Cannes."`                                                                                                                                                                                                            |
| `about.lede`          | `"Located in Mougins, in the heart of an exclusive private gated community of ten villas including the historic Château de Lérins, Villa Azuréa embodies the French Riviera art of living combined with modern luxury."`                                |
| `about.body1`         | `"A rare oasis of peace overlooking the Bay of Cannes, the estate is set on 2.1 hectares of landscaped grounds and offers an exceptional 300-degree panoramic view of the sea and surrounding mountains."`                                              |
| `about.body2`         | `"Designed as a complex of three buildings — main house, guest house and pool house — the property combines turnkey contemporary interiors with the warmth and craftsmanship of the Provençal tradition."`                                              |
| `about.quote`         | `"Sea-to-mountain panoramic views, an infinity pool that meets the horizon, and 2.1 hectares of absolute privacy."`                                                                                                                                     |
| `about.quoteLocation` | `"Mougins · 06250"`                                                                                                                                                                                                                                     |
| `about.imageAlt`      | `"Aerial view of Villa Azuréa over the Bay of Cannes"`                                                                                                                                                                                                  |
| `narrative.eyebrow`   | `"The Estate"`                                                                                                                                                                                                                                          |
| `narrative.para1`     | `"In the hills of Mougins — a village that drew Picasso, who made it his home, and welcomed Cocteau, Léger, and Man Ray before him — Villa Azuréa rests on 2.1 hectares of cypress, olive, and wild rosemary above the Bay of Cannes."`                 |
| `narrative.para2`     | `"Six hundred square metres of living space open to a seventeen-metre infinity pool that meets the horizon. The sea on one side, the Préalpes on the other."`                                                                                           |
| `feature.eyebrow`     | `"Indoor · Outdoor"`                                                                                                                                                                                                                                    |
| `feature.title`       | `"Where the horizon\nbecomes the room."`                                                                                                                                                                                                                |
| `feature.lead`        | `"Floor-to-ceiling glazing dissolves the line between living spaces and the Mediterranean panorama. From the covered terrace to the infinity edge of the pool, the estate is designed for the choreography of sun, sea and slow afternoons."`           |
| `feature.leftAlt`     | `"Covered terrace and outdoor dining at Villa Azuréa"`                                                                                                                                                                                                  |
| `feature.rightAlt`    | `"Outdoor living area at Villa Azuréa"`                                                                                                                                                                                                                 |
| `location.eyebrow`    | `"Location"`                                                                                                                                                                                                                                            |
| `location.title`      | `"In the hills\nof Mougins."`                                                                                                                                                                                                                           |
| `location.intro`      | `"Set in the historic perched village of Mougins — long beloved by Picasso and Cocteau — the villa is moments from Cannes, twenty-five minutes from Nice Côte d'Azur Airport, and within easy reach of Antibes, Monaco and the perfumeries of Grasse."` |
| `gallery.eyebrow`     | `"Gallery"`                                                                                                                                                                                                                                             |
| `gallery.title`       | `"A walk through\nthe estate."`                                                                                                                                                                                                                         |
| `gallery.meta`        | `"11 photographs · scroll →"`                                                                                                                                                                                                                           |
| `contact.eyebrow`     | `"Contact"`                                                                                                                                                                                                                                             |
| `contact.title`       | `"Private viewings,\nby appointment."`                                                                                                                                                                                                                  |
| `contact.lede`        | `"We respond within 24 hours, in French, English, Italian, and Russian."`                                                                                                                                                                               |
| `contact.callBtn`     | `"Appeler"`                                                                                                                                                                                                                                             |
| `contact.whatsappBtn` | `"WhatsApp"`                                                                                                                                                                                                                                            |
| `contact.brochure`    | `"Download brochure (PDF)"`                                                                                                                                                                                                                             |

All new keys must also be added to `fr.json` with correct French translations. Headings with `\n` render via `white-space: pre-line` on the element.

---

## Architecture Constraints

- **All components calling `t()` must be `"use client"`** — the i18n system uses React context
- **Leaflet CSS** — import `'leaflet/dist/leaflet.css'` inside `LocationMap.tsx` only; SSR is blocked by `dynamic({ssr:false})` wrapper
- **`photo()` type safety** — all 12 referenced images are already in the media manifest; TypeScript will catch any filename typo
- **`border-radius: 0` everywhere** — explicitly set on all `<button>` elements
- **Scroll listeners** — `{ passive: true }` + `requestAnimationFrame` throttle (see existing `EstateGallery.tsx` for the pattern)
- **CSS Modules only** — no Tailwind utility classes in component JSX

---

## Critical Files

| File                                           | Action  |
| ---------------------------------------------- | ------- |
| `app/layout.tsx`                               | Modify  |
| `app/globals.css`                              | Rewrite |
| `app/page.tsx`                                 | Rewrite |
| `lib/i18n/en.json` + `fr.json`                 | Modify  |
| `lib/useReveal.ts`                             | Create  |
| `components/Navbar.tsx` + `.module.css`        | Rewrite |
| `components/Hero.tsx` + `.module.css`          | Rewrite |
| `components/About.tsx` + `.module.css`         | Create  |
| `components/Narrative.tsx` + `.module.css`     | Create  |
| `components/FeatureStrip.tsx` + `.module.css`  | Create  |
| `components/LocationMap.tsx` + `.module.css`   | Create  |
| `components/Location.tsx` + `.module.css`      | Create  |
| `components/Gallery.tsx` + `.module.css`       | Create  |
| `components/Contact.tsx` + `.module.css`       | Create  |
| `components/Footer.tsx` + `.module.css`        | Create  |
| `components/EstateGallery.tsx` + `.module.css` | Delete  |

---

## Verification

After implementation, run `npm run dev` and check each section:

1. **Fonts/tokens** — body renders Montserrat, headings Cormorant; DevTools shows `--navy`, `--gold` resolved on `:root`
2. **Navbar** — transparent white at top; navy on white after 60px scroll; logo reads "AZURÉA"; correct 4 links; CTA is border-only (not filled)
3. **Hero** — 100vh, no text, video autoplays muted looped, scroll indicator animates bottom-center, hero bg translates on scroll
4. **About** — two-col grid, parallax aerial image block below, quote visible
5. **Narrative** — paper-warm bg, centered Cormorant prose, gold eyebrow
6. **FeatureStrip** — two side-by-side images, dark navy caption block below
7. **Location** — Leaflet map loads (no console errors), CartoCDN tiles, villa marker, 9 POIs; clicking a POI row highlights it and flies the map
8. **Gallery** — horizontal scroll reel, 11 cards in mixed sizes, ←/→ buttons work, progress bar updates, lightbox opens on click, Esc closes, ←/→ navigate
9. **Contact** — dark navy bg with faint photo, two agent cards, gold "Appeler" button, WhatsApp outline button, tel: links
10. **Footer** — copyright line, navy-deep bg
11. **`npm run build`** — no TypeScript errors
12. **`npm run lint`** — passes
