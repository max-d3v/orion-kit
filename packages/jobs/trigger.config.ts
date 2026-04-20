import type { TriggerConfig } from "@trigger.dev/sdk/v3";
import "dotenv/config";

// `trigger.config.ts` is loaded by the Trigger.dev CLI, not by app code.
// We keep a clear error here so running the CLI without the env fails fast,
// but the rest of the codebase can import from `@workspace/jobs` without crashing.
if (!process.env.TRIGGER_PROJECT) {
  throw new Error(
    "TRIGGER_PROJECT is not set. Configure it in packages/jobs/.env before running the Trigger.dev CLI. " +
      "If you aren't using background jobs, you can ignore this file — it's only loaded by `bun run jobs`."
  );
}

export const config: TriggerConfig = {
  // Replace <your-project-ref> with your project id: https://trigger.dev/docs/trigger-config
  project: process.env.TRIGGER_PROJECT,
  logLevel: "log",
  maxDuration: 5000,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10_000,
      factor: 2,
      randomize: true,
    },
  },
};
