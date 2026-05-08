import { assertAuthClientHasOrganizationOrThrow, BaseOrganizationRoles, customMutationKeys, customQueryKeys } from "@workspace/ui/lib/utils"
import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import { AuthClient } from "@better-auth-ui/react"
import { OrganizationClient } from "../lib/utils"
import { BetterFetchError } from "better-auth/client"
import { ClientFetchOption } from "better-auth"



export type InviteUsersOptions = Omit<
  ReturnType<typeof createInviteOptions>,
  "mutationKey" | "mutationFn"
>

type UserInvitationsParams = {
  emails: string[]
  role: BaseOrganizationRoles
  fetchOptions?: ClientFetchOption
}


function inviteMultipleUsers({authClient, emails, role, organizationId, fetchOptions}: {authClient: OrganizationClient, emails: string[], role: BaseOrganizationRoles, organizationId: string, fetchOptions?: ClientFetchOption}) {
  return Promise.all(
    emails.map((email) =>
      authClient.organization.inviteMember({
        email,
        role,
        organizationId,
        fetchOptions,
        resend: true
      })
    )
  )
}

function createInviteOptions(authClient: OrganizationClient, organizationId: string | undefined) {
  const mutationKey = customMutationKeys.inviteUsers

  const mutationFn = (params: UserInvitationsParams) => {
    if (!organizationId) {
      throw new Error("organizationId is required to invite users.")
    }
    return inviteMultipleUsers({authClient, organizationId, ...params, fetchOptions: { ...params.fetchOptions, throw: true }})
  }

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
 * Create a mutation for inviting users to a specific organization.
 *
 * Wraps `authClient.organization.inviteMember` and forwards React Query
 * mutation options such as `onSuccess`, `onError`, and `retry`.
 *
 * @param authClient - The Better Auth client.
 * @param organizationId - The organization to invite users to. When undefined, calling `mutate` will throw.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useInviteUsers(
  authClient: AuthClient,
  organizationId: string | undefined,
  options?: InviteUsersOptions
) {
  assertAuthClientHasOrganizationOrThrow(authClient)

  const queryClient = useQueryClient()

  return useMutation({
    ...createInviteOptions(authClient, organizationId),
    ...options,
    onSuccess: async (data, variables, ...rest) => {
      queryClient.setQueryData(
        customQueryKeys.organizationMembers(organizationId),
        (oldData: any) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            members: [...oldData.members, data]
          }
        }
      )
    }
  })
}
