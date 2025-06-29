import { figtree } from "@/lib/constants/fonts";

import "@/app/global.css";
import ThemeProviderWrapper from "@/lib/providers/theme-provider-wrapper";

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
          <main>{children}</main>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
