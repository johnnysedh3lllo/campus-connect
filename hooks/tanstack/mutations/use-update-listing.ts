import { updateListing } from "@/app/actions/supabase/listings";
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
    onSuccess: (data, variables) => {
      console.log(
        "before the mutation",
        variables.userId,
        variables.listingData.publication_status,
      );

      //   Set the individual listing if you're usi;ng that query somewhere
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

      // Invalidate the user's draft, unpublished or published listings
      queryClient.invalidateQueries({
        queryKey: [
          "listings",
          variables.userId,
          variables.listingData.publication_status,
        ],
      });
    },
  });
}
