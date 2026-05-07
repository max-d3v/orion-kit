import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AuthClient } from "@better-auth-ui/react"
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type OrganizationClient = ReturnType<typeof createAuthClient<{
    plugins: [ReturnType<typeof organizationClient<{}>>];
}>>;

export type BaseOrganizationRoles = "member" | "admin" | "owner"  

export const customMutationKeys = {
    createOrganization: ["createOrganization"],
    inviteUsers: ["inviteUsers"],
    updateOrganization: ["updateOrganization"]
}

export const customQueryKeys = {
    organizationMembers: (organizationId?: string) => ["organization", "members", organizationId],
    organizationInvitations: (organizationId?: string) => ["organization", "invitations", organizationId]
}

export function authClientHasOrganizationPlugin(authClient: AuthClient): authClient is OrganizationClient {
    return "organization" in authClient
}

export function assertAuthClientHasOrganizationOrThrow(authClient: AuthClient): asserts authClient is OrganizationClient {
    if (!authClientHasOrganizationPlugin(authClient)) {
        throw new Error("The provided authClient does not have the organization plugin. Please ensure your auth client is created with the organization plugin from better-auth/client/plugins.")
    }
}