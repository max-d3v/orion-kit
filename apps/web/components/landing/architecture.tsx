import { Card } from "@workspace/ui/components/card";
import {
  ArrowDown,
  Database,
  Layers3,
  type LucideIcon,
  Network,
  Radio,
  Server,
  Shield,
} from "lucide-react";

interface ArchitectureLayer {
  description: string;
  icon: LucideIcon;
  packages: string[];
  subtitle: string;
  title: string;
}

const layers: ArchitectureLayer[] = [
  {
    icon: Server,
    title: "Apps",
    subtitle: "Presentation",
    description:
      "User-facing Next.js apps (web, app) and the oRPC API server. Render UI, handle routing, and call procedures.",
    packages: ["apps/app", "apps/api", "apps/web"],
  },
  {
    icon: Radio,
    title: "Data Layer",
    subtitle: "Client Sync",
    description:
      "TanStack Query with oRPC utils and server-side hydration. The bridge between client state and server procedures.",
    packages: ["@workspace/data-layer"],
  },
  {
    icon: Network,
    title: "RPC",
    subtitle: "API Surface",
    description:
      "oRPC routers with Clerk authentication middleware and Zod input validation. Type-safe procedure contracts.",
    packages: ["@workspace/rpc", "@workspace/auth"],
  },
  {
    icon: Layers3,
    title: "Core",
    subtitle: "Business Logic",
    description:
      "Framework-agnostic use cases and authorization rules. Where your domain logic lives — testable and reusable.",
    packages: ["@workspace/core"],
  },
  {
    icon: Database,
    title: "Repository",
    subtitle: "Data Access",
    description:
      "Drizzle queries, CRUD helpers, search and pagination. The only layer that talks to the database.",
    packages: ["@workspace/repository"],
  },
  {
    icon: Database,
    title: "Database",
    subtitle: "Infrastructure",
    description:
      "Neon serverless PostgreSQL with Drizzle schema and migrations. The source of truth.",
    packages: ["@workspace/database"],
  },
];

export function Architecture() {
  return (
    <section className="relative bg-muted/30 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm">
            <Shield className="h-4 w-4" />
            <span>Clean Architecture</span>
          </div>
          <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
            Layered by design, type-safe end-to-end
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Each layer depends only on the layer below. Apps never touch the
            database directly. Business logic stays isolated from frameworks.
            Refactor with confidence.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          {layers.map((layer, index) => (
            <div key={layer.title}>
              <Card className="group relative overflow-hidden border-border/60 bg-card/70 p-5 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted">
                    <layer.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-semibold text-lg">{layer.title}</h3>
                      <span className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
                        {layer.subtitle}
                      </span>
                    </div>
                    <p className="mb-3 text-muted-foreground text-sm leading-relaxed">
                      {layer.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {layer.packages.map((pkg) => (
                        <code
                          className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                          key={pkg}
                        >
                          {pkg}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {index < layers.length - 1 ? (
                <div
                  aria-hidden="true"
                  className="flex justify-center py-1.5 text-muted-foreground/60"
                >
                  <ArrowDown className="h-4 w-4" />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-2xl space-y-3 text-center text-muted-foreground text-sm leading-relaxed">
          <p>
            oRPC provides automatic end-to-end type inference from database
            schema to UI — no manual API client code, no generated SDK, no
            drift.
          </p>
          <p>
            Sentry and OpenTelemetry trace the same layers: every oRPC procedure
            and Drizzle query emits spans, wired into{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              apps/app
            </code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              apps/api
            </code>{" "}
            out of the box.
          </p>
        </div>
      </div>
    </section>
  );
}
