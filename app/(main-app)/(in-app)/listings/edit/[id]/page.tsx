import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getListingByUUID } from "@/app/actions/supabase/listings";
import ListingEditPageBody from "@/components/app/page-containers/in-app/listing-edit-page-body";
import { queryKeys } from "@/lib/query-keys.config";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.listings.byId(id),
    queryFn: async () => await getListingByUUID(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingEditPageBody listingUUID={id} />;
    </HydrationBoundary>
  );
}
