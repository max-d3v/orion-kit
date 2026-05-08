import { getQueryClient } from "@workspace/data-layer/hydration";
import { orpc } from "@workspace/data-layer/orpc.tanstack";
import { CardContent } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Badge } from "lucide-react";
import Image from "next/image";

export async function ProfileContent() {
  const queryClient = getQueryClient();

  const user = await queryClient.fetchQuery(orpc.users.getUser.queryOptions());

  return (
    <CardContent className="space-y-4">
      <div className="flex items-center gap-4">
        {user.image && (
          <Image
            alt={user.name || "User"}
            className="h-16 w-16 rounded-full border-2 border-primary/20"
            height={64}
            src={user.image}
            width={64}
          />
        )}
        <div>
          <div className="font-semibold text-lg">{user.name || "User"}</div>
          <div className="text-muted-foreground text-sm">{user.email}</div>
        </div>
      </div>
      <Separator />
      <div className="grid gap-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">User ID</span>
          <span className="text-sm">{user.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">Member since</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">Status</span>
          <Badge className="bg-green-500">Active</Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">Email Verified</span>
          <Badge className={user.emailVerified ? "bg-green-500" : "bg-red-500"}>
            {user.emailVerified ? "Yes" : "No"}
          </Badge>
        </div>
      </div>
    </CardContent>
  );
}
