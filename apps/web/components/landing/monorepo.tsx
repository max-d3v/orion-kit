import { Card } from "@workspace/ui/components/card";
import {
  BarChart3,
  CreditCard,
  Database,
  FileText,
  FolderTree,
  Globe,
  KeyRound,
  Layers3,
  LayoutDashboard,
  type LucideIcon,
  Mail,
  Network,
  Package2,
  Palette,
  Radio,
  ScrollText,
  Server,
  Settings,
  Shapes,
  Terminal,
  Wrench,
  Zap,
} from "lucide-react";

interface WorkspaceItem {
  description: string;
  icon: LucideIcon;
  name: string;
  tag?: string;
}

interface WorkspaceGroup {
  description: string;
  items: WorkspaceItem[];
  title: string;
}

const apps: WorkspaceItem[] = [
  {
    icon: Globe,
    name: "web",
    tag: ":3000",
    description: "Marketing landing page (Next.js)",
  },
  {
    icon: LayoutDashboard,
    name: "app",
    tag: ":3001",
    description: "Dashboard with tasks, billing & analytics",
  },
  {
    icon: Server,
    name: "api",
    tag: ":3002",
    description: "oRPC server with Clerk authentication",
  },
  {
    icon: Database,
    name: "studio",
    tag: ":3003",
    description: "Drizzle Studio database browser",
  },
  {
    icon: FileText,
    name: "docs",
    tag: ":3004",
    description: "Astro Starlight documentation site",
  },
];

const corePackages: WorkspaceItem[] = [
  {
    icon: Network,
    name: "@workspace/rpc",
    tag: "API Surface",
    description: "oRPC routers, auth middleware, input validation",
  },
  {
    icon: Layers3,
    name: "@workspace/core",
    tag: "Business Logic",
    description: "Use cases and authorization rules",
  },
  {
    icon: Database,
    name: "@workspace/repository",
    tag: "Data Access",
    description: "Drizzle queries, CRUD, search, pagination",
  },
  {
    icon: Radio,
    name: "@workspace/data-layer",
    tag: "Client Sync",
    description: "TanStack Query, server hydration, oRPC utils",
  },
  {
    icon: KeyRound,
    name: "@workspace/auth",
    tag: "Authentication",
    description: "Clerk abstraction (server, client, middleware)",
  },
  {
    icon: Database,
    name: "@workspace/database",
    tag: "Infrastructure",
    description: "Drizzle schema, Neon client, migrations",
  },
  {
    icon: Shapes,
    name: "@workspace/types",
    tag: "Contracts",
    description: "Shared types, Zod schemas, error classes",
  },
];

const auxiliaryPackages: WorkspaceItem[] = [
  {
    icon: Palette,
    name: "@workspace/ui",
    description: "shadcn/ui + Radix UI + Tailwind v4",
  },
  {
    icon: BarChart3,
    name: "@workspace/analytics",
    description: "PostHog + Vercel Analytics",
  },
  {
    icon: ScrollText,
    name: "@workspace/observability",
    description: "Sentry + OpenTelemetry (oRPC & Drizzle traces)",
  },
  {
    icon: CreditCard,
    name: "@workspace/payment",
    description: "Stripe subscriptions + webhooks",
  },
  {
    icon: Mail,
    name: "@workspace/email",
    description: "Resend + React Email templates",
  },
  {
    icon: Zap,
    name: "@workspace/jobs",
    description: "Trigger.dev background tasks",
  },
  {
    icon: Settings,
    name: "@workspace/typescript-config",
    description: "Shared TSConfig presets",
  },
];

const groups: WorkspaceGroup[] = [
  {
    title: "Apps",
    description: "Five independent applications, all running side-by-side.",
    items: apps,
  },
  {
    title: "Core Packages",
    description:
      "Clean Architecture layers — each package owns one responsibility.",
    items: corePackages,
  },
  {
    title: "Auxiliary Packages",
    description: "Integrations and shared tooling used across the monorepo.",
    items: auxiliaryPackages,
  },
];

const groupIcons: Record<string, LucideIcon> = {
  Apps: Terminal,
  "Core Packages": Package2,
  "Auxiliary Packages": Wrench,
};

export function Monorepo() {
  return (
    <section className="relative px-6 pt-12 pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
            <FolderTree className="h-4 w-4" />
            <span>Monorepo structure</span>
          </div>
          <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
            5 apps, 14 packages, one Turborepo
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            A workspace designed for clarity — each app and package has a single
            responsibility and depends only on layers below it.
          </p>
        </div>

        <div className="space-y-10">
          {groups.map((group) => {
            const GroupIcon = groupIcons[group.title] ?? Package2;
            return (
              <div key={group.title}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border/60 bg-muted">
                    <GroupIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">{group.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {group.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((item) => (
                    <Card
                      className="group relative overflow-hidden border-border/60 bg-card/70 p-4 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                      key={item.name}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                            <item.icon className="h-3.5 w-3.5" />
                          </div>
                          <code className="font-mono font-semibold text-sm">
                            {item.name}
                          </code>
                        </div>
                        {item.tag ? (
                          <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                            {item.tag}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {item.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
