---
title: Web (Landing Page)
description: Marketing landing page with Next.js
---

The web application (`apps/web`) is the marketing landing page. It is a static Next.js site with no data fetching, no authentication, and no server state.

**Framework:** Next.js (App Router)
**Port:** 3000
**Styling:** Tailwind CSS v4 + shadcn/ui
**Data Layer:** None (static content)

## Technology

- **Next.js** with App Router for static site generation
- **Tailwind CSS v4** with PostCSS
- **shadcn/ui** components from `@workspace/ui`
- **next-themes** for dark/light mode
- **PostHog** + Vercel Analytics for visitor tracking
- **Lucide React** for icons

## Data Layer

The web app has no data layer. All content is static and rendered at build time. The only dynamic elements are:
- Theme toggle (client-side, persisted in localStorage)
- Analytics tracking (PostHog event capture)

## Structure

```
apps/web/
├── app/
│   ├── layout.tsx           # Root layout (fonts, metadata, providers)
│   ├── page.tsx             # Landing page (imports Header + Landing)
│   └── providers.tsx        # "use client" - Theme + Analytics providers
├── components/
│   ├── header.tsx           # Site header with navigation
│   ├── landing.tsx          # Main landing page orchestrator
│   ├── landing/
│   │   ├── hero.tsx         # Hero section with value proposition
│   │   ├── features.tsx     # Feature cards grid
│   │   ├── tech-stack.tsx   # Technology badges
│   │   ├── cta.tsx          # Call-to-action section
│   │   └── footer.tsx       # Site footer
│   └── mode-toggle.tsx      # Dark/light theme toggle
├── public/
│   └── assets/              # SVG illustrations and images
└── package.json
```

The page is composed from feature sections in `components/landing/`. Each section is a standalone component. The `landing.tsx` file assembles them in order.

## SEO

The root layout defines comprehensive metadata:

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "Orion Kit - Production-Ready SaaS Boilerplate for Next.js",
    template: "%s | Orion Kit",
  },
  description: "Build faster with authentication, payments, analytics...",
  openGraph: { ... },
  twitter: { card: "summary_large_image", ... },
  robots: { index: true, follow: true },
};
```

## Environment Variables

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  # For any future auth links
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Development

```bash
bun dev --filter web
# Runs on http://localhost:3000
```

## Related

- [App (Dashboard)](/apps/app) - The main application users sign into
- [UI Package](/packages/ui) - Shared component library
- [Analytics Package](/packages/analytics) - PostHog integration
