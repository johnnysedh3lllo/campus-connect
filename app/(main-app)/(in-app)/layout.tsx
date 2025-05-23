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
import ThemeProviderWrapper from "@/lib/providers/theme-provider-wrapper";
import Navigation from "@/components/app/navigation";

// Setup
import TanstackQueryProvider from "@/lib/providers/tanstack-query-provider";
import { getUser, getUserPublic } from "@/app/actions/supabase/user";
import { Toaster } from "@/components/ui/toaster";
import UserIdentityProvider from "@/lib/providers/user-identity-provider";
import { WelcomeModal } from "@/components/app/modals/welcome-modal";
import { PaymentAlertModal } from "@/components/app/modals/payment-alert-modal";
import { queryKeys } from "@/lib/config/query-keys.config";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: { default: "Campus Connect", template: "%s | Campus Connect" },
  description: "Campus Connect Application",
  icons: {
    icon: "/favicon.svg",
  },
  // alternates: {
  //   canonical: "https://example.com",
  //   languages: {
  //     "en-US": "https://example.com/en-US",
  //     "de-DE": "https://example.com/de-DE",
  //   },
  // },
  // openGraph: {
  //   title: "My Site",
  //   description: "Welcome to My Site",
  //   url: "https://example.com",
  //   siteName: "My Site",
  //   images: [{ url: "https://example.com/og.png" }],
  // },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }

  const userId = user?.id;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.user.main,
    queryFn: getUser,
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.user.public(userId),
    queryFn: async () => await getUserPublic(userId),
  });

  return (
    <html lang="en" className={figtree.variable} suppressHydrationWarning>
      <body className="bg-background text-text-primary flex h-screen flex-col font-serif">
        <ThemeProviderWrapper>
          <TanstackQueryProvider>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <UserIdentityProvider>
                <Navigation />

                <main className="relative flex-1 overflow-y-auto">
                  {children}
                  <WelcomeModal />
                  <PaymentAlertModal />
                </main>
                <Toaster />
              </UserIdentityProvider>
            </HydrationBoundary>
          </TanstackQueryProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
