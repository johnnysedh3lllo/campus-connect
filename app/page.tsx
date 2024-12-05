import Hero from "@/components/hero";
import Navigation from "@/components/ui/navigation";

import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function Index() {
  return (
    <>
      <Navigation />
      <Hero />
      <main className="p-12">
        <p>landing page body</p>
      </main>
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
        <ThemeSwitcher />
      </footer>
    </>
  );
}
