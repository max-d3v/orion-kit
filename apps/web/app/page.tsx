import type { Metadata } from "next";
import { Header } from "@/components/header";
import Landing from "@/components/landing";

export const metadata: Metadata = {
  title: "Cracked Template — Opinionated B2B SaaS Monorepo Template",
  description:
    "Ship B2B SaaS fast. Cracked Template is an opinionated Next.js monorepo with authentication, subscription billing, background jobs, and observability wired together — production-ready and end-to-end type-safe.",
  keywords: [
    "B2B SaaS template",
    "SaaS monorepo template",
    "Next.js monorepo",
    "TypeScript",
    "Stripe billing",
    "Clerk authentication",
    "TailwindCSS",
    "Drizzle ORM",
    "Turborepo",
    "monorepo",
    "full-stack",
    "production ready",
    "open source",
  ],
  authors: [{ name: "Cracked Template" }],
  creator: "Cracked Template",
  publisher: "Cracked Template",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://orion-kit-web.vercel.app/",
    siteName: "Cracked Template",
    title: "Cracked Template — Opinionated B2B SaaS Monorepo Template",
    description:
      "Ship B2B SaaS fast. An opinionated Next.js monorepo with authentication, subscription billing, background jobs, and observability wired together. Open source and end-to-end type-safe.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cracked Template — Opinionated B2B SaaS Monorepo Template",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cracked Template — Opinionated B2B SaaS Monorepo Template",
    description:
      "Ship B2B SaaS fast — authentication, subscription billing, background jobs, and observability wired together. Open source and end-to-end type-safe.",
    images: ["/og-image.png"],
    creator: "@crackedtemplate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function Page() {
  return (
    <div className="min-h-svh">
      <Header />
      <Landing />
    </div>
  );
}
