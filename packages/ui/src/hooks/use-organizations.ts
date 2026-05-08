import { AuthClient } from "@better-auth-ui/react"
import { useQuery } from "@tanstack/react-query"
import type { Organization } from "better-auth/client/plugins"
import { assertAuthClientHasOrganizationOrThrow, customQueryKeys } from "../lib/utils"

/**
 * Query all organizations for the current user.
 */
export function useOrganizations(authClient: AuthClient) {
  assertAuthClientHasOrganizationOrThrow(authClient)

  return useQuery({
    queryKey: customQueryKeys.organizations(),
    queryFn: async (): Promise<Organization[]> => {
      return await authClient.organization.list({
        fetchOptions: {
          throw: true
        }
      })
    } 
  })
}
