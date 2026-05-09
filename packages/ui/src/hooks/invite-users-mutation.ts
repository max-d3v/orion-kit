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


async function inviteMultipleUsers({authClient, emails, role, fetchOptions}: {authClient: OrganizationClient, emails: string[], role: BaseOrganizationRoles, fetchOptions?: ClientFetchOption}) {
  const results = await Promise.allSettled(
    emails.map((email) =>
      authClient.organization.inviteMember({
        email,
        role,
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

    const summary = `Failed to invite ${failures.length} of ${emails.length}. ${detail}`

    throw Object.assign(new Error(summary), {
      status: 0,
      statusText: "PARTIAL_FAILURE",
      error: { message: summary, code: "PARTIAL_FAILURE" },
      failures
    })
  }

  return results.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : []
  )
}

function createInviteOptions(authClient: OrganizationClient) {
  const mutationKey = customMutationKeys.inviteUsers

  const mutationFn = (params: UserInvitationsParams) =>
    inviteMultipleUsers({authClient, ...params, fetchOptions: { ...params.fetchOptions, throw: true }})

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
 * Create a mutation for inviting users to the active organization.
 *
 * Wraps `authClient.organization.inviteMember` and forwards React Query
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

  const queryClient = useQueryClient()

  return useMutation({
    ...createInviteOptions(authClient),
    ...options,
    onSuccess: async (data, variables, ...rest) => {
      await queryClient.invalidateQueries({
        queryKey: customQueryKeys.organizationInvitations()
      })

      await options?.onSuccess?.(data, variables, ...rest)
    }
  })
}
