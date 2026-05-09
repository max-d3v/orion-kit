import { queryOptions } from "@tanstack/react-query"
import { customQueryKeys } from "@workspace/ui/lib/utils"
import { assertAuthHasOrganizationOrThrow } from "@workspace/ui/lib/utils"
import { headers } from "next/headers"
import type { Auth } from "better-auth";

// biome-ignore lint/suspicious/noExplicitAny: Auth's Options generic is invariant; widen to accept any concrete auth instance.
export const organizationInvitationsOptions = <T extends Auth<any>>(auth: T) => {
    assertAuthHasOrganizationOrThrow(auth)
    return queryOptions({
        queryKey: customQueryKeys.organizationInvitations(),
        queryFn: async () => auth.api.listInvitations({
            headers: await headers()
        })
    })
}

// biome-ignore lint/suspicious/noExplicitAny: Auth's Options generic is invariant; widen to accept any concrete auth instance.
export const organizationMembersOptions = <T extends Auth<any>>(auth: T) => {
    assertAuthHasOrganizationOrThrow(auth)
    return queryOptions({
        queryKey: customQueryKeys.organizationMembers(),
        queryFn: async () => auth.api.listMembers({
            headers: await headers()
        })
    })
}

// biome-ignore lint/suspicious/noExplicitAny: Auth's Options generic is invariant; widen to accept any concrete auth instance.
export const activeOrganizationOptions = <T extends Auth<any>>(auth: T) => {
    assertAuthHasOrganizationOrThrow(auth)
    return queryOptions({
        queryKey: customQueryKeys.activeOrganization(),
        queryFn: async () => auth.api.getFullOrganization({
            headers: await headers()
        })
    })
}

// biome-ignore lint/suspicious/noExplicitAny: Auth's Options generic is invariant; widen to accept any concrete auth instance.
export const activeMemberRoleOptions = <T extends Auth<any>>(auth: T) => {
    assertAuthHasOrganizationOrThrow(auth)
    return queryOptions({
        queryKey: customQueryKeys.activeMemberRole(),
        queryFn: async () => {
            const result = await auth.api.getActiveMemberRole({
                headers: await headers()
            })
            return result?.role ?? null
        }
    })
}

export const organizationListOptions = <T extends Auth<any>>(auth: T) => {
    assertAuthHasOrganizationOrThrow(auth)
    return queryOptions({
        queryKey: customQueryKeys.organizations(),
        queryFn: async () => 
            auth.api.listOrganizations({
                headers: await headers()
            })
    })
}