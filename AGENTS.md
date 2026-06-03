# Data Engineers London Website

## Project Overview
Community website for Data Engineers London (2,000+ members).
Built with Astro. Hosted on Google Firebase Hosting.

## Tech Stack
- Framework: Astro (static site, TypeScript)
- Styling: Tailwind CSS
- Content: Markdown via Astro Content Collections
- Hosting: Google Firebase Hosting (free Spark plan)

## Development Rules
- This is a static community website, NOT a web app
- Zero client-side JavaScript unless absolutely necessary
- All event data lives in src/content/events/ as .md files
- Mobile-first responsive design
- Keep it simple — no databases, no auth, no APIs

## Pages
- / (homepage: next event + about + CTA)
- /events (list of upcoming and past events)
- /about (about the community + organisers)

## Workflow
- Use Superpowers methodology: brainstorm → plan → approve → build
- Write specs before code
- One feature at a time

## Design Reference
Anna's prototype is at docs/reference-design.html
Use these brand values from her design:
- Navy: #282A73 (background)
- Green: #4CBD94 (primary accent)
- Green Light: #6BD3AE
- Orange: #F37046 (secondary/CTA)
- Font: Outfit (Google Fonts)
- Logo: Three overlapping circles in green
- Style: Dark theme, glassmorphism cards, subtle gradients