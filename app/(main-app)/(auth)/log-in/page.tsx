"use client";

// UTILITIES
import { useState } from "react";
import { Login } from "@/app/actions";
import { useRouter } from "next/navigation";
import { LoginFormType } from "@/lib/formSchemas";
import { toast } from "@/hooks/use-toast";

// COMPONENTS

// ASSETS
import { LoginForm } from "@/components/app/auth-forms";
import { AnimationWrapper } from "@/lib/providers/AnimationWrapper";
import { animationConfig, formVariants } from "@/hooks/animations";

export default function LoginPage(props: { searchParams: Promise<Message> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Custom submit handler to manage loading state
  const handleLogin = async (values: LoginFormType) => {
    setIsLoading(true);
    try {
      const result = await Login(values);
      // If we're here and there's no error, manually navigate

      if (result?.success) {
        router.replace("/dashboard");
      } else {
        throw result?.error;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Please confirm email and password",
        description:
          error instanceof Error ? error.message : "An error occurred",
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
