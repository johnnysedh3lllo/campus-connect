// Utilities
import { Metadata } from "next";

// Assets
import { figtree } from "@/lib/fonts";

import "@/app/globals.css";

// Components
import ThemeProviderWrapper from "@/components/theme-provider-wrapper";
import Navigation from "@/components/navigation";
import React, { Suspense } from "react";

// Setup
import TanstackQueryProvider from "@/utils/TanstackQueryProvider";

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
      <body className="h-screen font-serif flex flex-col bg-background text-foreground">
        <ThemeProviderWrapper>
          <Navigation route={true ? "/" : "/dashboard"} />
          <div className="flex-1 min-h-0">
            <TanstackQueryProvider>{children}</TanstackQueryProvider>
          </div>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
