import type { StripeSubscription } from "@workspace/types/payments/billing";
import Stripe from "stripe";
import { getPlanByPriceId } from "./config";
import { env, isStripeServerEnabled } from "./keys";

const STRIPE_NOT_CONFIGURED =
  "Stripe is not configured. Set STRIPE_SECRET_KEY to enable billing.";

let stripeClient: Stripe | undefined;

/**
 * Lazily constructs the Stripe client so importing from `@workspace/payment/server`
 * never throws at module load when the env isn't set. Only call sites that actually
 * need Stripe will hit the error path.
 */
export function getStripe(): Stripe {
  if (!(isStripeServerEnabled && env.STRIPE_SECRET_KEY)) {
    throw new Error(STRIPE_NOT_CONFIGURED);
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }

  return stripeClient;
}

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  priceId: string,
  options?: {
    successUrl?: string;
    cancelUrl?: string;
  }
): Promise<Stripe.Checkout.Session> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

  const session = await getStripe().checkout.sessions.create({
    customer_email: userEmail,
    client_reference_id: userId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url:
      options?.successUrl || `${baseUrl}/dashboard/billing?success=true`,
    cancel_url:
      options?.cancelUrl || `${baseUrl}/dashboard/billing?canceled=true`,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  });

  return session;
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl?: string
): Promise<Stripe.BillingPortal.Session> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl || `${baseUrl}/dashboard/billing`,
  });

  return session;
}

export async function getSubscription(
  subscriptionId: string
): Promise<StripeSubscription | null> {
  try {
    const subscription =
      await getStripe().subscriptions.retrieve(subscriptionId);

    const priceId = subscription.items.data[0]?.price.id;
    const plan = priceId ? getPlanByPriceId(priceId) : null;

    return {
      id: subscription.id,
      customerId: subscription.customer as string,
      status: subscription.status,
      priceId: priceId || "",
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      plan: plan?.id || "free",
    };
  } catch (error) {
    console.error("Failed to get subscription:", error);
    return null;
  }
}

export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const subscription = await getStripe().subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
}
