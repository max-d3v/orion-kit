import { assertAuthClientHasOrganizationOrThrow, customMutationKeys } from "@workspace/ui/lib/utils"
import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"
import { sessionOptions, AuthClient } from "@better-auth-ui/react"
import { OrganizationClient } from "../lib/utils"


export type UpdateOrganizationOptions = Omit<
  ReturnType<typeof updateOrganizationOptions>,
  "mutationKey" | "mutationFn"
>

type UpdateOrganizationParams = Parameters<OrganizationClient["organization"]["update"]>[0]


/**
 * Mutation options factory for updating an organization.
 *
 * @param authClient - The Better Auth client.
 */
export function updateOrganizationOptions(
  authClient: OrganizationClient
) {
  const mutationKey = customMutationKeys.updateOrganization

  const mutationFn = (params: UpdateOrganizationParams) =>
    authClient.organization.update({
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
 * Create a mutation for updating an organization.
 *
 * Wraps `authClient.organization.update` and invalidates the cached session so
 * downstream consumers see fresh organization data.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useUpdateOrganization(
  authClient: AuthClient,
  options?: UpdateOrganizationOptions
) {
  assertAuthClientHasOrganizationOrThrow(authClient)

  const queryClient = useQueryClient()

  return useMutation({
    ...updateOrganizationOptions(authClient),
    ...options,
    onSuccess: async (data, variables, ...rest) => {
      await queryClient.invalidateQueries({
        queryKey: sessionOptions(authClient).queryKey
      })

      await options?.onSuccess?.(data, variables, ...rest)
    }
  })
}
