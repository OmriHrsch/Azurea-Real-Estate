# Handoff: Villa Azuréa — Single-Page Listing Site

## Overview

A single-page marketing site for **Villa Azuréa**, a luxury private estate in
Mougins (Cannes / Côte d'Azur). The audience is high-net-worth buyers,
brokers, and real-estate professionals — the site exists to communicate
character and arrange private viewings, not to capture leads at scale.

Five sections, top to bottom:

1. **Hero** — full-bleed looping video, no copy.
2. **About** — Cormorant lede + parallax aerial quote.
3. **The Estate (narrative)** — two short Cormorant paragraphs blending
   Mougins' artistic history with the property's headline numbers.
4. **Indoor / Outdoor feature strip** — two-image strip + dark caption block.
5. **Location** — interactive Leaflet map with 9 hand-curated POIs.
6. **Gallery** — horizontal-scroll cinematic reel (mixed portrait /
   landscape / square cards) with ←/→ controls, progress bar, counter,
   and a click-to-zoom lightbox.
7. **Contact** — no form. Two agent cards, each with a "Call" (`tel:`) and
   "WhatsApp" (`wa.me/…`) button, plus an email link and a "Download
   brochure (PDF)" link.

## About the Design Files

The files in this bundle (`index.html`, `photos/`, etc.) are **design
references created in HTML** — high-fidelity prototypes that show intended
look, layout, and behavior. They are **not production code to copy
directly**.

The task is to **recreate these designs in the target codebase's preferred
environment** (Next.js + Tailwind, Astro, Nuxt, SvelteKit, etc.) using its
established patterns, component libraries, and deployment pipeline. If no
environment exists yet, choose the most appropriate stack — for a static
marketing site like this, **Astro** or **Next.js (App Router, static
export)** are both excellent fits, and either will deploy cleanly to
Vercel, Netlify, or Cloudflare Pages.

The HTML uses inline `<style>` and a single inline `<script>` for clarity
during design — these should be split into proper components, modules, and
a styling system in the real implementation.

## Fidelity

**High-fidelity.** Final colors, typography, spacing, and interaction
behavior are decided. The developer should reproduce the layout
pixel-faithfully and lift exact values (hex codes, type sizes, spacing,
easings) from the reference. Adapt only where the target stack imposes
better idioms (e.g. `<Image>` instead of raw `<img>` for next/image).

## Tech / Stack Recommendation

This is a small, content-driven, mostly-static site with one map widget
and one horizontal carousel. Suggested stack:

- **Framework:** Astro 4 (preferred — zero-JS by default, perfect for this
  use case) or Next.js 15 with App Router + static export.
- **Styling:** Tailwind CSS for layout and spacing utilities, with a small
  set of CSS custom properties for the color tokens and font stacks
  (matching the tokens in this README).
- **Fonts:** `next/font` or Astro's font solution, loading **Cormorant
  Garamond** (400, 500) and **Montserrat** (300, 400, 500) from Google
  Fonts.
- **Map:** Leaflet 1.9.x with the standard OpenStreetMap tile layer (or
  swap to a styled tile provider — Stadia, Mapbox — if budget allows).
  Markers use custom DivIcons (HTML+CSS, not images).
- **Image handling:** Use the framework's optimized image component;
  serve AVIF + WebP with JPEG fallback. The 11 hero/gallery photos are
  the heaviest payload — compress aggressively (≤200 KB each at 2× of
  their displayed size).
- **Video:** The hero video is a 12-second loop. Encode at three sizes
  (1920w, 1280w, 720w) in H.264 MP4 + WebM. Autoplay, muted, loop,
  playsinline. First frame should match the still image used as the
  poster/`background-image` fallback.
- **Hosting:** Vercel, Netlify, or Cloudflare Pages.
- **i18n (future):** The copy is currently English-leaning with French
  agent-role labels. The intended end state is **French primary, English
  secondary**. Use the framework's i18n system (Astro `i18n`,
  `next-intl`, etc.) so the second locale is a flip-of-a-switch.

## Screens / Views

This is a single page; "screens" below means scrollable sections.

