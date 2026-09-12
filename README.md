# Hedaya Academy — Online Quran Academy (static site)

A fast, dependency-free rebuild of an online Quran academy website, deployed on GitHub Pages.

**Live:** https://youssefhassandev.github.io/guidance-to-quran/

## What's better than the original
- Zero WordPress/Elementor bloat: ~3 files, no jQuery, loads in well under a second
- Warm brown-and-gold design: full-bleed photo hero (Playfair Display + Cairo), stat cards, numbered FAQ, tutor cards with availability, payment strip in the footer
- Fully responsive with a mobile drawer, a phone bottom tab bar with a raised Enrol button, sticky header and dark mode
- Interactive courses page with search, category filters and detail modals
- Fee plans with per-category pricing, USD/GBP toggle, per-class cost and a comparison table
- Free-trial form with validation, time-zone detection and a no-backend fallback (WhatsApp + email prefill). Optional Formspree endpoint.
- SEO: canonical URLs, Open Graph, JSON-LD (Organization, FAQPage), sitemap, robots
- Accessible: skip link, ARIA labels, keyboard-friendly menu/modal, reduced-motion support

## Responsive design
The stylesheet is mobile-first: base rules are written for 320px phones and three `min-width` breakpoints add layout as room appears.

| Breakpoint | Width | What changes |
|---|---|---|
| base | 320px+ | one column, bottom tab bar, drawer menu, fluid type and gutters |
| sm | 641px+ | top bar, two-column grids and form rows, larger header |
| md | 861px+ | header trial button, desktop hero collage sizes, side-by-side CTA buttons, bottom bar hidden |
| lg | 1025px+ | desktop navigation with sub-menu, two-column hero / split / CTA / FAQ / globe, 3–5 column grids, 4-column footer |

Nothing sets a fixed pixel width; the comparison table scrolls inside its own wrapper with a sticky first column.

## Customise
Edit `SITE` at the top of `assets/js/main.js` (name, phone, email, socials, form endpoint). Course and plan data live in the same file.

## Run locally
Any static server, e.g. `python -m http.server 8080` then open http://localhost:8080.

## Deploy
Push to `main`; GitHub Pages serves from the root (`.nojekyll` present).

> Contact details in this demo are placeholders. Replace them with your own before going live.
