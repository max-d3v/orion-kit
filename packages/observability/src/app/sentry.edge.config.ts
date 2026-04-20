import { init } from "@sentry/nextjs";
import { env, isSentryEnabled } from "../keys";

if (isSentryEnabled) {
  init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}
