import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const allowedOrigin =
      process.env.NODE_ENV === "production"
        ? "https://orion-kit-app.vercel.app"
        : "http://localhost:3001";

    return [
      {
        // Apply CORS headers to all routes (API endpoints) - allow specific origins for demo
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: allowedOrigin },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie",
          },
        ],
      },
    ];
  },
};

// Only wrap with Sentry when a DSN is configured — keeps builds clean when observability isn't set up.
export default process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig)
  : nextConfig;
