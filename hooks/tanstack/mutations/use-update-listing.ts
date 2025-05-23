import { updateListing } from "@/app/actions/supabase/listings";
import { queryKeys } from "@/lib/config/query-keys.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      listingUUID,
      listingData,
    }: {
      userId: string | null;
      listingUUID: string | undefined;
      listingData: ListingsUpdate;
    }) => {
      const updatedListing = await updateListing(
        userId,
        listingUUID,
        listingData,
      );

      if (!updatedListing?.success) {
        throw updatedListing?.error || "Failed to update listing";
      }

      return updatedListing;
    },
    onSuccess: (_, variables) => {
      //   Set the individual listing if you're using that query somewhere
      queryClient.setQueryData(
        ["listings", variables.listingUUID],
        (old: any) => {
          console.log("old data", old);
          console.log("new data", variables.listingData);

          return {
            ...old,
            data: {
              ...(old.data || {}),
              ...variables.listingData,
            },
          };
        },
      );

      // TODO: REDUCE THIS TO ONE INVALIDATION INSTANCE THAT HANDLES WHICH EVER AFFECTED STATUS
      // Invalidate the user's published listings
      queryClient.invalidateQueries({
        queryKey: queryKeys.listings.published(variables.userId! ?? "public"),
      });

      // Invalidate the user's draft, unpublished listings
      queryClient.invalidateQueries({
        queryKey: queryKeys.listings.unpublished(variables.userId!),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.listings.drafts(variables.userId!),
      });
    },
  });
}
