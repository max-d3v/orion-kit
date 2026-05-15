---
title: Cloud Accounts Setup
---

:::tip[TL;DR]
You need 5 services: Neon (database), Stripe (payments), Resend (email), PostHog (analytics), Sentry (errors + tracing). All have generous free tiers!
:::

Cracked Template uses cloud services for database, payments, and monitoring. Authentication is handled by our custom JWT system (no external dependencies!).

| Service     | What It Does          | Used Where            | Free Tier    | Setup Time |
| ----------- | --------------------- | --------------------- | ------------ | ---------- |
| **Neon**    | Postgres database     | API + Database schema | 0.5GB        | 2 min      |
| **Stripe**  | Subscription payments | Billing page          | No fees      | 5 min      |
| **Resend**  | Transactional emails  | Welcome emails        | 3k emails    | 2 min      |
| **Sentry**  | Errors + OTel tracing | All apps + API        | 5k errors/mo | 3 min      |
| **PostHog** | Product analytics     | User behavior         | 1M events/mo | 2 min      |
| **Vercel**  | Hosting               | Production deploy     | Unlimited    | 1 min      |

## 🔐 Authentication (Custom JWT)

Cracked Template uses a **custom JWT-based authentication system** - no external auth provider needed!

### Setup

Add to your API app (`.env.local`):

```bash
AUTH_JWT_SECRET=your-super-secret-key-min-32-characters-long
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3002
DATABASE_URL=postgresql://...
```

That's it! No external accounts needed.

---

## 🗄️ Neon (2 minutes)

Serverless Postgres database with autoscaling and generous free tier.

### Quick Setup

1. **Create Account:** [neon.tech](https://neon.tech) → Sign up with GitHub
2. **Create Project:** Click "Create Project" → Copy **Pooled Connection** URL
3. **Add to .env files:**
   ```bash
   # packages/database/.env
   # apps/api/.env.local
   # apps/studio/.env.local
   DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require
   ```
4. **Initialize:** `pnpm db:push`
5. **Verify:** `pnpm db:studio` → Opens https://local.drizzle.studio

:::tip[Important]
Always use **"Pooled connection"** for serverless compatibility!
:::

---

## 💳 Stripe (5 minutes)

Handles subscription payments, billing, and customer management.

### Quick Setup

1. **Create Account:** [stripe.com](https://stripe.com) → Sign up → Enable **Test Mode**
2. **Create Products:** Products → Add Product → Pro ($19/month) + Enterprise ($49/month) → Copy Price IDs
3. **Get API Keys:** Developers → API Keys → Copy publishable + secret keys
4. **Add to .env files:**

   ```bash
   # apps/api/.env.local
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PRICE_ID_PRO=price_...
   STRIPE_PRICE_ID_ENTERPRISE=price_...

   # apps/app/.env.local
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

5. **Setup Webhooks:** `stripe listen --forward-to localhost:3002/webhooks/stripe` → Copy webhook secret
6. **Test:** Visit `/dashboard/billing` → Use test card `4242 4242 4242 4242`

:::tip[Test Mode]
Stripe test mode = no fees! Use test cards for development.
:::

---

## 📧 Resend (2 minutes)

Transactional emails with beautiful React Email templates.

### Quick Setup

1. **Create Account:** [resend.com](https://resend.com) → Sign up
2. **Get API Key:** Dashboard → API Keys → Create API Key → Copy key
3. **Add to .env:**
   ```bash
   # apps/api/.env.local
   RESEND_API_KEY=re_...
   FROM_EMAIL=onboarding@resend.dev
   ```
4. **Test:** Register new user → Check email for welcome message

:::tip[Free Tier]
3,000 emails/month free! Perfect for development and small apps.
:::

---

## 🛰️ Sentry (3 minutes)

Error tracking, session replay, and OpenTelemetry tracing (oRPC procedures + Drizzle queries).

### Quick Setup

1. **Create Account:** [sentry.io](https://sentry.io) → Sign up → Create a Next.js project
2. **Copy DSN:** Project Settings → Client Keys (DSN) → Copy DSN
3. **Create Auth Token:** Settings → Auth Tokens → Create → scope: `project:releases`, `org:read` → Copy
4. **Add to .env:**
   ```bash
   # apps/app/.env.local and apps/api/.env.local
   NEXT_PUBLIC_SENTRY_DSN=https://...sentry.io/...
   SENTRY_AUTH_TOKEN=sntrys_...
   SENTRY_ORG=your-org
   SENTRY_PROJECT=your-project
   ```
5. **Test:** Trigger an error → Visit sentry.io → Check Issues

:::tip[Fully Optional]
The observability package no-ops cleanly when `NEXT_PUBLIC_SENTRY_DSN` is unset — you can skip this entirely in development.
:::

---

## 📊 PostHog (2 minutes)

Open-source product analytics platform for tracking user events and page views.

### Quick Setup

1. **Create Account:** [posthog.com](https://posthog.com) → Sign up
2. **Get API Keys:** Dashboard → Project Settings → Copy API Key + Host URL
3. **Add to .env files:**
   ```bash
   # apps/web/.env.local + apps/app/.env.local
   NEXT_PUBLIC_POSTHOG_KEY=phc_...
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```
4. **Test:** Visit app → Navigate pages → Check posthog.com → Web Analytics

:::tip[Free Tier]
1M events/month free! Perfect for tracking user behavior.
:::

---

## ⚡ Trigger.dev (Optional)

Background jobs and scheduled tasks without managing infrastructure.

### Quick Setup

1. **Create Account:** [trigger.dev](https://trigger.dev) → Sign up → Create project
2. **Get API Key:** Project dashboard → Environments → Copy Development API Key
3. **Add to .env:**
   ```bash
   # packages/jobs/.env
   TRIGGER_API_KEY=tr_dev_...
   TRIGGER_API_URL=https://api.trigger.dev
   ```
4. **Test:** `cd packages/jobs && pnpm trigger:dev` → Check dashboard

:::tip[Optional]
Background jobs are optional! Skip if you don't need them yet.
:::

---

## ▲ Vercel (1 minute)

Deployment platform for Next.js apps with serverless hosting and automatic deployments.

### How It's Used

- **Three apps deployed**: `web` (marketing), `app` (dashboard), `api` (backend)
- **Automatic deployments**: Push to `main` branch = production deploy
- **Environment variables**: Set in Vercel dashboard for each app

See the [Deployment Guide](/getting-started/deployment) for complete instructions.

---

## 🎉 **You're Done!**

**Total setup time:** ~15 minutes for all services

**Next steps:**

- [Deploy to production](/getting-started/deployment)
- [Customize your app](/getting-started/customization)
- [Add features](/getting-started/integrations)

**Troubleshooting?** Check service docs: [Neon](https://neon.tech/docs) · [Stripe](https://stripe.com/docs) · [Resend](https://resend.com/docs)
