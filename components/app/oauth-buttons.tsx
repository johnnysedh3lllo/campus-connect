import { AppleLogo } from "@/public/logos/apple-logo";
import { FacebookLogo } from "@/public/logos/facebook-logo";
import { GoogleLogo } from "@/public/logos/google-logo";
import { Button } from "../ui/button";
import { signInWithOAuth } from "@/app/actions/supabase/onboarding";
import { SeparatorMain } from "./separator-main";

export function OAuthButtons() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <SeparatorMain />
      <div className="flex max-w-44 gap-3 mx-auto">
        <form action={() => signInWithOAuth("google")}>
          <Button variant="outline" className="border-line rounded-full p-3">
            <GoogleLogo />
          </Button>
        </form>

        <Button variant="outline" className="border-line rounded-full p-3">
          <FacebookLogo />
        </Button>

        <Button variant="outline" className="border-line rounded-full p-3">
          <AppleLogo />
        </Button>
      </div>
    </div>
  );
}
