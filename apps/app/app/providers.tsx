"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { AnalyticsProvider } from "@workspace/analytics/provider";
import { AuthProvider } from "@workspace/auth/provider";
import { createQueryClient } from "@workspace/data-layer/client";
import { WebVitals } from "@workspace/observability/client";
import { ThemeProvider } from "next-themes";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a client instance per request
  // This ensures each user gets their own QueryClient
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <WebVitals />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </AnalyticsProvider>
    </QueryClientProvider>
  );
}
