import Navigation from "@/components/app/navigation";

import { figtree } from "@/lib/fonts";

import "@/app/globals.css";
import ThemeProviderWrapper from "@/components/app/theme-provider-wrapper";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Campus Connect | Rental Paradise",
  description: "A rental platform for students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground flex h-full min-h-screen flex-col">
        <ThemeProviderWrapper>
          <Navigation route="/" />
          <main>{children}</main>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
