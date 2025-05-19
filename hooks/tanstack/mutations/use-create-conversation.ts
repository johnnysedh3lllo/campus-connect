import { createConversation } from "@/app/actions/supabase/messages";
import { updateUserPackageInquiries } from "@/app/actions/supabase/packages";
import { MIN_INQUIRIES } from "@/lib/app.config";
import { queryKeys } from "@/lib/query-keys.config";
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

      if (data?.is_new_conversation) {
        await updateUserPackageInquiries(
          tenantId,
          MIN_INQUIRIES,
          "used_inquiries",
        );
      }

      return data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.list(variables.tenantId),
      });

      queryClient.refetchQueries({
        queryKey: queryKeys.packages(variables.tenantId),
        exact: true,
      });
    },
  });
}