### 1. Top Navigation

- **Layout:** sticky bar, full width, flex between (logo left, links
  center-ish via `justify-content`, language indicator + CTA right).
- **Default state:** transparent over the hero video, white text. After
  60px scroll, gains class `scrolled`: solid white background, navy text,
  thin 1px bottom border, slightly reduced padding.
- **Logo:** "AZURÉA" in Cormorant Garamond, 20px, letter-spacing 0.3em.
- **Links:** "Estate · Location · Gallery · Contact" — 11px, uppercase,
  letter-spacing 0.18em, gap 26px, white-space: nowrap.
- **Language indicator:** "EN" (current) — 11px, letter-spacing 0.18em,
  opacity 0.7. (When i18n ships, this becomes a EN/FR toggle.)
- **CTA:** "Private Viewing" — 11px uppercase, 1px border in current
  color, padding 10px 18px.
- **Mobile (<960px):** burger icon reveals a full-width dropdown panel.

### 2. Hero (intentionally bare)

- **Layout:** 100vh, full bleed.
- **Background:** 12-second looped video (H.264/WebM), centered, `object-fit: cover`. Falls back to a still image (`photos/Azurea-6.JPG`) as the `background-image` of `.hero-bg`.
- **Overlay:** vertical gradient — `linear-gradient(180deg, rgba(10,26,46,0.35) 0%, rgba(10,26,46,0.10) 35%, rgba(10,26,46,0.55) 100%)`. This protects the navy nav text and the scroll indicator.
- **No copy.** The video carries the visual weight on its own.
- **Scroll indicator:** absolutely-positioned vertical 1px line, 56px
  tall, white→transparent gradient, anchored bottom-center. Animates
  with `drop` keyframe (scaleY 0.4 → 1 → 0.4 over 2.4s, ease-in-out
  infinite).
- **Parallax:** on scroll, the bg shifts down by `min(scrollY * 0.35, 200)px`. Should respect `prefers-reduced-motion`.

### 3. About

- **Section padding:** 130px top, 0 bottom (the parallax block hugs it).
- **Layout:** two-column grid `1fr 1.4fr`, gap 80px, max-width 1280px.
- **Left column:** lede paragraph in Cormorant, 20–26px, line-height
  1.5, navy.
