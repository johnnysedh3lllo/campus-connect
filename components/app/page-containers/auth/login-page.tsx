"use client";

// UTILITIES
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/hooks/ui/use-toast";
import { login } from "@/app/actions/supabase/onboarding";

// COMPONENTS

// ASSETS
import { LoginForm } from "@/components/app/auth-forms";
import { AnimationWrapper } from "@/lib/providers/animation-wrapper";
import { animationConfig, formVariants } from "@/lib/hooks/global/animations";
import { LoginFormType } from "@/types/form.types";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Custom submit handler to manage loading state
  const handleLogin = async (values: LoginFormType) => {
    setIsLoading(true);
    try {
      const result = await login(values);

      if (result?.success) {
        router.replace("/listings");
      } else {
        throw result?.error;
      }
    } catch (error: any) {
      console.error(error);

      if (error.code === "invalid_credentials") {
        toast({
          variant: "destructive",
          title: "Please confirm email and password",
          description:
            "Please enter your correct email and password to login to your account",
        });
      } else if (error.code === "user_does_not_exist") {
        toast({
          variant: "destructive",
          title: "Your account does not exist",
          description:
            "It seems you don't have an account. Please create an account",
        });
      } else {
        toast({
          variant: "destructive",
          description: error.message,
        });
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="onboarding-form--wrapper flex flex-col px-2 lg:w-full lg:overflow-x-hidden lg:overflow-y-auto">
      <AnimationWrapper
        variants={formVariants}
        transition={animationConfig}
        classes="w-full"
      >
        <LoginForm isLoading={isLoading} handleLogin={handleLogin} />
      </AnimationWrapper>
    </div>
  );
}
