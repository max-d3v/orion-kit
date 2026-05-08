import { AuthClient } from "@better-auth-ui/react"
import { assertAuthClientHasOrganizationOrThrow, customQueryKeys } from "../lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sessionOptions } from "@better-auth-ui/react"

/**
 * Mutation to set the active organization for the current session.
 *
 * Invalidates the session query so that consumers reading the active organization
 * see the updated value immediately.
 */
export function useSetActiveOrganization(authClient: AuthClient) {
  assertAuthClientHasOrganizationOrThrow(authClient)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (organizationId: string | null) => {
      return await authClient.organization.setActive({
        organizationId,
        fetchOptions: {
          throw: true
        }
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: sessionOptions(authClient).queryKey
      })
      await queryClient.invalidateQueries({
        queryKey: customQueryKeys.organizations()
      })
    }
  })
}
