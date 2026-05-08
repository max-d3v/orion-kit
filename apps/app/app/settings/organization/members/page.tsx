import { auth } from "@workspace/auth/auth";
import { getQueryClient } from "@workspace/data-layer/hydration";
import { Members } from "@workspace/ui/components/auth/custom/members";
import {
  organizationInvitationsOptions,
  organizationMembersOptions,
} from "@workspace/ui/hooks/server/organization";
import { headers } from "next/headers";

export default async function Page() {
  const queryClient = getQueryClient();
  const session = await auth.api.getSession({ headers: await headers() });
  const organizationId = session?.session.activeOrganizationId;

  if (organizationId) {
    void queryClient.prefetchQuery(
      organizationInvitationsOptions(auth, organizationId)
    );

    void queryClient.prefetchQuery(
      organizationMembersOptions(auth, organizationId)
    );
  }

  return <Members />;
}
