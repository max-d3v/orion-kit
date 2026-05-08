import { queryOptions } from "@tanstack/react-query"
import { customQueryKeys } from "@workspace/ui/lib/utils"
import { assertAuthHasOrganizationOrThrow } from "@workspace/ui/lib/utils"
import { headers } from "next/headers"
import type { Auth } from "better-auth";

// biome-ignore lint/suspicious/noExplicitAny: Auth's Options generic is invariant; widen to accept any concrete auth instance.
export const organizationInvitationsOptions = <T extends Auth<any>>(auth: T, organizationId: string) => {
    assertAuthHasOrganizationOrThrow(auth)
    return queryOptions({
        queryKey: customQueryKeys.organizationInvitations(organizationId),
        queryFn: async () => auth.api.listInvitations({
            query: { organizationId },
            headers: await headers()
        })
    })
}

// biome-ignore lint/suspicious/noExplicitAny: Auth's Options generic is invariant; widen to accept any concrete auth instance.
export const organizationMembersOptions = <T extends Auth<any>>(auth: T, organizationId: string) => {
    assertAuthHasOrganizationOrThrow(auth)
    return queryOptions({
        queryKey: customQueryKeys.organizationMembers(organizationId),
        queryFn: async () => auth.api.listMembers({
            query: { organizationId },
            headers: await headers()
        })
    })
} 