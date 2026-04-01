# Tolemi Marketing Website

## Tech Stack

- **Framework:** Astro 5 (SSR via `@astrojs/netlify`)
- **CMS:** Keystatic — config in `keystatic.config.ts`, admin UI at `/keystatic`
- **Styling:** Tailwind CSS v4 — custom `@theme` in `src/styles/global.css` (no tailwind.config.js)
- **Interactive components:** React 19 (opt-in via `client:load` directive)
- **Maps:** MapLibre GL + PMTiles
- **Deploy:** Netlify (Node 22)

## Commands

- `npm run dev` — dev server at localhost:4321
- `npm run build` — production build to `/dist`

## Architecture Principles

### Content is always separate from styling

All user-facing text must be editable from Keystatic. Content lives in `content/` as JSON singletons or Markdoc collections. Components receive text via props — never hardcode copy in components.

- **Singletons** (single JSON): `content/pages/home.json`, `content/global/site.json`, `content/team/team.json`, `content/careers/careers.json`, `content/about/about.json`
- **Collections** (one dir per entry): `content/products/{slug}/`, `content/solutions/{slug}/`, `content/blog/{category}/{slug}/`
- Keystatic schema is in `keystatic.config.ts` — update it when adding new content fields

### Each page section is its own component

Every discrete visual chunk of a page should be a separate Astro component in `src/components/blocks/`. Pages in `src/pages/` read content from Keystatic and pass it as props to block components. Block components handle layout and styling only.

### Extract reusable UI patterns

When a visual pattern appears in multiple places (cards, section headers, stat displays, job listings), extract it into `src/components/ui/`. Existing examples:
- `SectionHeader.astro` — eyebrow + heading + subtitle pattern
- `FeatureSlide.astro` — text + mockup with accent gradient
- `StatCard.tsx` — animated stat card (React)

### Colors and gradients are component props

Never hardcode brand colors inside a component's template. Pass Tailwind color classes as props with sensible defaults. This lets users customize colors by editing the component call site.

Example pattern (from `SectionHeader.astro`):
```astro
interface Props {
  eyebrowColor?: string;
  headingColor?: string;
}
const {
  eyebrowColor = "text-tolemi-sky-600",
  headingColor = "text-text-primary",
} = Astro.props;
```

## Project Structure

```
src/
  pages/           — Routes. Read Keystatic data, pass to components.
  components/
    blocks/        — Page sections (Hero, Features, Stats, Testimonials, CTA, etc.)
    blocks/landing/ — Home-page-specific sections
    layout/        — Header, Footer
    ui/            — Reusable primitives (SectionHeader, FeatureSlide, StatCard)
  layouts/
    Base.astro     — HTML shell, global styles, scroll-reveal observer
  styles/
    global.css     — Tailwind @import + @theme (brand colors, fonts, animations)
content/           — All CMS-managed content (JSON + Markdoc)
public/            — Static assets (logos, city seals, screenshots, map data)
keystatic.config.ts — CMS schema (singletons + collections)
```

## Design System

### Brand Colors (defined in `src/styles/global.css` @theme)

- **Primary accent:** `tolemi-indigo` (#6366F1) — gradients, key CTAs
- **Secondary accent:** `tolemi-sky` (#4CD5FF) — eyebrows, links, highlights
- **Data viz:** `tolemi-green`, `tolemi-red`, `tolemi-yellow`
- **Neutrals:** `tolemi-dark` (#343332), `tolemi-light` (#F5F5F5)
- **Semantic:** `surface`, `surface-secondary`, `text-primary`, `text-secondary`, `text-muted`

Each brand color has a full 50–900 scale.

### Typography

- **Headings:** `font-heading` (Raleway)
- **Body:** `font-sans` (Inter)
- **Logo:** `font-logo` (Montserrat)

### Spacing Conventions

- Section padding: `py-20` to `py-40`, `px-6`
- Container: `max-w-6xl` or `max-w-7xl mx-auto`
- Section header bottom margin: `mb-14 md:mb-20`

### Animations

- `.reveal` class on elements for scroll-triggered fade-in (handled by IntersectionObserver in `Base.astro`)
- `.feature-slide`, `.feature-slide-left`, `.feature-slide-right` for slide-in effects
- `float` / `float-delayed` keyframes for gentle bob animations

## Conventions

- Prefer Astro components (`.astro`) over React. Only use React (`client:load`) when client-side interactivity is required.
- Pages use `export const prerender = true` for static generation. Only `/keystatic` routes are SSR.
- Markdoc content is transformed server-side via `@markdoc/markdoc` and rendered as HTML.
- Images go in `public/uploads/` (for CMS-managed) or `public/` subdirectories (for static assets).
- Keystatic storage: local filesystem in dev, GitHub (tolemi-inc/website) in production.
