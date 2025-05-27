import { LoginPrompt } from "./log-in-prompt";
import { OAuthButtons } from "./oauth-buttons";

export function OnboardingFooter() {
  return (
    <footer className="flex flex-col items-center gap-6">
      <LoginPrompt callToAction="Already have an account?" route="/log-in" />

      {/* <OAuthButtons /> */}
    </footer>
  );
}
