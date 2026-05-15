import { assertAuthClientHasOrganizationOrThrow, customQueryKeys } from "@workspace/ui/lib/utils"
import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"
import { sessionOptions, AuthClient } from "@better-auth-ui/react"
import { OrganizationClient } from "../lib/utils"


export type DeleteOrganizationOptions = Omit<
  ReturnType<typeof deleteOrganizationOptions>,
  "mutationKey" | "mutationFn"
>

type DeleteOrganizationParams = Parameters<OrganizationClient["organization"]["delete"]>[0]

const mutationKey = ["deleteOrganization"]




/**
 * Mutation options factory for deleting an organization.
 *
 * @param authClient - The Better Auth client.
 */
export function deleteOrganizationOptions(
  authClient: OrganizationClient
) {
  const mutationFn = (params: DeleteOrganizationParams) =>
      

    authClient.organization.delete({
      ...params,
      fetchOptions: { ...params?.fetchOptions, throw: true }
    })

  return mutationOptions<
    Awaited<ReturnType<typeof mutationFn>>,
    BetterFetchError,
    Parameters<typeof mutationFn>[0]
  >({
    mutationKey,
    mutationFn
  })
}

/**
 * Create a mutation for deleting an organization.
 *
 * Wraps `authClient.organization.delete` and invalidates the cached session and
 * organizations list so downstream consumers reflect the deleted organization.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useDeleteOrganization(
  authClient: AuthClient,
  options?: DeleteOrganizationOptions
) {
  assertAuthClientHasOrganizationOrThrow(authClient)

  const queryClient = useQueryClient()

  return useMutation({
    ...deleteOrganizationOptions(authClient),
    meta: { errorTitle: "Failed to delete organization" },
    ...options,
    onSuccess: async (data, variables, ...rest) => {
      await queryClient.invalidateQueries({
        queryKey: sessionOptions(authClient).queryKey
      })

      await queryClient.invalidateQueries({
        queryKey: customQueryKeys.organizations()
      })

      await options?.onSuccess?.(data, variables, ...rest)
    }
  })
}
