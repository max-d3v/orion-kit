import type { UserPreferenceRawObject } from "@workspace/types/repository/user-preferences";
import { HttpError } from "@workspace/types/errors/http";

export const assertHasStripeCustomer = (
  preferences: UserPreferenceRawObject
): void => {
  if (!preferences.stripeCustomerId) {
    throw new HttpError(
      400,
      "No active subscription found. Please subscribe to a plan first."
    );
  }
};

export const assertHasSubscription = (
  preferences: UserPreferenceRawObject
): void => {
  if (!preferences.stripeSubscriptionId) {
    throw new HttpError(400, "No active subscription");
  }
};
