# Guidance to Quran — Online Quran Academy (static site)

A fast, dependency-free rebuild of an online Quran academy website, deployed on GitHub Pages.

**Live:** https://youssefhassandev.github.io/guidance-to-quran/

## What's better than the original
- Zero WordPress/Elementor bloat: ~3 files, no jQuery, loads in well under a second
- Fully responsive with a mobile drawer, sticky glass header and dark mode
- Interactive courses page with search, category filters and detail modals
- Fee plans with per-category pricing, USD/GBP toggle, per-class cost and a comparison table
- Free-trial form with validation, time-zone detection and a no-backend fallback (WhatsApp + email prefill). Optional Formspree endpoint.
- SEO: canonical URLs, Open Graph, JSON-LD (Organization, FAQPage), sitemap, robots
- Accessible: skip link, ARIA labels, keyboard-friendly menu/modal, reduced-motion support

## Customise
Edit `SITE` at the top of `assets/js/main.js` (name, phone, email, socials, form endpoint). Course and plan data live in the same file.

## Run locally
Any static server, e.g. `python -m http.server 8080` then open http://localhost:8080.

## Deploy
Push to `main`; GitHub Pages serves from the root (`.nojekyll` present).

> Contact details in this demo are placeholders. Replace them with your own before going live.
