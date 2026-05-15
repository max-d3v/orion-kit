# Cracked Template

**The opinionated B2B SaaS monorepo template.** Authentication, subscription billing, background jobs, and observability — already decided and wired together with end-to-end type safety. Ship product, not boilerplate.

[Docs](https://orion-kit-docs.vercel.app/) | [Architecture](https://orion-kit-docs.vercel.app/architecture/overview) | [Packages](https://orion-kit-docs.vercel.app/packages)

> If this saves you time, please star the repo.

## What's Included

**Apps:**

- **Landing Page** (`web`) -- Marketing site (Next.js, port 3000)
- **Dashboard** (`app`) -- Admin app with tasks, billing, analytics (Next.js + oRPC + TanStack Query, port 3001)
- **API** (`api`) -- oRPC server with Clerk authentication (Next.js, port 3002)
- **Studio** -- Drizzle Studio database browser (port 3003)
- **Docs** (`docs`) -- Astro Starlight documentation (port 3004)

**Core Packages (Clean Architecture):**

| Package | Layer | Purpose |
| ------- | ----- | ------- |
| `@workspace/rpc` | API Surface | oRPC routers, auth middleware, input validation |
| `@workspace/core` | Business Logic | Use cases, authorization rules |
| `@workspace/repository` | Data Access | Drizzle queries, CRUD, search, pagination |
| `@workspace/data-layer` | Client Sync | TanStack Query client, server hydration, oRPC utils |
| `@workspace/auth` | Authentication | Clerk abstraction (server, client, middleware) |
| `@workspace/database` | Infrastructure | Drizzle schema, Neon client, migrations |
| `@workspace/types` | Contracts | Shared types, Zod schemas, error classes |

**Auxiliary Packages:**

| Package | Service |
| ------- | ------- |
| `@workspace/ui` | shadcn/ui + Radix UI + Tailwind v4 |
| `@workspace/analytics` | PostHog + Vercel Analytics |
| `@workspace/observability` | Axiom logging + Web Vitals |
| `@workspace/payment` | Stripe subscriptions + webhooks |
| `@workspace/email` | Resend + React Email |
| `@workspace/jobs` | Trigger.dev background tasks |

**Infrastructure:**

- **Monorepo** -- Turborepo with Bun, catalog dependencies
- **Type Safety** -- End-to-end from database schema to UI via oRPC
- **Linting** -- Ultracite (Biome) for formatting and linting
- **Env Validation** -- t3-env with Zod in every package
- **Testing** -- Vitest unit tests + Playwright E2E
- **Git Hooks** -- Lefthook for pre-commit checks

## Architecture

```
Apps (app, api, web)
  |
Data Layer (TanStack Query + hydration)
  |
RPC (oRPC routers + Clerk auth middleware)
  |
Core (Use Cases + Authorization)
  |
Repository (Drizzle queries)
  |
Database (Neon PostgreSQL)
```

Each layer depends only on the layer below it. Apps never touch the database directly. Business logic is in the Core package. Data access is in the Repository package. The RPC layer exposes procedures with authentication. oRPC provides automatic end-to-end type inference -- no manual API client code needed.

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Mumma6/orion-kit your-project
cd your-project
bun install

# 2. Set up environment variables
cp apps/app/.env.example apps/app/.env.local
cp apps/api/.env.example apps/api/.env.local
cp packages/database/.env.example packages/database/.env

# 3. Initialize database
bun db:push

# 4. Start everything
bun dev
```

**Required services** (all have generous free tiers):

| Service | Purpose | Free Tier |
| ------- | ------- | --------- |
| [Clerk](https://clerk.com) | Authentication | 10k MAU |
| [Neon](https://neon.tech) | Database | 0.5GB |
| [Stripe](https://stripe.com) | Payments | No fees |
| [Resend](https://resend.com) | Email | 3k emails |
| [PostHog](https://posthog.com) | Analytics | 1M events |
| [Axiom](https://axiom.co) | Logging | 500MB/mo |

## Commands

```bash
bun dev               # Start all apps
bun build             # Build all apps
bun typecheck         # Type-check all packages
bun x ultracite check # Lint + format check
bun x ultracite fix   # Auto-fix lint + format
bun db:push           # Push schema to database
bun db:studio         # Open database GUI
bun db:seed           # Seed test data
bun test              # Run unit tests
bun test:e2e          # Run E2E tests
```

## Documentation

Full documentation: https://orion-kit-docs.vercel.app/

- [Introduction](https://orion-kit-docs.vercel.app/introduction/)
- [Monorepo Architecture](https://orion-kit-docs.vercel.app/architecture/overview/)
- [Clean Architecture](https://orion-kit-docs.vercel.app/architecture/clean-architecture/)
- [Applications](https://orion-kit-docs.vercel.app/apps/)
- [Core Packages](https://orion-kit-docs.vercel.app/packages/)

## License

MIT
