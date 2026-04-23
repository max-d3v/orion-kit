---
title: Monorepo Overview
description: Turborepo structure, environment validation, linting, precommit hooks, export patterns, and import conventions
---

:::tip[TL;DR]
Turborepo monorepo with Bun as the package manager. t3-env for environment validation, Ultracite (Biome) for linting and formatting, Lefthook for git hooks, and strict export/import patterns across all packages.
:::

## Monorepo Structure

```
orion-kit/
├── apps/
│   ├── app/          # Dashboard (Next.js, port 3001)
│   ├── api/          # oRPC server (Next.js, port 3002)
│   ├── web/          # Landing page (Next.js, port 3000)
│   ├── studio/       # Drizzle Studio (port 3003)
│   └── docs/         # Documentation (Astro, port 3004)
├── packages/
│   ├── rpc/          # oRPC routers + middleware
│   ├── core/         # Use cases + authorization
│   ├── repository/   # Data access layer
│   ├── data-layer/   # TanStack Query + hydration
│   ├── auth/         # Clerk abstraction
│   ├── database/     # Drizzle schema + Neon client
│   ├── types/        # Shared types + Zod schemas
│   ├── analytics/    # PostHog + Vercel Analytics
│   ├── observability/# Sentry + OTel (errors, traces, replay)
│   ├── payment/      # Stripe integration
│   ├── email/        # Resend + React Email
│   ├── jobs/         # Trigger.dev tasks
│   ├── ui/           # shadcn/ui components
│   └── typescript-config/ # Shared tsconfig presets
├── e2e/              # Playwright E2E tests
├── turbo.json        # Turborepo task pipelines
├── biome.jsonc       # Linting + formatting (Ultracite)
├── lefthook.yml      # Git hooks
├── package.json      # Root workspace config
└── tsconfig.json     # Root TypeScript config
```

## Turborepo

Build orchestration is handled by Turborepo. The `turbo.json` defines task pipelines:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": [".env*"],
      "outputs": [".next/**", "dist/**"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {}
  }
}
```

- **`build`** - Builds all apps and packages, respecting dependency order (`^build` means "build dependencies first"). Outputs are cached.
- **`typecheck`** - Type-checks all packages in dependency order.
- **`dev`** - Runs all dev servers concurrently. Not cached, persistent (stays running).
- **`lint`** - Runs linting across the monorepo.

### Catalog Dependencies

The root `package.json` uses Bun's catalog feature for shared dependency versions:

```json
{
  "catalogs": {
    "schemas": {
      "drizzle-zod": "^0.8.3",
      "drizzle-kit": "^0.31.10",
      "drizzle-orm": "^0.45.2",
      "zod": "^4.3.6"
    },
    "web": {
      "next": "^16.1.0",
      "react": "^19.2.4",
      "react-dom": "^19.2.4"
    },
    "data-layer": {
      "@orpc/tanstack-query": "^1.13.13",
      "@tanstack/react-query": "^5.96.2"
    }
  }
}
```

Packages reference these with `"catalog:schemas"`, `"catalog:web"`, etc. This ensures all packages use identical versions of shared dependencies.

## Environment Validation (t3-env)

Every package that uses environment variables validates them at import time with `@t3-oss/env-nextjs` and Zod schemas. Each package has a `keys.ts` file:

```typescript
// packages/auth/keys.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/login"),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/signup"),
  },
  runtimeEnv: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  },
});
```

Packages with environment validation:

| Package | Key Variables |
| ------- | ------------ |
| **auth** | `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` |
| **database** | `DATABASE_URL` (PostgreSQL connection string) |
| **analytics** | `NEXT_PUBLIC_POSTHOG_KEY` (phc_ prefix), `NEXT_PUBLIC_POSTHOG_HOST`, optional `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| **observability** | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` (sntrys_ prefix), `SENTRY_ORG`, `SENTRY_PROJECT`, optional `SENTRY_TRACE_EXPORTER_URL`, `SENTRY_TRACE_EXPORTER_SECRET_KEY` |
| **payment** | `STRIPE_SECRET_KEY` (sk_ prefix), `STRIPE_WEBHOOK_SECRET` (whsec_ prefix), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_ prefix), plan price IDs |
| **email** | `RESEND_API_KEY` (re_ prefix), `FROM_EMAIL` |
| **jobs** | `TRIGGER_PROJECT` |

## Linting and Formatting (Ultracite)

Ultracite is a zero-config preset built on top of Biome. It handles both linting and formatting in a single pass.

```bash
# Check for issues
bun x ultracite check

