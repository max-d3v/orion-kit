import { AuthClient } from "@better-auth-ui/react"
import { mutationOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"
import {
  assertAuthClientHasOrganizationOrThrow,
  customQueryKeys,
  OrganizationClient
} from "../lib/utils"

export type RemoveMemberOptions = Omit<
  ReturnType<typeof removeMemberOptions>,
  "mutationKey" | "mutationFn"
>

type RemoveMemberParams = Parameters<
  OrganizationClient["organization"]["removeMember"]
>[0]

const mutationKey = ["removeMember"]

/**
 * Mutation options factory for removing a member from the active organization.
 */
export function removeMemberOptions(authClient: OrganizationClient) {
  const mutationFn = (params: RemoveMemberParams) =>
    authClient.organization.removeMember({
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
 * Create a mutation for removing a member from the active organization.
 *
 * Wraps `authClient.organization.removeMember` and invalidates the
 * organization members list so consumers reflect the removal.
 */
export function useRemoveMember(
  authClient: AuthClient,
  options?: RemoveMemberOptions
) {
  assertAuthClientHasOrganizationOrThrow(authClient)
  const queryClient = useQueryClient()

  return useMutation({
    ...removeMemberOptions(authClient),
    meta: { errorTitle: "Failed to remove member" },
    ...options,
    onSuccess: async (data, variables, ...rest) => {
      await queryClient.invalidateQueries({
        queryKey: customQueryKeys.organizationMembers()
      })

      await options?.onSuccess?.(data, variables, ...rest)
    }
  })
}
