import { AuthClient } from "@better-auth-ui/react"
import { assertAuthClientHasOrganizationOrThrow, customQueryKeys } from "../lib/utils"
import { useQuery } from "@tanstack/react-query"


/**
 * Query the invitations for a given organization.
 *
 * Shares query key with the server-side "organizationInvitationsOptions",
 * so SSR-prefetched results hydrate seamlessly. When `organizationId` is
 * undefined, the query is disabled.
 */
export function useOrganizationInvitations(authClient: AuthClient, organizationId: string | undefined) {
  assertAuthClientHasOrganizationOrThrow(authClient)

  return useQuery({
    queryKey: customQueryKeys.organizationInvitations(organizationId),
    enabled: !!organizationId,
    queryFn: async () => {
      return await authClient.organization.listInvitations({
        query: {
          organizationId: organizationId as string
        },
        fetchOptions: {
            throw: true
        }
      })
    }
  })
}
