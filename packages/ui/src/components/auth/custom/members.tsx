"use client";

import { useAuth } from "@better-auth-ui/react";
import { OrganizationInvitations } from "@workspace/ui/components/auth/custom/organization-invitations";
import { OrganizationMembers } from "@workspace/ui/components/auth/custom/organization-members";
import { Badge } from "@workspace/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { useActiveOrganizationInvitations } from "@workspace/ui/hooks/use-invites";
import { cn } from "@workspace/ui/lib/utils";

export type MembersProps = {
  className?: string;
};

export function Members({ className }: MembersProps) {
  const { authClient } = useAuth();
  const { data: invitations } = useActiveOrganizationInvitations(authClient);

  const activeInvitationsCount =
    invitations?.filter((invitation) => invitation.status === "pending")
      .length ?? 0;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <h1 className="font-bold text-3xl">Members</h1>

      <Tabs className="gap-6" defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">
            Invitations
            {activeInvitationsCount > 0 && (
              <Badge className="ml-1 h-5 px-1.5" variant="secondary">
                {activeInvitationsCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <OrganizationMembers />
        </TabsContent>

        <TabsContent value="invitations">
          <OrganizationInvitations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
