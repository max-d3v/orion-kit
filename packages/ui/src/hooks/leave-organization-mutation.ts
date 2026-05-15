import { assertAuthClientHasOrganizationOrThrow, customQueryKeys } from "@workspace/ui/lib/utils"
import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"
import { sessionOptions, AuthClient } from "@better-auth-ui/react"
import { OrganizationClient } from "../lib/utils"


export type LeaveOrganizationOptions = Omit<
  ReturnType<typeof leaveOrganizationOptions>,
  "mutationKey" | "mutationFn"
>

type LeaveOrganizationParams = Parameters<OrganizationClient["organization"]["leave"]>[0]

const mutationKey = ["leaveOrganization"]

/**
 * Mutation options factory for leaving an organization.
 *
 * @param authClient - The Better Auth client.
 */
export function leaveOrganizationOptions(
  authClient: OrganizationClient
) {
  const mutationFn = (params: LeaveOrganizationParams) =>
    authClient.organization.leave({
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
 * Create a mutation for leaving an organization.
 *
 * Wraps `authClient.organization.leave` and invalidates the cached session and
 * organizations list so downstream consumers reflect the user's new membership state.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useLeaveOrganization(
  authClient: AuthClient,
  options?: LeaveOrganizationOptions
) {
  assertAuthClientHasOrganizationOrThrow(authClient)

  const queryClient = useQueryClient()

  return useMutation({
    ...leaveOrganizationOptions(authClient),
    meta: { errorTitle: "Failed to leave organization" },
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
