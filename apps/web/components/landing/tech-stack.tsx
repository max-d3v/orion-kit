import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

interface Tech {
  description: string;
  emoji: string;
  title: string;
}

const techStack: Tech[] = [
  {
    emoji: "⚛️",
    title: "Next.js 16",
    description:
      "App Router, React 19 & Server Actions for modern full-stack development.",
  },
  {
    emoji: "🔷",
    title: "TypeScript",
    description: "End-to-end type safety with strict mode across entire stack.",
  },
  {
    emoji: "🔌",
    title: "oRPC",
    description:
      "End-to-end type-safe RPC procedures — no manual API client code.",
  },
  {
    emoji: "🔐",
    title: "Clerk",
    description:
      "Authentication with server/client abstraction and middleware integration.",
  },
  {
    emoji: "🗄️",
    title: "Drizzle ORM",
    description: "Type-safe SQL with automatic type inference from schema.",
  },
  {
    emoji: "☁️",
    title: "Neon",
    description: "Serverless Postgres with instant scaling and branching.",
  },
  {
    emoji: "💳",
    title: "Stripe",
    description:
      "Payment processing for subscriptions, webhooks, and one-time charges.",
  },
  {
    emoji: "📧",
    title: "Resend",
    description: "Transactional emails with React Email templates.",
  },
  {
    emoji: "⚡",
    title: "Trigger.dev",
    description: "Background jobs & scheduled tasks with TypeScript.",
  },
  {
    emoji: "📊",
    title: "PostHog",
    description: "Product analytics with event tracking and insights.",
  },
  {
    emoji: "🐛",
    title: "Sentry",
    description:
      "Error monitoring and performance tracing for Next.js, server & edge.",
  },
  {
    emoji: "🔭",
    title: "OpenTelemetry",
    description:
      "End-to-end traces across oRPC procedures and Drizzle queries, wired via @vercel/otel.",
  },
  {
    emoji: "🎨",
    title: "TailwindCSS v4",
    description: "Modern design tokens and utility-first CSS framework.",
  },
  {
    emoji: "🧩",
    title: "shadcn/ui",
    description: "Beautiful, accessible components built with Radix UI.",
  },
  {
    emoji: "🔄",
    title: "TanStack Query",
    description: "Powerful data fetching, caching, and server-state hydration.",
  },
  {
    emoji: "✅",
    title: "Zod",
    description: "Runtime validation and type inference for forms & APIs.",
  },
  {
    emoji: "🛡️",
    title: "t3-env",
    description: "Type-safe environment variables with Zod validation.",
  },
  {
    emoji: "🎯",
    title: "Playwright",
    description: "Reliable end-to-end testing across browsers.",
  },
  {
    emoji: "🧪",
    title: "Vitest",
    description: "Fast unit testing with a modern test runner.",
  },
  {
    emoji: "▲",
    title: "Vercel",
    description: "Zero-config deployment with edge runtime support.",
  },
  {
    emoji: "🏗️",
    title: "Turborepo",
    description: "High-performance monorepo build system with caching.",
  },
  {
    emoji: "🥟",
    title: "Bun",
    description: "Ultra-fast JavaScript runtime and package manager.",
  },
  {
    emoji: "✨",
    title: "Ultracite",
    description: "Zero-config Biome preset for formatting and linting.",
  },
  {
    emoji: "🪝",
    title: "Lefthook",
    description: "Fast git hooks manager for pre-commit checks.",
  },
  {
    emoji: "📚",
    title: "Astro Starlight",
    description: "Fast, accessible documentation site with built-in search.",
  },
];

export function TechStack() {
  return (
    <section className="relative px-6 pt-12 pb-24 lg:pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
            Batteries included
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Every tool carefully chosen to work together — type-safe,
            production-tested, and with generous free tiers.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {techStack.map((tech) => (
            <Card
              className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
              key={tech.title}
            >
              <CardHeader className="mb-0 pb-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <span className="text-lg">{tech.emoji}</span>
                  </div>
                  <CardTitle className="font-semibold text-sm">
                    {tech.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-xs leading-relaxed">
                  {tech.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
