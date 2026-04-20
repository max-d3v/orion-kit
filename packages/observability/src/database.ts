import { instrumentDrizzleClient } from "@kubiks/otel-drizzle";
import { db } from "@workspace/database/client";

export const instrumentation = instrumentDrizzleClient(db);
