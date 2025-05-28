"use client";
import { AppleLogo } from "@/public/logos/apple-logo";
import { FacebookLogo } from "@/public/logos/facebook-logo";
import { GoogleLogo } from "@/public/logos/google-logo";
import { Button } from "../ui/button";
import {
  signInWithOAuth,
  signUpWithOAuth,
} from "@/app/actions/supabase/onboarding";
import { SeparatorMain } from "./separator-main";
import { useMultiStepFormStore } from "@/lib/store/multi-step-form-store";
import { OAuthActionType } from "@/types/config.types";
import { Provider } from "@supabase/supabase-js";
import { ReactNode } from "react";
import { OAuthButton } from "./oauth-button";

export function OAuthProviders({ action }: { action: OAuthActionType }) {
  const { formData } = useMultiStepFormStore();

  const oauthProviderData: { provider: Provider; logo: ReactNode }[] = [
    { provider: "google", logo: <GoogleLogo /> },
    // { provider: "facebook", logo: <FacebookLogo /> },
    // { provider: "apple", logo: <AppleLogo /> },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      <SeparatorMain />

      <div className="mx-auto flex max-w-44 gap-3">
        {action === "signup" &&
          oauthProviderData.map((oauthProvider) => (
            <OAuthButton
              key={`signup-${oauthProvider.provider}`}
              logo={oauthProvider.logo}
              provider={oauthProvider.provider}
              action={() =>
                signUpWithOAuth(oauthProvider.provider, +formData.roleId)
              }
            />
          ))}

        {action === "login" &&
          oauthProviderData.map((oauthProvider) => (
            <OAuthButton
              key={`login-${oauthProvider.provider}`}
              logo={oauthProvider.logo}
              provider={oauthProvider.provider}
              action={() => signInWithOAuth(oauthProvider.provider)}
            />
          ))}
      </div>
    </div>
  );
}
