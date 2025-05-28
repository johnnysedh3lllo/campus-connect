"use client";

import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Provider } from "@supabase/supabase-js";

export function OAuthButton({
  logo,
  provider,
  action,
}: {
  logo: ReactNode;
  provider: Provider;
  action: () => Promise<void>;
}) {
  return (
    <form key={`sign-up-${provider}`} action={action}>
      <Button variant="outline" className="border-line rounded-full p-3">
        {logo}
      </Button>
    </form>
  );
}
