import { AuthClient } from "@better-auth-ui/react"
import { mutationOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"
import type { ClientFetchOption } from "better-auth"
import {
  assertAuthClientHasOrganizationOrThrow,
  type BaseOrganizationRoles,
  customQueryKeys,
  OrganizationClient
} from "../lib/utils"

export type ResendInvitationOptions = Omit<
  ReturnType<typeof resendInvitationOptions>,
  "mutationKey" | "mutationFn"
>

type ResendInvitationParams = {
  email: string
  role: BaseOrganizationRoles
  fetchOptions?: ClientFetchOption
}

const mutationKey = ["resendInvitation"]

/**
 * Mutation options factory for resending an invitation.
 *
 * Better Auth has no dedicated resend endpoint — `inviteMember` with
 * `resend: true` re-sends the email for the existing pending invitation.
 */
export function resendInvitationOptions(authClient: OrganizationClient) {
  const mutationFn = (params: ResendInvitationParams) =>
    authClient.organization.inviteMember({
      email: params.email,
      role: params.role,
      resend: true,
      fetchOptions: { ...params.fetchOptions, throw: true }
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
 * Create a mutation for resending an invitation email.
 *
 * Wraps `authClient.organization.inviteMember` with `resend: true` and
 * invalidates the organization invitations list so consumers reflect any
 * updated timestamps.
 */
export function useResendInvitation(
  authClient: AuthClient,
  options?: ResendInvitationOptions
) {
  assertAuthClientHasOrganizationOrThrow(authClient)
  const queryClient = useQueryClient()

  return useMutation({
    ...resendInvitationOptions(authClient),
    ...options,
    onSuccess: async (data, variables, ...rest) => {
      await queryClient.invalidateQueries({
        queryKey: customQueryKeys.organizationInvitations()
      })

      await options?.onSuccess?.(data, variables, ...rest)
    }
  })
}
