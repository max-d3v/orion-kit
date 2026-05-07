import { assertAuthClientHasOrganizationOrThrow, BaseOrganizationRoles, customMutationKeys, customQueryKeys } from "@workspace/ui/lib/utils"
import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import { useSession, AuthClient } from "@better-auth-ui/react"
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


function inviteMultipleUsers({authClient, emails, role, orgId, fetchOptions}: {authClient: OrganizationClient, emails: string[], role: BaseOrganizationRoles, orgId: string, fetchOptions?: ClientFetchOption}) {
  return Promise.all(
    emails.map((email) =>
      authClient.organization.inviteMember({
        email,
        role,
        organizationId: orgId,
        fetchOptions,
        resend: true
      })
    )
  )
}

function createInviteOptions(authClient: OrganizationClient, orgId: string) {
  const mutationKey = customMutationKeys.inviteUsers

  const mutationFn = (params: UserInvitationsParams) => inviteMultipleUsers({authClient, orgId, ...params, fetchOptions: { ...params.fetchOptions, throw: true }})
  
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
 * Create a mutation for inviting users to active organization.
 *
 * Wraps `authClient.organization.inviteMember`, optimistically patches the cached session
 * Forwards React Query
 * mutation options such as `onSuccess`, `onError`, and `retry`.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useInviteUsers(
  authClient: AuthClient,
  options?: InviteUsersOptions
) {
    assertAuthClientHasOrganizationOrThrow(authClient)

  const { data: session } = useSession(authClient, {
    refetchOnMount: false
  })

  const orgId = session?.session.activeOrganizationId

  if (!orgId) throw new Error("No active organization found in session. An active organization is required to invite users.")

  const queryClient = useQueryClient()

  return useMutation({
    ...createInviteOptions(authClient, orgId),
    ...options,
    onSuccess: async (data, variables, ...rest) => {
      queryClient.setQueryData(
        customQueryKeys.organizationMembers(orgId),
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