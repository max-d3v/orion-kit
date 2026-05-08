import "@workspace/rpc/orpc/orpc.server";

import "@workspace/ui/globals.css";
import { Toaster } from "@workspace/ui/components/sonner";
import { Providers } from "@/app/providers";

export const metadata = {
  title: "Cracked Kit",
  description: "Dashboard for Cracked Kit",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
