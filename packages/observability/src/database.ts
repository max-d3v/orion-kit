import { db } from "@workspace/database/client";
import { instrumentDrizzleClient } from "@kubiks/otel-drizzle";

export const instrumentation = instrumentDrizzleClient(db);