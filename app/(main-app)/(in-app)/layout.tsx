// Utilities
import { Metadata } from "next";
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
import TanstackQueryProvider from "@/lib/providers/tanstack-query-provider";
import { getUser, getUserProfile } from "@/app/actions/supabase/user";
import { Toaster } from "@/components/ui/toaster";

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
  const user = await getUser();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  await queryClient.prefetchQuery({
    queryKey: ["userProfile"],
    queryFn: async () => await getUserProfile(user?.id),
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
              <Toaster />
            </HydrationBoundary>
          </TanstackQueryProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
