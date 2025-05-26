import { LoginPrompt } from "./log-in-prompt";
import { OAuthButtons } from "./oauth-buttons";
import { SeparatorMain } from "./separator-main";

export function OnboardingFooter() {
  return (
    <footer className="flex flex-col items-center gap-6">
      <LoginPrompt callToAction="Already have an account?" route="/log-in" />

      <SeparatorMain />

      {/* <OAuthButtons /> */}
    </footer>
  );
}
