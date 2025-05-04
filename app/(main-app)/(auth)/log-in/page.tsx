"use client";

// UTILITIES
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { login } from "@/app/actions/supabase/onboarding";

// COMPONENTS

// ASSETS
import { LoginForm } from "@/components/app/auth-forms";
import { AnimationWrapper } from "@/lib/providers/animation-wrapper";
import { animationConfig, formVariants } from "@/hooks/animations";
import { LoginFormType } from "@/lib/form.types";

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

      const errorMessage =
        error.code === "invalid_credentials"
          ? "Please enter your correct email and password to login to your account"
          : error.message;
      toast({
        variant: "destructive",
        title: "Please confirm email and password",
        description:
          errorMessage ||
          "An error occurred, please reload and try again later.",
      });
      setIsLoading(false);
    }
  };

  return (
    <AnimationWrapper
      variants={formVariants}
      transition={animationConfig}
      classes="w-full"
    >
      <LoginForm isLoading={isLoading} handleLogin={handleLogin} />
    </AnimationWrapper>
  );
}
