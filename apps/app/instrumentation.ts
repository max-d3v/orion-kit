import { registerOTel } from '@vercel/otel'
 
export async function register() {
  await import("@workspace/rpc/orpc/orpc.server");
  registerOTel({ serviceName: "app" });
}