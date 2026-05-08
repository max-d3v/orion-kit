"use client";

import { useAuth } from "@better-auth-ui/react";
import { OrganizationInvitations } from "@workspace/ui/components/auth/custom/organization-invitations";
import { OrganizationMembers } from "@workspace/ui/components/auth/custom/organization-members";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { useOrganizationInvitations } from "@workspace/ui/hooks/use-invites";
import {
  assertAuthClientHasOrganizationOrThrow,
  cn,
} from "@workspace/ui/lib/utils";
import { Building2 } from "lucide-react";

export type MembersProps = {
  className?: string;
};

export function Members({ className }: MembersProps) {
  const { authClient, Link } = useAuth();
  assertAuthClientHasOrganizationOrThrow(authClient);

  const { data: activeOrganization } = authClient.useActiveOrganization();
  const organizationId = activeOrganization?.id;

  const { data: invitations } = useOrganizationInvitations(
    authClient,
    organizationId
  );

  const activeInvitationsCount =
    invitations?.filter((invitation) => invitation.status === "pending")
      .length ?? 0;

  if (!organizationId) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <h1 className="font-bold text-3xl">Members</h1>

        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Building2 className="size-5 text-muted-foreground" />
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-medium">No active organization</p>
              <p className="text-muted-foreground text-sm">
                Create an organization to invite members and collaborate.
              </p>
            </div>

            <Button asChild size="sm">
              <Link href="/auth/onboarding">Create organization</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <OrganizationMembers organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="invitations">
          <OrganizationInvitations organizationId={organizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
