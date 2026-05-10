"use client";

import { customViewPaths } from "@workspace/ui/hooks/custom-view-paths"; 
import type { AuthView } from "@better-auth-ui/react/core";

import { ForgotPassword } from "@workspace/ui/components/auth/forgot-password";
import { MagicLink } from "@workspace/ui/components/auth/magic-link";
import type { SocialLayout } from "@workspace/ui/components/auth/provider-buttons";
import { ResetPassword } from "@workspace/ui/components/auth/reset-password";
import { SignIn } from "@workspace/ui/components/auth/sign-in";
import { SignOut } from "@workspace/ui/components/auth/sign-out";
import { SignUp } from "@workspace/ui/components/auth/sign-up";
import { Organization } from "better-auth/client";
import { Onboarding } from "./onboarding";
import { CreateOrganization } from "./create-organization";
import { OrganizationList } from "./organization-list";

export type AuthProps = {
  className?: string;
  path?: string;
  socialLayout?: SocialLayout;
  socialPosition?: "top" | "bottom";
  /** @remarks `AuthView` */
  view?: AuthView;
};

/**
 * Render the selected authentication view component.
 *
 * The view is determined by the explicit `view` prop or, if absent, resolved from `path` using the application's auth view paths.
 *
 * @param path - Route path used to resolve an auth view when `view` is not provided
 * @param socialLayout - Social layout to apply to the component
 * @param socialPosition - Social position to apply to the component
 * @param view - Explicit auth view to render (e.g., "signIn", "signUp")
 * @returns The rendered authentication view element
 * @throws Error if neither `view` nor `path` is provided
 * @throws Error if the resolved view is not a valid auth view
 */
export function Auth({
  className,
  view,
  path,
  socialLayout,
  socialPosition,
}: AuthProps) {

  if (!(view || path)) {
    throw new Error(
      "[Better Auth UI] Either `view` or `path` must be provided"
    );
  }

  const authPathViews = Object.fromEntries(
    Object.entries(customViewPaths.auth).map(([k, v]) => [v, k])
  ) as Record<string, AuthView>;

  const currentView = view || (path ? authPathViews[path] : undefined);

  switch (currentView) {
    case "signIn":
      return (
        <SignIn
          className={className}
          socialLayout={socialLayout}
          socialPosition={socialPosition}
        />
      );
    case "signUp":
      return (
        <SignUp
          className={className}
          socialLayout={socialLayout}
          socialPosition={socialPosition}
        />
      );
    case "magicLink":
      return (
        <MagicLink
          className={className}
          socialLayout={socialLayout}
          socialPosition={socialPosition}
        />
      );
    case "forgotPassword":
      return <ForgotPassword className={className} />;
    case "resetPassword":
      return <ResetPassword className={className} />;
    case "signOut":
      return <SignOut className={className} />;
    case "onboarding":
      return <Onboarding className={className} />
    case "listOrganizations":
      return <OrganizationList className={className} />
    case "createOrganization":
      return <CreateOrganization className={className} />
    default:
      throw new Error(
        `[Better Auth UI] Valid views are: ${Object.keys(customViewPaths.auth).join(", ")}`
      );
  }
}
