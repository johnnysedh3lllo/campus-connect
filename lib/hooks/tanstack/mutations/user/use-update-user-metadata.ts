import { updateUserInfo } from "@/app/actions/supabase/user";
import { ProfileInfoFormType } from "@/types/form.types";
import { queryKeys } from "@/lib/config/query-keys.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUserMetadata() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      values,
      userId,
    }: {
      values: ProfileInfoFormType;
      userId: string;
    }) => {
      return await updateUserInfo(values, userId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.main,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.public(variables.userId),
      });
    },
  });
}
