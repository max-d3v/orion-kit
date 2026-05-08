import type { AuthUser } from "@workspace/types/use-cases/users";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { User as UserIcon } from "lucide-react";
import Image from "next/image";
import { EditProfileButton } from "./edit-profile-button";

interface SettingsProfileProps {
  readonly user: AuthUser;
}

export function SettingsProfile({ user }: SettingsProfileProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </div>
          <EditProfileButton user={user} />
        </div>
      </CardHeader>
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
            <Badge className="bg-green-500" variant="default">
              Active
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">
              Email Verified
            </span>
            <Badge
              className={user.emailVerified ? "bg-green-500" : "bg-red-500"}
              variant={user.emailVerified ? "default" : "destructive"}
            >
              {user.emailVerified ? "Yes" : "No"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
