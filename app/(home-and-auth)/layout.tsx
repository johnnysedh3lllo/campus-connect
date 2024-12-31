import Navigation from "@/components/ui/navigation";

import { GeistSans } from "geist/font/sans";
import "@/app/globals.css";
import ThemeProviderWrapper from "@/components/theme-provider-wrapper";

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
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="min-h-screen h-full flex flex-col bg-background text-foreground">
        <ThemeProviderWrapper>
          <Navigation route="/" />
          <main>{children}</main>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