# Auto-fix issues
bun x ultracite fix
```

The root `biome.jsonc` extends Ultracite's presets:

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.0.6/schema.json",
  "extends": [
    "ultracite/core",
    "ultracite/react",
    "ultracite/next",
    "ultracite/biome"
  ],
  "linter": {
    "rules": {
      "performance": {
        "noBarrelFile": "off"
      }
    }
  },
  "formatter": {
    "lineWidth": 80
  },
  "css": {
    "linter": {
      "rules": {
        "correctness": {
          "noUnknownAtRule": "off"
        }
      }
    }
  }
}
```

Key rules enforced:
- Arrow functions for callbacks
- `for...of` over `.forEach()`
- `const` by default, never `var`
- Optional chaining and nullish coalescing
- No `console.log` in production code
- Semantic HTML and ARIA attributes
- Explicit Suspense boundaries (no implicit loading states)

## Git Hooks (Lefthook)

Lefthook manages pre-commit and pre-push hooks. The `lefthook.yml` in the root configures what runs before commits are created:

```yaml
# lefthook.yml
pre-commit:
  commands:
    check:
      glob: "*.{js,ts,jsx,tsx,json,css}"
      run: bunx ultracite check {staged_files}
pre-push:
  commands:
    typecheck:
      run: bun turbo typecheck
```

Install hooks after cloning:

```bash
bun run prepare  # runs "lefthook install"
```

## TypeScript Configuration

The `@workspace/typescript-config` package provides shared presets:

| Preset | Use Case | Key Settings |
| ------ | -------- | ------------ |
| `base.json` | Non-React packages | ES2022, strict mode, strict null checks, bundler module resolution |
| `nextjs.json` | Next.js apps | Extends base + Next.js plugin, JSX preserve, allowJs |
| `react-library.json` | React packages | Extends base + react-jsx transform |

All presets enable:
- `strictNullChecks` - No implicit null/undefined
- `noUncheckedIndexedAccess` - Array/object access returns `T | undefined`
- `isolatedModules` - Each file is a standalone module
- `declaration` + `declarationMap` - Emits `.d.ts` files for package consumers

## Export Patterns

Packages use **explicit path-based exports** in their `package.json`. No barrel files (index.ts re-exporting everything). Each export path maps to a specific file:

```json
// @workspace/repository
{
  "exports": {
    "./entities/*": "./src/entities/*.ts"
  }
}

// @workspace/core
{
  "exports": {
    "./use-cases/*": "./src/use-cases/*.ts"
  }
}

// @workspace/auth
{
  "exports": {
    ".": "./src/index.ts",
    "./client": "./src/client.ts",
    "./server": "./src/server.ts",
    "./proxy": "./src/proxy.ts",
    "./components": "./src/components/index.ts",
    "./provider": "./src/provider.tsx"
  }
}

// @workspace/data-layer
{
  "exports": {
    "./client": "./src/query-client.ts",
    "./hydration": "./src/hydration.tsx",
    "./orpc-tanstack-util": "./src/orpc-tanstack-util.ts"
  }
}
```

### Pattern Summary

