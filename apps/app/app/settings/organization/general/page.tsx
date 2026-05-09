import { auth } from "@workspace/auth/auth";
import { getQueryClient } from "@workspace/data-layer/hydration";
import { OrganizationGeneral } from "@workspace/ui/components/auth/custom/organization-general";
import {
  activeMemberRoleOptions,
  activeOrganizationOptions,
} from "@workspace/ui/hooks/server/organization";

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(activeOrganizationOptions(auth));
  void queryClient.prefetchQuery(activeMemberRoleOptions(auth));

  return <OrganizationGeneral />;
}
