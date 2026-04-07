import { Rocket } from "lucide-react";
import { auth } from "@workspace/auth/server";
import { useMemo } from "react";


export async function DashboardWelcome() {
  const { sessionClaims } = await auth();

  if (!sessionClaims?.full_name) {
    throw new Error("Full name is required in clerk's session claims");
  }

  const name = useMemo(() => sessionClaims?.full_name as string, [sessionClaims]);

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
