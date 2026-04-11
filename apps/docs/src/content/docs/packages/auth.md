---
title: Auth
description: Clerk authentication abstraction with server, client, middleware, and components
---

The Auth package (`@workspace/auth`) abstracts Clerk into a workspace package. It re-exports Clerk utilities through clean import paths and wraps the Clerk provider with theme support. If you ever need to swap Clerk for another auth provider, you change this package and nothing else.

**Service:** Clerk
**Layer:** Authentication
**Consumed by:** `@workspace/rpc` (middleware), Apps (providers, components)

## Package Exports

```json
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
```

| Export | Purpose | Environment |
| ------ | ------- | ----------- |
| `.` | Re-exports from index | Universal |
| `./client` | Clerk client hooks and utilities | Client only |
| `./server` | `auth()`, `currentUser()`, etc. | Server only |
| `./proxy` | `clerkMiddleware` as `authMiddleware` | Middleware |
| `./components` | SignIn, SignUp components | Client only |
| `./provider` | ClerkProvider with theme support | Client only |

## Server Utilities

```typescript
// src/server.ts
import "server-only";
export * from "@clerk/nextjs/server";
```

The `"server-only"` import ensures this module cannot be imported in client components. Used by the RPC auth middleware:

```typescript
import { auth } from "@workspace/auth/server";

const { userId, sessionClaims } = await auth();
```

## Client Utilities

```typescript
// src/client.ts
export * from "@clerk/nextjs";
```

Re-exports all Clerk client hooks (`useAuth`, `useUser`, `useClerk`, etc.).

## Middleware Proxy

```typescript
// src/proxy.ts
export { clerkMiddleware as authMiddleware } from "@clerk/nextjs/server";
```

Used in app middleware files (`proxy.ts`) to protect routes:

```typescript
// apps/app/proxy.ts
import { authMiddleware } from "@workspace/auth/proxy";

export default authMiddleware;
export const config = {
  matcher: ["/dashboard/:path*", "/rpc/:path*"],
};
```

## Provider

```typescript
// src/provider.tsx ("use client")
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export function AuthProvider({ children }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : undefined,
        // Custom styling...
      }}
    >
      {children}
    </ClerkProvider>
  );
}
```

Wraps `ClerkProvider` with dark/light theme detection from next-themes. The provider is used in the root `providers.tsx` of each app that needs auth.

## Components

```typescript
// src/components/sign-in.tsx
import { SignIn as ClerkSignIn } from "@clerk/nextjs";

export function SignIn() {
  return <ClerkSignIn appearance={{ /* custom styles */ }} />;
}
```

Thin wrappers around Clerk's pre-built components with custom styling.

## Environment Variables

Validated via t3-env in `keys.ts`:

```bash
# Server
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=svix_...     # Optional

# Client
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
```

## How Auth Flows Through the Stack

1. **User visits `/dashboard`** - Clerk middleware in `proxy.ts` checks for a valid session
2. **No session** - Redirected to `/login` (Clerk's SignIn component)
3. **User signs in** - Clerk sets a session cookie
4. **Subsequent requests** - Clerk middleware validates the cookie
5. **Server component** - Can call `auth()` from `@workspace/auth/server`
6. **oRPC call** - Auth middleware calls `auth()`, extracts `userId`, injects into context
7. **Use case** - Receives `userId` as a parameter, uses it for queries and authorization

## Dependencies

```json
{
  "@clerk/nextjs": "^7.0.1",
  "@clerk/themes": "^2.4.57",
  "@t3-oss/env-nextjs": "^0.13.10",
  "next-themes": "^0.4.6",
  "server-only": "^0.0.1",
  "zod": "catalog:schemas"
}
```

## Related

- [RPC Package](/packages/rpc) - Uses auth middleware for procedure authentication
- [App (Dashboard)](/apps/app) - Uses the provider and components
- [API Application](/apps/api) - Uses the middleware proxy
