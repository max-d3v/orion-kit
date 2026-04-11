---
title: Docs
description: Documentation site built with Astro and Starlight
---

The docs application (`apps/docs`) is this documentation site. It uses Astro with the Starlight documentation theme and Nova styling.

**Framework:** Astro + Starlight
**Port:** 3004
**Output:** Static HTML
**Theme:** Starlight with Nova theme plugin

## Technology

- **Astro** for static site generation with minimal JavaScript
- **Starlight** documentation theme with built-in search, navigation, and dark mode
- **starlight-theme-nova** for visual styling
- **Markdown/MDX** for content authoring

## Data Layer

None. All content is static markdown compiled to HTML at build time.

## Structure

```
apps/docs/
├── src/
│   ├── content/docs/
│   │   ├── index.mdx              # Home page (splash template)
│   │   ├── introduction.md        # What Orion Kit is
│   │   ├── quick-start.md         # Setup guide
│   │   ├── architecture/          # Monorepo, clean architecture, types
│   │   ├── apps/                  # Per-app documentation
│   │   ├── packages/              # Per-package documentation
│   │   ├── guide/                 # Step-by-step guides
│   │   ├── reference/             # Integration guides
│   │   └── learning-paths/        # Learning path recommendations
│   ├── assets/                    # Images and SVGs
│   └── content.config.ts          # Content collection schema
├── public/
│   └── favicon.svg
├── astro.config.mjs               # Starlight config + sidebar
├── vercel.json                    # Deployment config
└── package.json
```

## Configuration

The sidebar is defined in `astro.config.mjs`. Sections are either manually ordered or auto-generated from directories.

## Development

```bash
bun dev --filter docs
# Runs on http://localhost:3004
```

## Deployment

Static HTML deployed to Vercel. The `vercel.json` configures the build from the monorepo root:

```json
{
  "outputDirectory": "dist",
  "buildCommand": "cd ../../ && pnpm turbo build --filter=docs",
  "installCommand": "cd ../../ && pnpm install"
}
```

## Related

- [Introduction](/introduction) - Start reading the docs
- [Architecture Overview](/architecture/overview) - Monorepo structure
