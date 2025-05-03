import { updateUser } from "@/app/actions/supabase/user";
import { ProfileInfoFormType } from "@/lib/form.types";
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
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["userPublic", variable.userId],
      });
    },
  });
}
