import { updateUser } from "@/app/actions/supabase/user";
import { ProfileInfoFormType } from "@/lib/form.types";
import { queryKeys } from "@/lib/query-keys.config";
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
      return await updateUser(values, userId);
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
