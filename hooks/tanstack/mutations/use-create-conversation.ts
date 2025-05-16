import { createConversation } from "@/app/actions/supabase/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tenantId,
      landlordId,
    }: {
      tenantId: string;
      landlordId: string;
    }) => {
      const { data, error } = await createConversation(tenantId, landlordId);

      if (error) {
        throw error;
      }
      return data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.tenantId],
      });
    },
  });
}
