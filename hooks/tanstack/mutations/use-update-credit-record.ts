import { updateUserCreditRecord } from "@/app/actions/supabase/credits";
import { queryKeys } from "@/lib/config/query-keys.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCreditRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      addedCredits,
      tableColumn,
    }: {
      userId: string;
      addedCredits: number;
      tableColumn: "total_credits" | "used_credits";
    }) => {
      return await updateUserCreditRecord(userId, addedCredits, tableColumn);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.credits(variables.userId),
      });
    },
  });
}
