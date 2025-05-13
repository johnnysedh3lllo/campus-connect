import { updateUserCreditRecord } from "@/app/actions/supabase/credits";
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
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["userCredits", variable.userId],
      });
    },
  });
}
