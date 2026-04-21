import { env } from "@/keys";

const docsUrl = env.NEXT_PUBLIC_DOCS_URL;
const repoUrl = "https://github.com/Mumma6/orion-kit";

export function Footer() {
  const links = [
    { label: "Docs", href: docsUrl ?? repoUrl, external: true },
    { label: "GitHub", href: repoUrl, external: true },
    {
      label: "License",
      href: `${repoUrl}/blob/main/LICENSE`,
      external: true,
    },
  ];

  return (
    <footer className="relative border-border/50 border-t py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © 2025 Orion Kit. Open source under MIT License.
          </p>
          <div className="flex gap-6 text-muted-foreground text-sm">
            {links.map((link) => (
              <a
                className="transition-colors hover:text-foreground"
                href={link.href}
                key={link.label}
                rel={link.external ? "noopener" : undefined}
                target={link.external ? "_blank" : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
