import { createConversation } from "@/app/actions/supabase/messages";
import { queryKeys } from "@/lib/config/query-keys.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tenantId,
      landlordId,
    }: {
      tenantId: string | undefined;
      landlordId: string | undefined;
    }) => {
      const { data, error } = await createConversation(tenantId, landlordId);

      if (error) {
        throw error;
      }

      return data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.listInfinite(variables.tenantId, ""),
      });

      queryClient.refetchQueries({
        queryKey: queryKeys.packages(variables.tenantId),
        exact: true,
      });
    },
  });
}
