import { AuthClient } from "@better-auth-ui/react"
import { assertAuthClientHasOrganizationOrThrow, customQueryKeys } from "../lib/utils"
import { useQuery } from "@tanstack/react-query"

/**
 * Query the members of the active organization.
 *
 * Auth resolves the organization from the session, so callers don't pass an ID.
 * Shares the query key with `organizationMembersOptions` for SSR hydration.
 */
export function useOrganizationMembers(authClient: AuthClient) {
  assertAuthClientHasOrganizationOrThrow(authClient)

  return useQuery({
    queryKey: customQueryKeys.organizationMembers(),
    queryFn: async () => {
      const { members } = await authClient.organization.listMembers({
        fetchOptions: {
          throw: true
        }
      })

      return members
    }
  })
}
