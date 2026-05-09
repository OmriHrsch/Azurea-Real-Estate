---
name: "Villa Azuréa"
description: "A cinematic Riviera marketing system for a private estate above the Bay of Cannes."
colors:
  estate-navy: "#0a1a2e"
  night-estate: "#050d1a"
  provencal-gold: "#b89968"
  limestone-paper: "#fbf9f4"
  warm-limestone: "#fafaf7"
  cool-stone: "#f4f5f7"
  muted-slate: "#6b7280"
  estate-line: "#0a1a2e1f"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(36px, 4.6vw, 62px)"
    fontWeight: 300
    lineHeight: 1.12
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(36px, 4vw, 52px)"
    fontWeight: 300
    lineHeight: 1.15
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(22px, 2vw, 28px)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 300
    lineHeight: 1.75
  label:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.18em"
rounded:
  square: "0"
spacing:
  section: "130px 48px"
  section-large: "150px 48px"
  section-mobile: "80px 24px"
  nav-desktop: "22px 48px"
  nav-scrolled: "14px 48px"
  grid-gap: "80px"
  text-gap: "32px"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.estate-navy}"
    rounded: "{rounded.square}"
    padding: "10px 20px"
  button-outline-inverse:
    backgroundColor: "transparent"
    textColor: "{colors.limestone-paper}"
    rounded: "{rounded.square}"
    padding: "10px 20px"
  navigation:
    backgroundColor: "transparent"
    textColor: "{colors.limestone-paper}"
    typography: "{typography.label}"
    height: "auto"
---

# Design System: Villa Azuréa

## 1. Overview

**Creative North Star: "The Private Horizon"**

Villa Azuréa is designed as a cinematic Riviera surface: quiet enough to feel private, expansive enough to let the landscape do the persuasion. The system uses warm paper, estate navy, sparse gold, slow reveals, and full-bleed imagery to make the property feel rare before it feels transactional.

This is not a component-heavy product interface. It is a controlled sequence of viewports where navigation, typography, and controls stay crisp so video, photography, and spatial pacing can carry the emotional load. It explicitly rejects generic luxury brokerage templates, mass lead-generation funnels, overfilled amenity grids, glossy real-estate cliches, and SaaS-style landing page patterns.

**Key Characteristics:**
- Photography-first composition with copy kept selective and appointment-led.
- Square-edged controls, hairline rules, and disciplined uppercase labels.
- Large Cormorant editorial type paired with light Montserrat UI text.
- Warm neutral surfaces interrupted by deep navy cinematic fields.
- Motion that feels like reveal and drift, never bounce or decoration.

## 2. Colors

The palette is an estate language: warm limestone surfaces, deep private navy, and a single Provençal gold accent used sparingly.

### Primary
- **Estate Navy** (`estate-navy`): primary text, scrolled navigation, dark linework, and the core identity color.
- **Night Estate** (`night-estate`): immersive dark blocks, contact sections, and cinematic caption fields where the page should feel private and enclosed.

### Secondary
- **Provençal Gold** (`provencal-gold`): eyebrow labels, quiet emphasis, gallery numbering, and selected accents. It should remain rare.

### Neutral
- **Limestone Paper** (`limestone-paper`): default page surface and light text on dark fields.
- **Warm Limestone** (`warm-limestone`): alternate editorial sections that need warmth without visual noise.
- **Cool Stone** (`cool-stone`): subtle contrast sections when warm paper would feel too continuous.
- **Muted Slate** (`muted-slate`): secondary navigation and supporting metadata.
- **Estate Line** (`estate-line`): dividers, hairline borders, and low-contrast structure.

### Named Rules

**The Gold Rarity Rule.** Gold is an accent, not a theme. Use it for labels, numbers, and small moments of ceremony, never as a broad background.

**The Warm Neutral Rule.** Light surfaces should feel like limestone and paper, not pure white. Cold white breaks the estate atmosphere.

## 3. Typography

**Display Font:** Cormorant Garamond with Georgia fallback  
**Body Font:** Montserrat with Arial fallback  
**Label/Mono Font:** Montserrat, no monospace layer

**Character:** Cormorant gives the site its estate narrative voice, elegant and airy without becoming ornamental. Montserrat keeps navigation, labels, body copy, and buttons crisp enough for brokerage-grade clarity.

