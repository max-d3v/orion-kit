import { viewPaths } from "@better-auth-ui/core";

export const customViewPaths = {
    ...viewPaths,
    auth: {
        ...viewPaths.auth,
        onboarding: "onboarding",
        listOrganizations: "list-organizations",
        createOrganization: "create-organization"
    }
}