import Hero from "@/components/hero";
// import Navigation from "@/components/ui/navigation";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/utils/supabase/server";
import { insertProperty } from "../actions";
import { UserResponse } from "@supabase/supabase-js";

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
    error: getUserError,
  }: UserResponse = await supabase.auth.getUser();

  const insertPropertyWithUserId = insertProperty.bind(null, user?.id);

  return (
    <>
      {user?.user_metadata.role_id === 2 && (
        <button className="p-4 bg-amber-200" onClick={insertPropertyWithUserId}>
          click me!
        </button>
      )}
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
