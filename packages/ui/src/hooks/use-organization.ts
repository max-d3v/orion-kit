import { AuthClient } from "@better-auth-ui/react"
import { assertAuthClientHasOrganizationOrThrow } from "../lib/utils"
import { useQuery } from "@tanstack/react-query"

export function useActiveOrganizationMembers(authClient: AuthClient) {
  assertAuthClientHasOrganizationOrThrow(authClient)

  const { data: activeOrganization } = authClient.useActiveOrganization()

  return useQuery({
    queryKey: ["organization", "members", activeOrganization?.id],
    enabled: !!activeOrganization,
    queryFn: async () => {
      if (!activeOrganization) {
        throw new Error("No active organization found.")
      }

      const response = await authClient.organization.listMembers({
        query: {
          organizationId: activeOrganization.id
        }
      })

      if (response.error) {
        throw new Error(response.error.message ?? "Failed to load members.")
      }

      return response.data
    }
  })
}
