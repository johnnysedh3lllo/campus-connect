// Utilities
import { Metadata } from "next";

// Assets
import { figtree } from "@/lib/fonts";

import "@/app/globals.css";

// Components
import ThemeProviderWrapper from "@/components/app/theme-provider-wrapper";
import Navigation from "@/components/app/navigation";
import React, { Suspense } from "react";

// Setup
import TanstackQueryProvider from "@/lib/TanstackQueryProvider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: "%s | Campus Connect",
    default: "Dashboard",
  },
  description: "Campus Connect Application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground flex h-screen flex-col font-serif">
        <ThemeProviderWrapper>
          <Navigation route={true ? "/" : "/dashboard"} />
          <div className="min-h-0 flex-1">
            <TanstackQueryProvider>{children}</TanstackQueryProvider>
          </div>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
