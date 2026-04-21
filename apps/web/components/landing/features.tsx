import { Card } from "@workspace/ui/components/card";
import {
  Activity,
  Layers3,
  Lock,
  type LucideIcon,
  Rocket,
  Shield,
  Zap,
} from "lucide-react";

interface Feature {
  description: string;
  icon: LucideIcon;
  title: string;
}

const features: Feature[] = [
  {
    icon: Layers3,
    title: "Clean Architecture",
    description:
      "Layered monorepo where each package owns one responsibility — apps, data-layer, rpc, core, repository, database. Refactor with confidence.",
  },
  {
    icon: Shield,
    title: "Type-Safe End-to-End",
    description:
      "oRPC gives you automatic type inference from database schema to UI. Drizzle, Zod, and shared types keep contracts enforced across every layer.",
  },
  {
    icon: Lock,
    title: "Auth that just works",
    description:
      "Clerk authentication abstracted into @workspace/auth with server, client, and middleware helpers. Protected procedures out of the box.",
  },
  {
    icon: Rocket,
    title: "Production Services",
    description:
      "Stripe subscriptions, Resend emails with React Email, Trigger.dev background jobs, and PostHog product analytics — all pre-wired.",
  },
  {
    icon: Activity,
    title: "Traces Out of the Box",
    description:
      "Sentry + OpenTelemetry wired into both apps. Every oRPC procedure and Drizzle query emits spans — full browser → API → DB traces with zero extra code.",
  },
  {
    icon: Zap,
    title: "Fast Developer Experience",
    description:
      "Turborepo with Bun, Ultracite for lint & format, Lefthook git hooks, Vitest + Playwright for testing, t3-env for typed env vars, and Drizzle Studio on tap.",
  },
];

export function Features() {
  return (
    <section className="relative bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
            Everything you need — nothing you don&apos;t
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            A production SaaS foundation without the lock-in. Every piece is
            swap-able and every layer is inspectable.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card className="p-8" key={feature.title}>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-pretty font-semibold text-xl">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
