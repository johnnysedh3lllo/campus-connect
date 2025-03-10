// Utilities
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { UserResponse } from "@supabase/supabase-js";

// Assets
import { figtree } from "@/lib/fonts";

import "@/app/global.css";

// Components
import ThemeProviderWrapper from "@/components/app/theme-provider-wrapper";
import Navigation from "@/components/app/navigation";
import React, { Suspense } from "react";

// Setup
import TanstackQueryProvider from "@/lib/tanstack-query-provider";

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
  const supabase = await createClient();

  const {
    data: { user },
  }: UserResponse = await supabase.auth.getUser();

  return (
    <html lang="en" className={figtree.variable} suppressHydrationWarning>
      <body className="bg-background text-text-primary flex h-screen flex-col font-serif">
        <ThemeProviderWrapper>
          <Navigation user={user} />
          <main className="relative flex-1 overflow-y-auto">
            <TanstackQueryProvider>{children}</TanstackQueryProvider>
          </main>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
