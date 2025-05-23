import { upsertUserSettings } from "@/app/actions/supabase/settings";
import { SettingsFormType } from "@/types/form.types";
import { queryKeys } from "@/lib/config/query-keys.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newSettings,
    }: {
      userId: string | undefined;
      newSettings: SettingsFormType;
    }) => {
      return await upsertUserSettings(userId, newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.settings,
      });
    },
  });
}
