import { getListings } from "@/app/actions/supabase/listings";
import { getUserPublic } from "@/app/actions/supabase/user";
import { ListingLandlordProfilePageBody } from "@/components/app/page-containers/in-app/listing-landlord-profile-page-body";
import { queryKeys } from "@/lib/config/query-keys.config";
import { LISTING_PAGE_SIZE } from "@/lib/constants";
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

  await queryClient.prefetchQuery({
    queryKey: queryKeys.listings.published(id, undefined),
    queryFn: async () =>
      await getListings({
        pubStatus: "published",
        from: 0,
        to: LISTING_PAGE_SIZE,
        userId: id,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingLandlordProfilePageBody landlordId={id} />
    </HydrationBoundary>
  );
}
