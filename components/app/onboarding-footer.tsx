import { LoginPrompt } from "./log-in-prompt";
import { SeparatorMain } from "./separator-main";
import { Apple, Facebook, Google } from "./social-logos";

export function OnboardingFooter() {
  return (
    <footer className="flex flex-col items-center gap-6">
      <LoginPrompt />

      <SeparatorMain />

      <div className="flex gap-3">
        <Google />
        <Facebook />
        <Apple />
      </div>
    </footer>
  );
}
