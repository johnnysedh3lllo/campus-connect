// COMPONENTS
import Link from "next/link";
import ThemeProviderWrapper from "@/lib/providers/theme-provider-wrapper";
import Logo from "@/components/app/logo";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";

//ASSETS
import { figtree } from "@/lib/constants/fonts";
import "@/app/global.css";
import onboardingPattern from "@/public/patterns/pattern-onboarding.svg";
import { Metadata } from "next";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.variable} suppressHydrationWarning>
      <body className="bg-primary text-foreground relative flex min-h-screen flex-col font-serif">
        <ThemeProviderWrapper>
          <Image
            className="absolute inset-0 object-cover"
            alt="onboarding pattern"
            fill={true}
            src={onboardingPattern}
            quality={80}
          />
          <section className="max-w-screen-max-xl z-1 mx-auto flex w-full flex-col gap-6 overflow-y-hidden pt-6 pr-4 pb-20 pl-4 sm:items-start sm:pt-12 sm:pr-10 sm:pb-12 sm:pl-10 lg:h-screen lg:flex-row lg:items-center lg:p-6">
            <div className="text-background flex w-full justify-start sm:flex-1 lg:h-full lg:items-center lg:justify-center">
              <Link href="/">
                <Logo />
              </Link>
            </div>

            <div className="onboarding-form bg-background relative w-full rounded-md p-4 sm:rounded-xl sm:px-12 sm:py-12 lg:flex lg:h-full lg:flex-1 lg:justify-center">
              {children}
              <Toaster />
            </div>
          </section>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
