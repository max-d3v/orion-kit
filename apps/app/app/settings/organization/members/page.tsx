import { auth } from "@workspace/auth/auth";
import { getQueryClient } from "@workspace/data-layer/hydration";
import { Members } from "@workspace/ui/components/auth/custom/members";
import {
  organizationInvitationsOptions,
  organizationMembersOptions,
} from "@workspace/ui/hooks/server/organization";

export default function Page() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(organizationInvitationsOptions(auth));
  void queryClient.prefetchQuery(organizationMembersOptions(auth));

  return <Members />;
}