### Hierarchy
- **Display** (300-400, fluid 36px to 62px, 1.12 line-height): section-defining statements, dark caption blocks, and high-drama editorial moments.
- **Headline** (300, fluid 36px to 52px, 1.15 line-height): section titles and two-line architectural claims.
- **Title** (400, fluid 22px to 28px, 1.55 line-height): narrative paragraphs where copy should read like a spoken estate description.
- **Body** (300, 15px, 1.75 line-height): explanatory copy, with line length kept calm and readable.
- **Label** (500, 10px to 11px, tracked uppercase): navigation, eyebrow labels, locale controls, metadata, and concise CTAs.

### Named Rules

**The One Serif Voice Rule.** Cormorant carries atmosphere; Montserrat carries function. Do not introduce a third display, script, mono, or decorative family.

**The No-Shouting Rule.** Uppercase is reserved for labels, navigation, and compact controls. Body copy never goes all-caps.

## 4. Elevation

The system is mostly flat and tonal. Depth comes from image scale, navy scrims, large section spacing, hairline rules, and ambient state shadows rather than card stacks. Shadows should be sparse and almost architectural: the scrolled navigation uses a 1px hairline shadow, while image overlays rely on gradients and opacity rather than heavy blur.

### Shadow Vocabulary
- **Navigation Hairline** (`0 1px 0 rgba(10, 26, 46, 0.07)`): only for the scrolled navbar to separate it from page content.
- **Legacy Ambient Card** (`0 4px 40px rgba(28, 28, 25, 0.07), 0 1px 4px rgba(28, 28, 25, 0.04)`): legacy gallery overlay treatment. Use only if an overlay must sit above photography.

### Named Rules

**The Ambient, Not Lifted Rule.** Surfaces should not float like app cards. If a shadow is visible from across the room, it is too strong.

## 5. Components

### Buttons
- **Shape:** square-edged, no radius (`0`).
- **Primary:** the current primary action is an outlined CTA, transparent at rest with a one-pixel border and uppercase Montserrat label.
- **Hover / Focus:** hover may use a soft tint or background wash. Focus must be explicit and visible, using the current color family rather than a generic browser-blue treatment.
- **Secondary / Ghost:** locale buttons are text-only, uppercase, and rely on opacity plus current-color shifts.

### Cards / Containers
- **Corner Style:** square, not rounded.
- **Background:** most sections are not carded. Use full-width paper or navy fields instead of nested panels.
- **Shadow Strategy:** flat by default. Use tonal contrast, borders, and image overlays before shadows.
- **Border:** one-pixel rules in Estate Line or translucent white on dark backgrounds.
- **Internal Padding:** generous editorial spacing, typically 48px on desktop and 22px to 24px on mobile.

### Navigation
- **Style:** fixed, transparent over the hero, white text at rest, then paper-backed with navy text after scroll.
- **Typography:** 11px uppercase Montserrat with wide tracking and deliberate spacing between links.
- **States:** color changes are quiet and quick. The scrolled state uses the Navigation Hairline, not a heavy shadow.
- **Mobile:** the menu becomes a full-width paper panel with navy links and square controls below 960px.

### Hero Media

The hero is intentionally bare: full-bleed video, a still image fallback, a navy gradient overlay, and a single vertical scroll indicator. Do not add headline copy, metric blocks, badges, or CTA stacks over the hero.

### Reveal Motion

Scroll reveals fade and translate upward with a one-second ease. Parallax should be passive, rAF-throttled, and disabled for reduced motion or mobile where appropriate.

## 6. Do's and Don'ts

### Do:
- **Do** lead with video, photography, and spacing before adding explanatory copy.
- **Do** use Estate Navy, Night Estate, Limestone Paper, Warm Limestone, and Provençal Gold through the existing CSS custom properties.
- **Do** keep controls square-edged and brokerage-crisp, with `border-radius: 0` on all buttons.
- **Do** maintain WCAG 2.2 AA contrast, keyboard access, semantic structure, and reduced-motion alternatives.
- **Do** keep English and French treatments visually equal, with no layout that only works in one language.

### Don't:
- **Don't** use generic luxury brokerage templates, mass lead-generation funnels, overfilled amenity grids, glossy real-estate cliches, or SaaS-style landing page patterns.
- **Don't** add card grids, rounded icon tiles, hero metric blocks, gradient text, glassmorphism, or colored side-stripe borders.
- **Don't** reference raw media paths or public placeholders. Use the media manifest helpers.
- **Don't** broaden gold into a dominant background color. Its rarity is part of the voice.
- **Don't** add hero copy unless the property direction changes. The bare video hero is a deliberate brand choice.
