import { handleStripeWebhook } from "@workspace/core/use-cases/payments";
import { stripeWebhookInputSchema } from "@workspace/types/use-cases/payments";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");

    const input = stripeWebhookInputSchema.parse({ payload, signature });
    const result = await handleStripeWebhook(input);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const isClientError =
      error instanceof ZodError ||
      (error instanceof Error &&
        error.name === "StripeSignatureVerificationError");
    const status = isClientError ? 400 : 500;
    const message =
      error instanceof Error ? error.message : "Unknown webhook error";

    console.error("Stripe webhook error:", message);
    return NextResponse.json({ error: message }, { status });
  }
};
