export interface PricingPlan {
  readonly description: string;
  readonly features: readonly string[];
  readonly id: "free" | "pro" | "enterprise";
  readonly maxTasks: number;
  readonly maxUsers: number;
  readonly name: string;
  readonly popular?: boolean;
  readonly price: number;
  readonly priceId?: string;
}


export interface PricingCardProps {
  readonly current?: boolean;
  readonly loading?: boolean;
  readonly onSelect?: (priceId: string) => void | Promise<void>;
  readonly plan: PricingPlan;
}

export interface SubscriptionBadgeProps {
  readonly status: string;
}
