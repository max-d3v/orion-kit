import { auth } from "@workspace/auth/auth";
import { Rocket } from "lucide-react";
import { headers } from "next/headers";

export async function DashboardWelcome() {
  const data = await auth.api.getSession({
    headers: await headers(), // pass the request headers
  });

  const name = data?.user.name;

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-6">
      <div className="rounded-2xl bg-primary p-3">
        <Rocket className="h-8 w-8 text-primary-foreground" />
      </div>
      <div>
        <h2 className="font-bold text-2xl">Welcome back, {name}!</h2>
        <p className="text-muted-foreground">
          Ready to manage your tasks and projects
        </p>
      </div>
    </div>
  );
}
