import { init, replayIntegration } from "@sentry/nextjs";
import { env, isSentryEnabled } from "../keys";

if (isSentryEnabled) {
  init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [replayIntegration()],
  });
}
