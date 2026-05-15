import { AuthClient } from "@better-auth-ui/react"
import { mutationOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"
import {
  assertAuthClientHasOrganizationOrThrow,
  customQueryKeys,
  OrganizationClient
} from "../lib/utils"

export type UpdateMemberRoleOptions = Omit<
  ReturnType<typeof updateMemberRoleOptions>,
  "mutationKey" | "mutationFn"
>

type UpdateMemberRoleParams = Parameters<
  OrganizationClient["organization"]["updateMemberRole"]
>[0]

const mutationKey = ["updateMemberRole"]

/**
 * Mutation options factory for updating a member's role.
 */
export function updateMemberRoleOptions(authClient: OrganizationClient) {
  const mutationFn = (params: UpdateMemberRoleParams) =>
    authClient.organization.updateMemberRole({
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
 * Create a mutation for updating a member's role in the active organization.
 *
 * Wraps `authClient.organization.updateMemberRole` and invalidates the
 * organization members list so consumers reflect the new role.
 */
export function useUpdateMemberRole(
  authClient: AuthClient,
  options?: UpdateMemberRoleOptions
) {
  assertAuthClientHasOrganizationOrThrow(authClient)
  const queryClient = useQueryClient()

  return useMutation({
    ...updateMemberRoleOptions(authClient),
    meta: { errorTitle: "Failed to update member role" },
    ...options,
    onSuccess: async (data, variables, ...rest) => {
      await queryClient.invalidateQueries({
        queryKey: customQueryKeys.organizationMembers()
      })

      await options?.onSuccess?.(data, variables, ...rest)
    }
  })
}
