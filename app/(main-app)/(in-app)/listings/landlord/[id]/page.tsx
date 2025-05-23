import { getListings } from "@/app/actions/supabase/listings";
import { getUserPublic } from "@/app/actions/supabase/user";
import { ListingLandlordIdPageBody } from "@/components/app/page-containers/in-app/listing-landlord-id-page-body";
import { queryKeys } from "@/lib/config/query-keys.config";
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
    queryKey: queryKeys.listings.published(id ?? "public"),
    queryFn: async () => await getListings(id, "published"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingLandlordIdPageBody landlordId={id} />
    </HydrationBoundary>
  );
}
