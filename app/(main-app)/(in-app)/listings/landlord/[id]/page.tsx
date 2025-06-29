import { getListings } from "@/app/actions/supabase/listings";
import { getUserPublic } from "@/app/actions/supabase/user";
import { ListingLandlordProfilePageBody } from "@/components/app/page-containers/in-app/listing-landlord-profile-page-body";
import { queryKeys } from "@/lib/config/query-keys.config";
import { LISTING_PAGE_SIZE } from "@/lib/constants/constants";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.user.public(id),
    queryFn: async () => await getUserPublic(id),
  });

  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.listings.byStatusInfinite("published", id, undefined),
    queryFn: async () =>
      await getListings({
        pubStatus: "published",
        from: 0,
        to: LISTING_PAGE_SIZE - 1,
        userId: id,
      }),
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingLandlordProfilePageBody landlordId={id} />
    </HydrationBoundary>
  );
}
