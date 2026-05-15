import * as Sentry from "@sentry/nextjs";
import { initializeAnalytics } from "@workspace/analytics/instrumentation-client";

initializeAnalytics();
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
