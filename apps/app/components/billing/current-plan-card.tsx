"use client";

import type { StripeSubscription } from "@workspace/types/payments/billing";
import { getPlanById } from "@workspace/payment/config";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Calendar, CheckCircle2, Loader2 } from "lucide-react";

interface CurrentPlanCardProps {
  readonly currentPlan: string;
  readonly loading: boolean;
  readonly onManageBilling: () => void;
  readonly subscription: StripeSubscription | null | undefined;
}

export function CurrentPlanCard({
  currentPlan,
  subscription,
  onManageBilling,
  loading,
}: CurrentPlanCardProps) {
  const plan = getPlanById(currentPlan);

  if (!plan) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Current Plan
            </CardTitle>
            <CardDescription>Your active subscription</CardDescription>
          </div>
          {subscription && (
            <Button
              disabled={loading}
              onClick={onManageBilling}
              size="sm"
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Manage Billing"
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="font-bold text-2xl">{plan.name}</h3>
                {plan.popular && <Badge variant="default">Popular</Badge>}
              </div>
              <p className="font-bold text-3xl">
                ${plan.price}
                <span className="font-normal text-base text-muted-foreground">
                  /month
                </span>
              </p>
            </div>

            {subscription && subscription.status === "active" && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  {subscription.cancelAtPeriodEnd
                    ? `Cancels on ${formatDate(subscription.currentPeriodEnd)}`
                    : `Renews on ${formatDate(subscription.currentPeriodEnd)}`}
                </span>
              </div>
            )}

            {subscription?.status && subscription.status !== "active" && (
              <div className="text-sm">
                <Badge
                  variant={
                    subscription.status === "trialing"
                      ? "default"
                      : "destructive"
                  }
                >
                  {subscription.status}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
