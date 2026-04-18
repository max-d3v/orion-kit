import { handleAuthWebhook } from "@workspace/core/use-cases/auth";
import { webhookEventSchema } from "@workspace/types/auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    const body = await request.json();
    const input = webhookEventSchema.parse(body);
    const result = await handleAuthWebhook(input);

    return NextResponse.json({ received: true, result }, { status: 200 });
  } catch (error) { 
    const isClientError =
      error instanceof ZodError || error instanceof SyntaxError;
    const status = isClientError ? 400 : 500;
    const message =
      error instanceof Error ? error.message : "Unknown webhook error";

    console.error("Auth webhook error:", message);
    return NextResponse.json({ error: message }, { status });
  }
};
