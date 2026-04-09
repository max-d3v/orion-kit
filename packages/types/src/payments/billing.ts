import type Stripe from "stripe";
import { z } from "zod";

export const createCheckoutSessionInputSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionInputSchema
>;

export type CreateCheckoutSessionResponse = {
  url: string;
  sessionId: string;
};

export type SubscriptionResponse = {
  subscription: StripeSubscription | null;
  plan: string;
};
export type CreatePortalSessionResponse = {
  url: string;
};
export type DeleteSubscriptionResponse = {
  deleted: boolean;
};

export type StripeSubscription = {
  readonly cancelAtPeriodEnd: boolean;
  readonly currentPeriodEnd: Date;
  readonly customerId: string;
  readonly id: string;
  readonly plan: "free" | "pro" | "enterprise";
  readonly priceId: string;
  readonly status: Stripe.Subscription.Status;
}

export type CheckoutSession = {
  readonly sessionId: string;
  readonly url: string;
}

export type SubscriptionData = {
  readonly plan: string;
  readonly subscription: StripeSubscription | null;
}

export type PortalSession = {
  readonly url: string;
}

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "trialing"
  | "unpaid";

