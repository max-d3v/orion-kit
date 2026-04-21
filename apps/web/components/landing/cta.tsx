import { Button } from "@workspace/ui/components/button";
import { Github } from "lucide-react";
import { env } from "@/keys";

const docsUrl = env.NEXT_PUBLIC_DOCS_URL;

export function CTA() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0 hidden items-center justify-center opacity-30 dark:flex">
        <div className="h-[400px] w-[800px] rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="mb-6 text-balance font-bold text-4xl tracking-tight sm:text-5xl">
          Focus on your idea — Orion Kit handles the rest
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Clone the repo, point it at your services, and ship. Clean
          architecture, type safety, and production integrations all included.
        </p>

        <div className="relative flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <a href={docsUrl} rel="noopener" target="_blank">
              Get Started
            </a>
          </Button>
          <Button asChild className="gap-2" size="lg" variant="outline">
            <a
              href="https://github.com/Mumma6/orion-kit"
              rel="noopener"
              target="_blank"
            >
              <Github className="h-5 w-5" />
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
