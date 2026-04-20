import { render } from "@react-email/render";
import { Resend } from "resend";
import { env, isEmailEnabled } from "./keys";
import { WelcomeEmail } from "./templates/welcome-email";

let resendClient: Resend | undefined;

function getResend(): Resend | null {
  if (!isEmailEnabled) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }

  return resendClient;
}

export interface SendEmailOptions {
  react: React.ReactElement;
  subject: string;
  to: string;
}

export type SendEmailResult =
  | { success: true; id: string | undefined }
  | { success: false; error: string };

export async function sendEmail({
  to,
  subject,
  react,
}: SendEmailOptions): Promise<SendEmailResult> {
  const resend = getResend();

  if (!(resend && env.FROM_EMAIL)) {
    // Email is an optional service — skip silently when not configured
    // so feature code can stay straight-line without knowing about the env.
    console.warn(
      "[@workspace/email] RESEND_API_KEY / FROM_EMAIL not set — skipping email send."
    );
    return { success: false, error: "Email service not configured" };
  }

  try {
    const html = await render(react);
    const result = await resend.emails.send({
      from: env.FROM_EMAIL,
      to,
      subject,
      html,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: `Welcome ${name}! 🚀`,
    react: WelcomeEmail({ name }),
  });
}
