---
title: Packages
description: Core and auxiliary packages in the monorepo
---

:::tip[TL;DR]
14 shared packages split into **core** (the clean architecture layers) and **auxiliary** (integrations and utilities). Core packages implement the layered data flow. Auxiliary packages provide specific service integrations.
:::

## Core Packages

These packages implement the [clean architecture layers](/architecture/clean-architecture). Data flows downward: RPC -> Core -> Repository -> Database.

| Package | Layer | Responsibility |
| ------- | ----- | -------------- |
| [**@workspace/rpc**](/packages/rpc) | API Surface | oRPC routers, auth middleware, input validation |
| [**@workspace/core**](/packages/core) | Business Logic | Use cases, authorization rules, business orchestration |
| [**@workspace/repository**](/packages/repository) | Data Access | Drizzle queries, CRUD, search, pagination |
| [**@workspace/data-layer**](/packages/data-layer) | Client Sync | TanStack Query client, hydration, oRPC utilities |
| [**@workspace/auth**](/packages/auth) | Authentication | Clerk abstraction (server, client, middleware, components) |
| [**@workspace/database**](/packages/database) | Infrastructure | Drizzle schema, Neon client, migrations, seeding |
| [**@workspace/types**](/packages/types) | Contracts | Shared types, Zod schemas, error classes |

### Dependency Flow

```
@workspace/data-layer
└── @workspace/rpc
    ├── @workspace/core
    │   ├── @workspace/repository
    │   │   ├── @workspace/database
    │   │   └── @workspace/types
    │   ├── @workspace/payment
    │   └── @workspace/types
    ├── @workspace/auth
    └── @workspace/types
```

## Auxiliary Packages

Service integrations and shared utilities. These are consumed by apps and some core packages.

| Package | Purpose | Service |
| ------- | ------- | ------- |
| [**@workspace/ui**](/packages/ui) | Component library | shadcn/ui + Radix UI + Tailwind v4 |
| [**@workspace/analytics**](/packages/analytics) | Product analytics | PostHog + Vercel Analytics |
| [**@workspace/observability**](/packages/observability) | Logging + monitoring | Axiom |
| [**@workspace/payment**](/packages/payment) | Billing + subscriptions | Stripe |
| [**@workspace/email**](/packages/email) | Transactional email | Resend + React Email |
| [**@workspace/jobs**](/packages/jobs) | Background tasks | Trigger.dev |

## Shared Configuration

| Package | Purpose |
| ------- | ------- |
| **@workspace/typescript-config** | Shared tsconfig presets (base, nextjs, react-library) |

## Usage in Apps

Apps declare workspace dependencies in their `package.json`:

```json
{
  "dependencies": {
    "@workspace/rpc": "workspace:*",
    "@workspace/data-layer": "workspace:*",
    "@workspace/auth": "workspace:*",
    "@workspace/ui": "workspace:*",
    "@workspace/analytics": "workspace:*",
    "@workspace/observability": "workspace:*"
  }
}
```

Import using the package's exported paths:

```typescript
// Data fetching
import { getQueryClient, HydrateClient } from "@workspace/data-layer/hydration";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";

// UI
import { Button } from "@workspace/ui/components/button";

// Auth
import { auth } from "@workspace/auth/server";
```

## Related

- [Clean Architecture](/architecture/clean-architecture) - How the layers connect
- [Monorepo Overview](/architecture/overview) - Export patterns and import conventions
