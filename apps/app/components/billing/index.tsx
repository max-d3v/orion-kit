"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";
import { PricingCard } from "@workspace/payment/client";
import { PLANS } from "@workspace/types/billing";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { showErrorToast } from "@/lib/errors";
import { CurrentPlanCard } from "./current-plan-card";
import { WebhookStatus } from "./webhook-status";

export function BillingContent() {
  const { data: subscriptionData } = useSuspenseQuery(
    orpc.billing.getSubscription.queryOptions()
  );

  const checkout = useMutation(
    orpc.billing.createCheckoutSession.mutationOptions()
  );
  const billingPortal = useMutation(
    orpc.billing.createBillingPortalSession.mutationOptions()
  );

  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [showWebhookWarning, setShowWebhookWarning] = useState(true);

  const handleUpgrade = async (priceId: string) => {
    setSelectedPriceId(priceId);
    try {
      const result = await checkout.mutateAsync({ priceId });
      window.location.href = result.url;
    } catch (error) {
      showErrorToast(error as Error, "Failed to start checkout");
    }
  };

  const handleManageBilling = async () => {
    try {
      const result = await billingPortal.mutateAsync({});
      window.location.href = result.url;
    } catch (error) {
      const err = error as Error & { code?: string };
      const errorCode = err?.code;
      const errorMessage = err?.message || "Failed to open billing portal";

      if (errorCode === "NO_PREFERENCES") {
        showErrorToast(new Error(errorMessage), "Account Setup Required");
      } else if (errorCode === "NO_STRIPE_CUSTOMER") {
        showErrorToast(
          new Error("Please subscribe to a plan first to manage your billing."),
          "No Active Subscription"
        );
      } else if (errorCode === "PORTAL_NOT_ACTIVATED") {
        showErrorToast(
          new Error(
            "Billing portal is not available yet. Please contact support."
          ),
          "Portal Not Available"
        );
      } else {
        showErrorToast(err, "Failed to open billing portal");
      }
    }
  };

  const currentPlan = subscriptionData.plan ?? "free";
  const subscription = subscriptionData.subscription;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {showWebhookWarning && process.env.NODE_ENV === "development" && (
        <WebhookStatus onDismiss={() => setShowWebhookWarning(false)} />
      )}

      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-primary p-3">
          <CreditCard className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-3xl">Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing settings
          </p>
        </div>
      </div>

      <CurrentPlanCard
        currentPlan={currentPlan}
        loading={billingPortal.isPending}
        onManageBilling={handleManageBilling}
        subscription={subscription}
      />

      <div>
        <h2 className="mb-4 font-bold text-2xl">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {PLANS.map((plan) => (
            <PricingCard
              current={currentPlan === plan.id}
              key={plan.id}
              loading={checkout.isPending && selectedPriceId === plan.priceId}
              onSelect={plan.priceId ? handleUpgrade : undefined}
              plan={plan}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