| Package | Export Style | Example Import |
| ------- | ----------- | -------------- |
| **rpc** | Mixed (root + path) | `@workspace/rpc`, `@workspace/rpc/orpc/tanstack` |
| **core** | Wildcard path | `@workspace/core/use-cases/tasks` |
| **repository** | Wildcard path | `@workspace/repository/entities/tasks` |
| **data-layer** | Named paths | `@workspace/data-layer/hydration` |
| **auth** | Named paths | `@workspace/auth/server`, `@workspace/auth/client` |
| **database** | Named paths | `@workspace/database/client`, `@workspace/database/schema` |
| **types** | Wildcard path | `@workspace/types/use-cases/tasks` |
| **ui** | Wildcard path | `@workspace/ui/components/button` |
| **analytics** | Named paths | `@workspace/analytics/server`, `@workspace/analytics/provider`, `@workspace/analytics/events` |
| **observability** | Named + wildcard | `@workspace/observability/server`, `@workspace/observability/app/otel-config` |

## Import Conventions

### Layer boundaries

Packages only import from their dependencies, never upward:

```
rpc -> core -> repository -> database
                          -> types
       core -> payment
rpc -> auth
rpc -> types
data-layer -> rpc
```

### In apps

```typescript
// Server components - prefetch data
import { getQueryClient, HydrateClient } from "@workspace/data-layer/hydration";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";

// Client components - consume data
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";
// use orpc.tasks.getUserTasksWithCount.queryOptions() with useSuspenseQuery

// UI components
import { Button } from "@workspace/ui/components/button";

// Auth
import { auth } from "@workspace/auth/server";
import { AuthProvider } from "@workspace/auth/provider";

// Types (for type annotations only)
import type { TaskRawObject } from "@workspace/types/repository/tasks";
```

### In packages

```typescript
// Core imports from repository
import { tasksRepository } from "@workspace/repository/entities/tasks";

// RPC imports from core
import { getUserTasksWithCount } from "@workspace/core/use-cases/tasks";

// Repository imports from database
import { db } from "@workspace/database/client";
import { tasks } from "@workspace/database/schema";
```

### What to avoid

```typescript
// Never import database directly from apps
import { db } from "@workspace/database/client"; // wrong

// Never import repository from apps
import { tasksRepository } from "@workspace/repository/entities/tasks"; // wrong

// Never import core from apps
import { createTask } from "@workspace/core/use-cases/tasks"; // wrong

// Apps talk to the backend exclusively through oRPC
import { orpc } from "@workspace/data-layer/orpc-tanstack-util"; // correct
```

## Source File Conventions

### Package source layout

```
packages/some-package/
├── src/
│   ├── index.ts          # Main export (if applicable)
│   ├── keys.ts           # t3-env validation (if uses env vars)
│   └── [domain]/         # Domain-specific files
│       └── some-file.ts
├── package.json          # Exports field maps to src/
└── tsconfig.json         # Extends shared preset
```

### Server-only enforcement

Packages that must only run on the server use the `"server-only"` import:

```typescript
// packages/auth/src/server.ts
import "server-only";
export * from "@clerk/nextjs/server";
```

This causes a build error if the module is accidentally imported in a client component.

## Scripts Reference

```bash
# Development
bun dev                    # Start all apps
bun dev --filter app       # Start single app

# Building
bun build                  # Build all
bun typecheck              # Type-check all

# Database
bun db:generate            # Generate migrations
bun db:migrate             # Apply migrations
bun db:push                # Push schema (dev)
bun db:studio              # Open Drizzle Studio
bun db:seed                # Seed database

# Code Quality
bun x ultracite check      # Check lint + format
bun x ultracite fix        # Fix lint + format

# Testing
bun test                   # Unit tests (Vitest)
bun test:e2e               # E2E tests (Playwright)
bun test:coverage          # Coverage report
```

## Related

- [Clean Architecture](/architecture/clean-architecture) - How the layered package design works
- [Type System](/architecture/type-system) - How types flow through the layers
- [Applications](/apps) - How each app is built and structured
