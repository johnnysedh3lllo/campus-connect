import { createConversation } from "@/app/actions/supabase/messages";
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

      console.log("created or existing conversation:", data);
      return data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.tenantId],
      });
    },
  });
}
