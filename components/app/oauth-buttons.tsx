import { AppleLogo } from "@/public/logos/apple-logo";
import { FacebookLogo } from "@/public/logos/facebook-logo";
import { GoogleLogo } from "@/public/logos/google-logo";
import { Button } from "../ui/button";
import { signInWithOAuth } from "@/app/actions/supabase/onboarding";

export function OAuthButtons() {
  return (
    <div className="flex gap-3">
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
  );
}
