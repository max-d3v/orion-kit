---
title: API (oRPC Server)
description: Next.js app serving oRPC procedures with Clerk authentication
---

The API application (`apps/api`) serves the oRPC procedures defined in `@workspace/rpc`. It handles authentication via Clerk middleware, routes all RPC calls through a single catch-all handler, and processes Stripe webhooks.

**Framework:** Next.js (App Router)
**Port:** 3002
**Auth:** Clerk middleware
**API Protocol:** oRPC (via `@orpc/server/fetch`)
**Database:** Neon PostgreSQL (via `@workspace/database`)

## Technology

- **Next.js** with App Router for serverless deployment
- **oRPC** with `RPCHandler` for type-safe procedure handling
- **Clerk** for session verification on every RPC call
- **Drizzle ORM** for database operations (through the package layers)
- **Axiom** for request logging and observability

## Why Next.js for the API?

The API is a thin routing layer. Next.js provides:
- Serverless deployment on Vercel with automatic scaling
- File-based routing for the RPC catch-all and webhook endpoints
- Built-in middleware for Clerk auth
- Same deployment story as the other apps

The actual business logic lives in `@workspace/core`. The database access lives in `@workspace/repository`. This app just wires them together via oRPC.

## Structure

```
apps/api/
├── app/
│   ├── health/route.ts              # GET /health - status check
│   ├── rpc/[[...rest]]/route.ts     # ALL /rpc/* - oRPC handler
│   └── webhooks/stripe/route.ts     # POST /webhooks/stripe
├── next.config.mjs                  # CORS headers for app origin
├── proxy.ts                         # Clerk middleware for /rpc/*
└── package.json
```

This is deliberately minimal. Three route files. No business logic in the API app itself.

## oRPC Handler

The single catch-all route handles every RPC procedure:

```typescript
// app/rpc/[[...rest]]/route.ts
import { RPCHandler } from "@orpc/server/fetch";
import { router } from "@workspace/rpc";

const handler = new RPCHandler(router);

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/rpc",
    context: { headers: request.headers },
  });
  return response ?? new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
```

The `RPCHandler` from oRPC:
1. Parses the URL path to determine which procedure to call
2. Deserializes the request body as input
3. Runs the procedure (including middleware chain)
4. Serializes the return value as the response

All procedure definitions, authentication, input validation, and business logic are in the shared packages -- not in this route file.

## Authentication

Clerk middleware in `proxy.ts` protects the `/rpc/*` routes:

```typescript
// proxy.ts
import { authMiddleware } from "@workspace/auth/proxy";

export default authMiddleware;

export const config = {
  matcher: ["/rpc/:path*"],
};
```

This ensures Clerk's session is available when the oRPC auth middleware calls `auth()` in the RPC layer. The auth flow:

1. Request hits `/rpc/tasks.create`
2. Clerk middleware validates the session cookie
3. oRPC `authenticatedProcedure` runs `authMiddleware`
4. `authMiddleware` calls `auth()` from `@workspace/auth/server` to get `userId`
5. `userId` is injected into the procedure context
6. The procedure handler passes `userId` to the core use case

## CORS Configuration

The API app configures CORS headers to allow requests from the dashboard app:

```javascript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: "/rpc/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "http://localhost:3001" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type,Authorization" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
    ];
  },
};
```

## Stripe Webhook

The only non-RPC route handles Stripe webhooks:

```typescript
// app/webhooks/stripe/route.ts
import { handleWebhookEvent, verifyWebhookSignature } from "@workspace/payment/webhooks";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const event = await verifyWebhookSignature(body, signature);
  await handleWebhookEvent(event);

  return new Response("OK", { status: 200 });
}
```

Webhook events handled:
- `checkout.session.completed` - New subscription created
- `customer.subscription.updated` - Plan changed
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_succeeded` - Payment processed
- `invoice.payment_failed` - Payment failed

## Health Check

```typescript
// app/health/route.ts
export async function GET() {
  return new Response("OK", { status: 200 });
}
```

## Data Layer

The API app has no direct data layer of its own. All data access goes through the package layers:

```
Request -> oRPC Handler -> RPC Procedure -> Core Use Case -> Repository -> Database
```

The API app's only job is to:
1. Receive HTTP requests
2. Route them to oRPC procedures
3. Return the response

## Environment Variables

The API app needs server-side environment variables for all integrated services:

```bash
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_AXIOM_TOKEN=xaat_...
NEXT_PUBLIC_AXIOM_DATASET=orion-kit
```

## Development

```bash
# Start the API server
bun dev --filter api

# Test health check
curl http://localhost:3002/health

# Test Stripe webhooks locally
stripe listen --forward-to localhost:3002/webhooks/stripe
```

## Related

- [App (Dashboard)](/apps/app) - The frontend that consumes these procedures
- [RPC Package](/packages/rpc) - Procedure definitions and auth middleware
- [Clean Architecture](/architecture/clean-architecture) - How the layers connect
