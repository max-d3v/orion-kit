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


async function inviteMultipleUsers({authClient, emails, role, organizationId, fetchOptions}: {authClient: OrganizationClient, emails: string[], role: BaseOrganizationRoles, organizationId: string, fetchOptions?: ClientFetchOption}) {
  const results = await Promise.allSettled(
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

  const failures = results
    .map((result, index) => ({ result, email: emails[index] }))
    .filter(({ result }) => result.status === "rejected") as Array<{
      result: PromiseRejectedResult
      email: string
    }>

  if (failures.length > 0) {
    if (typeof window !== "undefined") {
      console.error("inviteMember failures", failures.map(({ email, result }) => ({ email, reason: result.reason })))
    }

    const detail = failures
      .map(({ email, result }) => {
        const reason = result.reason as BetterFetchError | undefined
        const message =
          (reason?.error as { message?: string } | undefined)?.message ??
          (reason?.error as { code?: string } | undefined)?.code ??
          reason?.statusText ??
          reason?.message ??
          "Unknown error"
        return `${email}: ${message}`
      })
      .join("; ")

    throw Object.assign(new Error(`Failed to invite ${failures.length} of ${emails.length}. ${detail}`), {
      status: 0,
      statusText: "PARTIAL_FAILURE",
      failures
    })
  }

  return results.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : []
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
      await queryClient.invalidateQueries({
        queryKey: customQueryKeys.organizationInvitations(organizationId)
      })

      await options?.onSuccess?.(data, variables, ...rest)
    }
  })
}
