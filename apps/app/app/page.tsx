import { Button } from "@workspace/ui/components/button";
import { OrionLogo } from "@workspace/ui/components/orion-logo";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export default function RootPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="mb-8 flex flex-col items-center gap-4">
        <OrionLogo size="lg" />
        <h1 className="text-center font-bold text-4xl">Welcome to Orion Kit</h1>
        <p className="max-w-md text-center text-lg text-muted-foreground">
          A modern, full-stack development kit built with Next.js, TypeScript,
          Tailwind CSS and modern cloud services.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline">Sign Up</Button>
        </Link>
      </div>

      <div className="mt-8 text-center text-muted-foreground text-sm">
        <p>Built with modern technologies and best practices</p>
      </div>
    </div>
  );
}
