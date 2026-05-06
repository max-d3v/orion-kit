import { customMutationKeys } from "./utils"
import {
  mutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"
import { useSession, sessionOptions, AuthClient } from "@better-auth-ui/react"
import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"


type OrganizationClient = ReturnType<typeof createAuthClient<{
    plugins: [ReturnType<typeof organizationClient<{}>>];
}>>;

export type CreateOrganizationOptions = Omit<
  ReturnType<typeof createOrganizationOptions>,
  "mutationKey" | "mutationFn"
>

type CreateOrganizationParams = Parameters<OrganizationClient["organization"]["create"]>[0]


/**
 * Mutation options factory for updating the authenticated user's profile.
 *
 * @param authClient - The Better Auth client.
 */
export function createOrganizationOptions(
  authClient: OrganizationClient
) {
  const mutationKey = customMutationKeys.createOrganization

  const mutationFn = (params: CreateOrganizationParams) =>
    authClient.organization.create({
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


function authClientHasOrganizationPlugin(authClient: AuthClient): authClient is OrganizationClient {
    return "organization" in authClient
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
  options?: CreateOrganizationOptions
) {

    if (!authClientHasOrganizationPlugin(authClient)) {
        throw new Error("The provided authClient does not have the organization plugin. Please ensure your auth client is created with the organization plugin from better-auth/client/plugins.")
    }

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
