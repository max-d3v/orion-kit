import { Button } from "@workspace/ui/components/button";
import { OrionLogo } from "@workspace/ui/components/orion-logo";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { env } from "@/keys";

const linkUrl = env.NEXT_PUBLIC_LINK_URL;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link className="transition-opacity hover:opacity-80" href="/">
          <OrionLogo size="sm" />
        </Link>
        <div className="flex items-center gap-3">
          <Link href={linkUrl}>
            <Button size="sm">Dashboard</Button>
          </Link>
          <Link href={`${linkUrl}/login`}>
            <Button size="sm" variant="secondary">
              Sign In
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
