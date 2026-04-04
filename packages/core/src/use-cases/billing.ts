import { userPreferencesRepository } from "@workspace/repository";
import {
  cancelSubscription,
  createBillingPortalSession,
  createCheckoutSession,
  getSubscription,
} from "@workspace/payment/server";
import {
  assertHasStripeCustomer,
  assertHasSubscription,
} from "../authorization/billing";

export const getSubscriptionStatus = async (params: { userId: string }) => {
  const { userId } = params;

  const preferences = await userPreferencesRepository.getOrCreate({ userId });

  if (!preferences.stripeSubscriptionId) {
    return { subscription: null, plan: "free" };
  }

  const subscription = await getSubscription(
    preferences.stripeSubscriptionId
  );

  if (!subscription) {
    return { subscription: null, plan: preferences.plan ?? "free" };
  }

  return { subscription, plan: subscription.plan };
};

export const cancelUserSubscription = async (params: { userId: string }) => {
  const { userId } = params;

  const preferences = await userPreferencesRepository.getOrCreate({ userId });
  assertHasSubscription(preferences);

  await cancelSubscription(preferences.stripeSubscriptionId as string);

  await userPreferencesRepository.updateOne({
    userId,
    stripeSubscriptionStatus: "canceled",
  });

  return { deleted: true };
};

export const createUserCheckoutSession = async (params: {
  userId: string;
  email: string;
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
}) => {
  const { userId, email, priceId, successUrl, cancelUrl } = params;

  const session = await createCheckoutSession(userId, email, priceId, {
    successUrl,
    cancelUrl,
  });

  return { url: session.url ?? "", sessionId: session.id };
};

export const createUserBillingPortalSession = async (params: {
  userId: string;
}) => {
  const { userId } = params;

  const preferences = await userPreferencesRepository.getOrCreate({ userId });
  assertHasStripeCustomer(preferences);

  const session = await createBillingPortalSession(
    preferences.stripeCustomerId as string
  );

  return { url: session.url };
};