- **Right column:** body copy in Montserrat, 15px, line-height 1.85,
  near-black (#2a2f39).
- **Below the columns:** 70vh min-480px parallax block with
  `background-attachment: fixed` (use a JS fallback on Safari iOS where
  `fixed` breaks). Image: `photos/Azurea-2.JPG` (aerial). Centered
  white quote with a 60px Cormorant `❝` mark.

### 4. The Estate (narrative)

- **Section padding:** 150px top/bottom on `--paper-warm` background.
- **Layout:** single 740px-max centered column, `text-align: center`.
- **Eyebrow:** "The Estate" — 11px uppercase, gold (#b89968),
  letter-spacing 0.4em, margin-bottom 36px.
- **Two paragraphs**, Cormorant 22–28px, line-height 1.55, navy,
  margin-bottom 28px between them, `text-wrap: pretty`. Final
  paragraph has no bottom margin.
- **Exact copy** (this is the version we landed on — keep it verbatim
  unless the client revises):

  > In the hills of Mougins — a village that drew Picasso, who made it
  > his home, and welcomed Cocteau, Léger, and Man Ray before him —
  > Villa Azuréa rests on 2.1 hectares of cypress, olive, and wild
  > rosemary above the Bay of Cannes.
  >
  > Six hundred square metres of living space open to a seventeen-metre
  > infinity pool that meets the horizon. The sea on one side, the
  > Préalpes on the other.

### 5. Indoor / Outdoor Feature Strip

- **Strip:** two-column grid, full-width, height 60vh min 460px. Left =
  `photos/Azurea-10.JPG`, right = `photos/Azurea-12.JPG`. Both `cover`,
  `center`.
- **Caption block below:** dark navy (`--navy-deep`), padding
  130px/48px, white text. Small gold eyebrow, large Cormorant title
  ("Where the horizon / becomes the room."), lead paragraph in 15px
  Montserrat at 78% white opacity.

### 6. Location

- **Section padding:** 130px top/bottom on white.
- **Header:** two-column grid, eyebrow + title left, intro paragraph
  right.
- **Map area:** two-column grid `1.4fr 1fr`. Map left at 600px tall,
  scrollable POI list right with the same height cap.
- **Map config:**
  - Center: `[43.5856, 6.9990]` (Mougins).
  - Zoom: start at 12 (regional view), animate to 14 when a POI is
    selected.
  - Tile provider: OSM standard, or replace with a custom Stadia/Mapbox
    style for a more editorial look.
  - Villa marker: a 44px navy circle with white "A" in Cormorant,
    box-shadow (`0 4px 18px rgba(10,26,46,0.4)`), 3px white border.
  - POI markers: 14px white circles with 2px navy border, scaling to
    1.4× and turning gold when active.
  - Popups: square corners, navy text on white, Cormorant headline.
- **POI list (9 items):** clickable rows with name, distance/time, and
  a one-line description. Active row turns navy with white text. Hover:
  subtle warm-paper bg + 8px left padding shift.

#### POI data (verbatim from the prototype)

```js
const VILLA = [43.5856, 6.9990];
const POIs = [
  { name: "Villa Azuréa",            coord: VILLA,             dist: "—",              desc: "The estate, set within an exclusive private gated community.", villa: true },
  { name: "Mougins Village",         coord: [43.6004, 7.0050], dist: "1 km · 3 min",   desc: "The historic perched village of Mougins, beloved by artists and gourmets." },
  { name: "Cannes & La Croisette",   coord: [43.5513, 7.0128], dist: "8 km · 15 min",  desc: "The Bay of Cannes, the Croisette and the Palais des Festivals." },
  { name: "Antibes / Cap d'Antibes", coord: [43.5808, 7.1239], dist: "15 km · 22 min", desc: "Old town, Picasso Museum and the legendary Cap d'Antibes." },
  { name: "Grasse",                  coord: [43.6584, 6.9225], dist: "15 km · 22 min", desc: "World capital of perfume, set in the foothills of the Alps." },
  { name: "Sophia Antipolis",        coord: [43.6217, 7.0498], dist: "6 km · 12 min",  desc: "Europe's largest technology park and business district." },
  { name: "Nice Côte d'Azur Airport",coord: [43.6584, 7.2158], dist: "25 km · 25 min", desc: "International airport with daily flights worldwide." },
  { name: "Monaco",                  coord: [43.7384, 7.4246], dist: "55 km · 50 min", desc: "The Principality, Monte-Carlo Casino and superyacht marina." },
  { name: "Saint-Paul de Vence",     coord: [43.6973, 7.1224], dist: "22 km · 30 min", desc: "Hilltop artists' village, Fondation Maeght." },
];
```

### 7. Gallery (horizontal cinematic reel)

- **Section:** white background, padding 130px top/bottom, `overflow: hidden`.
- **Header:** flex row, eyebrow + title left, "11 photographs · scroll →" meta right (uppercase 11px, letter-spacing 0.3em, muted color).
- **Reel container:**
  - `display: flex`, gap 18px, `overflow-x: auto`,
    `scroll-snap-type: x mandatory`, padding 0 48px 36px, scrollbar
    hidden (`scrollbar-width: none`, WebKit `::-webkit-scrollbar { display: none; }`).
  - Each `figure` is `flex: 0 0 auto`, `scroll-snap-align: center`,
    `overflow: hidden`, `cursor: pointer`.
- **Card sizes (fixed pixels — important: do NOT use vw/min-width here, those collapsed to identical sizes at narrower viewports):**
  - `.size-portrait`  — 360 × 560
  - `.size-landscape` — 720 × 480
  - `.size-square`    — 520 × 520
- **Card image:** `object-fit: cover`, transform `scale(1.04)` on
  hover with 1.2s `cubic-bezier(.2,.7,.3,1)`.
- **Card caption:** absolutely-positioned bottom-left (22px from each
  edge). `<span class="num">` shows the figure number in gold
  Cormorant; the label is 11px white uppercase with text-shadow.
- **Controls row** (below the reel, max-width 1280, padding 0 48px):
  ←/→ circular buttons (44×44, 1px border, navy-on-transparent → fills
  navy on hover), a flex-1 progress bar (1px line, 3px navy fill that
  grows with `--reel-progress`), and a "01 / 11" Cormorant counter.
- **Behavior:**
  - Prev/next buttons scroll by 60% of `clientWidth`.
  - On scroll, find the figure whose center is closest to the
    viewport center, set the counter to its index.
  - Update progress bar to `scrollLeft / (scrollWidth - clientWidth)`.
  - Disable prev when at start, next when at end.
- **Mobile (<960px):**
  - portrait → 70vw × 90vw
  - landscape → 86vw × 60vw
  - square → 78vw × 78vw
- **Lightbox:** click any figure → fullscreen overlay
  (`rgba(5,13,26,0.96)`), close on Esc, ←/→ to step. The image is
  `object-fit: contain` at 92vw × 88vh max.

#### Gallery contents (in order)

1. `Azurea-6.JPG` — landscape — "01 — The infinity pool"
2. `Azurea-10.JPG` — portrait — "02 — Covered terrace, dining"
3. `Azurea-12.JPG` — square — "03 — Outdoor living"
4. `Azurea-22.JPG` — landscape — "04 — Main living room"
5. `Azurea-47.JPG` — portrait — "05 — Living, toward the terrace"
6. `Azurea-25.JPG` — square — "06 — Master bedroom"
7. `Azurea-30.JPG` — portrait — "07 — Master bathroom"
8. `Azurea-20.JPG` — landscape — "08 — Kitchen, at twilight"
9. `Azurea-40.JPG` — square — "09 — Multimedia room"
10. `Azurea-50.JPG` — landscape — "10 — The villa, after dark"
11. `Azurea-1.JPG` — landscape — "11 — Aerial, the estate"

### 8. Contact

- **Background:** dark `--navy` with a faint aerial image
  (`photos/Azurea-50.JPG`) at 18% opacity, blended underneath.
- **Layout:** single 880px-max centered column, padding 150px top /
  130px bottom, `text-align: center`.
- **Eyebrow:** gold "Contact". **Title:** "Private viewings, / by
  appointment." in Cormorant, white. Below the title, a 60px gold
  rule (40% opacity), then a centered italic Cormorant lede:

  > We respond within 24 hours, in French, English, Italian, and
  > Russian.

- **Agent cards** (two, side-by-side, gap 32px, 1fr 1fr, text-aligned
  left within their card):
  - Top border (1px white at 18% opacity), padding-top 28px.
  - Role line in gold uppercase ("Représentante des ventes" — French
    role label even in EN locale).
  - Name in 28px Cormorant white, letter-spacing 0.01em, margin-bottom
    24px.
  - Two stacked action buttons (gap 10px):
    - **Primary "Appeler":** gold bg, navy text, phone icon left, label
      center, formatted phone number right (in 14px Cormorant). Uses
      `href="tel:+33…"`.
    - **Secondary "WhatsApp":** transparent with white 22%-opacity
      border, white text, WhatsApp glyph icon. Uses
      `href="https://wa.me/336…"` with `target="_blank" rel="noopener"`.
  - Both buttons: 11px uppercase, letter-spacing 0.2em, padding
    14px 18px, hover lifts contrast (primary → white bg, secondary →
    subtle white-tinted bg).

- **Secondary line** (centered flex, gap 22px, margin-top 64px):
  - **Email:** `private.viewings@azurea.fr` in 16px Cormorant (the
    real address replaces this placeholder during launch).
  - **Vertical 1px divider** (16px tall, 22%-opacity white).
  - **Brochure link:** download icon + "Download brochure (PDF)" in
    12px uppercase letter-spacing 0.18em, with a thin underline.

- **Mobile:** agent cards stack to 1fr, the secondary line goes
  vertical, the divider hides.

#### Agent data

```ts
[
  {
    role: "Représentante des ventes",
    name: "Bérangère Calabria",
    phoneDisplay: "+33 6 58 71 44 80",
    phoneTel: "+33658714480",
    whatsapp: "https://wa.me/33658714480",
  },
  {
    role: "Représentante des ventes",
    name: "Caroline Raoux",
    phoneDisplay: "+33 6 83 38 50 56",
    phoneTel: "+33683385056",
    whatsapp: "https://wa.me/33683385056",
  },
]
```

### 9. Footer

Single line, navy-deep bg, 11px uppercase letter-spacing 0.18em,
white at 50% opacity:

> AZURÉA  ·  Mougins, France  ·  © 2026 — All rights reserved

## Interactions & Behavior

- **Reveal-on-scroll:** elements with `.reveal` start at
  `opacity: 0; transform: translateY(30px)` and animate to
  `opacity: 1; translateY(0)` over 1s when they cross 12% into the
  viewport (use `IntersectionObserver`). Once revealed, they stay
  revealed.
- **Hero video:** `autoplay muted loop playsinline`. Should pause when
  off-screen (use `IntersectionObserver`) to save battery.
- **Hero parallax:** on `scroll` (passive), set
  `transform: scale(1.06) translateY(${min(scrollY*0.35, 200)}px)` on
  the bg layer. Skip when `prefers-reduced-motion`.
- **Nav scroll state:** add `.scrolled` class when `scrollY > 60`.
- **Map / POI:** clicking a POI list row pans/zooms the map and opens
  the popup; clicking a marker highlights the matching list row.
- **Reel:** see Gallery section above.
- **Lightbox:** Esc closes, ←/→ navigate.

## State Management

Light. Mostly local component state:

- Nav: `scrolled` boolean.
- Map: `activePoiIndex: number`.
- Reel: `currentIndex: number`, `progress: number (0–1)`,
  `canScrollPrev`, `canScrollNext`.
- Lightbox: `openIndex: number | null`.

No global store needed.

## Design Tokens

```css
:root {
  /* Color */
  --paper:        #fbf9f4;  /* page bg, hero text */
  --paper-warm:   #f5f1e8;  /* alt bg (narrative section, etc.) */
  --paper-cool:   #eef0f2;  /* map fallback bg */
  --navy:         #0a1a2e;  /* primary text & accents */
  --navy-deep:    #06111f;  /* dark backgrounds */
  --gold:         #b89968;  /* eyebrows, accents, primary CTA bg */
  --muted:        #6b7280;  /* secondary text */
  --line:         rgba(10,26,46,0.12);

  /* Type */
  --serif: "Cormorant Garamond", Georgia, serif;
  --sans:  "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

### Type scale

| Use                      | Family                | Size           | Weight | Letter-spacing | Line-height |
| ------------------------ | --------------------- | -------------- | ------ | -------------- | ----------- |
| Section title            | Cormorant Garamond    | clamp(36, 4.6vw, 62) | 400    | 0.01em         | 1.05        |
| Hero (n/a — bare)        | —                     | —              | —      | —              | —           |
| Narrative paragraph      | Cormorant Garamond    | clamp(22, 2vw, 28)   | 400    | normal         | 1.55        |
| Body                     | Montserrat            | 15             | 300/400| normal         | 1.85        |
| Eyebrow                  | Montserrat            | 11             | 500    | 0.4em          | 1           |
| UI / nav links / buttons | Montserrat            | 11             | 500    | 0.18–0.2em     | 1           |
| Agent name               | Cormorant Garamond    | 28             | 400    | 0.01em         | 1.1         |
| Phone (in CTA)           | Cormorant Garamond    | 14             | 400    | 0.04em         | 1           |

### Spacing

Section padding: **130px** top/bottom on desktop, **80px** mobile.
The narrative section uses **150px** for extra room around the
centered prose. The contact section uses 150/130 for the same reason.
Global horizontal padding: **48px** desktop, **22px** mobile.

### Other tokens

- Border radius: **0** everywhere. This is a deliberately rectilinear,
  editorial design. Even the agent buttons and lightbox are square.
- Shadows: minimal. Only the villa map marker
  (`0 4px 18px rgba(10,26,46,0.4)`) and Leaflet popups
  (`0 8px 30px rgba(10,26,46,0.18)`).
- Easings: `ease` for most transitions; `cubic-bezier(.2,.7,.3,1)` for
  the gallery image hover scale.

## Assets

All photographs are in `photos/Azurea-NN.JPG` (numbered by the
client's original delivery). The 12 files referenced in the design:

| File              | Used in                              |
| ----------------- | ------------------------------------ |
| `Azurea-1.JPG`    | Gallery #11 (aerial)                 |
| `Azurea-2.JPG`    | About / parallax background          |
| `Azurea-6.JPG`    | Hero (still fallback) + Gallery #1   |
| `Azurea-10.JPG`   | Feature strip left + Gallery #2      |
| `Azurea-12.JPG`   | Feature strip right + Gallery #3     |
| `Azurea-20.JPG`   | Gallery #8 (kitchen)                 |
| `Azurea-22.JPG`   | Gallery #4 (living)                  |
| `Azurea-25.JPG`   | Gallery #6 (bedroom)                 |
| `Azurea-30.JPG`   | Gallery #7 (bathroom)                |
| `Azurea-40.JPG`   | Gallery #9 (multimedia)              |
| `Azurea-47.JPG`   | Gallery #5 (living detail)           |
| `Azurea-50.JPG`   | Gallery #10 + Contact bg             |

The hero **video** is not in this bundle — it should be supplied by
the client, encoded as described in the Tech / Stack section above.
Until it lands, fall back to the still `Azurea-6.JPG` as
`<video poster>` and `.hero-bg` `background-image`.

The brochure PDF is **also not in this bundle** — when it ships, link
the "Download brochure" anchor to it (and add proper
`download="Villa-Azurea.pdf"`).

Icons in the contact buttons are inline SVG (phone glyph, WhatsApp
glyph, download glyph) — copy them from `index.html`. They use
`currentColor`, so they restyle automatically with the button.

## Files

- `index.html` — the full reference prototype. Every section is
  inside one file with inline `<style>` and `<script>`. Search for
  `/* ============ HERO ============ */` etc. to find each section.
- `photos/` — the 12 photographs.

## Implementation suggestions (in order)

1. Scaffold the chosen framework (Astro recommended). Configure
   Tailwind with the design tokens above as `extend.colors` and
   `extend.fontFamily`.
2. Build the layout shell + nav. Get the scrolled-state transition
   working.
3. Drop in static sections in order — hero (still image only first),
   about + parallax, narrative, feature strip. These are pure layout.
4. Build the Leaflet map as a client-only island (Astro: `client:visible`
   directive; Next: dynamic import with `ssr: false`). Wire the POI
   list ↔ map two-way.
5. Build the horizontal reel. The fixed-pixel card sizes are critical
   — see the Gallery section for the exact rationale.
6. Build the contact section. Make sure the `tel:` and `wa.me/`
   links work on mobile (test on a real device).
7. Replace the still hero image with the looping video once delivered.
   Add the `prefers-reduced-motion` fallback.
8. i18n: extract all visible strings into a `en.json` / `fr.json`
   pair. The narrative paragraph is the most important translation —
   don't lose its rhythm.
9. Performance pass: AVIF/WebP for all photos, lazy-load gallery
   images below the fold, preload the hero poster.
10. Deploy.

## Things to double-check with the client before launch

- **The hero video.** Source, length (we assumed 12s), rights to use.
- **The brochure PDF.** Final file or "coming soon"?
- **Real email address** for `private.viewings@azurea.fr`.
- **Languages spoken** — the lede claims "French, English, Italian,
  and Russian." Confirm this is accurate for both agents.
- **POI distances/times** — these were estimates based on the
  Mougins coordinates. Worth verifying with current Maps data.
- **Privacy/cookie banner.** GDPR applies (France). Even with no
  form, the Leaflet tile loads from third-party servers — this needs
  a banner or a same-origin tile server.
