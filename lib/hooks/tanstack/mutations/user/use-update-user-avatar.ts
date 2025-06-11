import { updateProfilePicture } from "@/app/actions/supabase/user";
import { queryKeys } from "@/lib/config/query-keys.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUserAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      base64Image,
      userId,
    }: {
      base64Image: string;
      userId: string | undefined;
    }) => {
      return await updateProfilePicture(base64Image, userId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.public(variables.userId),
      });
    },
  });
}
