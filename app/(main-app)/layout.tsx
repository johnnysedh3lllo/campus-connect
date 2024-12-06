import Navigation from "@/components/ui/navigation";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import "@/app/globals.css";

import { ThemeSwitcher } from "@/components/theme-switcher";

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

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <main
      className={`${GeistSans.className} min-h-screen bg-background text-foreground`}
    >
      <Navigation />
      <div>{children}</div>
      <ThemeSwitcher />
    </main>
  );
}
