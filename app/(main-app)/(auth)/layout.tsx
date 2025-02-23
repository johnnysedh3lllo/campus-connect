// COMPONENTS
import Link from "next/link";
import ThemeProviderWrapper from "@/components/app/theme-provider-wrapper";
import Logo from "@/components/app/logo";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";

//ASSETS
import { figtree } from "@/lib/fonts";
import "@/app/global.css";
import onboardingPattern from "@/public/patterns/pattern-onboarding.svg";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default async function RootLayout({
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
          <section className="z-1 flex flex-col gap-6 pt-6 pr-4 pb-20 pl-4 sm:items-start sm:pt-12 sm:pr-10 sm:pb-12 sm:pl-10 lg:h-screen lg:flex-row lg:items-center lg:p-6">
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
