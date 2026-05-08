import type { SocialProviders } from "better-auth";
import { keys } from "./keys";

const env = keys();

const googleAuth =
  env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }
    : null;

export const isGoogleAuthProvided = googleAuth !== null;

export const getSocialProvidersArray = () => {
  const socialProviders: string[] = [];

  if (isGoogleAuthProvided) {
    socialProviders.push("google");
  }

  return socialProviders;
};

export const getSocialProviders = (): SocialProviders => {
  const socialProviders: SocialProviders = {};

  if (googleAuth) {
    socialProviders.google = googleAuth;
  }

  return socialProviders;
};

export const config = {
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: getSocialProviders(),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
};
