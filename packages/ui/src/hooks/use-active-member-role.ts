import { AuthClient } from "@better-auth-ui/react"
import { useQuery } from "@tanstack/react-query"
import { assertAuthClientHasOrganizationOrThrow, customQueryKeys } from "../lib/utils"

/**
 * Query the current user's role in the active organization.
 *
 * Cached under `["organizations", "active", "member-role"]` so it's
 * refetched whenever any organization-scoped invalidation runs.
 */
export function useActiveMemberRole(authClient: AuthClient) {
  assertAuthClientHasOrganizationOrThrow(authClient)

  return useQuery({
    queryKey: customQueryKeys.activeMemberRole(),
    queryFn: async () => {
      const result = await authClient.organization.getActiveMemberRole({
        fetchOptions: { throw: true }
      })
      return result?.role ?? null
    },
    retry: false
  })
}
