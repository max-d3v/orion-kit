import { assertAuthClientHasOrganizationOrThrow, customMutationKeys } from "@workspace/ui/lib/utils"
import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"
import { useSession, sessionOptions, AuthClient } from "@better-auth-ui/react"
import { OrganizationClient } from "../lib/utils"



export type UpdateOrganizationOptions = Omit<
  ReturnType<typeof createOrganizationOptions>,
  "mutationKey" | "mutationFn"
>

type UpdateOrganizationParams = Parameters<OrganizationClient["organization"]["update"]>[0]


/**
 * Mutation options factory for updating the authenticated user's profile.
 *
 * @param authClient - The Better Auth client.
 */
export function createOrganizationOptions(
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
 * Create a mutation for creating a organization.
 *
 * Wraps `authClient.organization.create`, optimistically patches the cached session
 * with the new fields, refetches the session, and forwards React Query
 * mutation options such as `onSuccess`, `onError`, and `retry`.
 *
 * @param authClient - The Better Auth client.
 * @param options - React Query options forwarded to `useMutation`.
 */
export function useCreateOrganization(
  authClient: AuthClient,
  options?: UpdateOrganizationOptions
) {

    assertAuthClientHasOrganizationOrThrow(authClient)

  const { data: session, refetch: refetchSession } = useSession(authClient, {
    refetchOnMount: false
  }) 

  const queryClient = useQueryClient()

  return useMutation({
    ...createOrganizationOptions(authClient),
    ...options,
    onSuccess: async (data, variables, ...rest) => {

      if (session) {
        queryClient.setQueryData(sessionOptions(authClient).queryKey, {
          ...session,
          session: { ...session.session, activeOrganizationId: data.id }
        })
      }

      refetchSession()

      await options?.onSuccess?.(data, variables, ...rest)
    }
  })
}
