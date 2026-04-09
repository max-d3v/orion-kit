import { render } from "@react-email/render";
import { Resend } from "resend";
import { env } from "./keys";
import { WelcomeEmail } from "./templates/welcome-email";

const resend = new Resend(env.RESEND_API_KEY);

export interface SendEmailOptions {
  react: React.ReactElement;
  subject: string;
  to: string;
}

export async function sendEmail({ to, subject, react }: SendEmailOptions) {
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

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: `Welcome ${name}! 🚀`,
    react: WelcomeEmail({ name }),
  });
}
