---
title: Introduction
description: Opinionated B2B SaaS monorepo template with auth, billing, and end-to-end type safety
---

:::tip[What is Cracked Template?]
An opinionated B2B SaaS monorepo template. Every architectural and stack decision is already made: oRPC for type-safe RPC, Clerk for authentication, Drizzle ORM with Neon PostgreSQL, and TanStack Query for data management. Everything is end-to-end type-safe from database schema to UI components — so you ship product, not boilerplate.
:::

## What You Get

- **Clean Architecture** - Layered packages: RPC, Core (Use Cases + Authorization), Repository, Database
- **oRPC** - End-to-end type-safe RPC with automatic TanStack Query integration
- **Clerk Auth** - Managed authentication abstracted into a swappable package
- **Drizzle ORM** - Type-safe database with Neon PostgreSQL and auto-generated Zod schemas
- **Stripe Payments** - Subscriptions, checkout, billing portal, and webhooks
- **Resend Email** - React Email templates with transactional delivery
- **PostHog + Sentry** - Product analytics, error tracking, and OTel tracing
- **Trigger.dev** - Background jobs and scheduled tasks
- **Vitest + Playwright** - Unit and E2E testing

## Architecture at a Glance

```
Presentation (Apps)
       |
  Data Layer (TanStack Query + Hydration)
       |
  RPC Layer (oRPC routers + auth middleware)
       |
  Core Layer (Use Cases + Authorization)
       |
  Repository Layer (Drizzle queries)
       |
  Database (Neon PostgreSQL)
```

Each layer depends only on the layer below it. Business rules live in the Core package. Data access lives in the Repository package. The RPC layer exposes use cases as authenticated procedures. Apps never talk to the database directly.

## Applications

| App | Purpose | Technology | Port |
| --- | ------- | ---------- | ---- |
| **app** | User dashboard | Next.js + oRPC client + TanStack Query | 3001 |
| **api** | oRPC server | Next.js + oRPC handler + Clerk middleware | 3002 |
| **web** | Marketing landing page | Next.js (static) | 3000 |
| **studio** | Database browser | Drizzle Studio | 3003 |
| **docs** | Documentation | Astro + Starlight | 3004 |

## Core Packages

| Package | Layer | Purpose |
| ------- | ----- | ------- |
| **@workspace/rpc** | API | oRPC routers, auth middleware, procedure definitions |
| **@workspace/core** | Business Logic | Use cases, authorization rules |
| **@workspace/repository** | Data Access | Drizzle queries, CRUD operations |
| **@workspace/data-layer** | Client Sync | TanStack Query client, hydration, oRPC utilities |
| **@workspace/auth** | Authentication | Clerk abstraction (server, client, components) |
| **@workspace/database** | Infrastructure | Drizzle schema, Neon client, migrations |
| **@workspace/types** | Contracts | Shared types, Zod schemas, error classes |

## Auxiliary Packages

| Package | Purpose | Service |
| ------- | ------- | ------- |
| **@workspace/analytics** | Product analytics | PostHog + Vercel Analytics |
| **@workspace/observability** | Errors + tracing + replay | Sentry + OpenTelemetry |
| **@workspace/payment** | Billing + subscriptions | Stripe |
| **@workspace/email** | Transactional email | Resend |
| **@workspace/jobs** | Background tasks | Trigger.dev |
| **@workspace/ui** | Component library | shadcn/ui + Radix + Tailwind v4 |

## External Services

| Service | Purpose | Package |
| ------- | ------- | ------- |
| **Clerk** | Authentication and user management | @workspace/auth |
| **Neon** | Serverless PostgreSQL database | @workspace/database |
| **PostHog** | Product analytics and event tracking | @workspace/analytics |
| **Stripe** | Payment processing and subscriptions | @workspace/payment |
| **Sentry** | Error tracking, session replay, OTel tracing | @workspace/observability |
| **Resend** | Transactional email delivery | @workspace/email |
| **Trigger.dev** | Background job execution | @workspace/jobs |
| **Vercel** | Hosting and deployment | All apps |

## Quick Start

```bash
# Clone the template
git clone https://github.com/Mumma6/orion-kit your-project
cd your-project
bun install
bun dev
```

**Next:** [Architecture Overview](/architecture/overview) | [Applications](/apps) | [Core Packages](/packages)
