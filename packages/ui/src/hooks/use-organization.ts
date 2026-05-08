import { AuthClient } from "@better-auth-ui/react"
import { assertAuthClientHasOrganizationOrThrow, customQueryKeys } from "../lib/utils"
import { useQuery } from "@tanstack/react-query"

/**
 * Query the members for a given organization.
 *
 * When `organizationId` is undefined, the query is disabled and returns no data,
 * letting consumers render gracefully without an active organization.
 */
export function useOrganizationMembers(authClient: AuthClient, organizationId: string | undefined) {
  assertAuthClientHasOrganizationOrThrow(authClient)

  return useQuery({
    queryKey: customQueryKeys.organizationMembers(organizationId),
    enabled: !!organizationId,
    queryFn: async () => {
      const { members } = await authClient.organization.listMembers({
        query: {
          organizationId: organizationId as string
        },
        fetchOptions: {
          throw: true
        }
      })

      return members
    }
  })
}
