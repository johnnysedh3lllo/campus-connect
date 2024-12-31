import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserResponse } from "@supabase/supabase-js";
import { Metadata } from "next";

import { GeistSans } from "geist/font/sans";
import "@/app/globals.css";

import ThemeProviderWrapper from "@/components/theme-provider-wrapper";
import Navigation from "@/components/ui/navigation";

import React from "react";

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

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="h-screen flex flex-col bg-background text-foreground">
        <ThemeProviderWrapper>
          <Navigation route="/dashboard" />
          <div className="flex-1 min-h-0">{children}</div>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
