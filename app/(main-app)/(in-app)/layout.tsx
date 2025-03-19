// Utilities
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { UserResponse } from "@supabase/supabase-js";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

// Assets
import { figtree } from "@/lib/fonts";

import "@/app/global.css";

// Components
import ThemeProviderWrapper from "@/components/app/theme-provider-wrapper";
import Navigation from "@/components/app/navigation";

// Setup
import TanstackQueryProvider from "@/lib/tanstack-query-provider";
import { getUser } from "@/app/actions/actions";

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
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return (
    <html lang="en" className={figtree.variable} suppressHydrationWarning>
      <body className="bg-background text-text-primary flex h-screen flex-col font-serif">
        <ThemeProviderWrapper>
          <TanstackQueryProvider>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Navigation />
              <main className="relative flex-1 overflow-y-auto">
                {children}
              </main>
            </HydrationBoundary>
          </TanstackQueryProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
