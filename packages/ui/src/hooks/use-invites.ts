import { AuthClient } from "@better-auth-ui/react"
import { assertAuthClientHasOrganizationOrThrow, customQueryKeys } from "../lib/utils"
import { useQuery } from "@tanstack/react-query"


/**
 * Query the invitations of the active organization.
 *
 * Auth resolves the organization from the session, so callers don't pass an ID.
 * Shares the query key with `organizationInvitationsOptions` for SSR hydration.
 */
export function useOrganizationInvitations(authClient: AuthClient) {
  assertAuthClientHasOrganizationOrThrow(authClient)

  return useQuery({
    queryKey: customQueryKeys.organizationInvitations(),
    queryFn: async () => {
      return await authClient.organization.listInvitations({
        fetchOptions: {
            throw: true
        }
      })
    }
  })
}
