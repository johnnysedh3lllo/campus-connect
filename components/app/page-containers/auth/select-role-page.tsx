"use client";
import { animationConfig, formVariants } from "@/lib/hooks/global/animations";
import { AnimationWrapper } from "@/lib/providers/animation-wrapper";
import { SelectRole } from "../../auth-forms";
import { RoleFormType } from "@/types/form.types";
import { toast } from "@/lib/hooks/ui/use-toast";
import { useState } from "react";
import { updateUser } from "@/app/actions/supabase/user";
import { supabase } from "@/lib/utils/supabase/client";
import { redirectRoutes } from "@/lib/config/app.config";

export default function SelectRolePage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleRoleSubmit(values: RoleFormType) {
    setIsLoading(true);
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        toast({
          variant: "destructive",
          description:
            "There was and error creating your account, please try again.",
        });
        setIsLoading(false);
        return;
      }

      const { error } = await updateUser({
        data: {
          ...userData.user.user_metadata,
          role_id: values.roleId,
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          description:
            "There was and error creating your account, please try again",
        });
        throw error;
      }

      window.location.href = redirectRoutes.newUsers;
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  return (
    <AnimationWrapper
      variants={formVariants}
      transition={animationConfig}
      classes="w-full"
    >
      <SelectRole
        handleRoleSubmit={handleRoleSubmit}
        action="login"
        isLoading={isLoading}
      />
    </AnimationWrapper>
  );
}
